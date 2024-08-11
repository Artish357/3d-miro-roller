export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function generateRandomId() {
  return Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
}
