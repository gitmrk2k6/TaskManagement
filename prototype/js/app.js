const STORAGE_KEY_USER = 'tm_user';
const STORAGE_KEY_BOARDS = 'tm_boards';

const BOARD_COLORS = [
  { name: 'blue', value: '#0079bf' },
  { name: 'orange', value: '#d29034' },
  { name: 'green', value: '#519839' },
  { name: 'red', value: '#b04632' },
  { name: 'purple', value: '#89609e' },
  { name: 'pink', value: '#cd5a91' },
  { name: 'lime', value: '#4bbf6b' },
  { name: 'sky', value: '#00aecc' },
];

const LABEL_COLORS = [
  { key: 'green', value: '#61bd4f', label: 'Green' },
  { key: 'yellow', value: '#f2d600', label: 'Yellow' },
  { key: 'orange', value: '#ff9f1a', label: 'Orange' },
  { key: 'red', value: '#eb5a46', label: 'Red' },
  { key: 'purple', value: '#c377e0', label: 'Purple' },
  { key: 'blue', value: '#0079bf', label: 'Blue' },
];

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
    const boards = raw ? JSON.parse(raw) : [];
    return boards.map(migrateBoard);
  },
  setBoards(boards) {
    localStorage.setItem(STORAGE_KEY_BOARDS, JSON.stringify(boards));
  },
};

function migrateBoard(board) {
  if (!board.color) board.color = '#0079bf';
  board.lists = (board.lists || []).map((list) => ({
    ...list,
    cards: (list.cards || []).map((card) => ({
      description: '',
      labels: [],
      dueDate: null,
      ...card,
    })),
  }));
  return board;
}

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

function formatDueDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function dueDateStatus(dateStr, done = false) {
  if (!dateStr) return null;
  if (done) return 'done';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  const diffDays = Math.round((d - today) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'overdue';
  if (diffDays === 0) return 'today';
  if (diffDays <= 2) return 'soon';
  return null;
}
