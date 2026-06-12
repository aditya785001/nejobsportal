"use client";

import { useCallback, useRef, useState } from "react";

// ── Toolbar button props ──

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}

function ToolbarButton({ onClick, active, title, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded hover:bg-gray-200 transition-colors text-sm leading-none ${
        active ? "bg-gray-200 text-gray-900" : "text-gray-600"
      }`}
    >
      {children}
    </button>
  );
}

// ── Table Modal ──

function TableModal({ onClose, onInsert }: { onClose: () => void; onInsert: (rows: number, cols: number) => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-xl p-6 w-80"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Insert Table</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const rows = parseInt(fd.get("rows") as string) || 2;
            const cols = parseInt(fd.get("cols") as string) || 2;
            onInsert(rows, cols);
          }}
        >
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Rows</label>
              <input
                name="rows"
                type="number"
                min={1}
                max={20}
                defaultValue={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Columns</label>
              <input
                name="cols"
                type="number"
                min={1}
                max={10}
                defaultValue={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-sm bg-[#1a6b3c] text-white rounded-lg hover:bg-[#145230]"
            >
              Insert
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Color Picker Modal ──

const COLOR_PRESETS = [
  "#000000", "#434343", "#666666", "#999999", "#b7b7b7", "#cccccc", "#d9d9d9",
  "#efefef", "#f3f3f3", "#ffffff",
  "#980000", "#ff0000", "#ff9900", "#ffff00", "#00ff00", "#00ffff", "#4a86e8",
  "#0000ff", "#9900ff", "#ff00ff",
  "#e6b8af", "#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#c9daf8",
  "#cfe2f3", "#d9d2e9", "#ead1dc",
  "#dd7e6b", "#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#a4c2f4",
  "#9fc5e8", "#b4a7d6", "#d5a6bd",
  "#cc4125", "#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6d9eeb",
  "#6fa8dc", "#8e7cc3", "#c27ba0",
  "#a61c00", "#cc0000", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3c78d8",
  "#3d85c6", "#674ea7", "#a64d79",
  "#85200c", "#990000", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#1155cc",
  "#0b5394", "#351c75", "#741b47",
  "#5b0f00", "#660000", "#783f04", "#7f6000", "#274e13", "#0c343d", "#1c4587",
  "#073763", "#20124d", "#4c1130",
];

interface ColorPickerModalProps {
  onClose: () => void;
  onSelect: (color: string) => void;
}

function ColorPickerModal({ onClose, onSelect }: ColorPickerModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-xl p-4 w-80"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xs font-semibold text-gray-900 mb-3 uppercase tracking-wide">Text Color</h3>
        <div className="grid grid-cols-10 gap-1">
          {COLOR_PRESETS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => onSelect(color)}
              className="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
        <div className="flex justify-end mt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main RichTextEditor ──

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Start typing...",
  minHeight = 200,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showTableModal, setShowTableModal] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  // Track selection for toolbar state
  const [activeFormats, setActiveFormats] = useState<Record<string, boolean>>({});
  const selRef = useRef<Selection | null>(null);

  // ── Save / restore selection ──
  const saveSelection = useCallback(() => {
    const sel = window.getSelection();
    selRef.current = sel;
  }, []);

  const restoreSelection = useCallback(() => {
    if (selRef.current && editorRef.current) {
      // Try to restore; if the DOM changed, just focus the editor
      try {
        const range = selRef.current.getRangeAt(0);
        if (editorRef.current.contains(range.commonAncestorContainer)) {
          const sel = window.getSelection();
          sel?.removeAllRanges();
          sel?.addRange(range);
          return;
        }
      } catch {
        // ignore
      }
      editorRef.current.focus();
    }
  }, []);

  // ── Execute command ──
  const exec = useCallback(
    (command: string, value?: string) => {
      saveSelection();
      setTimeout(() => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
        // Trigger onChange after exec
        if (editorRef.current) {
          onChange(editorRef.current.innerHTML);
        }
        updateActiveFormats();
      }, 0);
    },
    [onChange]
  );

  // ── Update active format state ──
  const updateActiveFormats = useCallback(() => {
    if (!editorRef.current) return;
    setActiveFormats({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      strikeThrough: document.queryCommandState("strikeThrough"),
      insertOrderedList: document.queryCommandState("insertOrderedList"),
      insertUnorderedList: document.queryCommandState("insertUnorderedList"),
      justifyLeft: document.queryCommandState("justifyLeft"),
      justifyCenter: document.queryCommandState("justifyCenter"),
      justifyRight: document.queryCommandState("justifyRight"),
      formatBlock: document.queryCommandValue("formatBlock") === "h2" || document.queryCommandValue("formatBlock") === "h3",
    });
  }, []);

  // ── Handle input from contentEditable ──
  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  // ── Insert table ──
  const insertTable = useCallback(
    (rows: number, cols: number) => {
      setShowTableModal(false);
      restoreSelection();
      let tableHtml = "<table class='min-w-full border-collapse border border-gray-300 my-2'><tbody>";
      for (let r = 0; r < rows; r++) {
        tableHtml += "<tr>";
        for (let c = 0; c < cols; c++) {
          const tag = r === 0 ? "th" : "td";
          tableHtml += `<${tag} class='border border-gray-300 px-2 py-1'> </${tag}>`;
        }
        tableHtml += "</tr>";
      }
      tableHtml += "</tbody></table>";
      exec("insertHTML", tableHtml);
    },
    [exec, restoreSelection]
  );

  // ── Insert heading ──
  const toggleHeading = useCallback(() => {
    const isH2 = document.queryCommandValue("formatBlock") === "h2";
    exec("formatBlock", isH2 ? "p" : "h2");
  }, [exec]);

  // ── Handle paste to strip unwanted formatting ──
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  }, []);

  // ── Initialize content on mount ──
  // (value is set via dangerouslySetInnerHTML)

  // Need useState import
  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-gray-50 border-b border-gray-300">
        {/* Text style */}
        <ToolbarButton onClick={toggleHeading} active={activeFormats.formatBlock} title="Heading">
          <span className="font-bold text-xs">H</span>
        </ToolbarButton>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        {/* Bold / Italic / Underline / Strike */}
        <ToolbarButton onClick={() => exec("bold")} active={activeFormats.bold} title="Bold">
          <span className="font-bold">B</span>
        </ToolbarButton>
        <ToolbarButton onClick={() => exec("italic")} active={activeFormats.italic} title="Italic">
          <span className="italic">I</span>
        </ToolbarButton>
        <ToolbarButton onClick={() => exec("underline")} active={activeFormats.underline} title="Underline">
          <span className="underline">U</span>
        </ToolbarButton>
        <ToolbarButton onClick={() => exec("strikeThrough")} active={activeFormats.strikeThrough} title="Strikethrough">
          <span className="line-through">S</span>
        </ToolbarButton>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        {/* Text Color */}
        <ToolbarButton
          onClick={() => {
            saveSelection();
            setShowColorPicker(true);
          }}
          title="Text Color"
        >
          <span style={{ color: "#e06666", fontWeight: "bold" }}>A</span>
        </ToolbarButton>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        {/* Lists */}
        <ToolbarButton onClick={() => exec("insertUnorderedList")} active={activeFormats.insertUnorderedList} title="Bullet List">
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor"><circle cx="4" cy="4" r="1.5" /><circle cx="4" cy="8" r="1.5" /><circle cx="4" cy="12" r="1.5" /><rect x="7" y="3" width="7" height="2" /><rect x="7" y="7" width="7" height="2" /><rect x="7" y="11" width="7" height="2" /></svg>
        </ToolbarButton>
        <ToolbarButton onClick={() => exec("insertOrderedList")} active={activeFormats.insertOrderedList} title="Numbered List">
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor"><path d="M3 3h1v2H3V3zm0 4h1v2H3V7zm0 4h1v2H3v-2zm3-8h7v2H6V3zm0 4h7v2H6V7zm0 4h7v2H6v-2z" /></svg>
        </ToolbarButton>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        {/* Alignment */}
        <ToolbarButton onClick={() => exec("justifyLeft")} active={activeFormats.justifyLeft} title="Align Left">
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3" width="12" height="2" /><rect x="2" y="7" width="8" height="2" /><rect x="2" y="11" width="10" height="2" /></svg>
        </ToolbarButton>
        <ToolbarButton onClick={() => exec("justifyCenter")} active={activeFormats.justifyCenter} title="Align Center">
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3" width="12" height="2" /><rect x="4" y="7" width="8" height="2" /><rect x="3" y="11" width="10" height="2" /></svg>
        </ToolbarButton>
        <ToolbarButton onClick={() => exec("justifyRight")} active={activeFormats.justifyRight} title="Align Right">
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3" width="12" height="2" /><rect x="6" y="7" width="8" height="2" /><rect x="4" y="11" width="10" height="2" /></svg>
        </ToolbarButton>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        {/* Table */}
        <ToolbarButton
          onClick={() => {
            saveSelection();
            setShowTableModal(true);
          }}
          title="Insert Table"
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="2" width="12" height="3" rx="0.5" /><rect x="2" y="6.5" width="12" height="3" rx="0.5" /><rect x="2" y="11" width="12" height="3" rx="0.5" /></svg>
        </ToolbarButton>

        {/* Link */}
        <ToolbarButton
          onClick={() => {
            const url = prompt("Enter URL:");
            if (url) exec("createLink", url);
          }}
          title="Insert Link"
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor"><path d="M6.5 4.5l-2 2a2.5 2.5 0 003.54 3.54l2-2a.5.5 0 01.7.7l-2 2a3.5 3.5 0 01-4.95-4.95l2-2a.5.5 0 01.7.7zm3-3l-2 2a.5.5 0 01.7.7l2-2a2.5 2.5 0 00-3.54-3.54l-2 2a.5.5 0 01.7.7l2-2a3.5 3.5 0 014.95 4.95l-2 2a.5.5 0 01-.7-.7l2-2A2.5 2.5 0 009.5 1.5z" /></svg>
        </ToolbarButton>
      </div>

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onMouseUp={updateActiveFormats}
        onKeyUp={updateActiveFormats}
        onPaste={handlePaste}
        dangerouslySetInnerHTML={{ __html: value || "" }}
        data-placeholder={placeholder}
        style={{ minHeight }}
        className="px-4 py-3 text-sm text-gray-900 focus:outline-none [&:empty:before]:content-[attr(data-placeholder)] [&:empty:before]:text-gray-400 [&:empty:before]:pointer-events-none prose prose-sm max-w-none"
      />

      {/* Modals */}
      {showTableModal && (
        <TableModal
          onClose={() => setShowTableModal(false)}
          onInsert={insertTable}
        />
      )}
      {showColorPicker && (
        <ColorPickerModal
          onClose={() => setShowColorPicker(false)}
          onSelect={(color) => {
            setShowColorPicker(false);
            restoreSelection();
            exec("foreColor", color);
          }}
        />
      )}
    </div>
  );
}


