import Team from './Team';
import PositionedCharacter from './PositionedCharacter';
import { Swordsman, Bowman, Magician } from './characters';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.columnIndices = {
      player: [0, 1],
      enemy: [this.gamePlay.boardSize - 2, this.gamePlay.boardSize - 1],
    };
    this.gameState = new GameState();
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
    const positionedCharacter = this.getCharacterByIndex(index);
    if (positionedCharacter) {
      const { level, attack, defense, health } = positionedCharacter.character;
      const tooltipText = this.createTooltipText(level, attack, defense, health);
      this.gamePlay.showCellTooltip(tooltipText, index);
    }
  }

  onCellLeave(index) {
    this.gamePlay.hideCellTooltip(index);
  }

  createTooltipText(level, attack, defense, health) {
    return `🎖${level} ⚔${attack} 🛡${defense} ❤${health}`;
  }

  onCellClick(index) {
    const clickedCharacter = this.getCharacterByIndex(index);

    if (clickedCharacter) {
      if (this.isPlayerCharacter(clickedCharacter)) {
        this.selectPlayerCharacter(clickedCharacter, index);
      } else {
        this.showError('You can only select player characters!');
      }
    } else {
      this.showError('No character found in the clicked cell!');
    }
  }

  selectPlayerCharacter(character, index) {
    if (this.selectedCharacter) {
      this.gamePlay.deselectCell(this.selectedCharacter.position);
    }

    this.selectedCharacter = character;
    this.gamePlay.selectCell(index);
  }

  getCharacterByIndex(index) {
    return this.gameState.positions.find((positionedCharacter) => positionedCharacter.position === index);
  }

  isPlayerCharacter(character) {
    return character.character instanceof Bowman ||
      character.character instanceof Swordsman ||
      character.character instanceof Magician;
  }

  showError(message) {
    this.gamePlay.showMessage(message);
  }

  startNewGame() {
    this.gameState.reset();
    this.generateTeams();
    this.gamePlay.redrawPositions(this.gameState.positions);
  }

  generateTeams() {
    const playerTypes = [Bowman, Swordsman, Magician];
    const maxLevel = 3;
    const playerCharacterCount = 3;
    const enemyCharacterCount = 3;

    this.playerTeam = this.generateTeam(playerTypes, maxLevel, playerCharacterCount, 'player');
    this.enemyTeam = this.generateTeam(playerTypes, maxLevel, enemyCharacterCount, 'enemy');

    this.gameState.positions = [
      ...this.playerTeam.characters.map((character) => new PositionedCharacter(character, this.getRandomPosition('player'))),
      ...this.enemyTeam.characters.map((character) => new PositionedCharacter(character, this.getRandomPosition('enemy')))
    ];
  }

  generateTeam(allowedTypes, maxLevel, characterCount, team) {
    const teamCharacters = [];
    const columnIndices = this.columnIndices[team];

    for (let i = 0; i < characterCount; i++) {
      const randomType = allowedTypes[Math.floor(Math.random() * allowedTypes.length)];
      const randomLevel = Math.floor(Math.random() * maxLevel) + 1;
      const character = new randomType(randomLevel);
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


/* export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));

    const savedState = this.stateService.load();

    if (savedState) {
      this.gameState = savedState;

      this.gamePlay.drawUi(savedState.theme);
      this.gamePlay.redrawPositions(savedState.positions);
    } else {
      this.startNewGame();
    }
  }

  startNewGame() {
    this.gameState = {
      level: 1,
      theme: "prairie",
      positions: [],
    };

    this.gamePlay.drawUi(this.gameState.theme);
    this.gamePlay.redrawPositions(this.gameState.positions);
  }

  onCellClick(index) {
    const selectedCell = index;
  }

  onCellEnter(index) {
    const hoveredCell = index;
  }

  onCellLeave(index) {
    const previousCell = index;
  }
}
 */

