export default class GameState {
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
        // eslint-disable-next-line no-mixed-operators
        (character.attack * (80 + character.health)) / 100,
      );
      const defenseAfter = Math.max(
        character.defense,
        // eslint-disable-next-line no-mixed-operators
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
