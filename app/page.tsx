"use client";

import { FormEvent, useEffect, useState } from "react";

type ChatMessage = { role: "user" | "assistant"; content: string };
type Section = "overview" | "assistant" | "website" | "network" | "learning";

const checks = [
  "HTTPS is enforced and HTTP redirects to HTTPS",
  "TLS certificate is valid and not expired",
  "Security headers are configured (CSP, HSTS, frame protection)",
  "Admin pages use MFA and strong unique passwords",
  "Dependencies and server frameworks are patched",
  "Backups are encrypted and restoration is tested",
  "Forms validate input on the server and encode output",
  "Logs and alerts cover authentication and sensitive actions"
];

export default function Home() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [busy, setBusy] = useState(false);
  const [section, setSection] = useState<Section>("overview");
  const [draft, setDraft] = useState("");
  const [chatBusy, setChatBusy] = useState(false);
  const [chatError, setChatError] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Welcome to RAMZY AI. Ask me about defensive website security, network fundamentals, secure configuration, or authorized lab practice." }
  ]);
  const [completed, setCompleted] = useState<boolean[]>(checks.map(() => false));

  useEffect(() => {
    fetch("/api/auth/session").then((r) => r.json()).then((d) => setAuthenticated(Boolean(d.authenticated))).catch(() => setAuthenticated(false));
  }, []);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setLoginError("");
    try {
      const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Login failed.");
      setAuthenticated(true); setPassword("");
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "Could not sign in.");
    } finally { setBusy(false); }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setAuthenticated(false); setMessages([{ role: "assistant", content: "You are signed out." }]);
  }

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = draft.trim();
    if (!content || chatBusy) return;
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next); setDraft(""); setChatBusy(true); setChatError("");
    try {
      const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next.map(({ role, content }) => ({ role, content })) }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "AI request failed.");
      setMessages((current) => [...current, { role: "assistant", content: data.answer }]);
    } catch (error) {
      setChatError(error instanceof Error ? error.message : "Could not reach RAMZY AI.");
    } finally { setChatBusy(false); }
  }

  if (authenticated === null) return <main className="auth-screen"><div className="auth-card"><div className="brand"><span className="brand-mark">R</span> RAMZY<span className="green"> AI</span></div><p>Checking private workspace…</p></div></main>;

  if (!authenticated) return (
    <main className="auth-screen">
      <form className="auth-card" onSubmit={login}>
        <div className="brand"><span className="brand-mark">R</span> RAMZY<span className="green"> AI</span></div>
        <div className="eyebrow">PRIVATE OWNER ACCESS</div>
        <h1>Welcome back.</h1>
        <p>Sign in to open your security workspace.</p>
        <label htmlFor="owner-password">Owner password</label>
        <input id="owner-password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required />
        {loginError && <div className="error-text">{loginError}</div>}
        <button className="primary-button" disabled={busy}>{busy ? "CHECKING…" : "UNLOCK WORKSPACE ↗"}</button>
        <small>Your password is checked on the server and is not stored in the browser.</small>
      </form>
    </main>
  );

  const nav: { id: Section; icon: string; label: string }[] = [
    { id: "overview", icon: "⌂", label: "Overview" },
    { id: "assistant", icon: "✳", label: "AI Assistant" },
    { id: "website", icon: "◎", label: "Website security" },
    { id: "network", icon: "⌘", label: "Network security" },
    { id: "learning", icon: "▤", label: "Learning lab" }
  ];

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">R</span><span>RAMZY<span className="green"> AI</span></span></div>
        <div className="side-label">WORKSPACE</div>
        {nav.map((item) => <button key={item.id} className={section === item.id ? "nav-item active" : "nav-item"} onClick={() => setSection(item.id)}><span>{item.icon}</span>{item.label}</button>)}
        <div className="sidebar-bottom"><span className="status-dot" /> PRIVATE WORKSPACE<br /><small>Owner session active</small></div>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <div className="mobile-brand">RAMZY<span className="green"> AI</span></div>
          <div className="secure-label"><span className="status-dot" /> OWNER SESSION</div>
          <button className="logout-button" onClick={logout}>SIGN OUT</button>
          <div className="avatar">R</div>
        </header>

        <div className="content">
          {section === "overview" && <>
            <div className="eyebrow">YOUR PRIVATE SECURITY ASSISTANT</div>
            <h1>Think clearly.<br /><span className="green">Test responsibly.</span></h1>
            <p className="intro">A focused workspace for website security, network fundamentals, and authorized testing.</p>
            <div className="section-heading"><div><span className="eyebrow">YOUR TOOLKIT</span><h2>Security workspace</h2></div><span className="coming">OWNER ACCESS</span></div>
            <div className="tool-grid">
              <button className="tool-card" onClick={() => setSection("website")}><div className="tool-top"><span className="tool-number">01</span><span className="tool-tag">WEB</span></div><h3>Website Security</h3><p>Review common web risks, HTTPS, headers, and secure configuration.</p><span className="card-arrow">↗</span></button>
              <button className="tool-card" onClick={() => setSection("network")}><div className="tool-top"><span className="tool-number">02</span><span className="tool-tag">NETWORK</span></div><h3>Network Security</h3><p>Learn network fundamentals and how to secure your own devices.</p><span className="card-arrow">↗</span></button>
              <button className="tool-card" onClick={() => setSection("learning")}><div className="tool-top"><span className="tool-number">03</span><span className="tool-tag">LEARN</span></div><h3>Security Learning</h3><p>Build practical skills using legal labs and defensive exercises.</p><span className="card-arrow">↗</span></button>
            </div>
            <section className="assistant-panel">
              <div className="assistant-head"><div><span className="eyebrow">RAMZY INTELLIGENCE</span><h2>Ask your assistant</h2></div><span className="model-pill"><i /> PRIVATE AI</span></div>
              <p className="intro">Get explanations, secure configuration advice, and help interpreting authorized test results.</p>
              <button className="primary-button compact" onClick={() => setSection("assistant")}>OPEN AI ASSISTANT ↗</button>
            </section>
          </>}

          {section === "assistant" && <section className="assistant-panel full-panel">
            <div className="assistant-head"><div><span className="eyebrow">RAMZY INTELLIGENCE</span><h2>AI assistant</h2></div><span className="model-pill"><i /> OWNER ONLY</span></div>
            <div className="chat-window" aria-live="polite">{messages.map((item, index) => <div className={item.role === "user" ? "message you" : "message"} key={index}><span>{item.role === "user" ? "YOU" : "RAMZY"}</span><p>{item.content}</p></div>)}{chatBusy && <div className="message"><span>RAMZY</span><p>Thinking…</p></div>}</div>
            {chatError && <div className="error-text">{chatError}</div>}
            <form className="chat-form" onSubmit={sendMessage}><input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Ask a security question…" aria-label="Ask RAMZY AI" /><button type="submit" disabled={chatBusy}>SEND <span>↗</span></button></form>
            <p className="notice">Do not share passwords, API keys, or private credentials in chat. Use only authorized targets and legal labs.</p>
          </section>}

          {section === "website" && <section className="info-panel">
            <div className="eyebrow">DEFENSIVE WEB REVIEW</div><h1>Website <span className="green">security.</span></h1>
            <p className="intro">A practical checklist for a website you own or are explicitly authorized to assess. Tick each item after verifying it.</p>
            <div className="progress-line"><span>{completed.filter(Boolean).length} / {checks.length} reviewed</span><div><i style={{ width: (completed.filter(Boolean).length / checks.length * 100) + "%" }} /></div></div>
            <div className="check-list">{checks.map((item, i) => <label className="check-row" key={item}><input type="checkbox" checked={completed[i]} onChange={(e) => setCompleted((old) => old.map((v, n) => n === i ? e.target.checked : v))} /><span>{item}</span></label>)}</div>
            <div className="safe-note"><b>Good practice</b><p>Review your own application configuration and use reputable tools in a controlled environment. Do not test a site without permission.</p></div>
          </section>}

          {section === "network" && <section className="info-panel">
            <div className="eyebrow">DEFENSIVE NETWORK REVIEW</div><h1>Network <span className="green">security.</span></h1>
            <p className="intro">Start with devices and networks you own or administer.</p>
            <div className="lesson-grid">
              <article><span>01 / ROUTER</span><h3>Secure your router</h3><p>Change the default admin password, use WPA2-AES or WPA3, disable WPS, and install firmware updates.</p></article>
              <article><span>02 / DEVICES</span><h3>Protect connected devices</h3><p>Keep operating systems updated, enable device firewalls, remove unused apps, and use MFA.</p></article>
              <article><span>03 / VISIBILITY</span><h3>Know your network</h3><p>Review the connected-device list in your router admin page and remove unknown devices after verifying them.</p></article>
              <article><span>04 / RESPONSE</span><h3>Prepare for incidents</h3><p>Back up important files, document your devices, and know how to rotate Wi-Fi and admin credentials.</p></article>
            </div>
            <div className="safe-note"><b>Practice safely</b><p>Use a home lab, your own router, or a deliberately vulnerable training environment. RAMZY AI does not scan public IP ranges or attack networks.</p></div>
          </section>}

          {section === "learning" && <section className="info-panel">
            <div className="eyebrow">PRACTICE & KNOWLEDGE</div><h1>Learning <span className="green">lab.</span></h1>
            <p className="intro">Build skills in a legal environment before assessing real systems.</p>
            <div className="lesson-grid">
              <article><span>BEGINNER</span><h3>Web foundations</h3><p>Learn HTTP requests and responses, cookies, sessions, input validation, and access control.</p></article>
              <article><span>BEGINNER</span><h3>Network foundations</h3><p>Understand IP addresses, DNS, routing, ports, TCP/UDP, and Wi-Fi security.</p></article>
              <article><span>INTERMEDIATE</span><h3>Secure development</h3><p>Study authentication, authorization, secure secrets management, dependency updates, and logging.</p></article>
              <article><span>INTERMEDIATE</span><h3>Practice labs</h3><p>Use intentionally vulnerable local labs and capture-the-flag exercises with clear permission.</p></article>
            </div>
            <div className="safe-note"><b>Learning rule</b><p>Only test systems you own or have explicit written permission to assess.</p></div>
          </section>}
          <footer>RAMZY AI <span>·</span> BUILT FOR RESPONSIBLE SECURITY RESEARCH</footer>
        </div>
      </section>
    </main>
  );
}
