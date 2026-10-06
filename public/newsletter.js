document.addEventListener("submit", async (event) => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement) || !form.matches("[data-newsletter-form]")) return;
  event.preventDefault();
  if (form.dataset.busy === "true") return;

  const button = form.querySelector('button[type="submit"]');
  const status = form.closest("footer").querySelector("[data-newsletter-status]");
  const email = form.elements.namedItem("email");
  const originalLabel = button.textContent;
  form.dataset.busy = "true";
  form.setAttribute("aria-busy", "true");
  button.disabled = true;
  button.textContent = "Sending…";
  status.textContent = "";
  email.removeAttribute("aria-invalid");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(form.action, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new URLSearchParams(new FormData(form)),
      signal: controller.signal,
    });
    const data = await response.json();
    if (!response.ok) {
      if (response.status === 400) email.setAttribute("aria-invalid", "true");
      throw new Error(typeof data.message === "string" ? data.message : "Could not subscribe. Please try again.");
    }
    status.textContent = data.message || "Check your inbox to confirm your subscription.";
    status.dataset.state = "success";
    form.reset();
  } catch (error) {
    status.textContent = error.name === "AbortError"
      ? "The request timed out. Please try again."
      : error instanceof TypeError || error instanceof SyntaxError
        ? "Could not subscribe. Please try again later."
        : error.message || "Could not subscribe. Please try again.";
    status.dataset.state = "error";
  } finally {
    clearTimeout(timeout);
    button.textContent = originalLabel;
    button.disabled = false;
    form.removeAttribute("aria-busy");
    delete form.dataset.busy;
  }
});
