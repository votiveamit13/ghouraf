
export function getSession() {
  const saved = localStorage.getItem("anon_session");

  if (saved) {
    const { sessionId, expiresAt } = JSON.parse(saved);
    if (Date.now() < expiresAt) return sessionId;
  }

  const newSessionId = crypto.randomUUID();
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000;

  const data = { sessionId: newSessionId, expiresAt };
  localStorage.setItem("anon_session", JSON.stringify(data));

  return newSessionId;
}
