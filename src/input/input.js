// Turns keyboard and pointer events into named actions. It does not know the game rules:
// `onAction(action, detail)` decides what to do and returns true when the action was used.
// Actions: "jump", "jumpRelease", "confirm", "pause", "mute", "answer" (detail.index).
import { KEY_BINDINGS } from "../data/controls.js";

function actionsForKey(key, bindings) {
  const actions = [];
  for (const name of ["jump", "confirm", "pause", "mute"]) {
    if (bindings[name].includes(key)) actions.push({ name });
  }
  if (key in bindings.answer) actions.push({ name: "answer", index: bindings.answer[key] });
  return actions;
}

const isTyping = () => ["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName);

export function bindInput({ stage, onAction, onUserGesture, bindings = KEY_BINDINGS }) {
  window.addEventListener("keydown", event => {
    onUserGesture();
    if (isTyping()) return;
    const key = event.key.toLowerCase();
    let used = false;
    for (const { name, index } of actionsForKey(key, bindings)) {
      used = onAction(name, { index, repeat: event.repeat }) || used;
    }
    if (used) event.preventDefault();
  });

  window.addEventListener("keyup", event => {
    if (bindings.jump.includes(event.key.toLowerCase())) onAction("jumpRelease");
  });

  stage.addEventListener("pointerdown", event => {
    onUserGesture();
    if (event.target.closest("button, input, .card")) return;  // taps on UI are not jumps
    event.preventDefault();
    onAction("jump");
  });
  window.addEventListener("pointerup", () => onAction("jumpRelease"));
  window.addEventListener("pointercancel", () => onAction("jumpRelease"));
}
