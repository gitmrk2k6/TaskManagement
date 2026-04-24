const STORAGE_KEY_USER = 'tm_user';
const STORAGE_KEY_BOARDS = 'tm_boards';

const Storage = {
  getUser() {
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    return raw ? JSON.parse(raw) : null;
  },
  setUser(user) {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  },
  clearUser() {
    localStorage.removeItem(STORAGE_KEY_USER);
  },
  getBoards() {
    const raw = localStorage.getItem(STORAGE_KEY_BOARDS);
    return raw ? JSON.parse(raw) : [];
  },
  setBoards(boards) {
    localStorage.setItem(STORAGE_KEY_BOARDS, JSON.stringify(boards));
  },
};

function requireLogin() {
  if (!Storage.getUser()) {
    window.location.href = 'index.html';
  }
}

function logout() {
  Storage.clearUser();
  window.location.href = 'index.html';
}

function genId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}
