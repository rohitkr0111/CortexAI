import React, { useEffect } from "react";
import Nav from "./Nav";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import { useDispatch, useSelector } from "react-redux";
import getMessages from "../features/getMessages";
import {
  setArtifacts,
  setMessages,
} from "../redux/messageSlice";

function ChatArea() {
  const { selectedConversation } = useSelector(
    (state) => state.conversation
  );

  const dispatch = useDispatch();

  useEffect(() => {
    const getMesg = async () => {
      if (!selectedConversation) return;

      if (selectedConversation.title === "New Chat" || selectedConversation.title === "New Conversation") {
        dispatch(setMessages([]));
        dispatch(setArtifacts([]));
        return;
      }

      try {
        const data = await getMessages(
          selectedConversation?._id
        );

        dispatch(setMessages(data || []));

        const latestArtifactMessage = [...(data || [])]
          .reverse()
          .find(
            (msg) =>
              msg.artifacts &&
              msg.artifacts.length > 0
          );

        dispatch(
          setArtifacts(
            latestArtifactMessage?.artifacts || []
          )
        );
      } catch (error) {
        console.error(
          "Failed to load messages:",
          error
        );

        dispatch(setMessages([]));
        dispatch(setArtifacts([]));
      }
    };

    getMesg();
  }, [selectedConversation?._id, dispatch]);

  return (
    <main
      className="
        flex
        h-screen
        min-h-0
        flex-1
        flex-col
        overflow-hidden
        bg-[#090a0d]
        text-[#F4F5F7]
      "
    >
      {/* NAVBAR */}
      <header
        className="
          z-20
          shrink-0
        "
      >
        <Nav />
      </header>

      {/* CHAT HISTORY */}
      <section
        className="
          relative
          min-h-0
          flex-1
          overflow-y-auto
          overscroll-contain
          scroll-smooth
        "
      >
        <div
          className="
            mx-auto
            min-h-full
            w-full
            max-w-4xl
            px-3
            pb-8
            pt-4
            sm:px-6
            lg:px-8
          "
        >
          <MessageList />
        </div>
      </section>

      {/* INPUT */}
      <footer
        className="
          z-20
          shrink-0
          bg-gradient-to-t
          from-[#090a0d]
          via-[#090a0d]/90
          to-transparent
          pt-2
        "
      >
        <ChatInput />
      </footer>
    </main>
  );
}

export default ChatArea;


