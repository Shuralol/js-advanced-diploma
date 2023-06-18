/* eslint-disable no-use-before-define */
/* eslint-disable class-methods-use-this */
// eslint-disable-next-line max-classes-per-file
import Team from './Team';
import PositionedCharacter from './PositionedCharacter';
// eslint-disable-next-line import/no-unresolved
import { Swordsman, Bowman, Magician } from './Characters';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.selectedCharacter = null;
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.columnIndices = {
      player: [0, 1],
      enemy: [this.gamePlay.boardSize - 2, this.gamePlay.boardSize - 1],
    };
    this.gameState = new GameState();
    this.currentPlayerIndex = 0;
    this.selectedCharacter = null;
  }

  init() {
    this.gameState.init();
    this.gamePlay.drawUi(this.gameState.theme);
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
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
        const target = this.gameState.board[index];
        this.attackSelectedCharacter(target);
      } else {
        this.gamePlay.showMessage('Invalid move!');
      }
    }
  }

  async attackSelectedCharacter(target) {
    const attacker = this.selectedCharacter;
    const damage = Math.max(
      attacker.attack - target.defence,
      attacker.attack * 0.1,
    );

    // eslint-disable-next-line no-undef
    await this.gamePlay.showDamage(index, damage);

    // eslint-disable-next-line no-param-reassign
    target.health -= damage;

    if (target.health <= 0) {
      // Remove the defeated character from the board
      const targetIndex = this.gameState.board.findIndex(
        (cell) => cell === target,
      );
      this.gameState.board[targetIndex] = null;
      this.gamePlay.redrawPositions(this.gameState.board);
    } else {
      this.gamePlay.redrawPositions(this.gameState.board);
    }

    this.switchTurn();
  }

  getAllowedMoves(position) {
    const allowedMoves = [];
    const { row, column } = position;

    for (let i = 1; i <= this.selectedCharacter.moveRange; i += 1) {
      const leftIndex = this.gamePlay.boardSize * row + column - i;
      const rightIndex = this.gamePlay.boardSize * row + column + i;
      const topIndex = this.gamePlay.boardSize * (row - i) + column;
      const bottomIndex = this.gamePlay.boardSize * (row + i) + column;

      if (leftIndex >= 0 && leftIndex % this.gamePlay.boardSize <= column - i) {
        allowedMoves.push(leftIndex);
      }

      if (
        rightIndex < this.gamePlay.boardSize ** 2
        && rightIndex % this.gamePlay.boardSize >= column + i
      ) {
        allowedMoves.push(rightIndex);
      }

      if (
        topIndex >= 0
        && Math.floor(topIndex / this.gamePlay.boardSize) <= row - i
      ) {
        allowedMoves.push(topIndex);
      }

      if (
        bottomIndex < this.gamePlay.boardSize ** 2
        && Math.floor(bottomIndex / this.gamePlay.boardSize) >= row + i
      ) {
        allowedMoves.push(bottomIndex);
      }
    }

    return allowedMoves;
  }

  switchTurn() {
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % 2;
  }
}

class GameState {
  constructor() {
    this.level = 1;
    this.theme = 'prairie';
    this.board = [];
  }

  init() {
    this.level = 1;
    this.theme = 'prairie';
    this.board = Array(64).fill(null);

    const playerTeam = new Team();
    playerTeam.add(
      new PositionedCharacter(new Swordsman(), this.columnIndices.player[0]),
    );
    playerTeam.add(
      new PositionedCharacter(new Bowman(), this.columnIndices.player[0]),
    );
    playerTeam.add(
      new PositionedCharacter(new Magician(), this.columnIndices.player[0]),
    );

    const enemyTeam = new Team();
    enemyTeam.add(
      new PositionedCharacter(new Swordsman(), this.columnIndices.enemy[0]),
    );
    enemyTeam.add(
      new PositionedCharacter(new Bowman(), this.columnIndices.enemy[0]),
    );
    enemyTeam.add(
      new PositionedCharacter(new Magician(), this.columnIndices.enemy[0]),
    );

    this.board = [...playerTeam.characters, ...enemyTeam.characters].map(
      (character, index) => {
        const row = Math.floor(index / this.gamePlay.boardSize);
        const column = index % this.gamePlay.boardSize;
        const position = { row, column };
        return new PositionedCharacter(character, position);
      },
    );
  }

  reset() {
    this.level = 1;
    this.theme = 'prairie';
    this.board = Array(64).fill(null);
  }
}
