import { Challenge } from '@/challenges/core'
import { Move } from '@/move'
import { Chess } from './chess'
import { Coord } from '@/utils/coord'

/**
 * Like events in Elm.
 */
export type GameMessage =
  // Any human move, either for black or for white, potentially resulting in a premove
  | { type: 'handleHumanMove'; moveIntent: { from: Coord; to: Coord } }
  // A move has been decided and now has to be applied to the chess state
  | { type: 'makeMove'; move: Move }
  // An ask to recalculate the best move
  | { type: 'updateBestMove' }
  // Skip
  | { type: 'doNothing' }

/**
 * A way to control the sketch from the outside world.
 */
export type GameMethods = {
  /**
   * Reset the game.
   */
  reset: () => void
}

/**
 * A way to pass data from React to the sketch and vice-versa.
 */
export type GameProps = {
  /** The challenge to play. */
  challenge: Challenge | null
  /** Game search depth. */
  searchDepth: number
  /** Black makes moves automatically. */
  autoPlayEnabled: boolean
  /** Whether mouse/keyboard controls should be working. */
  controlsEnabled: boolean
  /** Display an arrow with the best move. */
  showBestMove: boolean
  /** Called when the evaluated best move/line changes. */
  onBestMoveChange: (move: Chess['bestMove']) => void
  /** Called when the sketch wants to communicate something (eg. debug output) to the user. */
  onOutputChange: (output: string) => void
  /** Called whenever the current status of the game changes (and also on every frame actually). */
  onStatusChange: (status: 'playing' | 'won' | 'lost' | 'draw') => void
  /** Called when current game's history changes. */
  onHistoryChange: (history: Chess['history']) => void
}
