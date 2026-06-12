"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useLanguageStore } from "@/store/language";
import { t } from "@/lib/utils/translations";
import { Breadcrumb } from "@/components/Breadcrumb";

// @ts-expect-error - qrcode's browser entry exists at runtime (pure JS, no Node deps)
import * as QRCode from "qrcode/lib/browser";

// Build a UPI URI string per NPCI specification
function buildUPIURI(params: {
  pa: string;
  pn?: string;
  am?: string;
  tn?: string;
}): string {
  let upi = `upi://pay?pa=${encodeURIComponent(params.pa)}`;
  if (params.pn) upi += `&pn=${encodeURIComponent(params.pn)}`;
  if (params.am) upi += `&am=${encodeURIComponent(params.am)}`;
  if (params.tn) upi += `&tn=${encodeURIComponent(params.tn)}`;
  return upi + "&cu=INR";
}

/** Extract QR module (pixel) size from a rendered canvas by scanning the first dark pixel. */
function detectModuleSize(ctx: CanvasRenderingContext2D, w: number): number {
  const d = ctx.getImageData(0, 0, w, 1).data;
  for (let x = 0; x < w; x++) {
    if (d[x * 4] < 128) {
      let run = 1;
      while (x + run < w && d[(x + run) * 4] < 128) run++;
      return run;
    }
  }
  return 1;
}

export default function UPIQRGeneratorPage() {
  const language = useLanguageStore((s) => s.language);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [vpa, setVpa] = useState("");
  const [payeeName, setPayeeName] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [qrSize, setQrSize] = useState(250);
  const [qrGenerated, setQrGenerated] = useState(false);
  const [genError, setGenError] = useState("");

  const generateQR = () => {
    if (!vpa.trim() || !canvasRef.current) return;
    setGenError("");

    const upiURI = buildUPIURI({
      pa: vpa.trim(),
      pn: payeeName.trim() || undefined,
      am: amount || undefined,
      tn: note.trim() || undefined,
    });

    const canvas = canvasRef.current;
    canvas.width = qrSize;
    canvas.height = qrSize;

    QRCode.toCanvas(
      canvas,
      upiURI,
      { width: qrSize, margin: 2, color: { dark: "#000000", light: "#ffffff" } },
      (err: unknown) => {
        if (err) {
          console.error("QR generation failed:", err);
          setGenError("Failed to generate QR code. Please try again.");
        } else {
          setQrGenerated(true);
        }
      },
    );
  };

  const downloadQR = (format: "png" | "svg") => {
    const canvas = canvasRef.current;
    if (!canvas || !qrGenerated) return;

    if (format === "png") {
      const link = document.createElement("a");
      link.download = `upi-qr-${vpa.replace(/[^a-zA-Z0-9]/g, "-")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      return;
    }

    // SVG: read pixel data from the rendered QR and build <rect> elements
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { width, height, data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const modSize = detectModuleSize(ctx, width);

    let rects = "";
    for (let y = 0; y < height; y += modSize) {
      for (let x = 0; x < width; x += modSize) {
        if (data[(y * width + x) * 4] < 128) {
          rects += `<rect x="${x}" y="${y}" width="${modSize}" height="${modSize}"/>`;
        }
      }
    }

    const svg = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" shape-rendering="crispEdges">`,
      `<rect width="${width}" height="${height}" fill="#fff"/>`,
      rects,
      "</svg>",
    ].join("");

    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `upi-qr-${vpa.replace(/[^a-zA-Z0-9]/g, "-")}.svg`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <Breadcrumb />
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="container-main py-8 md:py-12">
          <Link
            href="/tools"
            className="inline-flex items-center gap-1 text-sm text-white/80 hover:text-white no-underline mb-3"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Tools
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">
            💳 {t("tools.upi-qr-generator", language)}
          </h1>
          <p className="text-blue-100 mt-1">{t("tools.upi-qr-generator.desc", language)}</p>
        </div>
      </div>

      <div className="container-main py-8">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Form */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">UPI Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    UPI ID / VPA <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={vpa}
                    onChange={(e) => setVpa(e.target.value)}
                    placeholder="example@paytm or example@upi"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Example: name@paytm, name@googlepay, name@phonepe
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payee Name (optional)
                  </label>
                  <input
                    type="text"
                    value={payeeName}
                    onChange={(e) => setPayeeName(e.target.value)}
                    placeholder="Your name or business name"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount (optional)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g., 500"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Note (optional)
                  </label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g., Payment for services"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">QR Code Size</label>
                  <select
                    value={qrSize}
                    onChange={(e) => setQrSize(Number(e.target.value))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                  >
                    <option value={200}>Small (200px)</option>
                    <option value={250}>Medium (250px)</option>
                    <option value={350}>Large (350px)</option>
                    <option value={500}>Extra Large (500px)</option>
                  </select>
                </div>

                <button
                  onClick={generateQR}
                  disabled={!vpa.trim()}
                  className="w-full px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  Generate QR Code
                </button>
              </div>
            </div>

            {/* QR Display */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col items-center justify-center min-h-[320px] relative">
              {genError && (
                <p className="text-red-500 text-sm mb-3">{genError}</p>
              )}

              {/* Canvas always in DOM so ref works on first click; hidden until generated */}
              <canvas
                ref={canvasRef}
                className={`rounded-lg shadow-sm max-w-full h-auto ${qrGenerated ? "" : "hidden"}`}
              />

              {qrGenerated ? (
                <>
                  <p className="text-xs text-gray-500 mt-3 text-center break-all max-w-full">
                    UPI ID: {vpa}
                  </p>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => downloadQR("png")}
                      className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                    >
                      ⬇️ Download PNG
                    </button>
                    <button
                      onClick={() => downloadQR("svg")}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      Download SVG
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-10 text-gray-400">
                  <div className="text-5xl mb-3">💳</div>
                  <p className="text-sm">Enter UPI details and click</p>
                  <p className="text-sm font-medium">Generate QR Code</p>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 mt-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">About UPI QR Codes</h2>
            <ul className="text-sm text-gray-600 space-y-1.5">
              <li>• Enter your UPI ID (VPA) to generate a scannable QR code.</li>
              <li>• Optionally set a fixed amount and payment note.</li>
              <li>• The QR code works with all UPI apps: Google Pay, PhonePe, Paytm, BHIM, etc.</li>
              <li>• Download the QR as PNG or SVG for printing or sharing.</li>
              <li>
                <strong>No data is sent to any server</strong> — everything is generated in your
                browser.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
