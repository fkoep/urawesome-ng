export const enum Tile {
  Invalid = 'invalid',
  FourEyes = 'four-eyes',
  FiveDots = 'five-dots',
  Rosetta = 'rosetta',
  Finish = 'finish',
  FourCinques = 'four-cinques',
  Pyramid = 'pyramid',
  Blank = 'blank',
}

export class Board {
  // NOTE: tiles is row-major, layed out flat in memory
  constructor(
    public readonly width: number,
    public readonly tiles: ReadonlyArray<Tile>,
    readonly whitePath: ReadonlyArray<number>,
    readonly blackPath: ReadonlyArray<number>,
  ){
    /* assert this.tiles.length % this.width = 0 */
    /* assert all tiles in black path, white path are valid */
  }

  readonly height: number = this.tiles.length / this.width;
  readonly paths = {
    [Player.White]: this.whitePath,
    [Player.Black]: this.blackPath,
  };

  tile(x: number, y: number): Tile {
    return this.tiles[y * this.width + x];
  }
}

export const enum Player {
  White = 'white',
  Black = 'black',
}

// FIXME 
// namespace Player {
  export function nextPlayer(p: Player): Player {
    return (p == Player.White) ? Player.Black : Player.White;
  }
// }

export const enum GamePhase {
  ThrowDice = 'throw-dice',
  ChooseMove = 'choose-move',
  HasWon = 'has-won',
  HasConceded = 'has-conceded',
}

/* TODO use Start/Goal marker types instead of null */
export type Move = { fromPos?: number, toPos?: number };

export class GameState {
  constructor (
    public readonly numDice: number,
    public readonly numPieces: number,
    public readonly board: Board,
  ){}

  pieces: (Player | null) [] = new Array(this.board.tiles.length);
  dices: boolean[] = (new Array(this.numDice)).fill(false);

  phase: GamePhase = GamePhase.ThrowDice;
  currentPlayer: Player = Player.White;
  possibleMoves: Move[] = [];

  stashes = {
    [Player.White]: this.numPieces,
    [Player.Black]: this.numPieces,
  };
  scores = {
    [Player.White]: 0,
    [Player.Black]: 0, 
  };

  piece(x: number, y: number): Player | null {
    return this.pieces[y * this.board.width + x];
  }
}

// NOTE Ruleset shouldn't contain any state!
export interface Ruleset {
  numDice(): number;
  numPieces(): number;
  throwDice(state: GameState): void;
  chooseMove(state: GameState, moveIdx: number): void;
}

export class Game {
  private state: GameState;
  constructor(
    private ruleset: Ruleset,
    board: Board,
  ){
    this.state = new GameState(ruleset.numDice(), ruleset.numPieces(), board);
  }

  get board(): Board { return this.state.board }
  get possibleMoves(): ReadonlyArray<Move> { return this.state.possibleMoves; }
  get dices(): ReadonlyArray<boolean> { return this.state.dices; }
  get pieces(): ReadonlyArray<Player | null> { return this.state.pieces; }
  /* TODO type */
  get scores(): any { return this.state.scores; }
  /* TODO type */
  get stashes(): any { return this.state.stashes; }
  get phase(): GamePhase { return this.state.phase; }
  get currentPlayer(): Player { return this.state.currentPlayer; }
  piece(x: number, y: number): Player | null { return this.state.piece(x, y); }

  throwDice(): void { this.ruleset.throwDice(this.state); }
  chooseMove(moveIdx: number): void { this.ruleset.chooseMove(this.state, moveIdx); }

  concede(player: Player): void {
    switch (this.state.phase) {
      case GamePhase.HasWon:
      case GamePhase.HasConceded: {
        this.state.currentPlayer = player;
        this.state.phase = GamePhase.HasConceded;
      }
    }
  }

  reset(): void {
    this.state = new GameState(this.ruleset.numDice(), this.ruleset.numPieces(), this.state.board);
  }
}
