import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import MessageBubble from "./MessageBubble";
import LoadingAnimation from "./LoadingAnimation";
import {
  Code2,
  Globe,
  FileText,
  Presentation,
  Cpu,
  Sparkles,
  ArrowRight,
  Layers,
  Zap,
  Terminal
} from "lucide-react";
import sendMessage from "../features/sendMessage";
import { createConversation } from "../features/createConversation";
import {
  addConversation,
  setSelectedConversation,
  setConvTitle,
} from "../redux/conversationSlice";
import {
  addMessage,
  setArtifacts,
  setIsLoading,
} from "../redux/messageSlice";
import { updateConversation } from "../features/updateConversation";

function MessageList() {
  const { selectedConversation } = useSelector(
    (state) => state.conversation
  );
  const { messages, isLoading } = useSelector(
    (state) => state.message
  );
  const bottomRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    requestAnimationFrame(() => {
      bottomRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    });
  }, [messages?.length, isLoading]);

  const handleQuickPrompt = async (prompt, agent = "auto") => {
    if (isLoading) return;
    dispatch(setIsLoading(true));

    try {
      let conversation = selectedConversation;

      if (!conversation) {
        const conv = await createConversation();
        dispatch(setSelectedConversation(conv));
        dispatch(addConversation(conv));
        conversation = conv;
      }

      if (conversation.title === "New Chat" || conversation.title === "New Session") {
        await updateConversation({
          id: conversation?._id,
          title: prompt,
        });
        dispatch(
          setConvTitle({
            conversationId: conversation?._id,
            title: prompt.slice(0, 36),
          })
        );
      }

      const formData = new FormData();
      formData.append("prompt", prompt);
      formData.append("conversationId", conversation?._id);
      formData.append("agent", agent.toLowerCase());

      dispatch(
        addMessage({
          role: "user",
          content: prompt,
        })
      );

      const data = await sendMessage(formData);

      dispatch(setArtifacts(data?.artifacts || []));
      dispatch(
        addMessage({
          role: "assistant",
          content:
            data?.answer ||
            "Unable to generate response. Please check server logs.",
          images: data?.images,
        })
      );
    } catch (err) {
      console.error("Quick prompt execution failed:", err);
      dispatch(
        addMessage({
          role: "assistant",
          content:
            "Request failed. Ensure backend services are running.",
        })
      );
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const starterCards = [
    {
      title: "Interactive Full-Stack Dashboard",
      desc: "Generate a responsive SaaS dashboard with live charts, dark mode, and KPI cards.",
      icon: Code2,
      agent: "coding",
      prompt:
        "Build a responsive SaaS analytics dashboard with interactive charts, KPIs, and dark mode in HTML/CSS/JavaScript.",
    },
    {
      title: "Deep Web Research & Citations",
      desc: "Query live web indices using Tavily for recent breakthroughs and benchmarks.",
      icon: Globe,
      agent: "search",
      prompt:
        "Search the web for the latest multimodal agent benchmarks and architecture patterns in 2025/2026.",
    },
    {
      title: "Vector Document Intelligence",
      desc: "Analyze vector retrieval, chunking strategies, and RAG pipelines.",
      icon: FileText,
      agent: "pdf",
      prompt:
        "Explain how vector embeddings and semantic search enable high-precision document intelligence in production RAG systems.",
    },
    {
      title: "Executive Slide Deck Engine",
      desc: "Structure an investor presentation outline with key metrics and narrative flow.",
      icon: Presentation,
      agent: "ppt",
      prompt:
        "Generate a structured 10-slide executive pitch deck outline for an enterprise AI agent platform.",
    },
  ];

  return (
    <div className="flex-1 py-4 space-y-6">
      {!selectedConversation || messages.length === 0 ? (
        <div className="py-8 sm:py-12 flex flex-col items-center justify-center text-center max-w-2xl mx-auto px-2">
          {/* Emblem */}
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.08] border border-white/[0.12] text-white shadow-inner">
            <span className="text-xl font-bold">C</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2">
            Cortex AI
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed mb-8">
            How can I help you today? Ask anything — code, search, document extraction, or choose a starter below.
          </p>

          {/* Starter Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
            {starterCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickPrompt(card.prompt, card.agent)}
                  className="group flex flex-col justify-between p-4 rounded-xl border border-white/[0.08] bg-[#111319] hover:bg-[#151821] hover:border-white/[0.18] transition-all duration-200 text-left shadow-sm hover:shadow-md active:scale-[0.99]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.06] text-white group-hover:bg-white group-hover:text-black transition">
                        <Icon size={14} />
                      </div>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 group-hover:text-slate-200">
                        {card.agent}
                      </span>
                    </div>

                    <h3 className="text-xs font-semibold text-white group-hover:text-white transition">
                      {card.title}
                    </h3>

                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center gap-1 text-[10px] font-medium text-slate-400 group-hover:text-white transition pt-2 border-t border-white/[0.04]">
                    <span>Dispatch to Agent</span>
                    <ArrowRight size={10} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {messages.map((msg, i) => (
            <MessageBubble
              key={i}
              role={msg?.role}
              content={msg?.content}
              images={msg?.images || []}
              agent={msg?.agent}
            />
          ))}

          {isLoading && <LoadingAnimation />}
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

export default MessageList;
