import {Board, Tile} from './Game'

const B = Tile.Blank;
const R = Tile.Rosetta;
const FE = Tile.FourEyes;
const FC = Tile.FourCinques;
const FD = Tile.FiveDots;
const I = Tile.Invalid;
const F = Tile.Finish;
const P = Tile.Pyramid;

export const CommonUrBoard = new Board(8, [
  R, FE, FD, FE,  I,  I,  R, P,
  F, FD, FC,  R, FD, FC, FE, FD,
  R, FE, FD, FE,  I,  I,  R, P,
], [
  3, 2, 1, 0,
  8, 9, 10, 11, 12, 13, 14, 15,
  7, 6,
], [
  19, 18, 17, 16,
  8, 9, 10, 11, 12, 13, 14, 15,
  23, 22,
]);

export const CleanUrBoard = new Board(8, [
  /* TODO map */
  R, B, B, B, I, I, R, B,
  B, B, B, R, B, B, B, B,
  R, B, B, B, I, I, R, B,
], CommonUrBoard.whitePath, CommonUrBoard.blackPath);

export const AsebBoard = new Board(12, [
  R, B, B, B, I, I, I, I, I, I, I, I,
  B, B, B, R, B, B, B, R, B, B, B, R,
  R, B, B, B, I, I, I, I, I, I, I, I,
], [
  3, 2, 1, 0,
  12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
], [
  24, 25, 26, 27,
  12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
]);
