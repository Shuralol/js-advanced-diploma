import { calcHealthLevel, calcTileType } from './utils';
// eslint-disable-next-line no-unused-vars
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
    this.gameOver = false;
    this.maxScore = 0;
  }

  bindToDOM(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }
    this.container = container;
  }

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

  addCellEnterListener(callback) {
    this.cellEnterListeners.push(callback);
  }

  addCellLeaveListener(callback) {
    this.cellLeaveListeners.push(callback);
  }

  addCellClickListener(callback) {
    this.cellClickListeners.push(callback);
  }

  addNewGameListener(callback) {
    this.newGameListeners.push(callback);
  }

  addSaveGameListener(callback) {
    this.saveGameListeners.push(callback);
  }

  addLoadGameListener(callback) {
    this.loadGameListeners.push(callback);
  }

  onCellEnter(event) {
    if (!this.gameOver) {
      const cellIndex = Array.from(this.boardEl.children).indexOf(event.currentTarget);
      for (const listener of this.cellEnterListeners) {
        listener(cellIndex);
      }
    }
  }

  onCellLeave(event) {
    if (!this.gameOver) {
      const cellIndex = Array.from(this.boardEl.children).indexOf(event.currentTarget);
      for (const listener of this.cellLeaveListeners) {
        listener(cellIndex);
      }
    }
  }

  onCellClick(event) {
    if (!this.gameOver) {
      const cellIndex = Array.from(this.boardEl.children).indexOf(event.currentTarget);
      for (const listener of this.cellClickListeners) {
        listener(cellIndex);
      }
    }
  }

  onNewGameClick(event) {
    event.preventDefault();
    if (this.gameOver) {
      for (const listener of this.newGameListeners) {
        listener();
      }
    }
  }

  onSaveGameClick(event) {
    event.preventDefault();
    for (const listener of this.saveGameListeners) {
      listener();
    }
  }

  onLoadGameClick(event) {
    event.preventDefault();
    for (const listener of this.loadGameListeners) {
      listener();
    }
  }

  checkBinding() {
    if (!this.container) {
      throw new Error('GamePlay not bind to DOM');
    }
  }

  saveMaxScore() {
    localStorage.setItem('maxScore', this.maxScore.toString());
  }

  loadMaxScore() {
    const maxScoreStr = localStorage.getItem('maxScore');
    if (maxScoreStr !== null) {
      this.maxScore = parseInt(maxScoreStr, 10);
    }
  }
}
