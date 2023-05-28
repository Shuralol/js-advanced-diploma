/**
 * @todo
 * @param index - индекс поля
 * @param boardSize - размер квадратного поля (в длину или ширину)
 * @returns строка - тип ячейки на поле:
 *
 * top-left
 * top-right
 * top
 * bottom-left
 * bottom-right
 * bottom
 * right
 * left
 * center
 *
 * @example
 * ```js
 * calcTileType(0, 8); // 'top-left'
 * calcTileType(1, 8); // 'top'
 * calcTileType(63, 8); // 'bottom-right'
 * calcTileType(7, 7); // 'left'
 * ```
 * */
export function calcTileType(index, boardSize) {
  const isTop = index < boardSize;
  const isBottom = index >= boardSize ** 2 - boardSize;
  const isLeft = index % boardSize === 0;
  const isRight = (index + 1) % boardSize === 0;

  if (isTop && isLeft) {
    return "top-left";
  }
  if (isTop && isRight) {
    return "top-right";
  }
  if (isTop) {
    return "top";
  }
  if (isBottom && isLeft) {
    return "bottom-left";
  }
  if (isBottom && isRight) {
    return "bottom-right";
  }
  if (isBottom) {
    return "bottom";
  }
  if (isRight) {
    return "right";
  }
  if (isLeft) {
    return "left";
  }
  return "center";
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return "critical";
  }

  if (health < 50) {
    return "normal";
  }

  return "high";
}
