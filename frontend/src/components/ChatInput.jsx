import React, { useEffect, useRef, useState } from "react";
import {
  Code2,
  FileText,
  Globe,
  ImageIcon,
  MessageSquare,
  Mic,
  MicOff,
  Paperclip,
  Presentation,
  ArrowUp,
  X,
  Zap,
  Sparkles,
  CornerDownLeft
} from "lucide-react";
import sendMessage from "../features/sendMessage";
import { useDispatch, useSelector } from "react-redux";
import {
  addMessage,
  setArtifacts,
  setIsLoading,
  setMessages,
} from "../redux/messageSlice";
import { createConversation } from "../features/createConversation";
import {
  addConversation,
  setConvTitle,
  setSelectedConversation,
} from "../redux/conversationSlice";
import { updateConversation } from "../features/updateConversation";

function ChatInput() {
  const [value, setValue] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("Auto");
  const [selectedFile, setSelectedFile] = useState(null);
  const [listening, setListening] = useState(false);

  const { selectedConversation } = useSelector(
    (state) => state.conversation
  );

  const { isLoading } = useSelector((state) => state.message);

  const recognitionRef = useRef(null);
  const fileRef = useRef(null);
  const textareaRef = useRef(null);

  const dispatch = useDispatch();

  /*
   * ----------------------------------------------------
   * Speech Recognition Setup
   * ----------------------------------------------------
   */
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event) => {
      let transcript = "";
      for (
        let index = event.resultIndex;
        index < event.results.length;
        index++
      ) {
        transcript += event.results[index][0].transcript;
      }

      setValue((prev) =>
        prev ? `${prev} ${transcript}` : transcript
      );
    };

    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch (e) {}
    };
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  /*
   * ----------------------------------------------------
   * Auto resize textarea
   * ----------------------------------------------------
   */
  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    const maxHeight = 160;
    textareaRef.current.style.height = `${Math.min(
      textareaRef.current.scrollHeight,
      maxHeight
    )}px`;
  }, [value]);

  /*
   * ----------------------------------------------------
   * Send Message
   * ----------------------------------------------------
   */
  const handleSendMessage = async () => {
    const prompt = value.trim();
    if (!prompt || isLoading) return;

    dispatch(setIsLoading(true));

    try {
      let conversation = selectedConversation;

      // Create conversation if none selected
      if (!conversation) {
        dispatch(setMessages([]));
        const conv = await createConversation();
        dispatch(setSelectedConversation(conv));
        dispatch(addConversation(conv));
        conversation = conv;
      }

      // Rename conversation if default title
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
      formData.append("agent", selectedAgent.toLowerCase());

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      // Optimistic message
      dispatch(
        addMessage({
          role: "user",
          content: prompt,
        })
      );

      setValue("");

      // Backend call
      const data = await sendMessage(formData);

      dispatch(setArtifacts(data?.artifacts || []));

      dispatch(
        addMessage({
          role: "assistant",
          content:
            data?.answer ||
            "Unable to synthesize response. Please verify backend service logs.",
          images: data?.images,
          agent: selectedAgent,
        })
      );

      setSelectedFile(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
      dispatch(
        addMessage({
          role: "assistant",
          content:
            "Request failed. Ensure backend services (Gateway, Agent, Redis) are running.",
        })
      );
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isLoading) {
        handleSendMessage();
      }
    }
  };

  const agents = [
    { id: "auto", icon: Zap, label: "Auto", desc: "LangGraph Router" },
    { id: "coding", icon: Code2, label: "Coding", desc: "Monaco Sandbox" },
    { id: "search", icon: Globe, label: "Search", desc: "Tavily Live Web" },
    { id: "pdf", icon: FileText, label: "PDF", desc: "Vector RAG" },
    { id: "ppt", icon: Presentation, label: "PPT", desc: "Slide Architect" },
    { id: "vision", icon: ImageIcon, label: "Vision", desc: "Multimodal OCR" },
    { id: "chat", icon: MessageSquare, label: "Chat", desc: "Direct Dialogue" },
  ];

  const removeFile = () => {
    setSelectedFile(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isImage = selectedFile?.type?.startsWith("image/");

  return (
    <div className="w-full px-3 sm:px-6 pb-4 sm:pb-6">
      <div className="max-w-4xl mx-auto">
        {/* Command Dock Container */}
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.12] bg-[#111319] shadow-2xl backdrop-blur-2xl transition-all focus-within:border-white/25">
          {/* Top Hairline Sheen */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

          {/* Agent Selector Ribbon */}
          <div className="px-3.5 pt-3 pb-1 border-b border-white/[0.05] flex items-center justify-between gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex items-center gap-1.5 shrink-0">
              {agents.map((agent) => {
                const Icon = agent.icon;
                const isActive = selectedAgent.toLowerCase() === agent.label.toLowerCase();

                return (
                  <button
                    key={agent.id}
                    type="button"
                    onClick={() => setSelectedAgent(agent.label)}
                    disabled={isLoading}
                    title={agent.desc}
                    className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                      isActive
                        ? "bg-white text-black font-semibold shadow-sm"
                        : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    <Icon size={12} className={isActive ? "text-black" : "text-slate-400 group-hover:text-white"} />
                    <span>{agent.label}</span>
                  </button>
                );
              })}
            </div>

            <span className="hidden sm:inline font-mono text-[10px] text-slate-400">
              Routing: {selectedAgent}
            </span>
          </div>

          {/* Attachment Preview Chip */}
          {selectedFile && (
            <div className="px-4 pt-3">
              <div className="inline-flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-1.5">
                {isImage ? (
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt={selectedFile.name}
                    className="h-7 w-7 rounded-lg object-cover ring-1 ring-white/20"
                  />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.08] text-white">
                    <FileText size={14} />
                  </div>
                )}
                <div className="min-w-0 max-w-[180px]">
                  <p className="truncate text-xs font-medium text-white">
                    {selectedFile.name}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="flex h-5 w-5 items-center justify-center rounded-md text-slate-400 hover:bg-white/[0.08] hover:text-white transition"
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          )}

          {/* Textarea */}
          <div className="px-4 pt-2.5 pb-1">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              rows={1}
              placeholder={
                listening
                  ? "Listening to speech... (speak clearly)"
                  : "Instruct Cortex AI (e.g. 'Build a real-time dashboard', 'Search recent AI papers')..."
              }
              className="block w-full max-h-[160px] min-h-[46px] resize-none overflow-y-auto bg-transparent py-2 text-[13.5px] leading-relaxed text-white outline-none placeholder:text-slate-400 disabled:opacity-50"
            />
          </div>

          {/* Bottom Toolbar */}
          <div className="flex items-center justify-between px-3.5 pb-3 pt-1">
            {/* Left Controls */}
            <div className="flex items-center gap-1">
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setSelectedFile(file);
                }}
              />

              {/* Attach File */}
              <button
                type="button"
                disabled={isLoading}
                onClick={() => fileRef.current?.click()}
                title="Attach PDF or Image"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/[0.06] hover:text-white transition"
              >
                <Paperclip size={15} />
              </button>

              {/* Speech Input */}
              <button
                type="button"
                onClick={toggleMic}
                disabled={isLoading}
                title={listening ? "Stop recording" : "Voice input"}
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                  listening
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                {listening ? <Mic size={15} className="animate-pulse" /> : <MicOff size={15} />}
              </button>

              <span className="hidden sm:inline font-mono text-[10px] text-slate-400 ml-2">
                Shift + Enter for new line
              </span>
            </div>

            {/* Right: Send Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={!value.trim() || isLoading}
                onClick={handleSendMessage}
                title="Send message (Enter)"
                className={`flex h-8 w-8 items-center justify-center rounded-xl transition duration-150 ${
                  value.trim() && !isLoading
                    ? "bg-white text-black hover:bg-slate-200 active:scale-95 shadow-sm"
                    : "bg-white/[0.04] text-slate-400 cursor-not-allowed"
                }`}
              >
                {isLoading ? (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                ) : (
                  <ArrowUp size={15} strokeWidth={2.5} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Sub-bar disclaimer */}
        <div className="mt-2 flex items-center justify-center gap-2 text-[10px] text-slate-400">
          <span>Cortex Multi-Agent Engine</span>
          <span>•</span>
          <span>Orchestrated with LangGraph & Redis</span>
        </div>
      </div>
    </div>
  );
}

export default ChatInput;
