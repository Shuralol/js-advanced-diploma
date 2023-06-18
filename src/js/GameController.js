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
    const character = this.gameState.positions[index];

    if (character && character.character.player) {
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
    const character = this.gameState.positions[index];

    if (character && character.character.player) {
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
    const character = this.gameState.positions[index];

    if (character && character.character.player && character !== this.selectedCharacter) {
      if (this.selectedCharacter) {
        const previousIndex = this.gameState.positions.findIndex(
          (positionedCharacter) => positionedCharacter === this.selectedCharacter,
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

  createTooltipText(level, attack, defense, health) {
    return `🎖${level} ⚔${attack} 🛡${defense} ❤${health}`;
  }

  selectPlayerCharacter(character, index) {
    if (this.selectedCharacter) {
      const previousIndex = this.gameState.positions.findIndex(
        (positionedCharacter) => positionedCharacter === this.selectedCharacter,
      );
      this.gamePlay.deselectCell(previousIndex);
    }

    this.selectedCharacter = character;
    this.gamePlay.selectCell(index);
    this.gamePlay.setCursor('pointer');
  }

  getCharacterByIndex(index) {
    return this.gameState.positions[index];
  }

  isPlayerCharacter(character) {
    return (
      character.character instanceof Bowman
      || character.character instanceof Swordsman
      || character.character instanceof Magician
    );
  }

  showError(message) {
    this.gamePlay.showMessage(message);
  }

  startNewGame() {
    this.gameState.reset();
    this.generateTeams();
    this.gamePlay.redrawPositions(this.gameState.positions);

    if (this.selectedCharacter) {
      const previousIndex = this.gameState.positions.findIndex(
        (positionedCharacter) => positionedCharacter === this.selectedCharacter,
      );
      this.gamePlay.deselectCell(previousIndex);
      this.selectedCharacter = null;
    }
  }

  generateTeams() {
    const playerTypes = [Bowman, Swordsman, Magician];
    const maxLevel = 3;
    const playerCharacterCount = 3;
    const enemyCharacterCount = 3;

    this.playerTeam = this.generateTeam(
      playerTypes,
      maxLevel,
      playerCharacterCount,
      'player',
    );
    this.enemyTeam = this.generateTeam(
      playerTypes,
      maxLevel,
      enemyCharacterCount,
      'enemy',
    );

    this.gameState.positions = [
      ...this.playerTeam.characters.map(
        (character) => new PositionedCharacter(character, this.getRandomPosition('player')),
      ),
      ...this.enemyTeam.characters.map(
        (character) => new PositionedCharacter(character, this.getRandomPosition('enemy')),
      ),
    ];
  }

  generateTeam(allowedTypes, maxLevel, characterCount, team) {
    const teamCharacters = [];
    const columnIndices = this.columnIndices[team];

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < characterCount; i++) {
      const RandomType = allowedTypes[Math.floor(Math.random() * allowedTypes.length)];
      const randomLevel = Math.floor(Math.random() * maxLevel) + 1;
      const character = new RandomType(randomLevel);
      const position = this.getRandomPosition(columnIndices);
      const positionedCharacter = new PositionedCharacter(character, position);
      teamCharacters.push(positionedCharacter);
    }

    return new Team(teamCharacters);
  }

  getRandomPosition(columnIndices) {
    const rowIndex = Math.floor(Math.random() * this.gamePlay.boardSize);
    const columnIndex = columnIndices[Math.floor(Math.random() * columnIndices.length)];
    return rowIndex * this.gamePlay.boardSize + columnIndex;
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

  toggleCurrentPlayer() {
    this.currentPlayerIndex = this.currentPlayerIndex === 0 ? 1 : 0;
  }

  async moveSelectedCharacter(index) {
    const { position } = this.selectedCharacter;
    const character = this.getCharacterByIndex(index);

    if (character && !this.isPlayerCharacter(character)) {
      await this.attackEnemy(character);
    } else {
      this.selectedCharacter.position = index;
      this.gamePlay.deselectCell(position);
      this.gamePlay.redrawPositions(this.gameState.positions);
      this.toggleCurrentPlayer();
    }

    this.selectedCharacter = null;
    this.gamePlay.deselectCell(index);
    this.gamePlay.setCursor('auto');
  }

  async attackEnemy(enemy) {
    const { character } = this.selectedCharacter;

    try {
      await character.attack(enemy.character);

      if (!enemy.character.isAlive()) {
        const enemyIndex = this.gameState.positions.findIndex(
          (positionedCharacter) => positionedCharacter === enemy,
        );
        this.gameState.positions.splice(enemyIndex, 1);
        this.gamePlay.deselectCell(enemyIndex);
      }

      this.gamePlay.redrawPositions(this.gameState.positions);
      this.toggleCurrentPlayer();
    } catch (error) {
      this.showError(error.message);
    }
  }
}

class GameState {
  constructor() {
    this.level = 1;
    this.theme = 'prairie';
    this.positions = [];
  }

  init() {
    this.level = 1;
    this.theme = 'prairie';
    this.positions = [];
  }

  reset() {
    this.level = 1;
    this.theme = 'prairie';
    this.positions = [];
  }
}
