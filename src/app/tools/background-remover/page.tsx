"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";

type BgColor = "white" | "blue" | "red" | "transparent" | "custom";
type PassportSize = "2x2" | "35x45" | "51x51" | "custom";
type Status = "idle" | "loading" | "processing" | "done" | "error";

const PASSPORT_SIZES: Record<string, { w: number; h: number; label: string }> = {
  "2x2": { w: 600, h: 600, label: "2×2 in (US Passport)" },
  "35x45": { w: 413, h: 531, label: "35×45 mm (India Passport)" },
  "51x51": { w: 602, h: 602, label: "51×51 mm (Visa)" },
  custom: { w: 300, h: 300, label: "Custom" },
};

const BG_COLORS: Record<string, string> = {
  white: "#ffffff",
  blue: "#1a6b3c",
  red: "#dc2626",
};

/** Composite a PNG-with-alpha over a solid background color, so
 *  semi-transparent edge pixels get proper blending instead of
 *  looking washed out. */
function compositeOverColor(
  srcBlob: Blob,
  color: string
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const ctx = c.getContext("2d")!;
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(img, 0, 0);
      c.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png");
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(srcBlob);
  });
}

export default function BackgroundRemoverPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [processedSize, setProcessedSize] = useState(0);
  const [progress, setProgress] = useState(0);

  // Background replacement
  const [bgColor, setBgColor] = useState<BgColor>("white");
  const [customColor, setCustomColor] = useState("#e5e7eb");

  // Passport size
  const [passportSize, setPassportSize] = useState<PassportSize>("custom");
  const [cropWidth, setCropWidth] = useState(300);
  const [cropHeight, setCropHeight] = useState(300);
  const [applyCrop, setApplyCrop] = useState(false);

  // Draggable crop overlay
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });
  const [cropFrac, setCropFrac] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, orgX: 0, orgY: 0, orgW: 0, orgH: 0 });
  const displayImgRef = useRef<HTMLImageElement | null>(null);

  const imageRef = useRef<HTMLImageElement | null>(null);

  // Calculate crop rectangle fractions whenever inputs change
  useEffect(() => {
    if (!applyCrop || naturalSize.w === 0 || naturalSize.h === 0) {
      setCropFrac({ x: 0, y: 0, w: 0, h: 0 });
      return;
    }

    const { w: nw, h: nh } = naturalSize;
    const targetRatio =
      passportSize === "custom"
        ? cropWidth / cropHeight
        : PASSPORT_SIZES[passportSize].w / PASSPORT_SIZES[passportSize].h;

    let fracW: number, fracH: number;
    if (nw / nh > targetRatio) {
      // Image is wider than target — crop full height
      fracH = 1;
      fracW = (targetRatio * nh) / nw;
    } else {
      // Image is taller or equal — crop full width
      fracW = 1;
      fracH = nw / (targetRatio * nh);
    }

    fracW = Math.min(fracW, 1);
    fracH = Math.min(fracH, 1);

    // Center the crop rect initially
    setCropFrac({
      x: (1 - fracW) / 2,
      y: (1 - fracH) / 2,
      w: fracW,
      h: fracH,
    });
  }, [applyCrop, passportSize, cropWidth, cropHeight, naturalSize]);

  // === Draggable crop overlay pointer handlers ===
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!applyCrop || cropFrac.w === 0) return;
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      orgX: cropFrac.x,
      orgY: cropFrac.y,
      orgW: cropFrac.w,
      orgH: cropFrac.h,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const fracDX = (e.clientX - dragRef.current.startX) / rect.width;
    const fracDY = (e.clientY - dragRef.current.startY) / rect.height;

    let newX = dragRef.current.orgX + fracDX;
    let newY = dragRef.current.orgY + fracDY;

    // Constrain so crop rect stays within image bounds
    newX = Math.max(0, Math.min(newX, 1 - cropFrac.w));
    newY = Math.max(0, Math.min(newY, 1 - cropFrac.h));

    setCropFrac((prev) => ({ ...prev, x: newX, y: newY }));
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setInputFile(file);
    setOriginalSize(file.size);
    setResultUrl(null);
    setMessage(null);
    setStatus("idle");
    setProgress(0);

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
      setCropWidth(img.naturalWidth);
      setCropHeight(img.naturalHeight);
    };
    img.src = url;
  };

  /** Auto-resize very large images to prevent OOM */
  const downscaleIfNeeded = (img: HTMLImageElement): { w: number; h: number; downscaled: boolean } => {
    const MAX = 2048;
    let w = img.naturalWidth;
    let h = img.naturalHeight;
    if (w <= MAX && h <= MAX) return { w, h, downscaled: false };
    const r = Math.min(MAX / w, MAX / h);
    return { w: Math.round(w * r), h: Math.round(h * r), downscaled: true };
  };

  // === AI Background Removal ===
  const handleAIRemove = async () => {
    if (!inputFile || !previewUrl) {
      setMessage({ type: "error", text: "Please select an image first." });
      return;
    }

    setStatus("loading");
    setProgress(0);
    setMessage(null);

    try {
      const { removeBackground, preload } = await import("@imgly/background-removal");

      // Preload model
      await preload({
        progress: (_key: string, current: number, total: number) => {
          setProgress(Math.round((current / total) * 80));
        },
      });

      setProgress(80);

      // Downscale large images before AI
      let source: Blob | File = inputFile;
      if (imageRef.current) {
        const { w, h, downscaled } = downscaleIfNeeded(imageRef.current);
        if (downscaled) {
          const c = document.createElement("canvas");
          c.width = w;
          c.height = h;
          c.getContext("2d")!.drawImage(imageRef.current, 0, 0, w, h);
          source = await new Promise<Blob>((resolve) =>
            c.toBlob((b) => resolve(b!), "image/png")
          );
        }
      }

      setProgress(85);

      // Remove background
      let rawBlob = await removeBackground(source, {
        progress: (_key: string, current: number, total: number) => {
          setProgress(85 + Math.round((current / total) * 14));
        },
        output: { format: "image/png" },
      });

      setProgress(99);

      // Composite over chosen background so semi-transparent edges
      // blend properly instead of looking washed out.
      if (bgColor !== "transparent") {
        const fill = bgColor === "custom" ? customColor : BG_COLORS[bgColor];
        rawBlob = await compositeOverColor(rawBlob, fill);
      }

      const url = URL.createObjectURL(rawBlob);
      setResultUrl(url);
      setProcessedSize(rawBlob.size);
      setProgress(100);
      setStatus("done");
      setMessage({
        type: "success",
        text: `Background removed! (${formatSize(originalSize)} → ${formatSize(rawBlob.size)})`,
      });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      setStatus("error");
      setMessage({ type: "error", text: `AI background removal failed: ${errorMsg}` });
    }
  };

  // === Apply Passport Crop ===
  const applyPassportCrop = useCallback(async (sourceBlob: Blob): Promise<Blob> => {
    if (!applyCrop || cropFrac.w === 0) return sourceBlob;

    const img = new Image();

    return new Promise((resolve, reject) => {
      img.onload = () => {
        const nw = img.naturalWidth;
        const nh = img.naturalHeight;
        const c = document.createElement("canvas");
        let tw: number, th: number;
        if (passportSize === "custom") {
          tw = cropWidth;
          th = cropHeight;
        } else {
          tw = PASSPORT_SIZES[passportSize].w;
          th = PASSPORT_SIZES[passportSize].h;
        }

        c.width = tw;
        c.height = th;
        const ctx = c.getContext("2d")!;

        // Fill bg
        if (bgColor !== "transparent") {
          const fill = bgColor === "custom" ? customColor : BG_COLORS[bgColor];
          ctx.fillStyle = fill;
          ctx.fillRect(0, 0, tw, th);
        }

        // Convert crop fractions to pixel coords on the source image
        const sx = Math.round(cropFrac.x * nw);
        const sy = Math.round(cropFrac.y * nh);
        const sw = Math.round(cropFrac.w * nw);
        const sh = Math.round(cropFrac.h * nh);

        // Draw the user-positioned crop region, scaled to fill target canvas
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, tw, th);

        c.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob"))), "image/png");
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(sourceBlob);
    });
  }, [applyCrop, passportSize, cropWidth, cropHeight, bgColor, customColor, cropFrac]);

  // === Download ===
  const handleDownload = async () => {
    if (!resultUrl) return;
    setStatus("processing");
    setProgress(0);
    setMessage(null);

    try {
      let blob = await fetch(resultUrl).then((r) => r.blob());

      if (applyCrop) {
        blob = await applyPassportCrop(blob);
      }

      setProcessedSize(blob.size);

      const dlUrl = URL.createObjectURL(blob);
      const baseName = inputFile?.name.replace(/\.[^.]+$/, "") || "passport-photo";
      const suffix = applyCrop ? "-passport" : "-nobg";
      const fileName = `${baseName}${suffix}.png`;

      const link = document.createElement("a");
      link.href = dlUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => window.open(dlUrl, "_blank"), 200);

      setProgress(100);
      setStatus("done");
      setMessage({
        type: "success",
        text: `Downloaded! ${formatSize(blob.size)} — ${
          /iPad|iPhone|iPod/.test(navigator.userAgent)
            ? 'Tap & hold the image that opened to save it.'
            : 'Download started.'
        }`,
      });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Download failed";
      setStatus("error");
      setMessage({ type: "error", text: errorMsg });
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isProcessing = status === "loading" || status === "processing";
  const hasResult = status === "done";

  return (
    <div>
      <Breadcrumb />
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
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
          <h1 className="text-2xl md:text-3xl font-bold">🧹 Background Remover</h1>
          <p className="text-emerald-100 mt-1">
            Remove background from portraits &amp; passport photos using AI.
          </p>
        </div>
      </div>

      <div className="container-main py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Sidebar - Options */}
            <div className="lg:col-span-2 space-y-4">
              {/* File Input */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileSelect}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
                {inputFile && (
                  <p className="text-xs text-gray-500 mt-1">{inputFile.name}</p>
                )}
              </div>

              {/* Background Replacement */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Replace Background
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(["white", "blue", "red", "transparent"] as BgColor[]).map((color) => (
                    <button
                      key={color}
                      onClick={() => setBgColor(color)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                        bgColor === color
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-gray-300 inline-block shrink-0"
                        style={{
                          backgroundColor:
                            color === "transparent"
                              ? "#c0c0c0"
                              : BG_COLORS[color],
                        }}
                      />
                      {color.charAt(0).toUpperCase() + color.slice(1)}
                    </button>
                  ))}
                  <button
                    onClick={() => setBgColor("custom")}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                      bgColor === "custom"
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full border border-gray-300 inline-block shrink-0 bg-gradient-to-br from-pink-400 to-purple-500" />
                    Custom
                  </button>
                </div>
                {bgColor === "custom" && (
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="w-full h-8 rounded border border-gray-300 cursor-pointer mt-2"
                  />
                )}
              </div>

              {/* Passport Size */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <input
                    type="checkbox"
                    checked={applyCrop}
                    onChange={(e) => setApplyCrop(e.target.checked)}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  Passport Size Crop
                </label>

                {applyCrop && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      {(["2x2", "35x45", "51x51", "custom"] as PassportSize[]).map(
                        (size) => (
                          <button
                            key={size}
                            onClick={() => setPassportSize(size)}
                            className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                              passportSize === size
                                ? "bg-emerald-600 text-white border-emerald-600"
                                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {PASSPORT_SIZES[size].label}
                          </button>
                        )
                      )}
                    </div>
                    {passportSize === "custom" && (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Width (px)</label>
                          <input
                            type="number"
                            value={cropWidth}
                            onChange={(e) => setCropWidth(Number(e.target.value))}
                            min={1} max={5000}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Height (px)</label>
                          <input
                            type="number"
                            value={cropHeight}
                            onChange={(e) => setCropHeight(Number(e.target.value))}
                            min={1} max={5000}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <p className="text-xs text-amber-700 flex items-start gap-1.5">
                  <span>📡</span>
                  <span>First use downloads a ~20 MB AI model (once). Use Wi-Fi to avoid data charges.</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                {!hasResult ? (
                  <button
                    onClick={handleAIRemove}
                    disabled={!inputFile || isProcessing}
                    className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  >
                    {isProcessing
                      ? `Processing... ${progress}%`
                      : "🤖 Remove Background"}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleDownload}
                      disabled={isProcessing}
                      className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                    >
                      {isProcessing ? `Processing... ${progress}%` : "⬇️ Download Result"}
                    </button>
                    <button
                      onClick={() => {
                        setResultUrl(null);
                        setStatus("idle");
                        setMessage(null);
                        setProgress(0);
                      }}
                      className="w-full px-6 py-2.5 bg-white text-gray-600 rounded-lg hover:bg-gray-50 border border-gray-300 transition-colors text-sm font-medium"
                    >
                      🔄 Start Over
                    </button>
                  </>
                )}

                {status === "error" && !isProcessing && (
                  <button
                    onClick={() => { setStatus("idle"); setMessage(null); setProgress(0); }}
                    className="w-full px-6 py-2.5 bg-white text-gray-600 rounded-lg hover:bg-gray-50 border border-gray-300 transition-colors text-sm font-medium"
                  >
                    🔄 Try Again
                  </button>
                )}
              </div>

              {/* Progress */}
              {isProcessing && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
              )}
            </div>

            {/* Main - Preview & Result */}
            <div className="lg:col-span-3 space-y-4">
              {previewUrl && (
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <h3 className="text-sm font-bold text-gray-900 mb-2">
                    {hasResult ? "🖼️ Result" : "📷 Original"}
                  </h3>
                  <div className="relative bg-gray-50 rounded-lg flex items-center justify-center min-h-[200px] border border-gray-200">
                    <div className="relative inline-block leading-none">
                      <img
                        ref={displayImgRef}
                        src={resultUrl || previewUrl}
                        alt={hasResult ? "Processed result" : "Preview"}
                        className="max-w-full h-auto max-h-96 rounded-lg block"
                        draggable={false}
                      />
                      {/* Draggable passport crop overlay */}
                      {applyCrop && cropFrac.w > 0 && (
                        <div
                          className={`absolute inset-0 ${isDragging ? "cursor-grabbing" : "cursor-move"} select-none`}
                          onPointerDown={handlePointerDown}
                          onPointerMove={handlePointerMove}
                          onPointerUp={handlePointerUp}
                          onPointerCancel={handlePointerUp}
                          style={{ touchAction: "none" }}
                        >
                          {/* The clear rectangle with white border and dark overlay */}
                          <div
                            className="absolute border-2 border-white pointer-events-none"
                            style={{
                              left: `${cropFrac.x * 100}%`,
                              top: `${cropFrac.y * 100}%`,
                              width: `${cropFrac.w * 100}%`,
                              height: `${cropFrac.h * 100}%`,
                              boxShadow: "0 0 0 9999px rgba(0,0,0,0.45)",
                            }}
                          />
                          {/* Drag hint */}
                          {!isDragging && (
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-[10px] px-2 py-1 rounded pointer-events-none whitespace-nowrap opacity-70">
                              Drag to reposition
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  {inputFile && (
                    <p className="text-xs text-gray-500 mt-2">
                      {hasResult
                        ? `${formatSize(originalSize)} → ${formatSize(processedSize)}`
                        : formatSize(originalSize)}
                    </p>
                  )}
                </div>
              )}

              {!previewUrl && (
                <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 flex flex-col items-center justify-center text-center min-h-[300px]">
                  <span className="text-5xl mb-4">🧹</span>
                  <h3 className="text-lg font-semibold text-gray-700 mb-1">Upload a Portrait Photo</h3>
                  <p className="text-sm text-gray-500 max-w-sm">
                    Remove background from passport photos, profile pictures, and portraits.
                    The AI works best on photos with a clear subject.
                  </p>
                </div>
              )}

              {message && (
                <div className={`p-3 rounded-lg text-sm ${
                  message.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                  {message.text}
                </div>
              )}

              {/* Info */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h2 className="text-sm font-bold text-gray-900 mb-2">How It Works</h2>
                <ul className="text-sm text-gray-600 space-y-1.5">
                  <li>• Powered by <strong>AI</strong> — uses a neural network trained on millions of portraits. No manual color picking needed.</li>
                  <li>• Choose a replacement background (white, blue, red) — perfect for passport photos.</li>
                  <li>• Enable <strong>Passport Size Crop</strong> for standard dimensions.</li>
                  <li>• All processing happens <strong>entirely in your browser</strong>. Zero uploads to any server.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
