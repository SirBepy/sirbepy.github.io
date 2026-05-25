import { store } from "../state/store.js";

const DICT = {
  continue: { game: "Continue", plain: "About Me" },
  loadSave: { game: "Load Save", plain: "Projects" },
  credits: { game: "Credits", plain: "Contact" },
  settings: { game: "Settings", plain: "Settings" },
  back: { game: "← Back", plain: "← Back" },
  loadSaveHeading: { game: "Saved Games", plain: "Projects" },
  creditsHeading: { game: "End Credits", plain: "Contact" },
  bioHeading: { game: "Player Profile", plain: "About Me" },
  settingsHeading: { game: "Game Settings", plain: "Settings" },
  lingoLabel: { game: "Game Speak", plain: "Plain English" },
  musicLabel: { game: "Background Music", plain: "Background Music" },
};

export const getLabel = (key) => {
  const entry = DICT[key];
  if (!entry) throw new Error(`No lingo entry '${key}'`);
  return entry[store.get().lingo];
};

export const onLingoChange = (fn) => {
  return store.subscribe((s, p) => {
    if (s.lingo !== p.lingo) fn(s.lingo);
  });
};
