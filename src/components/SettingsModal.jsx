import { useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Settings, CheckCircle2 } from 'lucide-react';

export default function SettingsModal({ open, onClose, user, settings, onSave, onClear, onThemeToggle }) {
  const modalRef = useRef(null);
  const [form, setForm] = useState({
    name: user.name || '',
    age: user.age || '',
    animations: settings.animations,
    theme: settings.theme,
  });

  useEffect(() => {
    if (!open) return;
    setForm({ name: user.name || '', age: user.age || '', animations: settings.animations, theme: settings.theme });
    const panel = modalRef.current?.querySelector('.glass-panel');
    modalRef.current.classList.remove('opacity-0');
    panel?.classList.remove('scale-95');
    return () => {
      modalRef.current.classList.add('opacity-0');
      panel?.classList.add('scale-95');
    };
  }, [open, user, settings]);

  const closeModal = () => {
    const panel = modalRef.current?.querySelector('.glass-panel');
    modalRef.current.classList.add('opacity-0');
    panel?.classList.add('scale-95');
    setTimeout(() => onClose(), 300);
  };

  const themeIsDark = form.theme === 'dark';

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 dark:bg-black/75 backdrop-blur-sm"
          />
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-panel w-full max-w-md rounded-2xl border border-black/5 dark:border-white/10 p-6 lg:p-8 relative shadow-2xl bg-white dark:bg-black"
          >
            <button
              id="close-settings"
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors hover:scale-110 active:scale-95"
              onClick={closeModal}
            >
              <X className="text-xl" />
            </button>
            <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
              <Settings className="text-lg" /> SETTINGS
            </h2>

            <div className="space-y-5">
              <div>
                <label className="text-[9px] font-extrabold text-slate-400 dark:text-white/30 uppercase tracking-widest block mb-1.5">Identity</label>
                <div className="flex gap-2">
                  <input
                    id="set-name"
                    type="text"
                    className="glass-input w-2/3 p-3 rounded-xl font-bold text-xs"
                    placeholder="Name"
                    value={form.name}
                    onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <input
                    id="set-age"
                    type="number"
                    className="glass-input w-1/3 p-3 rounded-xl font-bold text-xs"
                    placeholder="Age"
                    value={form.age}
                    onChange={e => setForm(prev => ({ ...prev, age: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-extrabold text-slate-400 dark:text-white/30 uppercase tracking-widest block mb-1.5">Preferences</label>
                <label className="flex items-center justify-between p-3 glass-input rounded-xl cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors mb-2 hover:scale-[1.01] active:scale-95 transition-transform">
                  <span className="font-bold text-xs">Dark Theme</span>
                  <input
                    id="toggle-theme"
                    type="checkbox"
                    checked={themeIsDark}
                    onChange={() => setForm(prev => ({ ...prev, theme: themeIsDark ? 'light' : 'dark' }))}
                    className="w-4.5 h-4.5 accent-slate-900 dark:accent-white"
                  />
                </label>
                <label className="flex items-center justify-between p-3 glass-input rounded-xl cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors hover:scale-[1.01] active:scale-95 transition-transform">
                  <span className="font-bold text-xs">Enable Particle Animations</span>
                  <input
                    id="toggle-anim"
                    type="checkbox"
                    checked={form.animations}
                    onChange={e => setForm(prev => ({ ...prev, animations: e.target.checked }))}
                    className="w-4.5 h-4.5 accent-slate-900 dark:accent-white"
                  />
                </label>
              </div>

              <div className="pt-4 border-t border-black/5 dark:border-white/5">
                <button
                  id="clear-history-btn"
                  className="w-full bg-red-500/10 hover:bg-red-500/20 dark:bg-red-500/20 dark:hover:bg-red-500/30 text-red-600 dark:text-red-400 border border-red-500/10 font-bold text-xs py-3 rounded-xl transition-colors hover:scale-105 active:scale-95"
                  onClick={onClear}
                >
                  CLEAR CHAT LOGS
                </button>
              </div>
            </div>

            <button
              id="save-settings"
              className="w-full mt-6 bg-slate-900 text-white dark:bg-white dark:text-black font-extrabold py-3.5 rounded-xl hover:scale-[1.01] active:scale-95 transition-transform shadow-md"
              onClick={() => onSave(form)}
            >
              SAVE CONFIG
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
