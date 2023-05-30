import GameController from '../GameController.js';
import GamePlay from '../GamePlay.js';
import StateService from '../StateService.js';

describe('GameController', () => {
  let gamePlay;
  let stateService;
  let controller;

  beforeEach(() => {
    gamePlay = new GamePlay();
    stateService = new StateService();
    controller = new GameController(gamePlay, stateService);
    controller.init();
  });

  it('should display character tooltip on cell enter if character exists', () => {
    const index = 0;
    const character = new Bowman(1);
    const positionedCharacter = new PositionedCharacter(character, index);
    controller.gameState.positions = [positionedCharacter];

    const tooltipText = `🎖${character.level} ⚔${character.attack} 🛡${character.defense} ❤${character.health}`;

    controller.onCellEnter(index);

    expect(gamePlay.showCellTooltip).toHaveBeenCalledWith(tooltipText, index);
  });

  it('should not display character tooltip on cell enter if no character exists', () => {
    const index = 0;

    controller.onCellEnter(index);

    expect(gamePlay.showCellTooltip).not.toHaveBeenCalled();
  });

  it('should hide character tooltip on cell leave', () => {
    const index = 0;

    controller.onCellLeave(index);

    expect(gamePlay.hideCellTooltip).toHaveBeenCalledWith(index);
  });

  it('should generate teams with the specified number of characters', () => {
    const playerCharacterCount = 3;
    const enemyCharacterCount = 3;

    controller.startNewGame();

    expect(controller.playerTeam.characters.length).toBe(playerCharacterCount);
    expect(controller.enemyTeam.characters.length).toBe(enemyCharacterCount);
  });

  it('should generate teams with characters of the specified level', () => {
    const maxLevel = 3;

    controller.startNewGame();

    const playerLevels = controller.playerTeam.characters.map((character) => character.level);
    const enemyLevels = controller.enemyTeam.characters.map((character) => character.level);

    playerLevels.forEach((level) => {
      expect(level).toBeGreaterThanOrEqual(1);
      expect(level).toBeLessThanOrEqual(maxLevel);
    });

    enemyLevels.forEach((level) => {
      expect(level).toBeGreaterThanOrEqual(1);
      expect(level).toBeLessThanOrEqual(maxLevel);
    });
  });
});
