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
  newTile.addEventListener('click', createBoard);
  grid.appendChild(newTile);
}

function createBoard() {
  const name = prompt('ボード名を入力してください:');
  if (!name || !name.trim()) return;
  const boards = Storage.getBoards();
  boards.push({
    id: genId(),
    name: name.trim(),
    lists: [
      { id: genId(), name: 'ToDo', cards: [] },
      { id: genId(), name: 'Doing', cards: [] },
      { id: genId(), name: 'Done', cards: [] },
    ],
  });
  Storage.setBoards(boards);
  render();
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
