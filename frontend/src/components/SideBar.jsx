import React, { useEffect, useState, useMemo } from "react";
import {
  Coins,
  LogOut,
  Menu,
  MessageSquare,
  PanelLeftClose,
  PanelRightOpen,
  PenSquare,
  Plus,
  Sparkles,
  User,
  X,
  ChevronRight,
  Search,
  Cpu,
  Shield,
  Activity
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import {
  addConversation,
  setConversations,
  setSelectedConversation,
} from "../redux/conversationSlice";

import { getConversations } from "../features/getConversations";
import { createConversation } from "../features/createConversation";
import logOut from "../features/logOut";
import { setUserdata } from "../redux/userSlice";
import BillingDrawer from "./BillingDrawer";

function SideBar() {
  const [collapsed, setCollapsed] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showBilling, setShowBilling] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const dispatch = useDispatch();

  const { conversations, selectedConversation } = useSelector(
    (state) => state.conversation
  );

  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const getConv = async () => {
      const data = await getConversations();
      dispatch(setConversations(data));
    };

    getConv();
  }, [userData?._id, dispatch]);

  const handleCreateConversation = async () => {
    try {
      const data = await createConversation();

      if (data) {
        dispatch(addConversation(data));
        dispatch(setSelectedConversation(data));
      }
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  const handleSelectConversation = (conversation) => {
    dispatch(setSelectedConversation(conversation));
    setMobileOpen(false);
  };

  const handleNewChat = () => {
    dispatch(setSelectedConversation(null));
    setMobileOpen(false);
  };

  const avatar = userData?.avatar && !imageError;

  // Filter conversations based on search
  const filteredConversations = useMemo(() => {
    if (!conversations) return [];
    if (!searchQuery.trim()) return conversations;
    const q = searchQuery.toLowerCase();
    return conversations.filter((c) =>
      (c?.title || "New Chat").toLowerCase().includes(q)
    );
  }, [conversations, searchQuery]);

  // Group conversations by date if available, or flat list
  const groupedConversations = useMemo(() => {
    const today = [];
    const previous = [];

    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;

    filteredConversations.forEach((conv) => {
      if (conv?.createdAt) {
        const convDate = new Date(conv.createdAt);
        if (now - convDate < oneDay) {
          today.push(conv);
        } else {
          previous.push(conv);
        }
      } else {
        today.push(conv);
      }
    });

    return { today, previous };
  }, [filteredConversations]);

  /* =========================
     COLLAPSED SIDEBAR
  ========================== */
  if (collapsed) {
    return (
      <aside className="hidden lg:flex w-[68px] h-screen shrink-0 flex-col items-center bg-[#0d0f14] border-r border-white/[0.08] z-30 justify-between py-4">
        <div className="flex flex-col items-center w-full gap-4">
          {/* Logo */}
          <div className="relative group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06] border border-white/[0.1] text-white">
              <span className="font-bold text-sm">C</span>
            </div>
          </div>

          {/* Expand */}
          <button
            onClick={() => setCollapsed(false)}
            title="Expand sidebar"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition"
          >
            <PanelRightOpen size={16} />
          </button>

          {/* New Chat */}
          <button
            onClick={handleNewChat}
            title="New session"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-black hover:bg-slate-200 transition shadow-sm"
          >
            <Plus size={16} />
          </button>

          {/* Conversations icons */}
          <div className="w-full flex flex-col items-center gap-1.5 overflow-y-auto max-h-[48vh] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-2 pt-2 border-t border-white/[0.06]">
            {filteredConversations.slice(0, 10).map((conv) => {
              const isActive = selectedConversation?._id === conv?._id;
              return (
                <button
                  key={conv?._id}
                  onClick={() => handleSelectConversation(conv)}
                  title={conv?.title || "Session"}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs transition ${
                    isActive
                      ? "bg-white/[0.12] text-white border border-white/20"
                      : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <MessageSquare size={14} />
                </button>
              );
            })}
          </div>
        </div>

        {/* User profile collapsed */}
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => setShowBilling(true)}
            title="Billing & Credits"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] transition overflow-hidden"
          >
            {avatar ? (
              <img
                src={userData.avatar}
                alt="User"
                className="h-full w-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <User size={15} />
            )}
          </button>
        </div>
      </aside>
    );
  }

  /* =========================
     EXPANDED SIDEBAR
  ========================== */
  return (
    <>
      {/* Mobile hamburger button */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-[60] flex h-9 w-9 items-center justify-center rounded-xl bg-[#0d0f14]/90 border border-white/[0.1] text-slate-300 backdrop-blur-xl shadow-lg"
      >
        <Menu size={16} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
        />
      )}

      {/* Main Sidebar Element */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-[275px] h-screen shrink-0 bg-[#0d0f14] border-r border-white/[0.08] transition-transform duration-200 ease-out flex flex-col justify-between ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Top Brand Header */}
          <div className="h-14 px-4 flex items-center justify-between border-b border-white/[0.08] shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-black font-bold text-xs shadow-sm">
                C
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold tracking-tight text-white">
                    Cortex AI
                  </span>
                  <span className="rounded bg-white/[0.06] border border-white/[0.08] px-1.5 py-0.2 text-[9px] font-mono text-slate-300">
                    v2.4
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span>Fleet Operational</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCollapsed(true)}
                title="Collapse sidebar"
                className="hidden lg:flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition"
              >
                <PanelLeftClose size={15} />
              </button>

              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="lg:hidden flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:text-white"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* New Chat & Search Input */}
          <div className="p-3 space-y-2 shrink-0">
            <button
              type="button"
              onClick={handleCreateConversation}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white text-black hover:bg-slate-200 transition font-medium text-xs shadow-sm"
            >
              <div className="flex items-center gap-2">
                <Plus size={15} />
                <span>New Session</span>
              </div>
              <span className="font-mono text-[10px] text-slate-600 bg-black/10 px-1.5 py-0.5 rounded">
                ⌘N
              </span>
            </button>

            {/* Real-time search filter */}
            <div className="relative">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter sessions..."
                className="w-full rounded-lg bg-white/[0.03] border border-white/[0.07] pl-8 pr-7 py-1.5 text-xs text-slate-200 placeholder:text-slate-400 outline-none focus:border-white/20 transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Sessions List */}
          <div className="flex-1 overflow-y-auto px-2 space-y-4 pt-1 [scrollbar-width:thin]">
            {filteredConversations.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                {searchQuery ? "No matching sessions" : "No sessions yet. Start a new one!"}
              </div>
            ) : (
              <div>
                <div className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  {searchQuery ? "Search Results" : "Recent Sessions"}
                </div>
                <div className="space-y-0.5">
                  {filteredConversations.map((conv) => {
                    const isActive = selectedConversation?._id === conv?._id;
                    return (
                      <button
                        key={conv?._id}
                        type="button"
                        onClick={() => handleSelectConversation(conv)}
                        className={`w-full group flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition ${
                          isActive
                            ? "bg-white/[0.08] text-white border border-white/[0.12]"
                            : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <MessageSquare
                            size={13}
                            className={isActive ? "text-white shrink-0" : "text-slate-400 shrink-0"}
                          />
                          <span className="text-xs truncate">
                            {conv?.title || "New Session"}
                          </span>
                        </div>
                        <ChevronRight
                          size={12}
                          className={`shrink-0 transition ${
                            isActive ? "opacity-100 text-white" : "opacity-0 group-hover:opacity-60"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Bottom User Profile Area */}
          <div className="p-3 border-t border-white/[0.08] bg-[#0c0e13] shrink-0 space-y-2.5">
            {/* User Profile Card */}
            {userData ? (
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-2.5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.08] overflow-hidden border border-white/[0.1] shrink-0">
                      {avatar ? (
                        <img
                          src={userData.avatar}
                          alt="User"
                          className="h-full w-full object-cover"
                          onError={() => setImageError(true)}
                        />
                      ) : (
                        <User size={14} className="text-slate-300" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white truncate">
                        {userData?.name || "AI Researcher"}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {userData?.plan || "Free"} Workspace
                      </div>
                    </div>
                  </div>

                  <span className="rounded bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 text-[9px] font-mono font-semibold text-amber-400 uppercase">
                    {userData?.plan || "Free"}
                  </span>
                </div>

                {/* Credit usage bar */}
                <div className="space-y-1 mb-2">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>Credits</span>
                    <span>
                      {userData.credits || 0} / {userData.totalCredits || 100}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-300 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          100,
                          ((userData?.credits || 0) / (userData?.totalCredits || 100)) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center gap-1.5 pt-1 border-t border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => setShowBilling(true)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1 text-[11px] font-medium text-slate-300 hover:text-white hover:bg-white/[0.04] rounded transition"
                  >
                    <Coins size={12} />
                    <span>Billing</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      logOut();
                      dispatch(setUserdata(null));
                    }}
                    title="Sign Out"
                    className="flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition"
                  >
                    <LogOut size={12} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-1 text-xs text-slate-400">
                Not authenticated
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Razorpay Billing Drawer */}
      <BillingDrawer
        open={showBilling}
        onClose={() => setShowBilling(false)}
      />
    </>
  );
}

export default SideBar;
