import { motion } from 'framer-motion';
import { Code, Brain } from 'lucide-react';

const ICONS = { code: Code, brain: Brain };

export default function PromptBtn({ label, icon }) {
  const Icon = ICONS[icon] || Code;
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="prompt-btn glass-panel p-4 rounded-xl text-left hover:bg-slate-900/5 dark:hover:bg-white/5 transition-all group border border-black/5 dark:border-white/5"
    >
      <Icon className="text-xl mb-2 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
      <div className="font-bold text-xs text-slate-800 dark:text-white">{label}</div>
    </motion.button>
  );
}
