// import { useMemo, useState } from "react";
// import {
//   MessageSquare,
//   PieChart,
//   HeadphonesIcon,
//   Tag,
//   Package,
//   Users,
//   TrendingUp,
//   Presentation,
//   Home,
//   Search,
//   Sparkles,
//   Clock3,
//   ArrowRight,
//   ChevronRight,
// } from "lucide-react";
// import PageContainer from "../components/layout/PageContainer";
// import { useNavigate } from "react-router-dom";
// import AnimatedOrb from "../components/AnimatedOrb/AnimatedOrb";
// import { useChat } from "../contexts/ChatContext";


// const agents = [
//   {
//     id: "general",
//     title: "General Chat",
//     desc: "Everyday chatting and questions.",
//     icon: <MessageSquare size={18} className="text-yellow-500" />,
//     accent: "from-yellow-50 to-amber-50",
//   },
//   {
//     id: "hr",
//     title: "HR Assistant",
//     desc: "Employee policies, leaves & queries.",
//     icon: <Users size={18} className="text-emerald-500" />,
//     accent: "from-emerald-50 to-teal-50",
//   },
//   {
//     id: "finance",
//     title: "Finance",
//     desc: "Salary, deductions & finance advice.",
//     icon: <PieChart size={18} className="text-indigo-500" />,
//     accent: "from-indigo-50 to-blue-50",
//   },
//   {
//     id: "service",
//     title: "Service",
//     desc: "Product info, pricing & support.",
//     icon: <HeadphonesIcon size={18} className="text-blue-400" />,
//     accent: "from-sky-50 to-cyan-50",
//   },
//   {
//     id: "purchase",
//     title: "Purchase",
//     desc: "Vendor details & buying queries.",
//     icon: <Tag size={18} className="text-green-500" />,
//     accent: "from-green-50 to-lime-50",
//   },
//   {
//     id: "logistics",
//     title: "Logistics",
//     desc: "Shipment tracking & freight.",
//     icon: <Package size={18} className="text-purple-500" />,
//     accent: "from-purple-50 to-fuchsia-50",
//   },
//   {
//     id: "marketing",
//     title: "Marketing",
//     desc: "Campaigns & product info.",
//     icon: <TrendingUp size={18} className="text-orange-500" />,
//     accent: "from-orange-50 to-amber-50",
//   },
//   {
//     id: "sales",
//     title: "Pre-Sales",
//     desc: "Client support & pitch details.",
//     icon: <Presentation size={18} className="text-red-400" />,
//     accent: "from-rose-50 to-red-50",
//   },
// ];

// const quickActions = [
//   { title: "Ask HR", desc: "Leaves, policy, attendance", agentId: "hr", icon: Users },
//   { title: "Finance Help", desc: "Pay, deductions, salary", agentId: "finance", icon: PieChart },
//   { title: "Track Shipment", desc: "Logistics updates", agentId: "logistics", icon: Package },
// ];

// export default function HomePage() {
//   const navigate = useNavigate();
//   const {

//   user,

//   recentChats,

// } = useChat();
//   const [search, setSearch] = useState("");

//   const greeting = useMemo(() => {
//     const hour = new Date().getHours();
//     if (hour < 12) return "Good Morning";
//     if (hour < 18) return "Good Afternoon";
//     return "Good Evening";
//   }, []);


//   const filteredAgents = agents.filter((agent) => {
//     const q = search.trim().toLowerCase();
//     if (!q) return true;
//     return (
//       agent.title.toLowerCase().includes(q) ||
//       agent.desc.toLowerCase().includes(q)
//     );
//   });

//   const agentLookup = Object.fromEntries(agents.map((a) => [a.id, a]));

  
//    return (

// <PageContainer>
//         <section className="flex flex-col pb-16">
//           <div className="relative mb-8 flex items-center justify-center">
//             <div className="absolute h-[420px] w-[420px] rounded-full bg-violet-400/15 blur-[130px] animate-pulse" />
//             <AnimatedOrb />
//           </div>

//           <p className="text-xs uppercase tracking-[0.4em] text-text-muted">
//             Athena Workspace
//           </p>

//           <h1 className="mt-4 text-center text-3xl font-bold tracking-tight text-text-main md:text-5xl">
//             {greeting}, {user?.name || "Guest"}
//           </h1>

//           <p className="mt-3 max-w-2xl text-center text-sm text-text-muted md:text-base">
//             Ask Athena to draft, analyze, summarize, or coordinate work across
//             HR, finance, logistics, sales, and support.
//           </p>

