const PREFIX = "exampilot_";

const storageService = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(`${PREFIX}${key}`);
      return raw == null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try { localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value)); return true; }
    catch { return false; }
  },
  remove(key) {
    try { localStorage.removeItem(`${PREFIX}${key}`); } catch { /* storage may be blocked */ }
  },
  clear() {
    try {
      Object.keys(localStorage).filter((key) => key.startsWith(PREFIX)).forEach((key) => localStorage.removeItem(key));
    } catch { /* storage may be blocked */ }
  },
};

export default storageService;
export { storageService };
