const STORAGE_KEY = "portfolioSettings";

const defaultState = {
  view: "main",            // 'main' | 'bio' | 'projects' | 'credits' | 'settings'
  lingo: "game",           // 'game' | 'plain'
  music: false,            // bool
  settingsOpen: false,     // bool (independent of view, settings can be sub-modal)
};

const readPersisted = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    const pick = {};
    if (parsed.lingo === "game" || parsed.lingo === "plain") pick.lingo = parsed.lingo;
    if (typeof parsed.music === "boolean") pick.music = parsed.music;
    return pick;
  } catch {
    return {};
  }
};

const writePersisted = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ lingo: state.lingo, music: state.music }));
  } catch {
    // ignore
  }
};

const subscribers = new Set();
let state = { ...defaultState, ...readPersisted() };

export const store = {
  get: () => state,
  set: (partial) => {
    const prev = state;
    state = { ...state, ...partial };
    if (prev.lingo !== state.lingo || prev.music !== state.music) {
      writePersisted(state);
    }
    subscribers.forEach((fn) => fn(state, prev));
  },
  subscribe: (fn) => {
    subscribers.add(fn);
    return () => subscribers.delete(fn);
  },
  setView: (view) => store.set({ view }),
};
