"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";

type PDFToolTab = "merge" | "split" | "compress";

export default function PDFToolsPage() {
  const [activeTab, setActiveTab] = useState<PDFToolTab>("merge");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mergeFiles, setMergeFiles] = useState<File[]>([]);
  const [splitFile, setSplitFile] = useState<File | null>(null);
  const [compressFile, setCompressFile] = useState<File | null>(null);
  const [compressLevel, setCompressLevel] = useState(70);

  const tabs: { id: PDFToolTab; label: string; icon: string }[] = [
    { id: "merge", label: "Merge PDFs", icon: "📂" },
    { id: "split", label: "Split PDF", icon: "✂️" },
    { id: "compress", label: "Compress PDF", icon: "📦" },
  ];

  const handleMerge = async () => {
    if (mergeFiles.length < 2) {
      setMessage({ type: "error", text: "Please select at least 2 PDF files to merge." });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const mergedPdf = await PDFDocument.create();

      for (const file of mergeFiles) {
        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save();
      downloadBlob(mergedBytes, "merged-output.pdf");
      setMessage({ type: "success", text: `Merged ${mergeFiles.length} PDFs successfully!` });
    } catch (err) {
      setMessage({ type: "error", text: "Failed to merge PDFs. Make sure all files are valid PDFs." });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSplit = async () => {
    if (!splitFile) {
      setMessage({ type: "error", text: "Please select a PDF file to split." });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await splitFile.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const totalPages = pdf.getPageCount();

      if (totalPages <= 1) {
        setMessage({ type: "error", text: "This PDF has only 1 page. Nothing to split." });
        setLoading(false);
        return;
      }

      // Create a zip of individual PDFs
      const { default: JSZip } = await import("jszip");
      const zip = new JSZip();

      for (let i = 0; i < totalPages; i++) {
        const newPdf = await PDFDocument.create();
        const [page] = await newPdf.copyPages(pdf, [i]);
        newPdf.addPage(page);
        const pageBytes = await newPdf.save();
        zip.file(`page-${i + 1}.pdf`, pageBytes);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      downloadBlob(new Uint8Array(await zipBlob.arrayBuffer()), `split-${splitFile.name.replace(".pdf", "")}.zip`);
      setMessage({ type: "success", text: `Split ${totalPages} pages into individual PDFs!` });
    } catch (err) {
      setMessage({ type: "error", text: "Failed to split PDF." });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompress = async () => {
    if (!compressFile) {
      setMessage({ type: "error", text: "Please select a PDF file to compress." });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = await compressFile.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const compressedBytes = await pdf.save({ useObjectStreams: true });
      const originalSize = compressFile.size;
      const compressedSize = compressedBytes.length;
      const savings = ((1 - compressedSize / originalSize) * 100).toFixed(1);

      downloadBlob(compressedBytes, `compressed-${compressFile.name}`);
      setMessage({ type: "success", text: `Compressed from ${formatSize(originalSize)} to ${formatSize(compressedSize)} (${savings}% savings)!` });
    } catch (err) {
      setMessage({ type: "error", text: "Failed to compress PDF." });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadBlob = (bytes: Uint8Array, filename: string) => {
    const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, mode: "merge" | "split" | "compress") => {
    const files = e.target.files;
    if (!files) return;
    if (mode === "merge") {
      setMergeFiles(Array.from(files));
    } else if (mode === "split") {
      setSplitFile(files[0] || null);
    } else {
      setCompressFile(files[0] || null);
    }
    setMessage(null);
  };

  return (
    <div>
      <Breadcrumb />
      {/* Header */}
      <div className="bg-gradient-to-br from-red-600 to-orange-700 text-white">
        <div className="container-main py-8 md:py-12">
          <Link href="/tools" className="inline-flex items-center gap-1 text-sm text-white/80 hover:text-white no-underline mb-3">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Tools
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">📄 PDF Tools</h1>
          <p className="text-red-100 mt-1">Merge, split, and compress PDF files directly in your browser</p>
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
                    ? "bg-red-600 text-white shadow-sm"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            {/* Merge */}
            {activeTab === "merge" && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">Merge PDFs</h2>
                <p className="text-sm text-gray-500 mb-4">Combine multiple PDF files into a single PDF document.</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={(e) => handleFileSelect(e, "merge")}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                />
                {mergeFiles.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">{mergeFiles.length} file(s) selected:</p>
                    <ul className="text-xs text-gray-600 space-y-0.5">
                      {mergeFiles.map((f, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span>📄</span> {f.name} <span className="text-gray-400">({formatSize(f.size)})</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <button
                  onClick={handleMerge}
                  disabled={mergeFiles.length < 2 || loading}
                  className="mt-4 px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  {loading ? "Processing..." : "📂 Merge PDFs"}
                </button>
              </div>
            )}

            {/* Split */}
            {activeTab === "split" && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">Split PDF</h2>
                <p className="text-sm text-gray-500 mb-4">Split a PDF into individual pages. Each page becomes a separate PDF.</p>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileSelect(e, "split")}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                />
                {splitFile && (
                  <p className="mt-2 text-xs text-gray-500">Selected: {splitFile.name} ({formatSize(splitFile.size)})</p>
                )}
                <button
                  onClick={handleSplit}
                  disabled={!splitFile || loading}
                  className="mt-4 px-6 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  {loading ? "Processing..." : "✂️ Split PDF"}
                </button>
              </div>
            )}

            {/* Compress */}
            {activeTab === "compress" && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">Compress PDF</h2>
                <p className="text-sm text-gray-500 mb-4">Reduce PDF file size by optimizing internal structures.</p>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileSelect(e, "compress")}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
                {compressFile && (
                  <p className="mt-2 text-xs text-gray-500">Selected: {compressFile.name} ({formatSize(compressFile.size)})</p>
                )}
                <div className="mt-3">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Compression Quality: {compressLevel}%</label>
                  <input
                    type="range"
                    min={30}
                    max={100}
                    value={compressLevel}
                    onChange={(e) => setCompressLevel(Number(e.target.value))}
                    className="w-full max-w-xs"
                  />
                  <div className="flex justify-between max-w-xs text-[10px] text-gray-400">
                    <span>More compression</span>
                    <span>Better quality</span>
                  </div>
                </div>
                <button
                  onClick={handleCompress}
                  disabled={!compressFile || loading}
                  className="mt-4 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  {loading ? "Processing..." : "📦 Compress PDF"}
                </button>
              </div>
            )}

            {/* Message */}
            {message && (
              <div className={`mt-4 p-3 rounded-lg text-sm ${
                message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
              }`}>
                {message.text}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 mt-6">
            <h2 className="text-sm font-bold text-gray-900 mb-2">How PDF Tools Work</h2>
            <ul className="text-sm text-gray-600 space-y-1.5">
              <li>• All processing happens <strong>entirely in your browser</strong>. No files are uploaded.</li>
              <li>• <strong>Merge:</strong> Select multiple PDFs (in order) and combine them into one document.</li>
              <li>• <strong>Split:</strong> Extract each page of a PDF into a separate file, downloaded as a ZIP.</li>
              <li>• <strong>Compress:</strong> Optimize PDF structure to reduce file size.</li>
              <li>• Maximum file size depends on your device memory. Very large files may cause issues.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
