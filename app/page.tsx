"use client";

import { useState } from "react";

const tools = [
  { number: "01", name: "Website Security", detail: "Learn to review headers, TLS, and common web risks.", tag: "WEB" },
  { number: "02", name: "Network Security", detail: "Understand your own network and authorized test results.", tag: "NETWORK" },
  { number: "03", name: "Security Learning", detail: "Practice safe labs, concepts, and remediation steps.", tag: "LEARN" }
];

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([
    { role: "assistant", text: "Welcome. I’m RAMZY AI. I can help you understand security concepts and assess systems you own or are authorized to test. What would you like to work on?" }
  ]);

  function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const clean = message.trim();
    if (!clean) return;
    setMessages((current) => [...current, { role: "you", text: clean }]);
    setMessage("");
  }

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">R</span><span>RAMZY<span className="green"> AI</span></span></div>
        <div className="side-label">WORKSPACE</div>
        <div className="nav-item active"><span>⌂</span> Overview</div>
        <div className="nav-item"><span>⌘</span> AI Assistant</div>
        <div className="nav-item"><span>◈</span> Security tools</div>
        <div className="nav-item"><span>▤</span> Learning lab</div>
        <div className="sidebar-bottom"><span className="status-dot" /> PRIVATE WORKSPACE<br /><small>Owner access setup pending</small></div>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <div className="mobile-brand">RAMZY<span className="green"> AI</span></div>
          <div className="secure-label"><span className="status-dot" /> SECURITY WORKSPACE</div>
          <div className="avatar">R</div>
        </header>

        <div className="content">
          <div className="eyebrow">YOUR PRIVATE SECURITY ASSISTANT</div>
          <h1>Think clearly.<br /><span className="green">Test responsibly.</span></h1>
          <p className="intro">A focused workspace for website security, network fundamentals, and authorized testing.</p>

          <div className="section-heading"><div><span className="eyebrow">YOUR TOOLKIT</span><h2>Security workspace</h2></div><span className="coming">STARTER VERSION</span></div>
          <div className="tool-grid">
            {tools.map((tool) => (
              <article className="tool-card" key={tool.number}>
                <div className="tool-top"><span className="tool-number">{tool.number}</span><span className="tool-tag">{tool.tag}</span></div>
                <h3>{tool.name}</h3><p>{tool.detail}</p><span className="card-arrow">↗</span>
              </article>
            ))}
          </div>

          <section className="assistant-panel">
            <div className="assistant-head"><div><span className="eyebrow">RAMZY INTELLIGENCE</span><h2>AI assistant</h2></div><span className="model-pill"><i /> UI PREVIEW</span></div>
            <div className="chat-window" aria-live="polite">
              {messages.map((item, index) => <div className={item.role === "you" ? "message you" : "message"} key={index}><span>{item.role === "you" ? "YOU" : "RAMZY"}</span><p>{item.text}</p></div>)}
            </div>
            <form className="chat-form" onSubmit={sendMessage}>
              <input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ask a security question..." aria-label="Ask RAMZY AI" />
              <button type="submit" aria-label="Send message">SEND <span>↗</span></button>
            </form>
            <p className="notice">Preview only — AI connection and private owner login will be added before deployment.</p>
          </section>
          <footer>RAMZY AI <span>·</span> BUILT FOR RESPONSIBLE SECURITY RESEARCH</footer>
        </div>
      </section>
    </main>
  );
}
