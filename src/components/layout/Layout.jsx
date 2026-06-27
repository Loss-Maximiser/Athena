import { Outlet } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import { useChat } from "../../contexts/ChatContext";

export default function Layout() {

  const { sidebarCollapsed } = useChat();

  return (

    <div className="h-screen w-screen overflow-hidden bg-[#F8FAFC]">

      {/* Sidebar */}

      <Sidebar />

      {/* Main */}

      <main
className={`
flex
h-screen
flex-col
overflow-y-auto
transition-all
duration-300
${sidebarCollapsed ? "ml-[84px]" : "ml-[300px]"}
`}
>

        <Outlet />

      </main>

    </div>

  );

}