//           <div className="mt-8 w-full max-w-3xl">
//             <div className="flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3 shadow-sm focus-within:border-primary/40">
//               <Search size={18} className="text-text-muted" />
//               <input
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search agents or ask Athena..."
//                 className="w-full bg-transparent text-sm text-text-main outline-none placeholder:text-text-muted"
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") {
//                     navigate("/chat/general");
//                   }
//                 }}
//               />
//               <button
//                 onClick={() => navigate("/chat/general")}
//                 className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
//               >
//                 Ask <ArrowRight size={16} />
//               </button>
//             </div>
//           </div>

//           <div className="mt-10 grid w-full max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
//             {filteredAgents.map((agent) => (
//               <button
//                 key={agent.id}
//                 onClick={() => navigate(`/chat/${agent.id}`)}
//                 className="group rounded-2xl border border-gray-100 bg-white p-4 text-left shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_8px_20px_-6px_rgba(37,99,235,0.15)]"
//               >
//                 <div
//                   className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-gray-100 bg-gradient-to-br ${agent.accent} shadow-sm transition-transform duration-300 group-hover:scale-110`}
//                 >
//                   {agent.icon}
//                 </div>

//                 <h3 className="mb-1.5 text-[15px] font-semibold text-text-main transition-colors group-hover:text-primary">
//                   {agent.title}
//                 </h3>

//                 <p className="line-clamp-2 text-[13px] leading-relaxed text-text-muted">
//                   {agent.desc}
//                 </p>

//                 <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary">
//                   Open <ChevronRight size={14} />
//                 </div>
//               </button>
//             ))}
//           </div>

//           <div className="mt-12 w-full max-w-6xl">
//             <div className="flex items-center justify-between">
//               <h2 className="text-lg font-semibold text-text-main">
//                 Recent chats
//               </h2>
//               <span className="text-sm text-text-muted">
//                 {recentChats.length} active thread{recentChats.length === 1 ? "" : "s"}
//               </span>
//             </div>

//             <div className="mt-4 grid gap-4 md:grid-cols-2">
//               {recentChats.length > 0 ? (
//                 recentChats.map((item) => {
//                   const agent = agentLookup[item.agent];
//                   return (
//                     <button
//                       key={item.id}
//                       onClick={() => navigate(`/chat/${item.agent}`)}
//                       className="flex items-start gap-4 rounded-2xl border border-border bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
//                     >
//                       <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50 border border-gray-100">
//                         {agent?.icon}
//                       </div>
//                       <div className="min-w-0 flex-1">
//                         <div className="flex items-center justify-between gap-3">
//                           <h3 className="font-semibold text-text-main">
//                             {agent?.title || item.agent}
//                           </h3>
//                           <span className="text-xs text-text-muted">
//                             {new Date(item.updatedAt).toLocaleTimeString([], {
//                               hour: "numeric",
//                               minute: "2-digit",
//                             })}
//                           </span>
//                         </div>
//                         <p className="mt-1 line-clamp-1 text-sm text-text-muted">
//                           {item.messages.at(-1)?.text || "Conversation started"}
//                         </p>
//                       </div>
//                     </button>
//                   );
//                 })
//               ) : (
//                 <div className="rounded-2xl border border-dashed border-border bg-white p-6 text-sm text-text-muted">
//                   No recent chats yet. Start with any agent card above.
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="mt-12 grid w-full max-w-6xl grid-cols-1 gap-4 lg:grid-cols-3">
//             {quickActions.map((action) => {
//               const Icon = action.icon;
//               return (
//                 <button
//                   key={action.title}
//                   onClick={() => navigate(`/chat/${item.agent}`)}
//                   className="rounded-2xl border border-border bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
//                 >
//                   <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/5 text-primary">
//                     <Icon size={18} />
//                   </div>
//                   <h3 className="mt-4 font-semibold text-text-main">
//                     {action.title}
//                   </h3>
//                   <p className="mt-1 text-sm text-text-muted">{action.desc}</p>
//                   <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
//                     Start now <ArrowRight size={14} />
//                   </div>
//                 </button>
//               );
//             })}
//           </div>
//         </section>
//       </PageContainer>
//   );
// }




import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  Users,
  PieChart,
  HeadphonesIcon,
  Package,
  Tag,
  TrendingUp,
  Presentation,
  Sparkles,
  Clock3,
  ArrowRight,
} from "lucide-react";

import { motion } from "framer-motion";

import AnimatedOrb from "../components/AnimatedOrb/AnimatedOrb";
import PageContainer from "../components/layout/PageContainer";
import { useChat } from "../contexts/ChatContext";

