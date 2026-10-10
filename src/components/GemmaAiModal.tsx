"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  GEMMA_4_WEIGHTS_REGISTRY,
  Gemma4ModelType,
  GemmaProvider,
  ModelWeightInfo,
} from "@/lib/gemmaWeights";

interface GemmaAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultModel?: Gemma4ModelType;
}

interface ChatMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  isHtml?: boolean;
  modelTag?: string;
  providerTag?: string;
}

export default function GemmaAiModal({ isOpen, onClose, defaultModel = "gemma-4" }: GemmaAiModalProps) {
  const [activeModel, setActiveModel] = useState<Gemma4ModelType>(defaultModel);
  const [activeProvider, setActiveProvider] = useState<GemmaProvider>("builtin");
  const [showWeightsInspector, setShowWeightsInspector] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [endpointUrl, setEndpointUrl] = useState("");
  const [customKey, setCustomKey] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init-1",
      sender: "assistant",
      modelTag: "Gemma 4",
      providerTag: "Official Google Weights",
      text: `<p><strong>Namaste! Welcome to NITH Gemma 4 Academic Intelligence Hub</strong>.</p>
             <p>Powered by Google DeepMind's flagship <strong>Gemma 4 open model weights</strong>. This system is production-integrated across:</p>
             <ul>
               <li>🧠 <strong>Gemma 4 (Academic Reasoner)</strong>: Ordinance 7.2 attendance compliance optimizer and timetable advisor.</li>
               <li>💻 <strong>CodeGemma 4 (Lab Synthesizer)</strong>: C++20 STL, Python, Dijkstra algorithm proofs, and OS lab simulator.</li>
               <li>👁️ <strong>PaliGemma 4 (Vision VLM)</strong>: Student ID card OCR, scanned grade cards, and document authentication.</li>
               <li>🛡️ <strong>ShieldGemma 4 (Safety Guard)</strong>: Supreme Court & UGC Anti-Ragging policy compliance.</li>
             </ul>
             <p style="font-size:0.8rem; color:#475569;">
               📦 <em>Model weights supported: <strong>Hugging Face SafeTensors</strong>, <strong>Ollama</strong>, <strong>Kaggle Models</strong>, <strong>LM Studio GGUF</strong>, and <strong>Docker vLLM</strong>. Tap the <strong>Model Weights (chip icon)</strong> at top to inspect deployments!</em>
             </p>`,
      isHtml: true,
    }
  ]);

  const [inputVal, setInputVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCustomKey(localStorage.getItem("GEMMA_API_KEY") || "");
      const savedProvider = (localStorage.getItem("GEMMA_PROVIDER") as GemmaProvider) || "builtin";
      setActiveProvider(savedProvider);
      if (savedProvider === "ollama") setEndpointUrl("http://localhost:11434/api/generate");
      else if (savedProvider === "lmstudio") setEndpointUrl("http://localhost:1234/v1/chat/completions");
      else if (savedProvider === "docker") setEndpointUrl("http://localhost:8000/v1/chat/completions");
    }
  }, []);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const currentMeta: ModelWeightInfo = GEMMA_4_WEIGHTS_REGISTRY[activeModel] || GEMMA_4_WEIGHTS_REGISTRY["gemma-4"];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleProviderChange = (p: GemmaProvider) => {
    setActiveProvider(p);
    localStorage.setItem("GEMMA_PROVIDER", p);
    if (p === "ollama") setEndpointUrl("http://localhost:11434/api/generate");
    else if (p === "lmstudio") setEndpointUrl("http://localhost:1234/v1/chat/completions");
    else if (p === "docker") setEndpointUrl("http://localhost:8000/v1/chat/completions");
    else setEndpointUrl("");
  };

  const clearChat = () => {
    setMessages([
      {
        id: "cleared-" + Date.now(),
        sender: "assistant",
        modelTag: currentMeta.modelTag,
        providerTag: activeProvider.toUpperCase(),
        text: `<p><strong>Chat Cleared!</strong> Now running <strong>${currentMeta.name}</strong> (${currentMeta.parameters}) via <strong>${activeProvider.toUpperCase()}</strong> provider.</p>`,
        isHtml: true,
      }
    ]);
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: "u-" + Date.now(),
      sender: "user",
      text: `<p>${text}</p>`,
      isHtml: true,
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/gemma", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(customKey ? { "x-gemma-api-key": customKey } : {})
        },
        body: JSON.stringify({
          model: activeModel,
          provider: activeProvider,
          endpointUrl: endpointUrl.trim() || undefined,
          query: text,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Inference failed.");
      }

      const botMsg: ChatMessage = {
        id: "b-" + Date.now(),
        sender: "assistant",
        modelTag: currentMeta.modelTag,
        providerTag: data.provider?.toUpperCase() || "GEMMA 4",
        text: data.responseHtml,
        isHtml: true,
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      const fallbackMsg: ChatMessage = {
        id: "b-" + Date.now(),
        sender: "assistant",
        modelTag: currentMeta.modelTag,
        providerTag: "NOTICE",
        text: `<p><strong>⚠️ Gemma 4 Notice:</strong> ${msg}</p><p>Check if your local ${activeProvider.toUpperCase()} service is running or switch to Built-in engine.</p>`,
        isHtml: true,
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="gemmaModal" className="gemma-modal-overlay">
      <div className="gemma-modal-container">
        
        {/* MODAL HEADER */}
        <div className="gemma-modal-header">
          <div className="gemma-header-branding">
            <div className="gemma-avatar-icon">
              <span className="material-symbols-outlined">auto_awesome</span>
            </div>
            <div>
              <h3>NITH Gemma 4 Academic Intelligence</h3>
              <div className="gemma-engine-tag">
                <span className="pulse-gemma-dot"></span>
                <span>Active: <strong>{currentMeta.modelTag}</strong> • Provider: <strong>{activeProvider.toUpperCase()}</strong></span>
              </div>
            </div>
          </div>
          <div className="gemma-header-actions">
            <button
              type="button"
              className={`gemma-action-btn ${showWeightsInspector ? 'active' : ''}`}
              onClick={() => setShowWeightsInspector(!showWeightsInspector)}
              title="Inspect Hugging Face / Ollama / Kaggle / LM Studio / Docker Weights"
            >
              <span className="material-symbols-outlined">developer_board</span>
            </button>
            <button
              type="button"
              className="gemma-action-btn"
              onClick={() => setShowSettings(!showSettings)}
              title="Configure Provider & Endpoints"
            >
              <span className="material-symbols-outlined">settings</span>
            </button>
            <button
              type="button"
              className="gemma-action-btn"
              onClick={clearChat}
              title="Clear Chat History"
            >
              <span className="material-symbols-outlined">restart_alt</span>
            </button>
            <button type="button" className="gemma-close-btn" onClick={onClose}>
              &times;
            </button>
          </div>
        </div>

        {/* MODEL TABS BAR (GEMMA 4 ARCHITECTURES) */}
        <div className="gemma-model-tabs-bar">
          {[
            { key: "gemma-4", label: "Gemma 4", icon: "psychology", badge: "9B Flagship" },
            { key: "gemma-4-code", label: "CodeGemma 4", icon: "terminal", badge: "7B Code" },
            { key: "gemma-4-vision", label: "PaliGemma 4", icon: "document_scanner", badge: "3B Vision" },
            { key: "gemma-4-guard", label: "ShieldGemma 4", icon: "security", badge: "2B Safety" },
          ].map(m => {
            const isActive = activeModel === m.key;
            return (
              <button
                key={m.key}
                type="button"
                className={`gemma-model-tab ${isActive ? 'active' : ''}`}
                onClick={() => setActiveModel(m.key as Gemma4ModelType)}
              >
                <span className="material-symbols-outlined tab-icon">{m.icon}</span>
                <span className="tab-name">{m.label}</span>
                <span className="tab-badge">{m.badge}</span>
              </button>
            );
          })}
        </div>

        {/* PROVIDER SELECTION STRIP (Hugging Face • Ollama • Kaggle • LM Studio • Docker) */}
        <div style={{ background: "#1e293b", padding: "6px 16px", display: "flex", alignItems: "center", gap: "8px", overflowX: "auto", fontSize: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <span style={{ color: "#94a3b8", fontWeight: 700, whiteSpace: "nowrap" }}>Weights Engine:</span>
          {[
            { key: "builtin", label: "⚡ Built-in Gemma 4" },
            { key: "huggingface", label: "📦 Hugging Face Hub" },
            { key: "ollama", label: "🦙 Ollama Local" },
            { key: "kaggle", label: "📊 Kaggle Models" },
            { key: "lmstudio", label: "💻 LM Studio (GGUF)" },
            { key: "docker", label: "🐳 Docker vLLM" },
          ].map(p => (
            <button
              key={p.key}
              type="button"
              onClick={() => handleProviderChange(p.key as GemmaProvider)}
              style={{
                background: activeProvider === p.key ? "#4f46e5" : "rgba(255,255,255,0.08)",
                color: activeProvider === p.key ? "#fff" : "#cbd5e1",
                border: activeProvider === p.key ? "1px solid #818cf8" : "1px solid transparent",
                padding: "3px 9px",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.72rem",
                whiteSpace: "nowrap",
                transition: "all 0.15s ease",
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* MODEL WEIGHTS INSPECTOR CARD (HUGGING FACE, OLLAMA, KAGGLE, LM STUDIO, DOCKER) */}
        {showWeightsInspector && (
          <div className="gemma-weights-inspector-card" style={{ background: "#f8fafc", borderBottom: "2px solid #4f46e5", padding: "14px 18px", maxHeight: "320px", overflowY: "auto" }}>
            <div className="inspector-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span className="material-symbols-outlined" style={{ color: "#4f46e5" }}>memory</span>
                <strong style={{ fontSize: "0.9rem", color: "#0f172a" }}>
                  {currentMeta.name} — Model Weights Deployment Matrix
                </strong>
              </div>
              <button type="button" onClick={() => setShowWeightsInspector(false)} style={{ background: "transparent", border: "none", fontSize: "20px", cursor: "pointer", color: "#64748b" }}>&times;</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "10px", fontSize: "0.78rem" }}>
              
              {/* 1. HUGGING FACE */}
              <div style={{ background: "#fff", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <strong style={{ color: "#ea580c" }}>📦 Hugging Face Hub (SafeTensors)</strong>
                  <button
                    type="button"
                    onClick={() => handleCopy(`git clone https://huggingface.co/${currentMeta.huggingFace.repoId}`, "hf")}
                    style={{ fontSize: "0.7rem", padding: "2px 6px", cursor: "pointer", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "4px" }}
                  >
                    {copiedKey === "hf" ? "Copied!" : "Copy Clone"}
                  </button>
                </div>
                <div>Repo ID: <code>{currentMeta.huggingFace.repoId}</code></div>
                <div>Formats: <em>{currentMeta.huggingFace.format}</em></div>
                <div style={{ marginTop: "4px" }}>
                  <a href={currentMeta.huggingFace.url} target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb", textDecoration: "underline" }}>
                    View on Hugging Face ↗
                  </a>
                </div>
              </div>

              {/* 2. OLLAMA */}
              <div style={{ background: "#fff", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <strong style={{ color: "#0284c7" }}>🦙 Ollama CLI / Local Runner</strong>
                  <button
                    type="button"
                    onClick={() => handleCopy(currentMeta.ollama.runCommand, "ollama")}
                    style={{ fontSize: "0.7rem", padding: "2px 6px", cursor: "pointer", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "4px" }}
                  >
                    {copiedKey === "ollama" ? "Copied!" : "Copy Command"}
                  </button>
                </div>
                <div>Tag: <code>{currentMeta.ollama.tag}</code></div>
                <div style={{ margin: "4px 0" }}>Command: <code style={{ background: "#0f172a", color: "#38bdf8", padding: "2px 6px", borderRadius: "4px" }}>{currentMeta.ollama.runCommand}</code></div>
                <div style={{ color: "#64748b" }}>API: <code>http://localhost:11434/api/generate</code></div>
              </div>

              {/* 3. KAGGLE MODELS */}
              <div style={{ background: "#fff", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <strong style={{ color: "#059669" }}>📊 Kaggle Models Hub</strong>
                  <button
                    type="button"
                    onClick={() => handleCopy(`kaggle models get ${currentMeta.kaggle.handle}`, "kaggle")}
                    style={{ fontSize: "0.7rem", padding: "2px 6px", cursor: "pointer", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "4px" }}
                  >
                    {copiedKey === "kaggle" ? "Copied!" : "Copy CLI"}
                  </button>
                </div>
                <div>Handle: <code>{currentMeta.kaggle.handle}</code></div>
                <div>Checkpoints: <em>{currentMeta.kaggle.frameworks}</em></div>
                <div style={{ marginTop: "4px" }}>
                  <a href={currentMeta.kaggle.url} target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb", textDecoration: "underline" }}>
                    Open Kaggle Weights ↗
                  </a>
                </div>
              </div>

              {/* 4. LM STUDIO */}
              <div style={{ background: "#fff", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <strong style={{ color: "#7c3aed" }}>💻 LM Studio Desktop (GGUF)</strong>
                  <button
                    type="button"
                    onClick={() => handleCopy(currentMeta.lmStudio.modelSearch, "lm")}
                    style={{ fontSize: "0.7rem", padding: "2px 6px", cursor: "pointer", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "4px" }}
                  >
                    {copiedKey === "lm" ? "Copied!" : "Copy Search"}
                  </button>
                </div>
                <div>Search Model: <code>{currentMeta.lmStudio.modelSearch}</code></div>
                <div>Local Endpoint: <code>{currentMeta.lmStudio.endpoint}</code></div>
                <div>Quantization: <em>{currentMeta.lmStudio.quantRecommendation}</em></div>
              </div>

              {/* 5. DOCKER vLLM */}
              <div style={{ background: "#fff", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", gridColumn: "1 / -1" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <strong style={{ color: "#0f766e" }}>🐳 Docker Container (vLLM / TGI GPU Cluster Deployment)</strong>
                  <button
                    type="button"
                    onClick={() => handleCopy(currentMeta.docker.dockerRun, "docker")}
                    style={{ fontSize: "0.7rem", padding: "2px 6px", cursor: "pointer", background: "#0f172a", color: "#34d399", border: "1px solid #334155", borderRadius: "4px" }}
                  >
                    {copiedKey === "docker" ? "✓ Copied Docker Command!" : "Copy Docker Run"}
                  </button>
                </div>
                <pre style={{ background: "#0f172a", color: "#a5f3fc", padding: "8px", borderRadius: "6px", overflowX: "auto", margin: "4px 0", fontSize: "0.72rem" }}>
                  <code>{currentMeta.docker.dockerRun}</code>
                </pre>
                <div style={{ color: "#64748b" }}>Exposes OpenAI-compatible API at <code>http://localhost:{currentMeta.docker.port}/v1</code></div>
              </div>

            </div>
          </div>
        )}

        {/* SETTINGS / CUSTOM ENDPOINT DRAWER */}
        {showSettings && (
          <div className="gemma-settings-panel" style={{ background: "#f8fafc", padding: "16px", borderBottom: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <strong>⚙️ Gemma 4 Provider & Endpoint Configuration</strong>
              <button type="button" onClick={() => setShowSettings(false)} style={{ background: "transparent", border: "none", fontSize: "18px", cursor: "pointer" }}>&times;</button>
            </div>
            <p style={{ fontSize: "0.8rem", color: "#475569", marginBottom: "10px" }}>
              Connect directly to your local Ollama daemon, LM Studio desktop instance, or Docker vLLM container.
            </p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "10px" }}>
              <input
                type="text"
                placeholder="Custom Endpoint URL (e.g. http://localhost:11434/api/generate)"
                value={endpointUrl}
                onChange={(e) => setEndpointUrl(e.target.value)}
                style={{ flex: 1, minWidth: "260px", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.82rem" }}
              />
              <input
                type="password"
                placeholder="Optional API Key"
                value={customKey}
                onChange={(e) => setCustomKey(e.target.value)}
                style={{ width: "200px", padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.82rem" }}
              />
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  if (customKey) localStorage.setItem("GEMMA_API_KEY", customKey);
                  else localStorage.removeItem("GEMMA_API_KEY");
                  alert("✓ Provider settings saved!");
                  setShowSettings(false);
                }}
                style={{ padding: "8px 16px", fontSize: "0.82rem" }}
              >
                Save
              </button>
            </div>
          </div>
        )}

        {/* QUICK PROMPT CHIPS */}
        <div className="gemma-chips-bar">
          <span className="chips-title">Prompts:</span>
          {activeModel === "gemma-4" && (
            <>
              <button type="button" className="gemma-chip" onClick={() => handleSend("What is my safe attendance margin in CS-302 Operating Systems under Ordinance 7.2?")}>
                🎓 CS-302 Attendance Margin
              </button>
              <button type="button" className="gemma-chip" onClick={() => handleSend("Explain Ordinance 7.2 medical leave 10% relaxation rules and Z grade penalties at NIT Hamirpur.")}>
                📋 Ordinance 7.2 75% Rule
              </button>
            </>
          )}
          {activeModel === "gemma-4-code" && (
            <>
              <button type="button" className="gemma-chip" onClick={() => handleSend("Write Dijkstra's Algorithm in C++20 with Min-Heap for CS-304 DAA Lab.")}>
                💡 Dijkstra C++20 (CS-304 DAA)
              </button>
              <button type="button" className="gemma-chip" onClick={() => handleSend("Implement Banker's Algorithm for deadlock avoidance in C++ for CS-302 OS Lab.")}>
                ⚡ Banker's Deadlock (CS-302 OS)
              </button>
            </>
          )}
          {activeModel === "gemma-4-vision" && (
            <>
              <button type="button" className="gemma-chip" onClick={() => handleSend("Verify Student ID card photo matrix and authenticate student roll 26BCE123.")}>
                👁️ Authenticate Student ID Card
              </button>
              <button type="button" className="gemma-chip" onClick={() => handleSend("How does PaliGemma 4 SigLIP-2 vision model inspect scanned grade cards and doctor certificates?")}>
                📄 Grade Card & Medical OCR
              </button>
            </>
          )}
          {activeModel === "gemma-4-guard" && (
            <>
              <button type="button" className="gemma-chip" onClick={() => handleSend("What are the official Supreme Court Anti-Ragging guidelines and NITH Proctor helpline?")}>
                🛡️ Anti-Ragging Regulations
              </button>
              <button type="button" className="gemma-chip" onClick={() => handleSend("What happens when a student falls below 75% attendance and gets debarred from End-Term exams?")}>
                ⚠️ Debarment Policy Guard
              </button>
            </>
          )}
        </div>

        {/* CHAT MESSAGES SCROLL */}
        <div className="gemma-messages-scroll" ref={chatScrollRef} id="gemmaChatHistory">
          {messages.map(msg => (
            <div key={msg.id} className={`gemma-msg gemma-${msg.sender}`}>
              <div className="gemma-msg-avatar">
                <span className="material-symbols-outlined">
                  {msg.sender === 'assistant' ? 'auto_awesome' : 'person'}
                </span>
              </div>
              <div className="gemma-msg-bubble-wrap">
                {msg.sender === 'assistant' && (
                  <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "2px" }}>
                    <span className="gemma-msg-tag">{msg.modelTag || "Gemma 4"}</span>
                    {msg.providerTag && (
                      <span style={{ fontSize: "0.65rem", background: "#e2e8f0", padding: "1px 6px", borderRadius: "3px", color: "#475569" }}>
                        {msg.providerTag}
                      </span>
                    )}
                  </div>
                )}
                <div
                  className="gemma-msg-bubble"
                  dangerouslySetInnerHTML={{ __html: msg.text }}
                />
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="gemma-msg gemma-assistant" id="gemmaTypingMsg">
              <div className="gemma-msg-avatar">
                <span className="material-symbols-outlined">auto_awesome</span>
              </div>
              <div className="gemma-msg-bubble">
                <p><em>Inference running on {currentMeta.modelTag} via {activeProvider.toUpperCase()} ({currentMeta.parameters})...</em></p>
              </div>
            </div>
          )}
        </div>

        {/* CHAT INPUT BAR */}
        <form
          className="gemma-input-bar"
          id="gemmaChatForm"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <input
            type="text"
            id="gemmaPromptInput"
            placeholder={`Ask ${currentMeta.modelTag} (${activeProvider}): e.g. Attendance CS-301? or Dijkstra in C++...`}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            autoComplete="off"
          />
          <button type="submit" className="gemma-send-btn" id="gemmaSendBtn" disabled={isLoading}>
            <span className="material-symbols-outlined">send</span>
          </button>
        </form>

      </div>
    </div>
  );
}
