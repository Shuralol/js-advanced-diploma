import { calcHealthLevel, calcTileType } from './utils';
import cursors from './cursors';

export default class GamePlay {
  constructor() {
    this.boardSize = 8;
    this.container = null;
    this.boardEl = null;
    this.cells = [];
    this.cellClickListeners = [];
    this.cellEnterListeners = [];
    this.cellLeaveListeners = [];
    this.newGameListeners = [];
    this.saveGameListeners = [];
    this.loadGameListeners = [];
  }

  bindToDOM(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }
    this.container = container;
  }

  /**
   * Draws boardEl with specific theme
   *
   * @param theme
   */
  drawUi(theme) {
    this.checkBinding();

    this.container.innerHTML = `
      <div class="controls">
        <button data-id="action-restart" class="btn">New Game</button>
        <button data-id="action-save" class="btn">Save Game</button>
        <button data-id="action-load" class="btn">Load Game</button>
      </div>
      <div class="board-container">
        <div data-id="board" class="board"></div>
      </div>
    `;

    this.newGameEl = this.container.querySelector('[data-id=action-restart]');
    this.saveGameEl = this.container.querySelector('[data-id=action-save]');
    this.loadGameEl = this.container.querySelector('[data-id=action-load]');

    this.newGameEl.addEventListener('click', (event) => this.onNewGameClick(event));
    this.saveGameEl.addEventListener('click', (event) => this.onSaveGameClick(event));
    this.loadGameEl.addEventListener('click', (event) => this.onLoadGameClick(event));

    this.boardEl = this.container.querySelector('[data-id=board]');

    this.boardEl.classList.add(theme);
    for (let i = 0; i < this.boardSize ** 2; i += 1) {
      const cellEl = document.createElement('div');
      cellEl.classList.add('cell', 'map-tile', `map-tile-${calcTileType(i, this.boardSize)}`);
      cellEl.addEventListener('mouseenter', (event) => this.onCellEnter(event));
      cellEl.addEventListener('mouseleave', (event) => this.onCellLeave(event));
      cellEl.addEventListener('click', (event) => this.onCellClick(event));
      this.boardEl.appendChild(cellEl);
    }

    this.cells = Array.from(this.boardEl.children);
  }

  /**
   * Draws positions (with chars) on boardEl
   *
   * @param positions array of PositionedCharacter objects
   */
  redrawPositions(positions) {
    for (const cell of this.cells) {
      cell.innerHTML = '';
    }

    for (const position of positions) {
      const cellEl = this.boardEl.children[position.position];
      const charEl = document.createElement('div');
      charEl.classList.add('character', position.character.type);

      const healthEl = document.createElement('div');
      healthEl.classList.add('health-level');

      const healthIndicatorEl = document.createElement('div');
      healthIndicatorEl.classList.add('health-level-indicator', `health-level-indicator-${calcHealthLevel(position.character.health)}`);
      healthIndicatorEl.style.width = `${position.character.health}%`;
      healthEl.appendChild(healthIndicatorEl);

      charEl.appendChild(healthEl);
      cellEl.appendChild(charEl);
    }
  }

  getAllowedMoves(position) {
    const character = this.getCharacterByPosition(position);
    const { type } = character.character;

    if (type === 'swordsman' || type === 'skeleton') {
      return this.getMovesInRadius(position, 1);
    } if (type === 'bowman' || type === 'vampire') {
      return this.getMovesInRadius(position, 2);
    } if (type === 'magician' || type === 'demon') {
      return this.getMovesInRadius(position, 4);
    }

    return [];
  }

  getMovesInRadius(position, radius) {
    const allowedMoves = [];
    const rowIndex = Math.floor(position / this.gamePlay.boardSize);
    const columnIndex = position % this.gamePlay.boardSize;

    // eslint-disable-next-line no-plusplus
    for (let row = rowIndex - radius; row <= rowIndex + radius; row++) {
      // eslint-disable-next-line no-plusplus
      for (let col = columnIndex - radius; col <= columnIndex + radius; col++) {
        if (this.isValidPosition(row, col) && !(row === rowIndex && col === columnIndex)) {
          allowedMoves.push(row * this.gamePlay.boardSize + col);
        }
      }
    }

    return allowedMoves;
  }

  isValidPosition(row, col) {
    return row >= 0 && row < this.gamePlay.boardSize && col >= 0 && col < this.gamePlay.boardSize;
  }

  getCharacterByPosition(position) {
    return this.gameState.board[position];
  }

  /**
   * Add listener to mouse enter for cell
   *
   * @param callback
   */
  addCellEnterListener(callback) {
    this.cellEnterListeners.push(callback);
  }

  /**
   * Add listener to mouse leave for cell
   *
   * @param callback
   */
  addCellLeaveListener(callback) {
    this.cellLeaveListeners.push(callback);
  }

  /**
   * Add listener to mouse click for cell
   *
   * @param callback
   */
  addCellClickListener(callback) {
    this.cellClickListeners.push(callback);
  }

  /**
   * Add listener to "New Game" button click
   *
   * @param callback
   */
  addNewGameListener(callback) {
    this.newGameListeners.push(callback);
  }

  /**
   * Add listener to "Save Game" button click
   *
   * @param callback
   */
  addSaveGameListener(callback) {
    this.saveGameListeners.push(callback);
  }

  /**
   * Add listener to "Load Game" button click
   *
   * @param callback
   */
  addLoadGameListener(callback) {
    this.loadGameListeners.push(callback);
  }

  onCellEnter(index) {
    const character = this.gameState.board[index];

    if (character && character.player) {
      if (character !== this.selectedCharacter) {
        return;
      }

      this.gamePlay.setCursor('pointer');
    } else if (this.selectedCharacter) {
      const { position } = this.selectedCharacter;
      const allowedMoves = this.getAllowedMoves(position);

      if (allowedMoves.includes(index)) {
        this.gamePlay.selectCell(index, 'green');
        this.gamePlay.setCursor('pointer');
      } else {
        this.gamePlay.setCursor('notallowed');
      }
    }
  }

  onCellLeave(index) {
    const character = this.gameState.board[index];

    if (character && character.player) {
      if (character !== this.selectedCharacter) {
        return;
      }

      this.gamePlay.setCursor('pointer');
    } else if (this.selectedCharacter) {
      const { position } = this.selectedCharacter;
      const allowedMoves = this.getAllowedMoves(position);

      if (allowedMoves.includes(index)) {
        this.gamePlay.deselectCell(index);
      }

      this.gamePlay.setCursor('auto');
    }
  }

  onCellClick(index) {
    const character = this.gameState.board[index];

    if (character && character.player && character !== this.selectedCharacter) {
      if (this.selectedCharacter) {
        const previousIndex = this.gameState.board.findIndex(
          (cell) => cell === this.selectedCharacter,
        );
        this.gamePlay.deselectCell(previousIndex);
      }

      this.selectedCharacter = character;
      this.gamePlay.selectCell(index);
      this.gamePlay.setCursor('pointer');
    } else if (this.selectedCharacter) {
      const { position } = this.selectedCharacter;
      const allowedMoves = this.getAllowedMoves(position);

      if (allowedMoves.includes(index)) {
        this.moveSelectedCharacter(index);
      } else {
        this.gamePlay.showMessage('Invalid move!');
      }
    }
  }

  onNewGameClick(event) {
    event.preventDefault();
    this.newGameListeners.forEach((o) => o.call(null));
  }

  onSaveGameClick(event) {
    event.preventDefault();
    this.saveGameListeners.forEach((o) => o.call(null));
  }

  onLoadGameClick(event) {
    event.preventDefault();
    this.loadGameListeners.forEach((o) => o.call(null));
  }

  static showError(message) {
    // eslint-disable-next-line no-alert
    alert(message);
  }

  static showMessage(message) {
    // eslint-disable-next-line no-alert
    alert(message);
  }

  selectCell(index, color = 'yellow') {
    this.deselectCell(index);
    this.cells[index].classList.add('selected', `selected-${color}`);
  }

  deselectCell(index) {
    const cell = this.cells[index];
    cell.classList.remove(...Array.from(cell.classList)
      .filter((o) => o.startsWith('selected')));
  }

  showCellTooltip(message, index) {
    this.cells[index].title = message;
  }

  hideCellTooltip(index) {
    this.cells[index].title = '';
  }

  showDamage(index, damage) {
    return new Promise((resolve) => {
      const cell = this.cells[index];
      const damageEl = document.createElement('span');
      damageEl.textContent = damage;
      damageEl.classList.add('damage');
      cell.appendChild(damageEl);

      damageEl.addEventListener('animationend', () => {
        cell.removeChild(damageEl);
        resolve();
      });
    });
  }

  // eslint-disable-next-line class-methods-use-this
  setCursor(cursorType) {
    const body = document.querySelector('body');
    body.style.cursor = cursors[cursorType];
  }

  checkBinding() {
    if (this.container === null) {
      throw new Error('GamePlay not bind to DOM');
    }
  }
}
