import { useEffect, useRef, useState } from "react";
import {
  ChevronUp,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useChat } from "../../contexts/ChatContext";

export default function SidebarFooter() {
  const navigate = useNavigate();
const { user } = useChat();
console.log("USER =", user);

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClick
      );
  }, []);

  const menuItems = [
    {
      label: "Profile",
      icon: <User size={17} />,
      action: () => {},
    },
    {
      label: "Settings",
      icon: <Settings size={17} />,
      action: () => {},
    },
    {
      label: "Help",
      icon: <HelpCircle size={17} />,
      action: () => {},
    },
    {
      label: "Appearance",
      icon: <Moon size={17} />,
      action: () => {},
    },
  ];

  return (
    <div
      ref={menuRef}
      className="relative border-t border-gray-100 p-4"
    >
      {/* User Card */}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 rounded-2xl p-3 transition hover:bg-slate-50"
      >
        {/* Avatar */}

        <div className="relative">

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-sky-400 text-white font-semibold shadow-md">

            {(user?.name || "G").charAt(0).toUpperCase()}

          </div>

          {/* Online Dot */}

          <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500" />

        </div>

        {/* Name */}

        <div className="flex-1 text-left">

          <p className="font-semibold text-[14px] text-slate-800">

            {user?.name || "Guest"}

          </p>

          <p className="text-xs text-slate-500">

            Online

          </p>

        </div>

        <ChevronUp
          size={18}
          className={`transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </motion.button>

      {/* Dropdown */}

      <AnimatePresence>

        {open && (

          <motion.div
            initial={{
              opacity: 0,
              y: 12,
              scale: .97,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 12,
              scale: .97,
            }}
            transition={{
              duration: .18
            }}
            className="absolute bottom-24 left-4 right-4 rounded-3xl border border-gray-200 bg-white shadow-2xl overflow-hidden"
          >

            {/* Header */}

            <div className="border-b border-gray-100 px-5 py-4">

              <p className="font-semibold text-slate-900">

                {user?.name || "Guest"}

              </p>

              <p className="text-xs text-slate-500">

                Enterprise Workspace

              </p>

            </div>

            {/* Menu */}



            <div className="py-2">

              {menuItems.map((item) => (

                <button
                  key={item.label}
                  onClick={item.action}
                  className="flex w-full items-center gap-3 px-5 py-3 text-sm text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                >

                  {item.icon}

                  {item.label}

                </button>

              ))}

            </div>

            {/* Logout */}

            <div className="border-t border-gray-100 p-2">

              <button
                onClick={() => navigate("/")}
                className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-red-600 transition hover:bg-red-50"
              >

                <LogOut size={18} />

                Sign Out

              </button>

            </div>

          </motion.div>

        )}

      </AnimatePresence>

    </div>
  );
}