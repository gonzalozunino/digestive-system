// Scales the fixed-size stage to fit the window. Overlay sizes use `em`, so they scale with the font size.
import { VIEW } from "../data/config.js";

const BASE_FONT_SIZE = 16;

export function fitStageToWindow(stage) {
  const fit = () => {
    const scale = Math.min(window.innerWidth / VIEW.width, window.innerHeight / VIEW.height);
    stage.style.width = `${VIEW.width * scale}px`;
    stage.style.height = `${VIEW.height * scale}px`;
    stage.style.fontSize = `${BASE_FONT_SIZE * scale}px`;
    stage.classList.toggle("stage--compact", scale < 0.7);
  };
  window.addEventListener("resize", fit);
  fit();
}
