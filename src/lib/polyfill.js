window.requestAnimationFrame = window.requestAnimationFrame || (fn => setTimeout(fn, 1000 / 60));
window.cancelAnimationFrame = window.cancelAnimationFrame || clearTimeout;
