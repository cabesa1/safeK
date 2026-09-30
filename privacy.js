(() => {
  const key = 'safek_privacy_notice';
  const banner = document.querySelector('#privacy-notice');
  if (!banner) return;
  const remembered = document.cookie.split(';').some(c => c.trim() === key + '=remember');
  let dismissed = false;
  try { dismissed = sessionStorage.getItem(key) === 'dismissed'; } catch {}
  banner.hidden = remembered || dismissed;
  const save = remember => {
    document.cookie = `${key}=${remember ? 'remember' : ''}; Max-Age=${remember ? 15552000 : 0}; Path=/; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
    try { sessionStorage.setItem(key, 'dismissed'); } catch {}
    banner.hidden = true;
  };
  banner.querySelector('[data-privacy-remember]').addEventListener('click', () => save(true));
  banner.querySelector('[data-privacy-dismiss]').addEventListener('click', () => save(false));
  document.querySelectorAll('[data-privacy-open]').forEach(button => button.addEventListener('click', () => {
    banner.hidden = false;
    banner.querySelector('[data-privacy-dismiss]').focus();
  }));
})();
