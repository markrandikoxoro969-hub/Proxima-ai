import { AnimatePresence, motion } from 'framer-motion';

const ICONS = {
  error: 'ph-fill ph-warning-circle text-red-500',
  success: 'ph-fill ph-check-circle text-emerald-500',
  info: 'ph-fill ph-info text-blue-500',
};

export default function ToastContainer({ toasts }) {
  return (
    <div id="toast-container" className="fixed top-20 right-4 lg:right-8 z-[110] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, transition: { duration: 0.4 } }}
            className="glass-panel rounded-xl px-4 py-3 flex items-center gap-3 shadow-lg toast-enter bg-white/95 dark:bg-black/95 pointer-events-auto border border-black/5 dark:border-white/5"
          >
            <i className={ICONS[toast.type] || ICONS.info} />
            <span className="font-bold text-xs text-slate-800 dark:text-white">{toast.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
