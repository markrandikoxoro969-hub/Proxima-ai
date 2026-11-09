export const STORAGE_KEY = 'proxima_state_v3';

export function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    // migrate older state versions
    const oldStored = localStorage.getItem('proxima_state_v2') || localStorage.getItem('proxima_state');
    if (oldStored) {
      const oldObj = JSON.parse(oldStored);
      return {
        user: oldObj.user || {},
        settings: oldObj.settings || { animations: true, theme: 'dark' },
        sessions: oldObj.sessions || {},
        currentSessionId: oldObj.currentSessionId || null,
      };
    }
  } catch (e) {
    console.error('Storage load error', e);
  }
  return null;
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Storage write error', e);
  }
}
