import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Paperclip, SendHorizontal } from "lucide-react";

import PageContainer from "../components/layout/PageContainer";
import PageHeader from "../components/layout/PageHeader";
import ChatMessage from "../components/chat/ChatMessage";
import { useChat } from "../contexts/ChatContext";

export default function ChatPage() {
  const navigate = useNavigate();
  const { agentType } = useParams();

  const fileInputRef = useRef(null);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  const {
    user,
    currentConversation,
    currentConversationId,
    createConversation,
    openConversation,
    messages,
    sendMessage,
    attachments,
    addAttachment,
    clearAttachments,
    getDraft,
    setDraft,
    isLoading,
    isStreaming,
  } = useChat();

  const [prompt, setPrompt] = useState("");

  /* -------------------------------- */
  /* Create Conversation              */
  /* -------------------------------- */
  useEffect(() => {
    if (currentConversation) {
      setPrompt(getDraft(currentConversation.id));
      return;
    }

    const id = createConversation(agentType || "general");
    openConversation(id);
  }, []);

  /* -------------------------------- */
  /* Load Draft                       */
  /* -------------------------------- */
  useEffect(() => {
    if (!currentConversationId) return;
    setPrompt(getDraft(currentConversationId));
  }, [currentConversationId]);

  /* -------------------------------- */
  /* Save Draft                       */
  /* -------------------------------- */
  useEffect(() => {
    if (!currentConversationId) return;

    setDraft(currentConversationId, prompt);

}, [prompt, currentConversationId]);

  /* -------------------------------- */
  /* Scroll                           */
  /* -------------------------------- */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isLoading, isStreaming]);

  /* -------------------------------- */
  /* Files                            */
  /* -------------------------------- */
  function handleFiles(e) {
    [...e.target.files].forEach((file) => {
      addAttachment(file);
    });
  }

  /* -------------------------------- */
  /* Send                             */
  /* -------------------------------- */
  async function handleSend() {
    if (!currentConversationId) return;
    if (!prompt.trim() && attachments.length === 0) return;

    await sendMessage(currentConversationId, prompt, attachments);
    setPrompt("");
    clearAttachments();

    if (textareaRef.current) {
      textareaRef.current.style.height = "28px";
    }
  }

  /* -------------------------------- */
  /* Autosize                         */
  /* -------------------------------- */
  function handleInput(e) {
    setPrompt(e.target.value);
    e.target.style.height = "24px";
    e.target.style.height = e.target.scrollHeight + "px";
  }

  return (
    <PageContainer>
      <PageHeader title={`${agentType} Assistant`} subtitle="Athena Enterprise AI" />

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="flex-1 overflow-y-auto px-8 pt-6 pb-40"
      >
        <div
          className={`mx-auto flex w-full max-w-[760px] flex-col ${
            messages.length === 0 ? "h-full justify-center" : ""
          }`}
        >
          {messages.length === 0 && (
            <div className="flex flex-1 min-h-[calc(100vh-260px)] flex-col items-center justify-center">
              <img
                src="/assets/logo.png"
                alt="Athena"
                className="mb-8 h-20 w-20 opacity-90"
              />
              <h2 className="text-4xl font-semibold text-slate-900">
                Welcome to Athena
              </h2>
              <p className="mt-3 max-w-md text-center text-slate-500">
                How can I help you today?
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-3">
                {[
                  "Explain the process of leave",
                  "Why my salary deducted",
                  "Summarize document",
                  "What is company policies",
                ].map((item) => (
                  <button
                    key={item}
                    onClick={() => setPrompt(item)}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm transition hover:border-blue-300 hover:bg-blue-50 hover:shadow-md"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          <AnimatePresence>
            {messages.map((msg) => (
              <ChatMessage
    key={msg.id}
    message={msg.text}
    isUser={msg.role==="user"}
    onRetry={() => setPrompt(msg.text)}
/>
            ))}
          </AnimatePresence>

          {isLoading && (
            <div className="mt-8 flex items-center gap-3">
              <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600" />
              <div
                className="h-2 w-2 animate-bounce rounded-full bg-blue-500"
                style={{ animationDelay: ".15s" }}
              />
              <div
                className="h-2 w-2 animate-bounce rounded-full bg-blue-400"
                style={{ animationDelay: ".3s" }}
              />
              <p className="text-sm text-slate-500">Athena is thinking...</p>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </motion.section>

      {/* ---------------------------------- */}
      {/* COMPOSER                           */}
      {/* ---------------------------------- */}
      <motion.footer
  layout
  className={`

px-6

transition-all

duration-500

${
messages.length===0
?
"pb-24"
:
"pb-6 pt-3"
}

`}
>
        <div className="mx-auto w-full max-w-[860px]">
          {/* Attachments */}
          {attachments.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm text-blue-700"
                >
                  <Paperclip size={14} />
                  <span className="max-w-[180px] truncate">{file.name}</span>
                </div>
              ))}
            </div>
          )}

          {/* Composer Box */}
          <div className="flex items-center gap-2 rounded-[30px] border border-slate-300 bg-white px-3 py-2 shadow-md transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              hidden
              multiple
              onChange={handleFiles}
            />

            {/* Attach Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-blue-600"
            >
              <Paperclip size={17} />
            </button>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              rows={1}
              value={prompt}
              onChange={handleInput}
              placeholder="Message Athena..."
              className="max-h-36 flex-1 resize-none bg-transparent py-2 text-[15px] leading-6 text-slate-800 outline-none placeholder:text-slate-400 overflow-y-auto"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />

            {/* Send Button */}
            <button
              disabled={!prompt.trim() && attachments.length === 0}
              onClick={handleSend}
              className="flex h-10 w-10 items-center justify-center rounded-fullbg-gradient-to-br from-blue-600 to-sky-500 text-white transition-all duration-200 hover:scale-105 hover:bg-blue-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <SendHorizontal size={17} />
            </button>
          </div>

          <p className="mt-3 text-center text-xs text-slate-400">
            Athena can make mistakes. Verify important information.
          </p>
        </div>
      </motion.footer>
    </PageContainer>
  );
}