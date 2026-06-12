"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";

type ImageToolTab = "convert" | "resize" | "compress" | "removebg";

const PASSPORT_PREVIEW_SIZES = [
  { id: "2x2", label: "2×2 in", w: 600, h: 600 },
  { id: "35x45", label: "35×45 mm", w: 413, h: 531 },
  { id: "51x51", label: "51×51 mm", w: 602, h: 602 },
];

export default function ImageToolsPage() {
  const [activeTab, setActiveTab] = useState<ImageToolTab>("convert");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState("png");
  const [resizeWidth, setResizeWidth] = useState(800);
  const [resizeHeight, setResizeHeight] = useState(600);
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [compressQuality, setCompressQuality] = useState(80);
  const [originalSize, setOriginalSize] = useState(0);
  const [processedSize, setProcessedSize] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const tabs: { id: ImageToolTab; label: string; icon: string }[] = [
    { id: "convert", label: "Convert", icon: "🔄" },
    { id: "resize", label: "Resize", icon: "📐" },
    { id: "compress", label: "Compress", icon: "📦" },
    { id: "removebg", label: "Remove BG", icon: "🧹" },
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setInputFile(file);
    setOriginalSize(file.size);
    setMessage(null);

    // Show preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Read dimensions
    const img = new Image();
    img.onload = () => {
      setResizeWidth(img.naturalWidth);
      setResizeHeight(img.naturalHeight);
    };
    img.src = url;
  };

  const processImage = (action: "convert" | "resize" | "compress") => {
    if (!inputFile || !canvasRef.current) {
      setMessage({ type: "error", text: "Please select an image first." });
      return;
    }

    setLoading(true);
    setMessage(null);

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;

      let w = img.naturalWidth;
      let h = img.naturalHeight;

      if (action === "resize") {
        w = resizeWidth || w;
        h = resizeHeight || h;
        if (maintainAspect) {
          const ratio = Math.min(w / img.naturalWidth, h / img.naturalHeight);
          w = Math.round(img.naturalWidth * ratio);
          h = Math.round(img.naturalHeight * ratio);
        }
      }

      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(img, 0, 0, w, h);

      let mimeType = "image/png";
      let ext = "png";
      let quality: number | undefined = undefined;

      if (action === "convert") {
        switch (outputFormat) {
          case "jpeg": mimeType = "image/jpeg"; ext = "jpg"; quality = 0.92; break;
          case "webp": mimeType = "image/webp"; ext = "webp"; quality = 0.9; break;
          case "png": mimeType = "image/png"; ext = "png"; break;
          case "bmp": mimeType = "image/bmp"; ext = "bmp"; break;
        }
      } else if (action === "compress") {
        mimeType = "image/jpeg";
        ext = "jpg";
        quality = compressQuality / 100;
      } else {
        // resize - keep original format
        const origType = inputFile.type;
        if (origType === "image/jpeg" || origType === "image/jpg") {
          mimeType = "image/jpeg"; ext = "jpg"; quality = 0.92;
        } else if (origType === "image/webp") {
          mimeType = "image/webp"; ext = "webp"; quality = 0.9;
        } else {
          mimeType = "image/png"; ext = "png";
        }
      }

      canvas.toBlob((blob) => {
        if (!blob) {
          setMessage({ type: "error", text: "Failed to process image." });
          setLoading(false);
          return;
        }
        setProcessedSize(blob.size);

        // Download
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        const baseName = inputFile.name.replace(/\.[^.]+$/, "");
        link.download = `${baseName}-${action}d.${ext}`;
        link.click();

        const original = formatSize(originalSize);
        const processed = formatSize(blob.size);
        const savings = originalSize > 0 ? ((1 - blob.size / originalSize) * 100).toFixed(1) : "0";
        const actionLabel = action === "convert" ? "Converted" : action === "resize" ? "Resized" : "Compressed";
        setMessage({
          type: "success",
          text: `${actionLabel}! ${original} → ${processed} (${savings}% ${blob.size < originalSize ? "smaller" : "larger"})`,
        });
        setLoading(false);
      }, mimeType, quality);
    };

    img.onerror = () => {
      setMessage({ type: "error", text: "Failed to load image. Try a different file." });
      setLoading(false);
    };

    if (previewUrl) img.src = previewUrl;
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
      <div className="bg-gradient-to-br from-purple-600 to-violet-700 text-white">
        <div className="container-main py-8 md:py-12">
          <Link href="/tools" className="inline-flex items-center gap-1 text-sm text-white/80 hover:text-white no-underline mb-3">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Tools
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">🖼️ Image Tools</h1>
          <p className="text-purple-100 mt-1">Convert, resize, and compress images directly in your browser</p>
        </div>
      </div>

      <div className="container-main py-8">
        <div className="max-w-3xl mx-auto">
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setMessage(null); }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-purple-600 text-white shadow-sm"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            {/* File Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
              {inputFile && (
                <p className="text-xs text-gray-500 mt-1">
                  {inputFile.name} ({formatSize(originalSize)}) &bull; {resizeWidth}×{resizeHeight}
                </p>
              )}
            </div>

            {/* Preview */}
            {previewUrl && (
              <div className="mb-4">
                <img src={previewUrl} alt="Preview" className="max-w-full h-auto max-h-48 rounded-lg border border-gray-200" />
              </div>
            )}

            {/* Convert Options */}
            {activeTab === "convert" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Output Format</label>
                <div className="flex gap-2">
                  {["png", "jpeg", "webp", "bmp"].map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setOutputFormat(fmt)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        outputFormat === fmt
                          ? "bg-purple-600 text-white border-purple-600"
                          : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      .{fmt}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => processImage("convert")}
                  disabled={!inputFile || loading}
                  className="mt-3 px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  {loading ? "Processing..." : `🔄 Convert to .${outputFormat.toUpperCase()}`}
                </button>
              </div>
            )}

            {/* Resize Options */}
            {activeTab === "resize" && (
              <div className="mb-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Width (px)</label>
                    <input
                      type="number"
                      value={resizeWidth}
                      onChange={(e) => setResizeWidth(Number(e.target.value))}
                      min={1}
                      max={10000}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Height (px)</label>
                    <input
                      type="number"
                      value={resizeHeight}
                      onChange={(e) => setResizeHeight(Number(e.target.value))}
                      min={1}
                      max={10000}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    checked={maintainAspect}
                    onChange={(e) => setMaintainAspect(e.target.checked)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-xs text-gray-600">Maintain aspect ratio</span>
                </label>
                <button
                  onClick={() => processImage("resize")}
                  disabled={!inputFile || loading}
                  className="mt-3 px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  {loading ? "Processing..." : "📐 Resize Image"}
                </button>
              </div>
            )}

            {/* Compress Options */}
            {activeTab === "compress" && (
              <div className="mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Quality: {compressQuality}%
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    value={compressQuality}
                    onChange={(e) => setCompressQuality(Number(e.target.value))}
                    className="w-full max-w-xs"
                  />
                  <div className="flex justify-between max-w-xs text-[10px] text-gray-400">
                    <span>Smaller size</span>
                    <span>Better quality</span>
                  </div>
                </div>
                <button
                  onClick={() => processImage("compress")}
                  disabled={!inputFile || loading}
                  className="mt-3 px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  {loading ? "Processing..." : "📦 Compress Image"}
                </button>
              </div>
            )}

            {/* Remove BG Info */}
            {activeTab === "removebg" && (
              <div className="space-y-5">
                {/* Feature cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                    <span className="text-xl">🤖</span>
                    <h4 className="text-sm font-bold text-gray-900 mt-1">AI-Powered</h4>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Uses a neural network trained on millions of portraits. Automatically detects the subject — no color picking.
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <span className="text-xl">🎨</span>
                    <h4 className="text-sm font-bold text-gray-900 mt-1">Background Colors</h4>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Replace with white, blue, red, or any custom color — perfect for passport &amp; visa photos.
                    </p>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                    <span className="text-xl">📐</span>
                    <h4 className="text-sm font-bold text-gray-900 mt-1">Passport Sizes</h4>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Crop to standard dimensions: 2×2 in, 35×45 mm, 51×51 mm, or custom. Drag to reposition.
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                    <span className="text-xl">🔒</span>
                    <h4 className="text-sm font-bold text-gray-900 mt-1">100% Private</h4>
                    <p className="text-xs text-gray-600 mt-0.5">
                      All processing runs in your browser. Zero uploads to any server.
                    </p>
                  </div>
                </div>

                {/* Passport size table */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Standard Passport Sizes</h4>
                  <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-left px-3 py-2 font-medium text-gray-600">Type</th>
                          <th className="text-left px-3 py-2 font-medium text-gray-600">Dimensions</th>
                          <th className="text-left px-3 py-2 font-medium text-gray-600">Pixels (300 DPI)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {PASSPORT_PREVIEW_SIZES.map((s) => (
                          <tr key={s.id} className="hover:bg-gray-50">
                            <td className="px-3 py-2 text-gray-800">{s.label}</td>
                            <td className="px-3 py-2 text-gray-600">{s.id === "2x2" ? "2 × 2 in" : s.id === "35x45" ? "35 × 45 mm" : "51 × 51 mm"}</td>
                            <td className="px-3 py-2 text-gray-600">{s.w} × {s.h}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href="/tools/background-remover"
                  className="block w-full text-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium no-underline"
                >
                  🧹 Open Background Remover Tool →
                </Link>
                <p className="text-xs text-gray-400 text-center">
                  First use downloads a ~20 MB AI model (one-time). Use Wi-Fi to avoid data charges.
                </p>
              </div>
            )}

            {/* Message */}
            {message && (
              <div className={`p-3 rounded-lg text-sm ${
                message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
              }`}>
                {message.text}
              </div>
            )}

            {/* Hidden canvas for processing */}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Info */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 mt-6">
            <h2 className="text-sm font-bold text-gray-900 mb-2">How Image Tools Work</h2>
            <ul className="text-sm text-gray-600 space-y-1.5">
              <li>• All processing happens <strong>entirely in your browser</strong>. No images are uploaded.</li>
              <li>• <strong>Convert:</strong> Change image format between PNG, JPEG, WebP, and BMP.</li>
              <li>• <strong>Resize:</strong> Change image dimensions. Optionally maintain aspect ratio.</li>
              <li>• <strong>Compress:</strong> Reduce JPEG quality to decrease file size.</li>
              <li>• Maximum image size depends on your device memory.</li>
            </ul>
          </div>


        </div>
      </div>
    </div>
  );
}
