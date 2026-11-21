// Small Spanish text helpers.

export const capitalize = text => text.charAt(0).toUpperCase() + text.slice(1);
export const lowercaseFirst = text => text.charAt(0).toLowerCase() + text.slice(1);

/** "el río" -> "del río", "la casa" -> "de la casa". */
export const withDe = name => (name.startsWith("el ") ? "del " + name.slice(3) : "de " + name);

/** "el río" -> "río". */
export const withoutArticle = name => name.replace(/^(el|la|los|las) /, "");

/** Fills {placeholders} in a template. */
export const format = (template, values = {}) =>
  template.replace(/\{(\w+)\}/g, (match, key) => (key in values ? String(values[key]) : match));
