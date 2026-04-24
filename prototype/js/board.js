requireLogin();

const user = Storage.getUser();
document.getElementById('userLabel').textContent = user.displayName;

const boardId = Number(new URLSearchParams(window.location.search).get('id'));

let openCardCtx = null;

function loadBoard() {
  const boards = Storage.getBoards();
  return boards.find((b) => b.id === boardId);
}

function saveBoard(board) {
  const boards = Storage.getBoards();
  const idx = boards.findIndex((b) => b.id === board.id);
  if (idx >= 0) {
    boards[idx] = board;
    Storage.setBoards(boards);
  }
}

function render() {
  const board = loadBoard();
  if (!board) {
    alert('ボードが見つかりません');
    window.location.href = 'boards.html';
    return;
  }
  document.getElementById('boardTitle').textContent = board.name;
  document.title = `${board.name} | Task Management`;
  document.body.style.setProperty('--board-bg', board.color);

  const container = document.getElementById('listsContainer');
  container.innerHTML = '';

  board.lists.forEach((list) => {
    container.appendChild(renderList(list));
  });

  const addList = document.createElement('button');
  addList.className = 'add-list';
  addList.textContent = '+ リストを追加';
  addList.addEventListener('click', () => addNewList());
  container.appendChild(addList);
}

function renderList(list) {
  const el = document.createElement('div');
  el.className = 'list';
  el.dataset.listId = list.id;

  const header = document.createElement('div');
  header.className = 'list-header';

  const title = document.createElement('h2');
  title.innerHTML = `${escapeHtml(list.name)}<span class="list-count">${list.cards.length}</span>`;
  title.addEventListener('click', () => editListName(list.id, title));
  header.appendChild(title);

  const del = document.createElement('button');
  del.className = 'list-delete';
  del.textContent = '✕';
  del.title = 'リストを削除';
  del.addEventListener('click', () => deleteList(list.id));
  header.appendChild(del);

  el.appendChild(header);

  const cards = document.createElement('div');
  cards.className = 'cards';
  cards.dataset.listId = list.id;
  list.cards.forEach((card) => cards.appendChild(renderCard(card, list.id)));

  cards.addEventListener('dragover', onDragOver);
  cards.addEventListener('dragleave', onDragLeave);
  cards.addEventListener('drop', onDrop);

  el.appendChild(cards);

  const addCard = document.createElement('button');
  addCard.className = 'add-card';
  addCard.textContent = '+ カードを追加';
  addCard.addEventListener('click', () => addNewCard(list.id));
  el.appendChild(addCard);

  return el;
}

function renderCard(card, listId) {
  const el = document.createElement('div');
  el.className = 'card';
  el.draggable = true;
  el.dataset.cardId = card.id;
  el.dataset.listId = listId;

  const parts = [];
  if (card.labels && card.labels.length > 0) {
    const labelsHtml = card.labels
      .map((key) => {
        const lc = LABEL_COLORS.find((l) => l.key === key);
        return lc ? `<div class="card-label" style="background:${lc.value}"></div>` : '';
      })
      .join('');
    parts.push(`<div class="card-labels">${labelsHtml}</div>`);
  }

  parts.push(`<div class="card-title">${escapeHtml(card.title)}</div>`);

  if (card.dueDate) {
    const status = dueDateStatus(card.dueDate);
    const cls = status ? ` ${status}` : '';
    parts.push(`<div class="card-meta"><span class="card-due${cls}">📅 ${formatDueDate(card.dueDate)}</span></div>`);
  }

  el.innerHTML = parts.join('');

  el.addEventListener('click', (e) => {
    if (e.target.classList.contains('card-delete')) return;
    openCardModal(listId, card.id);
  });

  el.addEventListener('dragstart', onDragStart);
  el.addEventListener('dragend', onDragEnd);

  return el;
}

function addNewList() {
  const name = prompt('リスト名:');
  if (!name || !name.trim()) return;
  const board = loadBoard();
  board.lists.push({ id: genId(), name: name.trim(), cards: [] });
  saveBoard(board);
  render();
}

function editListName(listId, titleEl) {
  const board = loadBoard();
  const list = board.lists.find((l) => l.id === listId);
  if (!list) return;

  const input = document.createElement('input');
  input.type = 'text';
  input.value = list.name;
  input.className = 'inline-input';
  titleEl.replaceWith(input);
  input.focus();
  input.select();

  const commit = () => {
    const newName = input.value.trim();
    if (newName && newName !== list.name) {
      list.name = newName;
      saveBoard(board);
    }
    render();
  };

  input.addEventListener('blur', commit);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') input.blur();
    if (e.key === 'Escape') render();
  });
}

function deleteList(listId) {
  if (!confirm('このリストを削除しますか？配下のカードもまとめて削除されます。')) return;
  const board = loadBoard();
  board.lists = board.lists.filter((l) => l.id !== listId);
  saveBoard(board);
  render();
}

function addNewCard(listId) {
  const title = prompt('カードタイトル:');
  if (!title || !title.trim()) return;
  const board = loadBoard();
  const list = board.lists.find((l) => l.id === listId);
  if (!list) return;
  list.cards.push({
    id: genId(),
    title: title.trim(),
    description: '',
    labels: [],
    dueDate: null,
  });
  saveBoard(board);
  render();
}

