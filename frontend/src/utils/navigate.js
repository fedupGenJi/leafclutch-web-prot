// There is no router in this project (see hooks/useCurrentPath.js) — every
// component reads the path from window.location through that hook, which
// re-renders on 'popstate'. These two helpers are the write side of that: they
// change the URL with the History API and then dispatch a synthetic
// 'popstate' event so useCurrentPath (and anything else listening) picks up
// the change immediately, without a full page reload.

export function navigate(path, { replace = false } = {}) {
  if (typeof window === 'undefined') return;
  if (window.location.pathname === path) return;

  if (replace) {
    window.history.replaceState({}, '', path);
  } else {
    window.history.pushState({}, '', path);
  }
  window.dispatchEvent(new PopStateEvent('popstate'));
}

// Convenience wrapper for click handlers on <a href="..."> tags: keeps the
// real href (right-click / open-in-new-tab / no-JS still work) while making a
// plain left-click navigate client-side instead of reloading the page.
export function navigateOnClick(path, options) {
  return (e) => {
    if (e.defaultPrevented || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(path, options);
  };
}
