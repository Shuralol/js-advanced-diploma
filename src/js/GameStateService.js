export default class GameStateService {
  constructor(storage) {
    this.storage = storage || localStorage;
  }

  save(state) {
    try {
      const gameStateJson = JSON.stringify(state);
      this.storage.setItem('state', gameStateJson);
      // eslint-disable-next-line no-console
      console.log('Game state saved successfully.');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Failed to save game state:', error);
    }
  }

  load() {
    try {
      const gameStateJson = this.storage.getItem('state');
      if (gameStateJson) {
        const loadedGameState = JSON.parse(gameStateJson);
        // eslint-disable-next-line no-console
        console.log('Game state loaded successfully.');
        return loadedGameState;
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to load game state:', error);
    }

    throw new Error('Invalid state');
  }
}
