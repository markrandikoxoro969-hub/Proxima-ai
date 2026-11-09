import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Globe } from 'lucide-react';

export default function Onboarding({
  step,
  typing,
  loadingText,
  loadingBarWidth,
  user,
  onNameSubmit,
  onAgeSubmit,
}) {
  const inputNameRef = useRef(null);
  const inputAgeRef = useRef(null);

  // scene exit variants for AnimatePresence
  const sceneVariants = {
    hidden: { opacity: 0, pointerEvents: 'none' },
    visible: { opacity: 1, pointerEvents: 'auto' },
  };

  return (
    <div id="onboarding" className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50 dark:bg-black transition-opacity duration-1000">
      <AnimatePresence mode="wait">
        {step === 'logo' && (
          <motion.div
            id="scene-logo"
            key="logo"
            initial={false}
            animate={sceneVariants.visible}
            exit={sceneVariants.hidden}
            className="flex flex-col items-center justify-center absolute inset-0"
          >
            <div className="relative w-32 h-32 flex items-center justify-center mb-6">
              <div className="absolute inset-0 rounded-full border border-black/10 dark:border-white/10 animate-[spin_6s_linear_infinite]" />
              <div className="absolute inset-2 rounded-full border border-t-black dark:border-t-white border-transparent animate-[spin_3s_linear_infinite_reverse]" />
              <Globe className="text-5xl text-gray-900 dark:text-white text-glow-strong animate-pulse" />
            </div>
            <div className="h-8">
              <span id="logo-typing" className="font-extrabold text-2xl tracking-[0.3em] text-glow">{typing}</span>
              <span className="animate-pulse">_</span>
            </div>
          </motion.div>
        )}

        {step === 'welcome' && (
          <motion.div
            id="scene-welcome"
            key="welcome"
            initial={sceneVariants.hidden}
            animate={sceneVariants.visible}
            exit={sceneVariants.hidden}
            className="hidden flex flex-col items-center justify-center w-full max-w-md px-6 absolute inset-0"
          >
            <h1 className="text-5xl md:text-6xl font-black mb-2 text-center text-glow-strong uppercase tracking-tighter">PROXIMA</h1>
            <p className="text-slate-400 dark:text-white/30 font-bold mb-12 tracking-widest uppercase text-[10px]">
              V2.81 Core API BY SUJAN SHRESTHA
            </p>

            <div id="step-name" className="w-full flex flex-col">
              <label className="text-lg font-bold mb-4 text-center text-slate-600 dark:text-slate-300">
                What should we call you?
              </label>
              <input
                id="input-name"
                ref={inputNameRef}
                type="text"
                className="glass-input w-full p-4 rounded-2xl text-center text-xl font-bold mb-6 placeholder:text-gray-400 dark:placeholder:text-white/10"
                placeholder="ENTER NAME"
                autoComplete="off"
                maxLength="20"
                onKeyPress={e => e.key === 'Enter' && onNameSubmit(inputNameRef.current.value)}
              />
              <button
                id="btn-name"
                className="w-full bg-slate-900 text-white dark:bg-white dark:text-black font-extrabold py-4 rounded-2xl hover:scale-[1.01] active:scale-95 transition-all shadow-glow"
                onClick={() => onNameSubmit(inputNameRef.current.value)}
              >
                CONTINUE
              </button>
            </div>
          </motion.div>
        )}

        {step === 'age' && (
          <motion.div
            id="scene-welcome"
            key="age"
            initial={sceneVariants.hidden}
            animate={sceneVariants.visible}
            exit={sceneVariants.hidden}
            className="hidden flex flex-col items-center justify-center w-full max-w-md px-6 absolute inset-0"
          >
            <h1 className="text-5xl md:text-6xl font-black mb-2 text-center text-glow-strong uppercase tracking-tighter">PROXIMA</h1>
            <p className="text-slate-400 dark:text-white/30 font-bold mb-12 tracking-widest uppercase text-[10px]">
              V2.81 Core API BY SUJAN SHRESTHA
            </p>

            <div id="step-age" className="w-full flex flex-col">
              <label className="text-lg font-bold mb-4 text-center text-slate-600 dark:text-slate-300">
                How old are you?
              </label>
              <input
                id="input-age"
                ref={inputAgeRef}
                type="number"
                className="glass-input w-full p-4 rounded-2xl text-center text-xl font-bold mb-6 placeholder:text-gray-400 dark:placeholder:text-white/10"
                placeholder="ENTER AGE"
                min="1"
                max="120"
                onKeyPress={e => e.key === 'Enter' && onAgeSubmit(inputAgeRef.current.value)}
              />
              <button
                id="btn-age"
                className="w-full bg-slate-900 text-white dark:bg-white dark:text-black font-extrabold py-4 rounded-2xl hover:scale-[1.01] active:scale-95 transition-all shadow-glow"
                onClick={() => onAgeSubmit(inputAgeRef.current.value)}
              >
                INITIALIZE
              </button>
            </div>
          </motion.div>
        )}

        {step === 'loading' && (
          <motion.div
            id="scene-loading"
            key="loading"
            initial={sceneVariants.hidden}
            animate={sceneVariants.visible}
            exit={sceneVariants.hidden}
            className="hidden flex flex-col items-center justify-center absolute inset-0"
          >
            <div className="w-12 h-12 border-2 border-black/5 border-t-black dark:border-white/5 dark:border-t-white rounded-full animate-spin mb-8" />
            <div id="loading-text" className="text-sm font-bold tracking-widest uppercase text-glow text-slate-500 dark:text-white/70">
              {loadingText}
            </div>
            <div className="w-60 h-[3px] bg-black/5 dark:bg-white/5 rounded-full mt-6 overflow-hidden">
              <div
                id="loading-bar"
                className="h-full bg-slate-900 dark:bg-white w-[0] transition-all duration-[3000ms] ease-out"
                style={{ width: loadingBarWidth }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
