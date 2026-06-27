import { useState } from "react";
import {
  PanelLeft,
  Plus,
  Search,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { useChat } from "../../contexts/ChatContext";
import RecentChats from "./RecentChats";
import SidebarFooter from "./SidebarFooter";
import SearchChats from "./SearchChats";

export default function Sidebar() {
  const navigate = useNavigate();

  const {
    sidebarCollapsed,
    setSidebarCollapsed,
    createConversation,
    openConversation,
  } = useChat();

  const [search, setSearch] = useState("");

  const handleNewChat = () => {
    const id = createConversation("general");
    openConversation(id);
    navigate("/chat/general");
  };

  return (
    <motion.aside
      animate={{
    width: sidebarCollapsed ? 82 : 300,
}}
      transition={{
    type:"spring",
    stiffness:280,
    damping:28
}}
      className="
        fixed
        left-0
        top-0
        z-50
        flex
        h-screen
        flex-col
        border-r
        border-slate-200
        bg-white
      "
    >
      {/* Header */}

      <div className="border-b border-slate-200 p-4">

       <div
  className={`mb-5 flex items-center ${
    sidebarCollapsed
      ? "justify-center"
      : "justify-between"
  }`}
>

          <button
            onClick={() =>
              setSidebarCollapsed(!sidebarCollapsed)
            }
            className="
              rounded-xl
              p-2
              transition
              hover:bg-slate-100
            "
          >
            <PanelLeft size={20} />
          </button>

          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <img
                src="/assets/logo.png"
                className="h-9"
                alt="Athena"
              />
            </motion.div>
          )}

        </div>

        {/* New Chat */}

        <button
          onClick={handleNewChat}
className="
mt-4
flex
h-12
w-full
items-center
justify-center
gap-2
rounded-2xl
bg-gradient-to-r
from-blue-600
to-sky-500
text-[15px]
font-medium
text-white
transition-all
duration-200
hover:shadow-lg
hover:scale-[1.01]
active:scale-[0.98]
"
        >
          <Plus size={18} />

          {!sidebarCollapsed && (
            <span>New Chat</span>
          )}
        </button>

        {/* Search */}

        {!sidebarCollapsed && (
          <div className="relative mt-4">

            <Search
              size={17}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <SearchChats
              search={search}
              setSearch={setSearch}
            />

          </div>
        )}

      </div>

      {/* Recent Chats */}

      {/* Content */}

<div className="flex-1 overflow-y-auto">

    {sidebarCollapsed ? (

        <div className="mt-5 flex flex-col items-center gap-4">

            <button
                onClick={() => navigate("/home")}
                className="rounded-xl p-3 transition hover:bg-slate-100"
                title="Home"
            >
                🏠
            </button>

            <button
                onClick={handleNewChat}
                className="rounded-xl p-3 transition hover:bg-slate-100"
                title="New Chat"
            >
                💬
            </button>

        </div>

    ) : (

        <RecentChats
            search={search}
        />

    )}

</div>

     {/* Footer */}

{!sidebarCollapsed && (

    <SidebarFooter />

)}
    </motion.aside>
  );
}