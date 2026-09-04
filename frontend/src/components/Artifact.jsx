import React, { useState, useId } from "react";
import {
  Check,
  Code2,
  Copy,
  Eye,
  PanelRightClose,
  PanelRightOpen,
  X,
  RotateCw,
  Smartphone,
  Tablet,
  Monitor,
  Download,
  FileCode,
  FileText,
  ExternalLink,
  Layers
} from "lucide-react";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "motion/react";
import Editor from "@monaco-editor/react";

function Artifact() {
  const [collapsed, setCollapsed] = useState(false);
  const { artifacts } = useSelector((state) => state.message);
  const [tab, setTab] = useState("preview"); // Default to preview if available
  const [activeFile, setActiveFile] = useState(0);
  const [copied, setCopied] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [viewportMode, setViewportMode] = useState("desktop"); // 'desktop' | 'tablet' | 'mobile'
  const [previewKey, setPreviewKey] = useState(0);

  if (!artifacts || artifacts.length === 0) return null;

  const currentArtifact = artifacts[0];
  const files = currentArtifact?.files || [];
  const file = files[activeFile] || files[0];

  const htmlFile = files.find((f) => f?.name?.toLowerCase() === "index.html");
  const cssFile = files.find((f) => f?.name?.toLowerCase() === "style.css");
  const jsFile = files.find((f) => f?.name?.toLowerCase() === "script.js");

  const canPreview = Boolean(htmlFile);

  const previewDoc = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
     ${cssFile?.content || ""}
    </style>
</head>
<body style="margin: 0; padding: 0;">
 ${htmlFile?.content || ""} 
<script>
    try {
      ${jsFile?.content || ""}
    } catch(err) {
      console.error("Artifact runtime error:", err);
    }
</script>    
</body>
</html>`;

  const handleCopy = async () => {
    if (!file?.content) return;
    await navigator.clipboard.writeText(file.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!file?.content) return;
    const blob = new Blob([file.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name || "artifact-file.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const detectLanguage = (fileName = "") => {
    const name = fileName.toLowerCase();
    if (name.endsWith(".html")) return "html";
    if (name.endsWith(".css")) return "css";
    if (name.endsWith(".js") || name.endsWith(".jsx")) return "javascript";
    if (name.endsWith(".ts") || name.endsWith(".tsx")) return "typescript";
    if (name.endsWith(".json")) return "json";
    if (name.endsWith(".py")) return "python";
    if (name.endsWith(".java")) return "java";
    if (name.endsWith(".cpp") || name.endsWith(".c")) return "cpp";
    return "plaintext";
  };

  const reloadPreview = () => {
    setPreviewKey((prev) => prev + 1);
  };

  const PanelContent = ({ onClose }) => {
    return (
      <div className="flex flex-col h-full bg-[#0d0f14] border-l border-white/[0.08] select-none">
        {/* Top Header */}
        <div className="h-14 px-3 sm:px-4 border-b border-white/[0.08] flex items-center justify-between shrink-0 bg-[#101218]">
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={onClose ?? (() => setCollapsed(true))}
              title="Close panel"
              className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition shrink-0"
            >
              {onClose ? <X size={15} /> : <PanelRightClose size={15} />}
            </button>

            <div className="flex items-center gap-2 min-w-0">
              <div className="flex items-center justify-center w-6 h-6 rounded-md bg-white/[0.08] border border-white/[0.1] shrink-0 text-slate-200">
                <Code2 size={13} />
              </div>
              <span className="text-xs font-semibold text-white truncate max-w-[140px] sm:max-w-[200px]">
                {currentArtifact?.title || "Artifact Sandbox"}
              </span>
            </div>
          </div>

          {/* Right Toolbar */}
          <div className="flex items-center gap-1.5">
            {/* View Mode Toggle: Code vs Preview */}
            {canPreview && (
              <div className="flex items-center rounded-lg bg-white/[0.04] border border-white/[0.08] p-0.5">
                <button
                  type="button"
                  onClick={() => setTab("code")}
                  className={`flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-md transition ${
                    tab === "code"
                      ? "bg-white text-black font-semibold shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Code2 size={12} />
                  <span>Code</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTab("preview")}
                  className={`flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-md transition ${
                    tab === "preview"
                      ? "bg-white text-black font-semibold shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Eye size={12} />
                  <span>Preview</span>
                </button>
              </div>
            )}

            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopy}
              title="Copy active file content"
              className="flex items-center justify-center h-7 w-7 text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            </button>

            {/* Download Button */}
            <button
              type="button"
              onClick={handleDownload}
              title="Download file"
              className="flex items-center justify-center h-7 w-7 text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition"
            >
              <Download size={14} />
            </button>
          </div>
        </div>

        {/* Sub-Header: Responsive Device Viewport Switcher (Preview Mode) OR File Tabs (Code Mode) */}
        {tab === "preview" && canPreview ? (
          <div className="h-10 px-4 border-b border-white/[0.06] bg-[#0c0d12] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mr-1.5">
                Viewport:
              </span>
              <button
                type="button"
                onClick={() => setViewportMode("desktop")}
                title="Desktop View (100%)"
                className={`p-1.5 rounded-md transition ${
                  viewportMode === "desktop"
                    ? "bg-white/[0.1] text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Monitor size={14} />
              </button>
              <button
                type="button"
                onClick={() => setViewportMode("tablet")}
                title="Tablet View (768px)"
                className={`p-1.5 rounded-md transition ${
                  viewportMode === "tablet"
                    ? "bg-white/[0.1] text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Tablet size={14} />
              </button>
              <button
                type="button"
                onClick={() => setViewportMode("mobile")}
                title="Mobile View (375px)"
                className={`p-1.5 rounded-md transition ${
                  viewportMode === "mobile"
                    ? "bg-white/[0.1] text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Smartphone size={14} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={reloadPreview}
                title="Reload Sandbox"
                className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white transition"
              >
                <RotateCw size={11} />
                <span>Reload</span>
              </button>
            </div>
          </div>
        ) : (
          /* File Tabs Bar */
          <div className="h-10 border-b border-white/[0.06] bg-[#0c0d12] flex items-center overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shrink-0">
            {files.map((f, index) => {
              const isActive = activeFile === index;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveFile(index)}
                  className={`flex items-center gap-1.5 px-3.5 h-full text-xs font-medium border-r border-white/[0.06] transition relative whitespace-nowrap ${
                    isActive
                      ? "text-white bg-white/[0.04]"
                      : "text-slate-400 hover:text-slate-300 hover:bg-white/[0.02]"
                  }`}
                >
                  <FileCode size={12} className={isActive ? "text-white" : "text-slate-400"} />
                  <span>{f?.name || `file_${index}`}</span>
                  {isActive && (
                    <div className="absolute bottom-0 inset-x-0 h-0.5 bg-white" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden relative bg-[#090a0d]">
          {tab === "preview" && canPreview ? (
            <div className="w-full h-full flex items-center justify-center p-2 sm:p-4 bg-[#08090c] overflow-auto">
              <div
                className={`h-full transition-all duration-300 rounded-xl overflow-hidden shadow-2xl border border-white/[0.1] bg-white ${
                  viewportMode === "desktop"
                    ? "w-full"
                    : viewportMode === "tablet"
                    ? "w-[768px] max-w-full"
                    : "w-[375px] max-w-full"
                }`}
              >
                <iframe
                  key={previewKey}
                  title="Cortex Live Sandbox"
                  srcDoc={previewDoc}
                  sandbox="allow-scripts allow-modals allow-forms"
                  className="w-full h-full border-none"
                />
              </div>
            </div>
          ) : (
            <Editor
              theme="vs-dark"
              language={detectLanguage(file?.name)}
              value={file?.content || ""}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 12.5,
                lineHeight: 20,
                wordWrap: "on",
                automaticLayout: true,
                scrollBeyondLastLine: false,
                padding: { top: 14, bottom: 14 },
                lineNumbers: "on",
                renderLineHighlight: "all",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            />
          )}
        </div>

        {/* Status Bar */}
        <div className="h-6 px-3 border-t border-white/[0.06] bg-[#0c0d12] flex items-center justify-between text-[10px] font-mono text-slate-400 shrink-0">
          <div className="flex items-center gap-3">
            <span>{detectLanguage(file?.name).toUpperCase()}</span>
            <span>•</span>
            <span>UTF-8</span>
          </div>
          <div>
            <span>Monaco Runtime Active</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Floating Button */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-20 right-4 z-40 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white text-black text-xs font-semibold shadow-2xl transition active:scale-95"
      >
        <Code2 size={14} />
        <span>Sandbox</span>
      </button>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="lg:hidden fixed inset-y-0 right-0 z-50 w-[90vw] max-w-[480px] shadow-2xl overflow-hidden"
            >
              <PanelContent onClose={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Persistent Panel */}
      {collapsed ? (
        <div className="hidden lg:flex h-full border-l border-white/[0.08] bg-[#0d0f14] flex-col items-center py-4 gap-4 shrink-0 w-12 justify-between">
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            title="Open Sandbox"
            className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition"
          >
            <PanelRightOpen size={16} />
          </button>
          <div
            className="text-[10px] font-mono tracking-widest uppercase text-slate-400"
            style={{
              writingMode: "vertical-lr",
              transform: "rotate(180deg)",
            }}
          >
            {currentArtifact?.title || "Artifact Sandbox"}
          </div>
          <div className="h-8 w-8" />
        </div>
      ) : (
        <motion.div
          initial={{ width: 440 }}
          animate={{ width: 440 }}
          transition={{ duration: 0.2 }}
          className="hidden lg:flex h-full flex-col overflow-hidden shrink-0 z-20"
        >
          <PanelContent />
        </motion.div>
      )}
    </>
  );
}

export default Artifact;
