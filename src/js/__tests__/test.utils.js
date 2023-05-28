import { calcTileType } from "../utils.js";

describe("calcTileType", () => {
  it('should return "top-left" for the top-left corner tile', () => {
    expect(calcTileType(0, 8)).toBe("top-left");
  });

  it('should return "top-right" for the top-right corner tile', () => {
    expect(calcTileType(7, 8)).toBe("top-right");
  });

  it('should return "top" for the top edge tile', () => {
    expect(calcTileType(5, 8)).toBe("top");
  });

  it('should return "bottom-left" for the bottom-left corner tile', () => {
    expect(calcTileType(56, 8)).toBe("bottom-left");
  });

  it('should return "bottom-right" for the bottom-right corner tile', () => {
    expect(calcTileType(63, 8)).toBe("bottom-right");
  });

  it('should return "bottom" for the bottom edge tile', () => {
    expect(calcTileType(58, 8)).toBe("bottom");
  });

  it('should return "left" for the left edge tile', () => {
    expect(calcTileType(16, 8)).toBe("left");
  });

  it('should return "right" for the right edge tile', () => {
    expect(calcTileType(23, 8)).toBe("right");
  });

  it('should return "center" for a tile in the center of the board', () => {
    expect(calcTileType(29, 8)).toBe("center");
  });
});
