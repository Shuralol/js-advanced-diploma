/**
 * Формирует экземпляр персонажа из массива allowedTypes со
 * случайным уровнем от 1 до maxLevel
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове
 * возвращает новый экземпляр класса персонажа
 *
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  
  while (true) {
    const characterClass = allowedTypes[randomInteger(0, allowedTypes.length - 1)];
    const level = randomInteger(1, maxLevel);
    yield new characterClass(level);
  }
}

export function randomInteger(min, max) {
  const rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

/**
 * Формирует массив персонажей на основе characterGenerator
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @param characterCount количество персонажей, которое нужно сформировать
 * @returns экземпляр Team, хранящий экземпляры персонажей. Количество персонажей в команде - characterCount
 * */

import Team from '../Team.js';
import { characterGenerator } from '../generators.js';

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const teamCharacters = [];
  const playerGenerator = characterGenerator(allowedTypes, maxLevel);

  for (let i = 0; i < characterCount; i++) {
    const character = playerGenerator.next().value;
    teamCharacters.push(character);
  }

  return new Team(teamCharacters);
}

