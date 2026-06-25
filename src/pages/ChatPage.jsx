// src/pages/ChatPage.jsx
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Send, Paperclip, MoreVertical, ArrowLeft, MessageSquare, Users } from "lucide-react";

export default function ChatPage() {
  const { agentType } = useParams(); // URL se pata chalega HR hai ya General
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  // Agent configuration based on URL
  const agentDetails = {
    general: {
      name: "General Assistant",
      icon: <MessageSquare size={20} className="text-yellow-500" />,
      greeting: "Hello! I am Athena's General AI. Ask me anything from coding to drafting emails.",
    },
    hr: {
      name: "HR Assistant",
      icon: <Users size={20} className="text-emerald-500" />,
      greeting: "Hi there! I am your HR Assistant. You can ask me about INGSOL's leave policies, payroll, or benefits.",
    }
  };

  const currentAgent = agentDetails[agentType] || agentDetails.general;

  // Set initial greeting when page loads
  useEffect(() => {
    setChatHistory([{ sender: "ai", text: currentAgent.greeting }]);
  }, [agentType]);

  // Auto-scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isTyping]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message to UI
    const newUserMsg = { sender: "user", text: message };
    setChatHistory((prev) => [...prev, newUserMsg]);
    setMessage("");
    setIsTyping(true);

    // TODO: Yahan par actual API call aayegi future me
    // Filhal simulation ke liye setTimeout use kar rahe hain
    setTimeout(() => {
      let aiResponse = "I understand. I am processing your request.";
      
      // Basic mock logic to show difference to evaluator
      if (agentType === "hr" && newUserMsg.text.toLowerCase().includes("maternity leave")) {
        aiResponse = "According to INGSOL's HR policy, female employees are entitled to 26 weeks of paid maternity leave. For male employees, paternity leave is currently 14 days.";
      }

      setChatHistory((prev) => [...prev, { sender: "ai", text: aiResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex h-screen bg-bg-light">
      
      {/* Mini Sidebar */}
      <aside className="w-16 bg-white border-r border-border flex flex-col items-center py-6 gap-6 fixed h-full z-10">
        <button onClick={() => navigate('/home')} className="p-2 hover:bg-gray-100 rounded-lg text-text-muted transition">
          <ArrowLeft size={24} />
        </button>
        <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center">
           <img src="/logo.png" alt="A" className="w-5 h-5 opacity-70" />
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 ml-16 flex flex-col h-full relative">
        
        {/* Chat Header */}
        <header className="h-16 bg-white border-b border-border flex items-center justify-between px-8 absolute w-full top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-50 border border-border flex items-center justify-center shadow-sm">
              {currentAgent.icon}
            </div>
            <div>
              <h2 className="font-semibold text-text-main leading-tight">{currentAgent.name}</h2>
              <span className="text-[11px] text-emerald-500 font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Online
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Publish Dropdown Placeholder for future */}
            <button className="text-xs font-medium text-primary bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition">
              Publish Chat
            </button>
            <MoreVertical size={20} className="text-text-muted cursor-pointer" />
          </div>
        </header>

        {/* Chat Messages Timeline */}
        <div className="flex-1 overflow-y-auto p-8 pt-24 pb-32">
          <div className="max-w-3xl mx-auto flex flex-col gap-6">
            {chatHistory.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] p-4 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                  msg.sender === "user" 
                    ? "bg-primary text-white rounded-br-none" 
                    : "bg-white text-text-main border border-border rounded-bl-none"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-border p-4 rounded-2xl rounded-bl-none flex items-center gap-2 shadow-sm">
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 w-full bg-gradient-to-t from-bg-light via-bg-light to-transparent p-6">
          <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto relative bg-white border border-border rounded-2xl shadow-lg flex items-end overflow-hidden focus-within:border-primary/50 transition-colors">
            
            <button type="button" className="p-4 text-gray-400 hover:text-primary transition">
              <Paperclip size={20} />
            </button>

            <textarea
              rows="1"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              placeholder={`Ask ${currentAgent.name} anything...`}
              className="flex-1 max-h-32 p-4 pl-0 bg-transparent resize-none focus:outline-none text-text-main"
            />

            <button 
              type="submit" 
              disabled={!message.trim() || isTyping}
              className="p-4 text-white bg-primary m-2 rounded-xl hover:bg-primary-hover disabled:opacity-50 disabled:hover:bg-primary transition"
            >
              <Send size={18} />
            </button>
          </form>
          <div className="text-center mt-3 text-[11px] text-text-muted">
            Athena AI can make mistakes. Verify important information.
          </div>
        </div>

      </main>
    </div>
  );
}