import {Component, OnInit, Input} from '@angular/core';
import * as ur from './gamelib'

@Component({
  selector: 'app-ur-game',
  templateUrl: './ur-game.component.html',
  styleUrls: ['./ur-game.component.css']
})
export class UrGameComponent implements OnInit {
  game = new ur.Game(ur.finkelRuleset, ur.CleanUrBoard);

  count(n: number): number[] { return Array.from(Array(n).keys()); }

  constructor() {}

  ngOnInit(): void {}

  throwDice(): void {
    (new Audio('assets/dice2.wav')).play();
    this.game.throwDice();
  }
  isActionTile(pos: number): boolean {
    return this.game.possibleMoves.findIndex((m) => m.fromPos == pos || m.fromPos == null && m.toPos == pos) != -1;
  }
  triggerActionTile(pos: number): void {
    (new Audio('assets/knock2.wav')).play();
    let moveIdx = this.game.possibleMoves.findIndex((m) => m.fromPos == pos || m.fromPos == null && m.toPos == pos);
    this.game.chooseMove(moveIdx);
  }
}