export default function HomePage() {
  const navigate = useNavigate();
  const { user, conversations } = useChat();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  const agents = [
    {
      id: "general",
      title: "General Chat",
      desc: "Everyday conversations and AI assistance.",
      color: "from-yellow-400 to-orange-400",
      icon: <MessageSquare size={20} />,
    },
    {
      id: "hr",
      title: "HR Assistant",
      desc: "Leave, attendance & HR policies.",
      color: "from-emerald-400 to-green-500",
      icon: <Users size={20} />,
    },
    {
      id: "finance",
      title: "Finance",
      desc: "Payroll, invoices and expenses.",
      color: "from-indigo-500 to-blue-500",
      icon: <PieChart size={20} />,
    },
    {
      id: "service",
      title: "Service",
      desc: "Support tickets & products.",
      color: "from-sky-400 to-cyan-500",
      icon: <HeadphonesIcon size={20} />,
    },
    {
      id: "purchase",
      title: "Purchase",
      desc: "Vendor management.",
      color: "from-green-500 to-lime-500",
      icon: <Tag size={20} />,
    },
    {
      id: "logistics",
      title: "Logistics",
      desc: "Shipment & dispatch.",
      color: "from-violet-500 to-fuchsia-500",
      icon: <Package size={20} />,
    },
    {
      id: "marketing",
      title: "Marketing",
      desc: "Campaigns & branding.",
      color: "from-orange-500 to-red-400",
      icon: <TrendingUp size={20} />,
    },
    {
      id: "sales",
      title: "Pre Sales",
      desc: "Proposal & client support.",
      color: "from-pink-500 to-rose-500",
      icon: <Presentation size={20} />,
    },
  ];

  const quickActions = [
    {
      title: "Generate Report",
      icon: <Sparkles size={18} />,
      agent: "general",
    },
    {
      title: "Recent Chats",
      icon: <Clock3 size={18} />,
      agent: "general",
    },
  ];

  return (
    <PageContainer>
      <div className="flex flex-col pb-16">
        {/* HERO */}
        <div className="flex flex-col items-center pt-12">
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.45 }}
          >
            <AnimatedOrb />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-8 text-4xl font-bold text-slate-900"
          >
            {greeting},{" "}
            <span className="text-blue-600">{user?.name || "Guest"}</span>
          </motion.h1>

          <p className="mt-3 max-w-xl text-center text-slate-500">
            Choose an AI workspace below to begin your conversation with Athena.
          </p>
        </div>

        {/* QUICK ACTIONS */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {quickActions.map((item) => (
            <button
              key={item.title}
              onClick={() => navigate(`/chat/${item.agent}`)}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm transition hover:border-blue-300 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="font-medium">{item.title}</span>
              </div>
            </button>
          ))}
        </div>

        {/* AI AGENTS */}
        <div className="mt-14">
          <h2 className="mb-6 text-2xl font-semibold text-slate-900">
            AI Assistants
          </h2>

          {/* Fixed Container Wrapping */}
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {agents.map((agent) => (
              <motion.button
                key={agent.id}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/chat/${agent.id}`)}
                className="group text-left rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-200 hover:shadow-xl"
              >
                <div
                  className={`mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${agent.color} text-white shadow-lg`}
                >
                  {agent.icon}
                </div>

                <h3 className="text-base font-semibold text-slate-900">
                  {agent.title}
                </h3>

                <p className="mt-2 text-sm leading-5 text-slate-500">
                  {agent.desc}
                </p>

                <div className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-600">
                  Open Assistant
                  <ArrowRight
                    size={16}
                    className="transition group-hover:translate-x-1"
                  />
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* RECENT CONVERSATIONS */}
        <div className="mt-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-slate-900">
              Recent Conversations
            </h2>
            <button
              onClick={() => navigate("/chat/general")}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View All
            </button>
          </div>
         

          {conversations.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <MessageSquare
                size={36}
                className="mx-auto mb-4 text-slate-300"
              />
              <h3 className="text-base font-semibold text-slate-700">
                No conversations yet
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Start a new conversation with Athena.
              </p>
              <button
                onClick={() => navigate("/chat/general")}
                className="mt-4 rounded-2xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
              >
                Start Chat
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {conversations.slice(0, 6).map((chat) => (
                <motion.button
                  key={chat.id}
                  whileHover={{ x: 4 }}
                  onClick={() => navigate(`/chat/${chat.agent}`)}
                  className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-200 hover:shadow-md"
                >
                  <div>
                    <h4 className="font-semibold text-slate-900">
                      {chat.title}
                    </h4>
                    <p className="mt-1 text-sm capitalize text-slate-500">
                      {chat.agent} Assistant
                    </p>
                  </div>
                  <ArrowRight size={18} className="text-slate-400" />
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}