import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useChat } from "../../contexts/ChatContext";

export default function PageHeader({

    title,

    subtitle,

}){

const navigate=useNavigate();

const {user}=useChat();

return(

<header
className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-8 backdrop-blur">

<div className="flex items-center gap-3">

<button

onClick={()=>navigate("/home")}

className="rounded-xl p-2 transition hover:bg-slate-100"

>

<ArrowLeft size={20}/>

</button>

<div>

<h2 className="text-xl font-semibold">

{title}

</h2>

<p className="text-xs text-slate-500">

{subtitle}

</p>

</div>

</div>

<div className="flex h-10 min-w-[42px] items-center justify-center rounded-full bg-blue-600 px-4 font-medium text-white">

{(user?.name || "G").charAt(0).toUpperCase()}

</div>

</header>

);

}