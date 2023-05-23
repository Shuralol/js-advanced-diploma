export default class GameController {
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
