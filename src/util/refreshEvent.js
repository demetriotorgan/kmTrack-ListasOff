const listeners = new Set();

export function subscribeRefresh(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function triggerRefresh() {
  listeners.forEach((fn) => fn());
}
