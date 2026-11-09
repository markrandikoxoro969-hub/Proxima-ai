import { AnimatePresence, motion } from 'framer-motion';
import {
  Globe, Plus, List, X, Settings, Facebook, Moon, Sun, Trash2, ChevronRight, Circle,
} from 'lucide-react';

export default function Sidebar({
  open,
  onToggle,
  sessions,
  currentSessionId,
  user,
  msgCount,
  onNewChat,
  onSwitch,
  onDelete,
  onThemeToggle,
  onSettings,
  onExport,
}) {
  const themeIsDark = document.documentElement.classList.contains('dark');

  return (
    <>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onToggle}
          className="fixed inset-y-0 left-0 w-[300px] lg:hidden z-[39] bg-black/40 dark:bg-white/10 backdrop-blur-md"
        />
      )}
      <motion.aside
        id="sidebar"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed inset-y-0 left-0 w-[300px] lg:w-[320px] glass-panel border-r-0 border-black/5 dark:border-white/5 flex flex-col z-40 transform lg:translate-x-0 lg:static lg:relative"
      >
        <div className="p-6 pb-4 flex items-center justify-between border-b border-black/5 dark:border-white/5">
          <div className="flex items-center gap-3">
            <Globe className="text-2xl text-gray-900 dark:text-white" />
            <span className="font-extrabold text-lg tracking-wider">Proxima</span>
          </div>
          <button
            id="close-sidebar-btn"
            className="lg:hidden p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors hover:scale-110 active:scale-95"
            onClick={onToggle}
          >
            <X className="text-lg" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 relative">
          <button
            id="new-chat-btn"
            className="w-full flex items-center justify-center gap-2 bg-slate-900/5 dark:bg-white/5 hover:bg-slate-900/10 dark:hover:bg-white/10 font-bold py-3.5 rounded-xl transition-all border border-black/5 dark:border-white/5 mb-4 shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
            onClick={onNewChat}
          >
            <Plus className="text-lg" /> NEW CHAT
          </button>

          <div className="text-[10px] font-extrabold text-slate-400 dark:text-white/20 uppercase tracking-widest px-2 mb-1">
            Recent Sessions
          </div>
          <div id="chat-history-list" className="flex flex-col gap-1.5 max-h-[45vh] overflow-y-auto pr-1">
            <AnimatePresence>
              {Object.values(sessions).map(session => (
                <motion.div
                  key={session.id}
                  layoutId="session"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={`w-full flex items-center justify-between group rounded-xl p-2.5 transition-all text-left cursor-pointer ${session.id === currentSessionId ? 'bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10' : 'hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'}`}
                  onClick={() => onSwitch(session.id)}
                >
                  <div className="flex items-center gap-2 overflow-hidden w-[80%]">
                    <Circle className={`text-sm shrink-0 ${session.id === currentSessionId ? 'text-gray-900 dark:text-white' : 'text-slate-400 dark:text-white/30'}`} />
                    <span className={`font-bold text-xs truncate ${session.id === currentSessionId ? 'text-gray-900 dark:text-white' : 'text-slate-500 dark:text-white/50 group-hover:text-gray-900 dark:group-hover:text-white'}`}>
                      {session.title}
                    </span>
                  </div>
                  <button
                    className="text-slate-400 hover:text-red-500 dark:text-white/20 dark:hover:text-red-400 p-1 rounded transition-colors"
                    onClick={e => { e.stopPropagation(); onDelete(session.id); }}
                  >
                    <Trash2 className="text-xs" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="p-4 border-t border-black/5 dark:border-white/5 flex flex-col gap-1.5">
          <div className="flex justify-between items-center px-2 mb-2 text-[10px] font-extrabold text-slate-400 dark:text-white/30">
            <span>MESSAGES: <span className="text-slate-900 dark:text-white">{msgCount}</span></span>
            <span className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-600 dark:text-white">ENGINE ONLINE</span>
            </span>
          </div>

          <a
            href="https://m.facebook.com/profile.php?id=61583876866265&name=xhp_nt__fb__action__open_user&locale=en_US"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-3 p-3 text-blue-600 dark:text-blue-400 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors font-bold text-sm hover:scale-105 active:scale-95"
          >
            <Facebook className="text-lg" /> DEV FACEBOOK
          </a>

          <button
            id="settings-btn"
            className="w-full flex items-center gap-3 p-3 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors font-bold text-sm hover:scale-105 active:scale-95"
            onClick={onSettings}
          >
            <Settings className="text-lg" /> SETTINGS
          </button>

          <div className="flex items-center justify-between p-3 bg-slate-900/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5 mt-2 hover:scale-105 active:scale-95 transition-transform">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-300 to-slate-500 dark:from-zinc-700 dark:to-zinc-500 flex items-center justify-center font-extrabold text-sm text-white shadow-glow">
                <span className="text-white">{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xs">{user.name ? user.name.toUpperCase() : 'USER'}</span>
                <span className="text-[10px] font-bold text-slate-400 dark:text-white/30">Premium Access</span>
              </div>
            </div>
            <button
              id="quick-theme-toggle"
              className="p-2 text-slate-400 hover:text-slate-950 dark:hover:text-white rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              title="Toggle Theme"
              onClick={onThemeToggle}
            >
              {themeIsDark ? <Sun className="text-lg" /> : <Moon className="text-lg" />}
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