// ==== Card detail modal ====
function openCardModal(listId, cardId) {
  const board = loadBoard();
  const list = board.lists.find((l) => l.id === listId);
  const card = list ? list.cards.find((c) => c.id === cardId) : null;
  if (!card) return;

  openCardCtx = { listId, cardId, selectedLabels: [...(card.labels || [])] };

  document.getElementById('cardTitleInput').value = card.title;
  document.getElementById('cardDescInput').value = card.description || '';
  document.getElementById('cardDueInput').value = card.dueDate || '';

  const picker = document.getElementById('labelPicker');
  picker.innerHTML = '';
  LABEL_COLORS.forEach((lc) => {
    const chip = document.createElement('div');
    chip.className = 'label-chip' + (openCardCtx.selectedLabels.includes(lc.key) ? ' selected' : '');
    chip.style.background = lc.value;
    chip.textContent = lc.label;
    chip.dataset.key = lc.key;
    chip.addEventListener('click', () => {
      const idx = openCardCtx.selectedLabels.indexOf(lc.key);
      if (idx >= 0) {
        openCardCtx.selectedLabels.splice(idx, 1);
        chip.classList.remove('selected');
      } else {
        openCardCtx.selectedLabels.push(lc.key);
        chip.classList.add('selected');
      }
    });
    picker.appendChild(chip);
  });

  document.getElementById('cardModal').classList.remove('hidden');
  document.getElementById('cardTitleInput').focus();
}

function closeCardModal() {
  document.getElementById('cardModal').classList.add('hidden');
  openCardCtx = null;
}

function saveCardModal() {
  if (!openCardCtx) return;
  const board = loadBoard();
  const list = board.lists.find((l) => l.id === openCardCtx.listId);
  const card = list ? list.cards.find((c) => c.id === openCardCtx.cardId) : null;
  if (!card) return;

  const newTitle = document.getElementById('cardTitleInput').value.trim();
  if (!newTitle) {
    alert('タイトルは必須です');
    return;
  }
  card.title = newTitle;
  card.description = document.getElementById('cardDescInput').value;
  card.dueDate = document.getElementById('cardDueInput').value || null;
  card.labels = [...openCardCtx.selectedLabels];

  saveBoard(board);
  closeCardModal();
  render();
}

function deleteCardFromModal() {
  if (!openCardCtx) return;
  if (!confirm('このカードを削除しますか？')) return;
  const board = loadBoard();
  const list = board.lists.find((l) => l.id === openCardCtx.listId);
  if (!list) return;
  list.cards = list.cards.filter((c) => c.id !== openCardCtx.cardId);
  saveBoard(board);
  closeCardModal();
  render();
}

document.getElementById('closeCardModal').addEventListener('click', closeCardModal);
document.getElementById('cancelCardBtn').addEventListener('click', closeCardModal);
document.getElementById('saveCardBtn').addEventListener('click', saveCardModal);
document.getElementById('deleteCardBtn').addEventListener('click', deleteCardFromModal);
document.getElementById('cardModal').addEventListener('click', (e) => {
  if (e.target.id === 'cardModal') closeCardModal();
});

// ==== Drag and Drop ====
let dragData = null;

function onDragStart(e) {
  const cardEl = e.currentTarget;
  dragData = {
    cardId: Number(cardEl.dataset.cardId),
    fromListId: Number(cardEl.dataset.listId),
  };
  cardEl.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
}

function onDragEnd(e) {
  e.currentTarget.classList.remove('dragging');
  document.querySelectorAll('.cards.drag-over').forEach((el) => el.classList.remove('drag-over'));
  dragData = null;
}

function onDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  e.currentTarget.classList.add('drag-over');

  const container = e.currentTarget;
  const afterEl = getDragAfterElement(container, e.clientY);
  const dragging = document.querySelector('.card.dragging');
  if (!dragging) return;
  if (afterEl == null) {
    container.appendChild(dragging);
  } else {
    container.insertBefore(dragging, afterEl);
  }
}

function onDragLeave(e) {
  if (!e.currentTarget.contains(e.relatedTarget)) {
    e.currentTarget.classList.remove('drag-over');
  }
}

function onDrop(e) {
  e.preventDefault();
  if (!dragData) return;
  const toListId = Number(e.currentTarget.dataset.listId);
  const board = loadBoard();
  const fromList = board.lists.find((l) => l.id === dragData.fromListId);
  const toList = board.lists.find((l) => l.id === toListId);
  if (!fromList || !toList) return;

  const cardIdx = fromList.cards.findIndex((c) => c.id === dragData.cardId);
  if (cardIdx < 0) return;
  const [movedCard] = fromList.cards.splice(cardIdx, 1);

  const cardsEls = Array.from(e.currentTarget.querySelectorAll('.card'));
  const newIdx = cardsEls.findIndex((el) => Number(el.dataset.cardId) === dragData.cardId);

  if (newIdx >= 0) {
    toList.cards.splice(newIdx, 0, movedCard);
  } else {
    toList.cards.push(movedCard);
  }

  saveBoard(board);
  render();
}

function getDragAfterElement(container, y) {
  const draggableEls = [...container.querySelectorAll('.card:not(.dragging)')];
  return draggableEls.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      }
      return closest;
    },
    { offset: Number.NEGATIVE_INFINITY, element: null }
  ).element;
}

render();
