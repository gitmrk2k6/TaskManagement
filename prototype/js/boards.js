requireLogin();

const user = Storage.getUser();
document.getElementById('userLabel').textContent = user.displayName;

function render() {
  const grid = document.getElementById('boardsGrid');
  const boards = Storage.getBoards();
  grid.innerHTML = '';

  boards.forEach((board) => {
    const tile = document.createElement('div');
    tile.className = 'board-tile';
    tile.style.setProperty('--tile-bg', board.color);
    tile.innerHTML = `
      <h3>${escapeHtml(board.name)}</h3>
      <div class="actions">
        <button class="mini-btn" data-action="rename" data-id="${board.id}">名前変更</button>
        <button class="mini-btn" data-action="delete" data-id="${board.id}">削除</button>
      </div>
    `;
    tile.addEventListener('click', (e) => {
      const action = e.target.dataset.action;
      const id = Number(e.target.dataset.id);
      if (action === 'rename') {
        e.stopPropagation();
        renameBoard(id);
      } else if (action === 'delete') {
        e.stopPropagation();
        deleteBoard(id);
      } else {
        window.location.href = `board.html?id=${board.id}`;
      }
    });
    grid.appendChild(tile);
  });

  const newTile = document.createElement('div');
  newTile.className = 'board-tile new';
  newTile.textContent = '+ 新しいボードを作成';
  newTile.addEventListener('click', openCreateModal);
  grid.appendChild(newTile);
}

function openCreateModal() {
  const overlay = document.getElementById('createModal');
  const nameInput = document.getElementById('newBoardName');
  const picker = document.getElementById('colorPicker');
  nameInput.value = '';

  picker.innerHTML = '';
  let selectedColor = BOARD_COLORS[0].value;
  BOARD_COLORS.forEach((c, idx) => {
    const sw = document.createElement('div');
    sw.className = 'color-swatch' + (idx === 0 ? ' selected' : '');
    sw.style.background = c.value;
    sw.dataset.value = c.value;
    sw.addEventListener('click', () => {
      selectedColor = c.value;
      picker.querySelectorAll('.color-swatch').forEach((el) => el.classList.remove('selected'));
      sw.classList.add('selected');
    });
    picker.appendChild(sw);
  });

  overlay.classList.remove('hidden');
  nameInput.focus();

  const submit = () => {
    const name = nameInput.value.trim();
    if (!name) {
      nameInput.focus();
      return;
    }
    const boards = Storage.getBoards();
    boards.push({
      id: genId(),
      name,
      color: selectedColor,
      lists: [
        { id: genId(), name: 'ToDo', cards: [] },
        { id: genId(), name: 'Doing', cards: [] },
        { id: genId(), name: 'Done', cards: [] },
      ],
    });
    Storage.setBoards(boards);
    close();
    render();
  };

  const close = () => {
    overlay.classList.add('hidden');
    submitBtn.removeEventListener('click', submit);
    cancelBtn.removeEventListener('click', close);
    nameInput.removeEventListener('keydown', onKey);
  };

  const onKey = (e) => {
    if (e.key === 'Enter') submit();
    if (e.key === 'Escape') close();
  };

  const submitBtn = document.getElementById('createBoardBtn');
  const cancelBtn = document.getElementById('cancelCreateBtn');
  submitBtn.addEventListener('click', submit);
  cancelBtn.addEventListener('click', close);
  nameInput.addEventListener('keydown', onKey);
}

function renameBoard(id) {
  const boards = Storage.getBoards();
  const board = boards.find((b) => b.id === id);
  if (!board) return;
  const name = prompt('新しいボード名:', board.name);
  if (!name || !name.trim()) return;
  board.name = name.trim();
  Storage.setBoards(boards);
  render();
}

function deleteBoard(id) {
  if (!confirm('このボードを削除しますか？配下のリスト・カードもまとめて削除されます。')) return;
  const boards = Storage.getBoards().filter((b) => b.id !== id);
  Storage.setBoards(boards);
  render();
}

render();
