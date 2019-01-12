import {Move, Tile, nextPlayer, Ruleset, GamePhase, GameState} from './Game'

export class CommonUrRuleset implements Ruleset {
  constructor(
    private numDice_: number,
    private numPieces_: number,
    private exactFinish: boolean
  ){}

  numDice(): number { return this.numDice_; }
  numPieces(): number { return this.numPieces_; }

  throwDice(state: GameState): void {
    /* TODO split this up */

    state.dices = state.dices.map(() => Math.random() <= 0.5);
    let roll = state.dices.reduce((a, v) => a + ((v) ? 1 : 0), 0);

    /* generate possible moves */
    if (roll !== 0) {
      let path = state.board.paths[state.currentPlayer];
      let stash = state.stashes[state.currentPlayer];
      let score = state.scores[state.currentPlayer];

      /* iterate through player path */
      path.forEach((pos, i) => {
        let piece = state.pieces[pos];

        /* check if we can place a new piece */
        if (piece == null || piece !== state.currentPlayer) {
          if (i + 1 === roll && stash > 0) {
            state.possibleMoves.push({toPos: pos});
          }
          return
        }

        /* check if we can move this piece */
        let j = i + roll;
        if (this.exactFinish && j === path.length
          || !this.exactFinish && j >= path.length
        ){ 
          /* we can move out of game */
          state.possibleMoves.push({fromPos: pos});
        } else if (j < path.length) {
          /* check if we can move placed piece */
          let targetPos = path[j];
          let targetPiece = state.pieces[targetPos];
          let targetTile = state.board.tiles[targetPos];
          if (targetPiece == null /* no piece */
            || (targetPiece !== state.currentPlayer && targetTile != Tile.Rosetta) /* beatable piece */
          ){
            state.possibleMoves.push({fromPos: pos, toPos: targetPos});
          };
        }

      }); // player path
    } // generate moves

    /* determine next phase */
    if (state.possibleMoves.length !== 0) {
      state.phase = GamePhase.ChooseMove;
    } else {
      state.currentPlayer = nextPlayer(state.currentPlayer);
      state.phase = GamePhase.ThrowDice;
    }
  } // throwDice()

  chooseMove(state: GameState, moveIdx: number): void {
    let move: Move = state.possibleMoves[moveIdx];
    state.possibleMoves = [];

    if (move.fromPos == null) {
      /* place new piece */
      state.stashes[state.currentPlayer] -= 1;
    } else {
      /* move placed piece */
      state.pieces[move.fromPos] = null;
    }

    let extraTurn = false;
    if (move.toPos == null) {
      /* move piece out of game */
      state.scores[state.currentPlayer] += 1;
    } else {
      /* move piece to new position */
      if (state.pieces[move.toPos] != null) {
        /* beat piece of the other player */
        state.stashes[nextPlayer(state.currentPlayer)] += 1;
      }
      state.pieces[move.toPos] = state.currentPlayer;
      extraTurn = (state.board.tiles[move.toPos] === Tile.Rosetta);
    }

    if (state.scores[state.currentPlayer] == this.numPieces_) {
      state.phase = GamePhase.HasWon;
    } else {
      if (!extraTurn) {
        state.currentPlayer = nextPlayer(state.currentPlayer);
      }
      state.phase = GamePhase.ThrowDice;
    }
  } // chooseMove()
}

export const finkelRuleset = new CommonUrRuleset(4, 5, true);
