import Sidebar from "../components/Sidebar";

export default function HRChatPage() {
  return (
    <div className="landing-layout">

      <Sidebar />

      <div className="chat-page">

        <h2>HR Assistant</h2>

        <div className="chat-window">

          <div className="bot-msg">
            Hello! How can I help you with HR policies?
          </div>

        </div>

        <div className="chat-input">

          <input
            type="text"
            placeholder="Ask HR anything..."
          />

          <button>
            Send
          </button>

        </div>

      </div>

    </div>
  );
}