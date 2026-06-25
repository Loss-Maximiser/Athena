import { useEffect, useState } from "react";
import { MessageSquare, PieChart, HeadphonesIcon, Tag, Package, Users, TrendingUp, Presentation, Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [userName, setUserName] = useState("Guest");
  const navigate = useNavigate(); // Navigation hook

  // Extract name from URL after Zoho Redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nameFromZoho = params.get("name");
    if (nameFromZoho) {
      setUserName(nameFromZoho);
    }
  }, []);

  const agents = [
    { title: "General Chat", desc: "General everyday chatting and question.", icon: <MessageSquare className="text-yellow-500" /> },
    { title: "Finance", desc: "Get finance expert advice", icon: <PieChart className="text-indigo-500" /> },
    { title: "Service", desc: "Product Info, Pricing, Customer Support", icon: <HeadphonesIcon className="text-blue-400" /> },
    { title: "Purchase", desc: "Purchase discussion, Customer bargaining", icon: <Tag className="text-green-500" /> },
    { title: "Logistics", desc: "Shipment tracking, Freight management", icon: <Package className="text-purple-500" /> },
    { title: "HR Assistant", desc: "Employee Queries, policies, leave management", icon: <Users className="text-emerald-500" /> },
    { title: "Marketing", desc: "Product Info, Pricing, Customer Support", icon: <TrendingUp className="text-orange-500" /> },
    { title: "Pre-Sales", desc: "Product Info, Pricing, Customer Support", icon: <Presentation className="text-yellow-400" /> },
  ];

  return (
    <div className="flex min-h-screen bg-bg-light">
      
      {/* Sidebar Navigation */}
      <aside className="w-16 bg-white border-r border-border flex flex-col items-center py-6 gap-8 fixed h-full">
        <div className="w-8 h-8 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
           <img src="/assets/logo.png" alt="A" className="w-5 h-5" />
        </div>
        <div className="p-3 bg-blue-50 text-primary rounded-xl cursor-pointer">
          <MessageSquare size={20} />
        </div>
        <div className="p-3 text-gray-400 hover:text-primary cursor-pointer">
          <Plus size={24} />
        </div>
        <div className="p-3 text-gray-400 hover:text-primary cursor-pointer mt-auto">
          <Search size={20} />
        </div>
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs font-bold text-white mb-4">
          {userName.charAt(0)}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-16 p-10 flex flex-col items-center">
        
        {/* Top Abstract Graphic Animation */}
        <div className="w-48 h-48 mb-6 relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-400 to-primary rounded-full blur-2xl opacity-20 animate-pulse"></div>
          {/* You can replace this img with your abstract wave vector */}
          <div className="w-full h-full rounded-full border border-primary/20 bg-gradient-to-b from-blue-50 to-purple-50 shadow-inner flex items-center justify-center overflow-hidden">
             <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100 via-transparent to-transparent opacity-50"></div>
          </div>
        </div>

        {/* Dynamic Greeting */}
        <h1 className="text-4xl font-semibold text-text-main mb-2">Good Morning, {userName}</h1>
        <p className="text-text-muted mb-12">How can i assist you today?</p>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl mb-12">
          {agents.map((agent, idx) => (
            <div 
              key={idx} 
              // ✅ Yahan maine onClick routing insert kar di hai
              onClick={() => {
                if (agent.title === "General Chat") navigate('/chat/general');
                if (agent.title === "HR Assistant") navigate('/chat/hr');
              }}
              className="bg-white p-5 rounded-2xl border border-border hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center mb-4 border border-gray-100 group-hover:bg-blue-50 transition-colors">
                {agent.icon}
              </div>
              <h3 className="font-semibold text-text-main mb-1">{agent.title}</h3>
              <p className="text-xs text-text-muted line-clamp-2">{agent.desc}</p>
            </div>
          ))}
        </div>

        {/* Community Chat Section */}
        <div className="w-full max-w-5xl bg-white p-6 rounded-2xl border border-border">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-text-main">Community Chat</h2>
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                <input type="text" placeholder="Search" className="pl-9 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary" />
              </div>
              <button className="flex items-center gap-2 border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
                <Plus size={16} /> Community Chat
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             {/* Render Community Cards similarly based on design */}
             <div className="p-4 border border-border rounded-xl cursor-pointer hover:border-primary">
                <div className="w-8 h-8 rounded bg-indigo-100 text-indigo-500 flex items-center justify-center mb-6">
                  <PieChart size={16} />
                </div>
                <h4 className="font-medium text-sm">Community Finance</h4>
                <p className="text-[10px] text-gray-400 mt-2">Made by- Aryan<br/>Created on- 12/4/25</p>
             </div>
             
             {/* Duplicate for other community cards */}
             <div className="p-4 border border-border rounded-xl cursor-pointer flex items-center justify-center hover:bg-gray-50 text-primary">
                <span className="text-sm font-medium flex items-center gap-2">View All →</span>
             </div>
          </div>
        </div>

      </main>
    </div>
  );
}