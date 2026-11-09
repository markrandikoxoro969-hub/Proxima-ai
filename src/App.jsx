import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Globe, Sparkles, Moon, Sun, List, X, Send } from 'lucide-react';

import BackgroundCanvas from './components/BackgroundCanvas';
import Onboarding from './components/Onboarding';
import Sidebar from './components/Sidebar';
import ChatContainer from './components/ChatContainer';
import InputArea from './components/InputArea';
import SettingsModal from './components/SettingsModal';
import ToastContainer from './components/Toast';

import { loadState, saveState, STORAGE_KEY } from './hooks/useLocalStorage';
import { getPersonalityOverride, cleanIdentityLeaks, fetchGeminiChatResponse, API_BASE } from './hooks/useChat';

const LOGO_TEXT = "Proxima";

export default function App() {
  // -------------------------------------------------
  // 1. STATE
  // -------------------------------------------------
  const [state, setState] = useState({
    user: { name: '', age: '' },
    settings: { animations: true, theme: 'dark' },
    sessions: {},
    currentSessionId: null,
  });

  const [step, setStep] = useState('logo'); // logo | welcome | name | age | loading | done
  const [typing, setTyping] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // onboarding sub-state
  const [loadingText, setLoadingText] = useState('Preparing Proxima...');
  const [loadingBarWidth, setLoadingBarWidth] = useState('0%');

  // streaming state
  const [streamingMsgId, setStreamingMsgId] = useState(null);
  const [streamingText, setStreamingText] = useState('');
  const [sending, setSending] = useState(false);

  // refs
  const stateRef = useRef(state);
  const typingIntervalRef = useRef(null);
  const streamIntervalRef = useRef(null);
  const chatContainerRef = useRef(null);
  const loadTextIntRef = useRef(null);

  useEffect(() => { stateRef.current = state; }, [state]);

  // -------------------------------------------------
  // 2. THEME & INIT
  // -------------------------------------------------
  useEffect(() => {
    const html = document.documentElement;
    if (state.settings.theme === 'dark') html.classList.add('dark');
    else html.classList.remove('dark');
  }, [state.settings.theme]);

  useEffect(() => {
    const stored = loadState();
    if (stored) {
      setState(prev => ({
        ...prev,
        ...stored,
        settings: { ...prev.settings, ...stored.settings },
        sessions: stored.sessions || {},
      }));
    }
    if (!state.settings.theme) {
      setState(prev => ({ ...prev, settings: { ...prev.settings, theme: 'dark' } }));
    }
    setIsInitialized(true);
  }, []);

  // start onboarding once initialized
  useEffect(() => {
    if (!isInitialized) return;
    if (!state.user.name || !state.user.age) {
      startLogoTyping();
    } else {
      setStep('done');
    }
  }, [isInitialized]);

  // -------------------------------------------------
  // 3. ONBOARDING
  // -------------------------------------------------
  function startLogoTyping() {
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    let i = 0;
    const interval = setInterval(() => {
      setTyping(LOGO_TEXT.slice(0, i + 1));
      i++;
      if (i >= LOGO_TEXT.length) {
        clearInterval(interval);
        typingIntervalRef.current = null;
        setTimeout(() => setStep('welcome'), 800);
      }
    }, 90);
    typingIntervalRef.current = interval;
  }

  function handleNameSubmit(name) {
    if (!name.trim()) return showToast("Please enter your name", "error");
    setState(prev => ({ ...prev, user: { ...prev.user, name: name.trim() } }));
    setStep('age');
  }

  function handleAgeSubmit(age) {
    if (!age || age < 1) return showToast("Please enter a valid age", "error");
    setState(prev => ({ ...prev, user: { ...prev.user, age } }));
    saveStateFromRef();
    setStep('loading');
    startLoadingSequence();
  }

  function startLoadingSequence() {
    const texts = ["Syncing Core System...", "Initializing Brain...", "Securing Data Gateways...", "System Ready."];
    let ti = 0;
    setLoadingBarWidth('100%');
    loadTextIntRef.current = setInterval(() => {
      if (ti < texts.length) { setLoadingText(texts[ti]); ti++; }
    }, 700);

    setTimeout(() => {
      clearInterval(loadTextIntRef.current);
      setTimeout(() => {
        setStep('done');
        ensureSession();
        updateUIFromState();
      }, 1000);
    }, 3000);
  }

  // -------------------------------------------------
  // 4. SESSION MANAGEMENT
  // -------------------------------------------------
  function ensureSession() {
    setState(prev => {
      const hasSessions = Object.keys(prev.sessions).length > 0;
      if (hasSessions && prev.currentSessionId && prev.sessions[prev.currentSessionId]) return prev;
      const newId = 'session_' + Date.now();
      return {
        ...prev,
        sessions: { ...prev.sessions, [newId]: { id: newId, title: "New Chat Session", history: [] } },
        currentSessionId: newId,
      };
    });
    saveStateFromRef();
  }

  function createNewSession() {
    const newId = 'session_' + Date.now();
    setState(prev => ({
      ...prev,
      sessions: { ...prev.sessions, [newId]: { id: newId, title: "New Chat Session", history: [] } },
      currentSessionId: newId,
    }));
    saveStateFromRef();
    return newId;
  }

  function switchSession(sessionId) {
    if (!state.sessions[sessionId]) return;
    setState(prev => ({ ...prev, currentSessionId: sessionId }));
    saveStateFromRef();
    setSidebarOpen(false);
    showToast("Switched active session", "success");
  }

  function deleteSession(sessionId) {
    if (Object.keys(state.sessions).length <= 1) {
      showToast("Cannot delete the only remaining session.", "error");
      return;
    }
    setState(prev => {
      const { [sessionId]: removed, ...rest } = prev.sessions;
      let current = prev.currentSessionId;
      if (current === sessionId) current = Object.keys(rest)[0];
      return { ...prev, sessions: rest, currentSessionId: current };
    });
    saveStateFromRef();
    showToast("Session deleted", "info");
  }

  function saveStateFromRef() {
    saveState(stateRef.current);
  }

  function updateUIFromState() {
    const currentSession = state.sessions[state.currentSessionId];
    const msgCount = currentSession ? currentSession.history.filter(m => m.role === 'user').length : 0;
    // stats are read directly from state by Sidebar via props
    // (kept here for parity with original updateUIWithState)
    if (state.user.name) {
      // name & avatar are rendered from state directly
    }
  }

  // -------------------------------------------------
  // 5. CHAT ENGINE
  // -------------------------------------------------
  function handleSend(text) {
    if (!text.trim()) return;
    setStreamingMsgId('msg-' + Date.now());
    setStreamingText('');

    setState(prev => {
      const session = prev.sessions[prev.currentSessionId];
      if (!session) return prev;
      if (session.history.length === 0) {
        session.title = text.length > 25 ? text.substring(0, 25) + "..." : text;
      }
      session.history.push({ role: 'user', content: text, timestamp: new Date().toISOString() });
      return prev;
    });
    saveStateFromRef();

    const override = getPersonalityOverride(text);
    const currentSession = state.sessions[state.currentSessionId];
    if (!currentSession) return;

    if (override) {
      const id = 'msg-' + Date.now();
      setStreamingMsgId(id);
      setTimeout(() => streamResponse(id, override), 400);
      return;
    }

    setSending(true);
    const startTime = Date.now();
    fetchGeminiChatResponse(text, state.currentSessionId)
      .then(reply => {
        const latencyEl = document.getElementById('latency-display');
        if (latencyEl) latencyEl.textContent = `${Date.now() - startTime}ms`;
        streamResponse('msg-' + Date.now(), reply);
      })
      .catch(error => {
        console.error("Engine Error:", error);
        streamResponse('msg-' + Date.now(), `**[CONNECTION RECOVERY ERROR]**\nUnable to establish stable handshake protocols with the core servers. Please verify your system link configuration.`);
        showToast("Connection Fail", "error");
      })
      .finally(() => setSending(false));
  }

  // NOTE: handleSend above pushes user message directly into state session to keep
  // history and streaming bubble consistent. appendUserMessage is kept for parity.

  function streamResponse(elementId, fullText) {
    setStreamingMsgId(elementId);
    setStreamingText('');
    let i = 0;
    const chunkSize = Math.max(1, Math.floor(fullText.length / 45));
    if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    streamIntervalRef.current = setInterval(() => {
      i += chunkSize;
      if (i >= fullText.length) {
        i = fullText.length;
        clearInterval(streamIntervalRef.current);
        finalizeResponse(elementId, fullText);
      } else {
        setStreamingText(fullText.slice(0, i));
        scrollToBottom();
      }
    }, 10);
  }

  function finalizeResponse(elementId, fullText) {
    setState(prev => {
      const session = prev.sessions[prev.currentSessionId];
      if (session) {
        session.history.push({ role: 'ai', content: fullText, timestamp: new Date().toISOString() });
      }
      return prev;
    });
    saveStateFromRef();
    setStreamingMsgId(null);
    setStreamingText('');
    scrollToBottom();
  }

  // -------------------------------------------------
  // 6. UI ACTIONS
  // -------------------------------------------------
  function toggleTheme() {
    setState(prev => {
      const newTheme = prev.settings.theme === 'dark' ? 'light' : 'dark';
      return { ...prev, settings: { ...prev.settings, theme: newTheme } };
    });
    saveStateFromRef();
  }

  function toggleSidebar() { setSidebarOpen(prev => !prev); }

  function showToast(message, type = 'info') {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }

  function exportSession() {
    const history = state.sessions[state.currentSessionId]?.history || [];
    const dl = document.createElement('a');
    dl.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history));
    dl.download = `proxima_export_${Date.now()}.json`;
    dl.click();
    showToast("Session exported successfully!", "success");
  }

  function clearAllHistory() {
    if (window.confirm("Are you sure you want to completely erase all conversation histories?")) {
      localStorage.clear();
      window.location.reload();
    }
  }

  // settings
  function saveSettings(form) {
    setState(prev => ({
      ...prev,
      user: { ...prev.user, name: form.name || prev.user.name, age: form.age || prev.user.age },
      settings: { ...prev.settings, animations: form.animations, theme: form.theme },
    }));
    saveStateFromRef();
    setModalOpen(false);
    showToast("Preferences updated", "success");
  }

  // -------------------------------------------------
  // 7. SCROLL
  // -------------------------------------------------
  function scrollToBottom() {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
    }
  }

  useEffect(() => {
    scrollToBottom();
  }, [streamingMsgId, streamingText, state.sessions]);

  // -------------------------------------------------
  // 8. RENDER
  // -------------------------------------------------
  const currentSession = state.sessions[state.currentSessionId];
  const msgCount = currentSession ? currentSession.history.filter(m => m.role === 'user').length : 0;
  const userInitial = state.user.name ? state.user.name.charAt(0).toUpperCase() : 'U';

  if (step !== 'done') {
    return (
      <>
        <BackgroundCanvas />
        <div className="bg-gradient-glow" />
        <Onboarding
          step={step}
          typing={typing}
          loadingText={loadingText}
          loadingBarWidth={loadingBarWidth}
          user={state.user}
          onNameSubmit={handleNameSubmit}
          onAgeSubmit={handleAgeSubmit}
        />
      </>
    );
  }

  return (
    <>
      <BackgroundCanvas />
      <div className="bg-gradient-glow" />

      {/* App shell */}
      <div id="app" className="relative z-10 w-full h-[100dvh] flex overflow-hidden">

        {/* Sidebar */}
        <Sidebar
          open={sidebarOpen}
          onToggle={toggleSidebar}
          sessions={state.sessions}
          currentSessionId={state.currentSessionId}
          user={state.user}
          msgCount={msgCount}
          onNewChat={createNewSession}
          onSwitch={switchSession}
          onDelete={deleteSession}
          onThemeToggle={toggleTheme}
          onSettings={() => { setModalOpen(true); toggleSidebar(); }}
          onExport={exportSession}
        />

        {/* Main workspace */}
        <main id="main-content" className="flex-1 flex flex-col w-full h-[100dvh] relative z-30">
          <header className="h-16 lg:h-20 flex items-center justify-between px-4 lg:px-8 bg-gradient-to-b from-slate-50/90 dark:from-black/80 to-transparent backdrop-blur-md absolute top-0 w-full z-20">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl bg-slate-900/5 dark:bg-white/5 border border-black/5 dark:border-white/5 backdrop-blur-md transition-all hover:scale-105 active:scale-95"
                onClick={toggleSidebar}
                title="Open Menu"
              >
                <List className="text-lg" />
              </button>
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-wide flex items-center gap-1.5">
                  Proxima <Globe className="text-blue-500 dark:text-white text-glow text-xs" />
                </span>
                <span className="text-[9px] font-extrabold text-slate-400 dark:text-white/30 uppercase tracking-widest hidden sm:block">
                  V2.81 CORE // <span id="latency-display">42ms</span>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="p-2 lg:px-4 lg:py-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-900/5 hover:bg-slate-900/10 dark:bg-white/5 dark:hover:bg-white/10 border border-black/5 dark:border-white/5 rounded-xl font-bold text-xs transition-all hover:scale-105 active:scale-95 backdrop-blur-md flex items-center gap-1.5"
                onClick={exportSession}
              >
                <Send className="text-sm" /> <span className="hidden lg:inline">EXPORT</span>
              </button>
            </div>
          </header>

          <ChatContainer
            ref={chatContainerRef}
            sessions={state.sessions}
            currentSessionId={state.currentSessionId}
            user={state.user}
            streamingMsgId={streamingMsgId}
            streamingText={streamingText}
          />

          <InputArea
            disabled={sending}
            onSend={handleSend}
          />
        </main>

        <SettingsModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          user={state.user}
          settings={state.settings}
          onSave={saveSettings}
          onClear={clearAllHistory}
          onThemeToggle={toggleTheme}
        />

        <ToastContainer toasts={toasts} />
      </div>
    </>
  );
}
