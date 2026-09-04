import React, { useState } from "react";
import {
  Check,
  Copy,
  ExternalLink,
  X,
  Cpu,
  User,
  Code2,
  Terminal,
  Download
} from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function MessageBubble({ role, content, images = [], agent }) {
  const isUser = role === "user";
  const [lightBox, setLightBox] = useState(null);
  const [copiedCode, setCopiedCode] = useState("");
  const [copiedFull, setCopiedFull] = useState(false);

  const copyCode = async (code) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  const copyFullResponse = async () => {
    await navigator.clipboard.writeText(content);
    setCopiedFull(true);
    setTimeout(() => setCopiedFull(false), 2000);
  };

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"} my-2`}>
      {isUser ? (
        /* USER MESSAGE BUBBLE (Refined Obsidian Card) */
        <div className="flex items-start gap-2.5 max-w-[92vw] sm:max-w-[76%]">
          <div className="rounded-2xl rounded-tr-sm border border-white/[0.12] bg-[#161822] px-4 py-3 text-[13.5px] leading-relaxed text-white shadow-sm break-words overflow-hidden">
            <p className="whitespace-pre-wrap">{content}</p>
          </div>
          <div className="hidden sm:flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.08] border border-white/[0.1] text-slate-300">
            <User size={13} />
          </div>
        </div>
      ) : (
        /* ASSISTANT MESSAGE BUBBLE (Cortex AI Monolith) */
        <div className="flex items-start gap-3 w-full max-w-[96vw] sm:max-w-[92%]">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/[0.08] border border-white/[0.12] text-white shadow-sm mt-1">
            <span className="font-bold text-xs">C</span>
          </div>

          <div className="flex-1 min-w-0 rounded-2xl border border-white/[0.08] bg-[#101218] p-4 sm:p-5 shadow-sm">
            {/* Header: Agent Identity & Copy Action */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-white tracking-tight">
                  Cortex AI
                </span>
                <span className="rounded bg-white/[0.05] border border-white/[0.07] px-1.5 py-0.2 text-[9.5px] font-mono text-slate-400">
                  {agent ? `${agent} Agent` : "Autonomous Fleet"}
                </span>
              </div>

              <button
                type="button"
                onClick={copyFullResponse}
                title="Copy entire response"
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-0.5 rounded hover:bg-white/[0.06] transition"
              >
                {copiedFull ? (
                  <>
                    <Check size={12} className="text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Generated Images */}
            {images.length > 0 && (
              <div className="flex flex-wrap gap-2.5 mb-4">
                {images.map((img, i) => (
                  <div key={i} className="relative group overflow-hidden rounded-xl border border-white/[0.1]">
                    <img
                      src={img}
                      alt="Generated or analyzed visual"
                      onClick={() => setLightBox(img)}
                      loading="lazy"
                      onError={(e) => e.currentTarget.remove()}
                      className="w-48 h-32 object-cover cursor-zoom-in transition duration-200 group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Markdown Body */}
            <div className="text-[13.5px] leading-relaxed text-slate-200">
              <Markdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-xl font-bold text-white mt-5 mb-2.5 tracking-tight border-b border-white/[0.06] pb-1.5">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-lg font-semibold text-white mt-4 mb-2 tracking-tight">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-base font-semibold text-white mt-3 mb-1.5">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="mb-3 leading-relaxed whitespace-pre-wrap break-words text-slate-200">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc pl-5 space-y-1.5 my-2.5 text-slate-300">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal pl-5 space-y-1.5 my-2.5 text-slate-300">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="leading-relaxed">{children}</li>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-2 border-white/20 pl-3.5 italic text-slate-400 my-3">
                      {children}
                    </blockquote>
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-4 rounded-xl border border-white/[0.08]">
                      <table className="min-w-full text-xs text-left">
                        {children}
                      </table>
                    </div>
                  ),
                  thead: ({ children }) => (
                    <thead className="bg-white/[0.05] border-b border-white/[0.08] font-semibold text-white">
                      {children}
                    </thead>
                  ),
                  th: ({ children }) => (
                    <th className="px-3.5 py-2.5">{children}</th>
                  ),
                  td: ({ children }) => (
                    <td className="px-3.5 py-2 border-t border-white/[0.05] text-slate-300">
                      {children}
                    </td>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-white underline underline-offset-2 hover:text-slate-300 inline-flex items-center gap-1 transition"
                    >
                      {children}
                      <ExternalLink size={11} className="opacity-70" />
                    </a>
                  ),
                  code: ({ className, children }) => {
                    const value = String(children).trim();

                    if (!className) {
                      return (
                        <code className="px-1.5 py-0.5 rounded-md bg-white/[0.08] text-white font-mono text-[12px] border border-white/[0.06]">
                          {value}
                        </code>
                      );
                    }

                    const language = className.replace("language-", "");

                    return (
                      <div className="my-3.5 overflow-hidden rounded-xl border border-white/[0.1] bg-[#0c0d12]">
                        {/* Code Header */}
                        <div className="flex items-center justify-between bg-[#14161f] border-b border-white/[0.08] px-3.5 py-2 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="uppercase font-mono text-[10.5px] font-semibold text-slate-300">
                              {language || "code"}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => copyCode(value)}
                            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
                          >
                            {copiedCode === value ? (
                              <>
                                <Check size={13} className="text-emerald-400" />
                                <span className="text-emerald-400 text-[11px]">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy size={13} />
                                <span className="text-[11px]">Copy Code</span>
                              </>
                            )}
                          </button>
                        </div>

                        <SyntaxHighlighter
                          language={language}
                          style={oneDark}
                          wrapLongLines
                          showLineNumbers
                          customStyle={{
                            margin: 0,
                            padding: "14px 16px",
                            background: "#090a0f",
                            fontSize: "12.5px",
                            lineHeight: "1.6",
                          }}
                        >
                          {value}
                        </SyntaxHighlighter>
                      </div>
                    );
                  },
                }}
              >
                {content}
              </Markdown>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightBox && (
        <div className="fixed inset-0 z-[110] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const a = document.createElement("a");
                a.href = lightBox;
                a.download = "cortex-visual.png";
                a.click();
              }}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.1] hover:bg-white/[0.2] text-white transition"
              title="Download image"
            >
              <Download size={16} />
            </button>
            <button
              type="button"
              onClick={() => setLightBox(null)}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.1] hover:bg-white/[0.2] text-white transition"
              title="Close modal"
            >
              <X size={16} />
            </button>
          </div>
          <img
            src={lightBox}
            alt="Expanded visual"
            className="max-w-[90vw] max-h-[85vh] rounded-2xl border border-white/[0.15] shadow-2xl object-contain"
          />
        </div>
      )}
    </div>
  );
}

export default MessageBubble;
