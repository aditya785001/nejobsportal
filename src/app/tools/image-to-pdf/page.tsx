"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";

export default function ImageToPDFPage() {
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [pageSize, setPageSize] = useState("A4");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [margin, setMargin] = useState(10);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pageSizes: Record<string, [number, number]> = {
    A4: [595.28, 841.89],
    A3: [841.89, 1190.55],
    Letter: [612, 792],
    Legal: [612, 1008],
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newImages: { file: File; preview: string }[] = [];
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        newImages.push({
          file,
          preview: URL.createObjectURL(file),
        });
      }
    });
    setImages((prev) => [...prev, ...newImages]);
    setMessage(null);
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const reorderImage = (from: number, to: number) => {
    setImages((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(from, 1);
      copy.splice(to, 0, item);
      return copy;
    });
  };

  const moveUp = (index: number) => {
    if (index > 0) reorderImage(index, index - 1);
  };

  const moveDown = (index: number) => {
    if (index < images.length - 1) reorderImage(index, index + 1);
  };

  const generatePDF = async () => {
    if (images.length === 0) {
      setMessage({ type: "error", text: "Please add at least one image." });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const { PDFDocument } = await import("pdf-lib");
      const pdf = await PDFDocument.create();

      const [pw, ph] = pageSizes[pageSize] || pageSizes.A4;
      const pageW = orientation === "landscape" ? ph : pw;
      const pageH = orientation === "landscape" ? pw : ph;

      for (let i = 0; i < images.length; i++) {
        const imgData = await fetch(images[i].preview).then((r) => r.arrayBuffer());
        const mimeType = images[i].file.type;

        let image;
        if (mimeType === "image/jpeg" || mimeType === "image/jpg") {
          image = await pdf.embedJpg(imgData);
        } else {
          image = await pdf.embedPng(imgData);
        }

        const imgW = image.width;
        const imgH = image.height;

        // Calculate max dimensions respecting margins
        const maxW = pageW - margin * 2;
        const maxH = pageH - margin * 2;

        // Fit image within page
        const scale = Math.min(maxW / imgW, maxH / imgH);
        const finalW = imgW * scale;
        const finalH = imgH * scale;

        // Center on page
        const x = (pageW - finalW) / 2;
        const y = (pageH - finalH) / 2;

        const page = pdf.addPage([pageW, pageH]);
        page.drawImage(image, {
          x,
          y,
          width: finalW,
          height: finalH,
        });
      }

      const pdfBytes = await pdf.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `images-converted-${Date.now()}.pdf`;
      link.click();
      URL.revokeObjectURL(link.href);

      setMessage({ type: "success", text: `PDF created with ${images.length} page(s)!` });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to generate PDF. Some image formats may not be supported." });
    } finally {
      setLoading(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div>
      <Breadcrumb />
      {/* Header */}
      <div className="bg-gradient-to-br from-teal-600 to-emerald-700 text-white">
        <div className="container-main py-8 md:py-12">
          <Link href="/tools" className="inline-flex items-center gap-1 text-sm text-white/80 hover:text-white no-underline mb-3">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Tools
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">📸 Image to PDF</h1>
          <p className="text-teal-100 mt-1">Convert your images to PDF documents with custom page settings</p>
        </div>
      </div>

      <div className="container-main py-8">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Controls */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-sm font-bold text-gray-900 mb-4">Settings</h2>

              <div className="space-y-4">
                {/* Page Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Page Size</label>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  >
                    {Object.keys(pageSizes).map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>

                {/* Orientation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Orientation</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setOrientation("portrait")}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        orientation === "portrait"
                          ? "bg-teal-600 text-white border-teal-600"
                          : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      📄 Portrait
                    </button>
                    <button
                      onClick={() => setOrientation("landscape")}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        orientation === "landscape"
                          ? "bg-teal-600 text-white border-teal-600"
                          : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      📄 Landscape
                    </button>
                  </div>
                </div>

                {/* Margin */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Margin: {margin}px</label>
                  <input
                    type="range"
                    min={0}
                    max={50}
                    value={margin}
                    onChange={(e) => setMargin(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Add Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Add Images</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFiles}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                  />
                  <p className="text-xs text-gray-400 mt-1">Supported: JPG, PNG, WebP, BMP</p>
                </div>

                {/* Generate Button */}
                <button
                  onClick={generatePDF}
                  disabled={images.length === 0 || loading}
                  className="w-full px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  {loading ? "Generating PDF..." : `📄 Generate PDF (${images.length} image${images.length !== 1 ? "s" : ""})`}
                </button>
              </div>

              {/* Message */}
              {message && (
                <div className={`mt-4 p-3 rounded-lg text-sm ${
                  message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                  {message.text}
                </div>
              )}
            </div>

            {/* Image List */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-sm font-bold text-gray-900 mb-4">
                Images ({images.length})
              </h2>

              {images.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-5xl mb-3">📸</div>
                  <p className="text-sm">Add images to get started</p>
                  <p className="text-xs mt-1">You can add multiple images at once</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {images.map((img, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <img
                        src={img.preview}
                        alt={`Image ${index + 1}`}
                        className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 truncate">{img.file.name}</p>
                        <p className="text-[10px] text-gray-400">{formatSize(img.file.size)}</p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <button
                          onClick={() => moveUp(index)}
                          disabled={index === 0}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          title="Move up"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => moveDown(index)}
                          disabled={index === images.length - 1}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          title="Move down"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => removeImage(index)}
                          className="p-1 text-red-400 hover:text-red-600"
                          title="Remove"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 mt-6">
            <h2 className="text-sm font-bold text-gray-900 mb-2">How Image to PDF Works</h2>
            <ul className="text-sm text-gray-600 space-y-1.5">
              <li>• Add one or more images (JPG, PNG, WebP, BMP).</li>
              <li>• Reorder images by dragging or using the up/down buttons.</li>
              <li>• Choose page size, orientation, and margin.</li>
              <li>• Click <strong>Generate PDF</strong> to download your document.</li>
              <li>• Each image becomes one page in the PDF.</li>
              <li>• <strong>No data is sent to any server</strong> — everything runs in your browser using pdf-lib.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
