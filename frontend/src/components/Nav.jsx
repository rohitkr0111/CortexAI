import React from 'react';
import { useSelector } from 'react-redux';
import {
  MessageSquare,
  Code2,
  ChevronRight
} from 'lucide-react';

function Nav() {
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { messages, artifacts } = useSelector((state) => state.message);

  const hasArtifacts = artifacts && artifacts.length > 0;

  return (
    <div className="h-14 flex items-center justify-between px-4 sm:px-6 border-b border-white/[0.08] bg-[#0d0f14]/90 backdrop-blur-xl">
      {/* Left: Breadcrumbs & Title */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
          <span className="hover:text-white transition">Cortex</span>
          <ChevronRight size={12} className="text-slate-400" />
          <span className="hover:text-white transition">Session</span>
          <ChevronRight size={12} className="text-slate-400" />
        </div>

        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center justify-center w-6 h-6 rounded-md bg-white/[0.06] border border-white/[0.1] text-slate-300 shrink-0">
            <MessageSquare size={12} />
          </div>

          <h2 className="text-xs sm:text-[13px] font-semibold text-white tracking-tight truncate max-w-[200px] sm:max-w-[320px]">
            {selectedConversation?.title || "New Chat"}
          </h2>
        </div>

        {messages && messages.length > 0 && (
          <span className="hidden md:inline-flex items-center font-mono text-[10px] text-slate-400 bg-white/[0.04] border border-white/[0.07] px-2 py-0.5 rounded-full">
            {messages.length} {messages.length === 1 ? "turn" : "turns"}
          </span>
        )}
      </div>

      {/* Right: Sandbox Status Pill */}
      <div className="flex items-center gap-2 sm:gap-3">
        {hasArtifacts && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-slate-300">
            <Code2 size={12} className="text-emerald-400" />
            <span>Sandbox Active</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/[0.08] border border-emerald-500/20 text-[10.5px] font-mono text-emerald-400">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
          </span>
          <span className="hidden md:inline">Online</span>
        </div>
      </div>
    </div>
  );
}

export default Nav;


