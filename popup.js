async function getAllTabs() {
  // Query all tabs across all windows
  const tabs = await chrome.tabs.query({});
  return tabs.filter(t => !!t.url);
}

function applyFilters(tabs, { windowScope, domain, domainMode, regex, regexMode }) {
  let list = [...tabs];
  // window filter
  if (windowScope && windowScope !== 'all') {
    const currentWindowId = tabs.find(t => t.active)?.windowId;
    if (currentWindowId != null) {
      list = list.filter(t => windowScope === 'current' ? t.windowId === currentWindowId : t.windowId !== currentWindowId);
    }
  }
  // domain filter (substring or host match)
  if (domain && domain.trim()) {
    const needle = domain.trim().toLowerCase();
    const matched = (t) => {
      try {
        const u = new URL(t.url);
        return u.hostname.toLowerCase().includes(needle);
      } catch { return false; }
    };
    list = list.filter(t => domainMode === 'exclude' ? !matched(t) : matched(t));
  }
  // regex filter
  if (regex && regex.trim()) {
    try {
      const re = new RegExp(regex.trim());
      list = list.filter(t => regexMode === 'exclude' ? !re.test(t.url) : re.test(t.url));
    } catch {
      // invalid regex: show nothing to signal issue
      list = [];
    }
  }
  return list.map(t => t.url);
}

async function populate() {
  const textarea = document.getElementById('urls');
  try {
    const tabs = await getAllTabs();
    const filters = readFilters();
    const urls = applyFilters(tabs, filters);
    textarea.value = urls.join('\n');
  } catch (e) {
    textarea.value = `Error: ${e?.message || e}`;
  }
}

async function copyAll() {
  const textarea = document.getElementById('urls');
  try {
    await navigator.clipboard.writeText(textarea.value);
    const btn = document.getElementById('copy');
    const prev = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => (btn.textContent = prev), 1200);
  } catch (e) {
    alert('Copy failed: ' + (e?.message || e));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  populate();
  document.getElementById('copy').addEventListener('click', copyAll);
  document.getElementById('apply').addEventListener('click', () => populate());
  document.getElementById('clear').addEventListener('click', () => {
    document.getElementById('window').value = 'all';
    document.getElementById('domain').value = '';
    document.getElementById('regex').value = '';
    populate();
  });
});

function readFilters() {
  return {
    windowScope: document.getElementById('window').value,
    domain: document.getElementById('domain').value,
    domainMode: document.getElementById('domainMode').value,
    regex: document.getElementById('regex').value,
    regexMode: document.getElementById('regexMode').value,
  };
}
