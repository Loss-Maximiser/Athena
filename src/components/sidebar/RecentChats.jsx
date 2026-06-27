import { motion } from "framer-motion";
import {
  MessageSquare,
  MoreHorizontal,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useChat } from "../../contexts/ChatContext";

export default function RecentChats({ search = "" }) {

  const navigate = useNavigate();

  const {
    conversations,
    currentConversationId,
    openConversation,
  } = useChat();

  const filtered = conversations.filter((chat) => {

    if (!search.trim()) return true;

    return (
      chat.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      chat.agent
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  });

  if (filtered.length === 0) {

    return (

      <div className="px-4 py-8 text-center text-[14px]
font-medium
text-slate-700
truncate">

        No conversations

      </div>

    );

  }

  return (

    <div className="px-3 py-4">

      <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wide text-slate-400">

        Recent Chats

      </p>

      <div className="space-y-1">

        {filtered.map((chat) => {

          const active =
            currentConversationId === chat.id;

          return (

            <motion.button
              key={chat.id}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {

                openConversation(chat.id);

                navigate(`/chat/${chat.agent}`);

              }}
              className="
group
mb-1
flex
h-10
w-full
items-center
justify-between
rounded-xl
px-3
text-left
transition-all
duration-150
hover:bg-slate-100
"
            >

              <div className="flex items-center gap-3 overflow-hidden">

                <MessageSquare
                  size={17}
                  className={
                    active
                      ? "text-blue-600"
                      : "text-slate-400"
                  }
                />

                <div className="overflow-hidden">

                  <p
                    className={`
                      truncate
                      text-sm
                      font-medium

                      ${
                        active
                          ? "text-blue-700"
                          : "text-slate-700"
                      }
                    `}
                  >

                    {chat.title}

                  </p>

                  <p className="truncate text-xs text-slate-400">

                    {chat.agent} assistant

                  </p>

                </div>

              </div>

              <div
className="
rounded-lg
p-1
opacity-0
transition
group-hover:opacity-100
hover:bg-slate-200
cursor-pointer
"
>

<MoreHorizontal size={15}/>

</div>

            </motion.button>

          );

        })}

      </div>

    </div>

  );

}