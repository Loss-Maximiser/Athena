import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const ChatContext = createContext(null);

const STORAGE_KEY = "athena_workspace_v2";

/* ------------------------------------------ */
/* Helpers */
/* ------------------------------------------ */

const uid = () =>
  crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2, 12);

const now = () => Date.now();

const readStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/* ------------------------------------------ */
/* Provider */
/* ------------------------------------------ */

export function ChatProvider({ children }) {
  const stored = readStorage();

  /* ------------------------------------------ */
  /* User */
  /* ------------------------------------------ */

  const [user, setUser] = useState(() => ({
    name: stored?.user?.name ?? "Guest",
    email: stored?.user?.email ?? "",
    avatar: stored?.user?.avatar ?? "",
}));

  /* ------------------------------------------ */
  /* Conversations */
  /* ------------------------------------------ */

  const [conversations, setConversations] = useState(
    stored?.conversations || []
  );

  /* ------------------------------------------ */
  /* Current Conversation */
  /* ------------------------------------------ */

  const [currentConversationId, setCurrentConversationId] =
    useState(stored?.currentConversationId || null);

  /* ------------------------------------------ */
  /* Drafts */
  /* ------------------------------------------ */

  const [drafts, setDrafts] = useState(
    stored?.drafts || {}
  );

  /* ------------------------------------------ */
  /* Attachments */
  /* ------------------------------------------ */

  const [attachments, setAttachments] =
    useState([]);

  /* ------------------------------------------ */
  /* Loading */
  /* ------------------------------------------ */

  const [isLoading, setIsLoading] =
    useState(false);

  const [isStreaming, setIsStreaming] =
    useState(false);

  /* ------------------------------------------ */
  /* Sidebar */
  /* ------------------------------------------ */

  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  /* ------------------------------------------ */
  /* Persist */
  /* ------------------------------------------ */

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        user,
        conversations,
        currentConversationId,
        drafts,
      })
    );
  }, [
    user,
    conversations,
    currentConversationId,
    drafts,
  ]);

  /* ------------------------------------------ */
  /* Current Conversation */
  /* ------------------------------------------ */

  const currentConversation = useMemo(() => {
    return (
      conversations.find(
        (c) => c.id === currentConversationId
      ) || null
    );
  }, [
    conversations,
    currentConversationId,
  ]);

  const messages =
    currentConversation?.messages || [];

  /* ------------------------------------------ */
  /* Update Conversation */
  /* ------------------------------------------ */

  const updateConversation = (
    conversationId,
    updater
  ) => {
    setConversations((prev) =>
      prev.map((conversation) => {
        if (
          conversation.id !== conversationId
        )
          return conversation;

        return {
          ...updater(conversation),
          updatedAt: now(),
        };
      })
    );
  };

    /* ------------------------------------------ */
  /* Conversation CRUD */
  /* ------------------------------------------ */

  const createConversation = (agent = "general") => {
    const conversation = {
      id: uid(),
      title: "New Chat",
      agent,
      pinned: false,
      createdAt: now(),
      updatedAt: now(),
      messages: [],
    };

    setConversations((prev) => [
      conversation,
      ...prev,
    ]);

    setCurrentConversationId(conversation.id);

    return conversation.id;
  };

  const openConversation = (id) => {
    setCurrentConversationId(id);
  };

  const renameConversation = (id, title) => {
    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === id
          ? {
              ...conversation,
              title,
            }
          : conversation
      )
    );
  };

  const deleteConversation = (id) => {
    setConversations((prev) =>
      prev.filter((conversation) => conversation.id !== id)
    );

    if (currentConversationId === id) {
      setCurrentConversationId(null);
    }
  };

  const togglePinConversation = (id) => {
    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === id
          ? {
              ...conversation,
              pinned: !conversation.pinned,
            }
          : conversation
      )
    );
  };

  /* ------------------------------------------ */
  /* Drafts */
  /* ------------------------------------------ */

  const setDraft = (conversationId, value) => {
    setDrafts((prev) => ({
      ...prev,
      [conversationId]: value,
    }));
  };

  const getDraft = (conversationId) => {
    return drafts[conversationId] || "";
  };

  /* ------------------------------------------ */
  /* Attachments */
  /* ------------------------------------------ */

  const addAttachment = (file) => {
    setAttachments((prev) => [...prev, file]);
  };

  const removeAttachment = (index) => {
    setAttachments((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const clearAttachments = () => {
    setAttachments([]);
  };

  /* ------------------------------------------ */
  /* Assistant Reply */
  /* ------------------------------------------ */

  const fakeAssistantReply = async (
    conversationId,
    prompt
  ) => {

    setIsLoading(true);

    await new Promise((resolve) =>
      setTimeout(resolve, 900)
    );

    const assistantMessage = {
      id: uid(),
      role: "assistant",
      text: `I understand your request regarding "${prompt}".

This is currently a frontend prototype of Athena. Once the backend is connected, I'll provide intelligent responses based on your enterprise data.`,
      createdAt: now(),
    };

    updateConversation(
      conversationId,
      (conversation) => ({
        ...conversation,
        messages: [
          ...conversation.messages,
          assistantMessage,
        ],
      })
    );

    setIsLoading(false);
  };

  /* ------------------------------------------ */
  /* Streaming */
  /* ------------------------------------------ */

  const streamResponse = async (
    conversationId,
    prompt
  ) => {

    setIsStreaming(true);

    await fakeAssistantReply(
      conversationId,
      prompt
    );

    setIsStreaming(false);
  };

  /* ------------------------------------------ */
  /* Send Message */
  /* ------------------------------------------ */

  const sendMessage = async (
    conversationId,
    text,
    files = []
  ) => {

    const clean = text.trim();

    if (!clean && files.length === 0)
      return;

    const userMessage = {
      id: uid(),
      role: "user",
      text: clean,
      attachments: files,
      createdAt: now(),
    };

    updateConversation(
      conversationId,
      (conversation) => ({
        ...conversation,
        title:
          conversation.title === "New Chat"
            ? clean.slice(0, 40)
            : conversation.title,

        messages: [
          ...conversation.messages,
          userMessage,
        ],
      })
    );

    clearAttachments();

    await streamResponse(
      conversationId,
      clean
    );
  };

  /* ------------------------------------------ */
  /* Recent Chats */
  /* ------------------------------------------ */

  const recentChats = useMemo(() => {

    return [...conversations].sort(
      (a, b) => b.updatedAt - a.updatedAt
    );

  }, [conversations]);

  /* ------------------------------------------ */
  /* Search */
  /* ------------------------------------------ */

  const searchChats = (query) => {

    if (!query.trim())
      return recentChats;

    const q = query.toLowerCase();

    return recentChats.filter((conversation) => {

      if (
        conversation.title
          .toLowerCase()
          .includes(q)
      ) {
        return true;
      }

      return conversation.messages.some((message) =>
        message.text
          .toLowerCase()
          .includes(q)
      );

    });

  };

    /* ------------------------------------------ */
  /* Context Value */
  /* ------------------------------------------ */

  const value = {

    /* User */
    user,
    setUser,

    /* Conversations */
    conversations,
    setConversations,

    currentConversation,
    currentConversationId,

    createConversation,
    openConversation,
    renameConversation,
    deleteConversation,
    togglePinConversation,

    updateConversation,

    /* Messages */
    messages,
    sendMessage,

    /* Drafts */
    drafts,
    setDraft,
    getDraft,

    /* Search */
    recentChats,
    searchChats,

    /* Attachments */
    attachments,
    addAttachment,
    removeAttachment,
    clearAttachments,

    /* Loading */
    isLoading,
    isStreaming,
    setIsLoading,
    setIsStreaming,

    /* Sidebar */
    sidebarCollapsed,
    setSidebarCollapsed,

  };

  return (

    <ChatContext.Provider value={value}>

      {children}

    </ChatContext.Provider>

  );

}

/* ------------------------------------------ */
/* Hook */
/* ------------------------------------------ */

export function useChat() {

  const context = useContext(ChatContext);

  if (!context) {

    throw new Error(
      "useChat must be used inside ChatProvider"
    );

  }

  return context;

}