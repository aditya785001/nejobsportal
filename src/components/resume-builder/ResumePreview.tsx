"use client";

import { useRef, useEffect, useState } from "react";
import type { ResumeData, TemplateId } from "./types";
import { TEMPLATES } from "./types";
import { TEMPLATE_COMPONENTS } from "./templates";

interface Props {
  data: ResumeData;
  templateId: TemplateId;
}

export function ResumePreview({ data, templateId }: Props) {
  const scaleRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const config = TEMPLATES.find((t) => t.id === templateId) || TEMPLATES[0];
  const TemplateComponent = TEMPLATE_COMPONENTS[templateId];

  // Auto-scale the resume to fit within the preview container
  useEffect(() => {
    function computeScale() {
      if (!scaleRef.current) return;
      const container = scaleRef.current.parentElement;
      if (!container) return;
      const containerW = container.clientWidth - 32;
      const containerH = container.clientHeight - 32;
      const resumeW = 816; // US Letter width in pixels at 72dpi (8.5in)
      const resumeH = 1056; // US Letter height
      const scaleX = containerW / resumeW;
      const scaleY = containerH / resumeH;
      setScale(Math.min(scaleX, scaleY, 1));
    }
    computeScale();
    const observer = new ResizeObserver(computeScale);
    if (scaleRef.current?.parentElement) {
      observer.observe(scaleRef.current.parentElement);
    }
    return () => observer.disconnect();
  }, [data, templateId]);

  return (
    <div
      ref={scaleRef}
      style={{
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        width: 816,
        minHeight: 1056,
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        background: "#fff",
        overflow: "hidden",
      }}
    >
      <TemplateComponent data={data} config={config} />
    </div>
  );
}

/** Renders the resume at full size for printing */
export function ResumePrintView({ data, templateId }: Props) {
  const config = TEMPLATES.find((t) => t.id === templateId) || TEMPLATES[0];
  const TemplateComponent = TEMPLATE_COMPONENTS[templateId];

  return (
    <div style={{ width: 816, minHeight: 1056, background: "#fff", margin: "0 auto" }}>
      <TemplateComponent data={data} config={config} />
    </div>
  );
}
