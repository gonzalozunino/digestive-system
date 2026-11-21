// DOM helpers for the views.

export function byId(id) {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing element #${id} in index.html`);
  return element;
}

export function focusSoon(element) {
  setTimeout(() => element.focus(), 50);
}
