// Fixed-timestep game loop: logic runs at a constant rate, rendering once per animation frame.

export function startLoop({ update, render, step, maxFrameTime }) {
  let last = performance.now();
  let accumulator = 0;

  function frame(now) {
    accumulator += Math.min(maxFrameTime, (now - last) / 1000);
    last = now;
    while (accumulator >= step) {
      update(step);
      accumulator -= step;
    }
    render();
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}
