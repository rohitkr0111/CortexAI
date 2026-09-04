import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Crown,
  X,
  Check,
  Zap,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  CreditCard
} from "lucide-react";
import { useSelector } from "react-redux";
import { createOrder } from "../features/createOrder";
import { verifyPayment } from "../features/verifyPayment";

function BillingDrawer({ open, onClose }) {
  const { userData } = useSelector((state) => state.user);
  const [upgradingPlan, setUpgradingPlan] = useState(null);

  const handleUpgrade = async (plan) => {
    try {
      setUpgradingPlan(plan);
      const data = await createOrder(plan);
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data?.order?.amount,
        currency: data?.order?.currency,
        name: "Cortex AI",
        description: `${data?.plan?.name || plan} Workspace Upgrade`,
        order_id: data?.order?.id,
        handler: async (response) => {
          try {
            const result = await verifyPayment(response);
            console.log("Payment verified:", result);
            window.location.reload(); // Refresh to update user plan state
          } catch (error) {
            console.error("Payment verification failed:", error);
          }
        },
        theme: {
          color: "#18191d",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Order creation failed:", error);
    } finally {
      setUpgradingPlan(null);
    }
  };

  const userCredits = userData?.credits || 0;
  const totalCredits = userData?.totalCredits || 100;
  const creditPercent = Math.min(100, Math.round((userCredits / totalCredits) * 100));

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[110]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed right-0 top-0 z-[115] h-screen w-full max-w-[420px] bg-[#0d0f14] border-l border-white/[0.08] shadow-2xl flex flex-col justify-between"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/[0.08] bg-[#111319]">
              <div>
                <h2 className="text-base font-semibold text-white tracking-tight">
                  Workspace & Quota
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Manage agent compute and credits
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 [scrollbar-width:thin]">
              {/* Current Tier & Usage Card */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#12151e] p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      Active Tier
                    </span>
                    <h3 className="text-lg font-bold text-white capitalize">
                      {userData?.plan || "Free"} Plan
                    </h3>
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    <Crown size={18} />
                  </div>
                </div>

                {/* Quota Progress */}
                <div className="space-y-1.5 pt-2 border-t border-white/[0.06]">
                  <div className="flex justify-between text-xs font-mono text-slate-300">
                    <span>Available Compute</span>
                    <span>
                      {userCredits} / {totalCredits} Credits
                    </span>
                  </div>
                  <div className="h-2 w-full bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-200 rounded-full transition-all duration-300"
                      style={{ width: `${creditPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Plans Selection */}
              <div className="space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
                  Available Upgrades
                </div>

                {/* Starter Plan */}
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4.5 hover:border-white/[0.15] transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-white">Starter</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        For developers and active builders
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-white">₹199</div>
                      <div className="text-[10px] text-slate-400">one-time</div>
                    </div>
                  </div>

                  <ul className="mt-3.5 space-y-2 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <Check size={13} className="text-emerald-400 shrink-0" />
                      <span>500 High-Speed Agent Credits</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={13} className="text-emerald-400 shrink-0" />
                      <span>Full LangGraph Router Access</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={13} className="text-emerald-400 shrink-0" />
                      <span>Tavily Live Web Search</span>
                    </li>
                  </ul>

                  <button
                    type="button"
                    disabled={upgradingPlan === "starter"}
                    onClick={() => handleUpgrade("starter")}
                    className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-slate-200 transition shadow-sm"
                  >
                    {upgradingPlan === "starter" ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                    ) : (
                      <>
                        <span>Upgrade to Starter</span>
                        <ArrowRight size={13} />
                      </>
                    )}
                  </button>
                </div>

                {/* Pro Plan */}
                <div className="relative rounded-2xl border border-white/[0.15] bg-[#12151e] p-4.5 shadow-md">
                  <div className="absolute -top-2.5 right-4 rounded-full bg-white text-black px-2.5 py-0.5 text-[9.5px] font-mono font-bold tracking-wider uppercase shadow-sm">
                    Recommended
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-white">Pro Fleet</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        For enterprise engineering & deep research
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-white">₹499</div>
                      <div className="text-[10px] text-slate-400">one-time</div>
                    </div>
                  </div>

                  <ul className="mt-3.5 space-y-2 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <Check size={13} className="text-emerald-400 shrink-0" />
                      <span>1,000 High-Speed Agent Credits</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={13} className="text-emerald-400 shrink-0" />
                      <span>Priority LLM Execution & Low Latency</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={13} className="text-emerald-400 shrink-0" />
                      <span>Unlimited PDF Vector RAG Intelligence</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={13} className="text-emerald-400 shrink-0" />
                      <span>Multi-Modal Vision Transformers</span>
                    </li>
                  </ul>

                  <button
                    type="button"
                    disabled={upgradingPlan === "pro"}
                    onClick={() => handleUpgrade("pro")}
                    className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-slate-200 transition shadow-sm"
                  >
                    {upgradingPlan === "pro" ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                    ) : (
                      <>
                        <span>Upgrade to Pro</span>
                        <ArrowRight size={13} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/[0.08] bg-[#111319] flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <CreditCard size={13} />
                Secured by Razorpay
              </span>
              <span>Encrypted 256-bit</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default BillingDrawer;
