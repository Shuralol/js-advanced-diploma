/* eslint-disable no-console */
// eslint-disable-next-line max-classes-per-file
class GameState {
  constructor() {
    this.level = 1;
    this.theme = 'prairie';
    this.positions = [];
  }

  static from(state) {
    const gameState = new GameState();
    gameState.level = state.level;
    gameState.theme = state.theme;
    // eslint-disable-next-line max-len
    gameState.positions = state.positions.map((positionedCharacter) => positionedCharacter.from(positionedCharacter));
    return gameState;
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

  increaseLevel() {
    // eslint-disable-next-line no-plusplus
    this.level++;
    if (this.level > 4) {
      this.level = 4;
    }
    this.changeTheme();

    this.positions.forEach((position) => {
      const { character } = position;

      character.levelUp();

      const health = character.health + this.level + 80;
      character.health = Math.min(health, 100);

      const attackAfter = Math.max(
        character.attack,
        (character.attack * (80 + character.health)) / 100,
      );
      const defenseAfter = Math.max(
        character.defense,
        (character.defense * (80 + character.health)) / 100,
      );
      character.attack = attackAfter;
      character.defense = defenseAfter;
    });
  }

  changeTheme() {
    switch (this.level) {
      case 2:
        this.theme = 'desert';
        break;
      case 3:
        this.theme = 'arctic';
        break;
      case 4:
        this.theme = 'mountain';
        break;
      default:
        this.theme = 'prairie';
    }
  }
}

class GameStateService {
  constructor(storage) {
    this.storage = storage || localStorage;
    this.gameState = null;
  }

  save() {
    try {
      const gameStateJson = JSON.stringify(this.gameState);
      this.storage.setItem('gameState', gameStateJson);
      console.log('Game state saved successfully.');
    } catch (error) {
      console.log('Failed to save game state:', error);
    }
  }

  load() {
    try {
      const gameStateJson = this.storage.getItem('gameState');
      if (gameStateJson) {
        const loadedGameState = JSON.parse(gameStateJson);
        console.log('Game state loaded successfully.');
        this.gameState = GameState.from(loadedGameState);
      } else {
        console.log('No game state found.');
        this.gameState = new GameState();
      }
    } catch (error) {
      console.error('Failed to load game state:', error);
      this.gameState = new GameState();
    }
  }

  setLevel(level) {
    this.gameState.level = level;
  }

  setTheme(theme) {
    this.gameState.theme = theme;
  }

  setPositions(positions) {
    this.gameState.positions = positions;
  }

  getLevel() {
    return this.gameState.level;
  }

  getTheme() {
    return this.gameState.theme;
  }

  getPositions() {
    return this.gameState.positions;
  }
}

const gameStateService = new GameStateService();

gameStateService.load();

gameStateService.setLevel(3);
gameStateService.setTheme('arctic');
gameStateService.setPositions([1]);

gameStateService.save();

const loadedLevel = gameStateService.getLevel();
const loadedTheme = gameStateService.getTheme();
const loadedPositions = gameStateService.getPositions();

console.log(loadedLevel);
console.log(loadedTheme);
console.log(loadedPositions);
