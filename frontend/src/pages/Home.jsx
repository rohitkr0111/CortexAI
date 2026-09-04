import { signInWithPopup } from "firebase/auth";
import React, { useState } from "react";
import { auth, googleProvider } from "../../utils/firebase";
import api from "../../utils/axios";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { setUserdata } from "../redux/userSlice";
import {
  MessageSquare,
  Code2,
  Globe,
  ShieldCheck
} from "lucide-react";

import SideBar from "../components/SideBar";
import ChatArea from "../components/ChatArea";
import Artifact from "../components/Artifact";

function Home() {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState("");

  /*
   * --------------------------------------------------
   * Backend Login
   * --------------------------------------------------
   */
  const handleLogin = async (token) => {
    try {
      const { data } = await api.post(
        "/api/auth/login",
        { token }
      );

      dispatch(setUserdata(data));
      return true;
    } catch (error) {
      console.error("Backend login failed:", error);
      setLoginError(
        "Unable to connect to Cortex AI. Please try again."
      );
      return false;
    }
  };

  /*
   * --------------------------------------------------
   * Google Login
   * --------------------------------------------------
   */
  const googleLogin = async () => {
    if (isLoggingIn) return;

    setIsLoggingIn(true);
    setLoginError("");

    try {
      const result = await signInWithPopup(
        auth,
        googleProvider
      );

      const token = await result.user.getIdToken();
      await handleLogin(token);
    } catch (error) {
      console.error("Google login failed:", error);
      if (error?.code === "auth/popup-closed-by-user") {
        setLoginError("");
      } else {
        setLoginError("Google sign-in failed. Please try again.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div
      className="
        relative
        flex
        h-screen
        w-full
        overflow-hidden
        bg-[#090a0d]
        text-[#F4F5F7]
        font-sans
      "
    >
      {/* ==============================================
          REFINED ARCHITECTURAL BACKGROUND (NO NEON)
      =============================================== */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Subtle central vignette */}
        <div
          className="
            absolute
            left-1/2
            top-[-180px]
            h-[500px]
            w-[750px]
            -translate-x-1/2
            rounded-full
            bg-white/[0.025]
            blur-[160px]
          "
        />

        {/* Fine Architectural Grid */}
        <div
          className="
            absolute
            inset-0
            opacity-[0.035]
            [background-image:linear-gradient(rgba(255,255,255,.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.35)_1px,transparent_1px)]
            [background-size:48px_48px]
          "
        />

        {/* Soft Radial Vignette */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-[#090a0d]
            via-transparent
            to-[#090a0d]/40
          "
        />
      </div>

      {/* ==============================================
          MAIN APPLICATION
      =============================================== */}
      <div className="relative z-10 flex h-full w-full">
        {/* Sidebar */}
        <SideBar />

        {/* Chat Area */}
        <ChatArea />

        {/* Monaco Artifact Sandbox Panel */}
        <Artifact />
      </div>

      {/* ==============================================
          LOGIN OVERLAY (Zero Neon / High-End)
      =============================================== */}
      {!userData && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            overflow-hidden
            bg-black/75
            px-4
            backdrop-blur-2xl
          "
        >
          {/* Card */}
          <div
            className="
              relative
              w-full
              max-w-[420px]
              overflow-hidden
              rounded-3xl
              border
              border-white/[0.12]
              bg-[#0e1017]/95
              p-8
              shadow-[0_40px_120px_rgba(0,0,0,0.85)]
              backdrop-blur-3xl
            "
          >
            {/* Top Hairline Sheen */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* BRAND HEADER */}
            <div className="relative flex flex-col items-center text-center">
              {/* Logo */}
              <div
                className="
                  mb-5
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-white/[0.15]
                  bg-gradient-to-b
                  from-white/[0.08]
                  to-white/[0.02]
                  shadow-inner
                "
              >
                <div
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-xl
                    bg-white
                    text-black
                    text-[14px]
                    font-black
                    tracking-tight
                    shadow-md
                  "
                >
                  C
                </div>
              </div>

              <h1
                className="
                  text-[26px]
                  font-bold
                  tracking-[-0.03em]
                  text-white
                "
              >
                Welcome to Cortex AI
              </h1>

              <p
                className="
                  mt-2
                  max-w-[320px]
                  text-[13px]
                  leading-relaxed
                  text-slate-400
                "
              >
                Your intelligent workspace for conversations, code execution, and document analysis.
              </p>
            </div>

            {/* FEATURES GRID */}
            <div className="relative mt-6 grid grid-cols-3 gap-2">
              <SpecBadge
                icon={<MessageSquare size={14} className="text-slate-300" />}
                title="AI Chat"
                desc="Dialogue"
              />
              <SpecBadge
                icon={<Code2 size={14} className="text-slate-300" />}
                title="Coding"
                desc="Sandbox"
              />
              <SpecBadge
                icon={<Globe size={14} className="text-slate-300" />}
                title="Search"
                desc="Live Web"
              />
            </div>

            {/* DIVIDER */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/[0.08]" />
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">
                Continue to Workspace
              </span>
              <div className="h-px flex-1 bg-white/[0.08]" />
            </div>

            {/* GOOGLE AUTH BUTTON */}
            <button
              type="button"
              disabled={isLoggingIn}
              onClick={googleLogin}
              className="
                group
                relative
                flex
                w-full
                items-center
                justify-center
                gap-3
                rounded-xl
                border
                border-white/[0.2]
                bg-white
                py-3.5
                text-[13.5px]
                font-semibold
                text-[#090a0d]
                shadow-[0_8px_30px_rgba(255,255,255,0.06)]
                transition-all
                duration-200
                hover:bg-[#f1f3f5]
                hover:shadow-[0_12px_35px_rgba(255,255,255,0.12)]
                active:scale-[0.99]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {isLoggingIn ? (
                <>
                  <span
                    className="
                      h-4
                      w-4
                      animate-spin
                      rounded-full
                      border-2
                      border-black/20
                      border-t-black
                    "
                  />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <FcGoogle size={19} />
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            {/* ERROR */}
            {loginError && (
              <div
                className="
                  mt-4
                  rounded-xl
                  border
                  border-red-500/20
                  bg-red-500/[0.08]
                  px-3.5
                  py-2.5
                  text-center
                  text-[12px]
                  text-red-300
                "
              >
                {loginError}
              </div>
            )}

            {/* FOOTER */}
            <p className="mt-6 text-center text-[11px] text-slate-500">
              By continuing, you agree to use Cortex AI responsibly and securely.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/*
 * ----------------------------------------------------
 * Small Feature Badge
 * ----------------------------------------------------
 */
function SpecBadge({ icon, title, desc }) {
  return (
    <div
      className="
        flex
        flex-col
        items-center
        gap-1
        rounded-xl
        border
        border-white/[0.07]
        bg-white/[0.02]
        p-2.5
        text-center
      "
    >
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.05]">
        {icon}
      </div>
      <span className="text-[11px] font-semibold text-slate-200">
        {title}
      </span>
      <span className="text-[9.5px] text-slate-500">
        {desc}
      </span>
    </div>
  );
}

export default Home;