import { Search, X } from "lucide-react";
import { motion } from "framer-motion";

export default function SearchChats({
  search,
  setSearch,
}) {
  return (
    <div className="relative">

      <Search
        size={16}
        className="
mt-3
flex
h-12
items-center
gap-3
rounded-2xl
border
border-slate-200
bg-[#F8FAFC]
px-4
transition
focus-within:border-blue-400
focus-within:bg-white
"
      />

      

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search chats..."
        className="
flex-1
bg-transparent
text-[14px]
text-slate-700
placeholder:text-slate-400
outline-none
"
      />

      {search && (
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setSearch("")}
          className="
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            rounded-full
            p-1
            text-slate-400
            transition
            hover:bg-slate-200
            hover:text-slate-700
          "
        >
          <X size={14} />
        </motion.button>
      )}

    </div>
  );
}