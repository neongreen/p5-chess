// @ts-check

/** A module for generating all quasi-legal moves.

Checks we do:
  - no leaping through other pieces
  - can only capture your opponent's pieces, not your own

Checks we *don't* do:
  - king check stuff
  
Moves we are currently entirely ignoring:
  - en passant
  - castling

*/

/**
 *
 * @param {Board} board
 * @param {Coord} pawn
 * @returns {Move[]}
 */
function pawnQuasiLegalMoves(board, pawn) {
  const piece = board.at(pawn)
  /** @type {Move[]} */
  let moves = []
  if (piece === WHITE_PAWN) {
    // going up 1 if empty
    if (board.isEmpty(pawn.n()))
      moves.push({ kind: 'normal', from: pawn, to: pawn.n() })
    // going up 2 if empty && we are on the second rank
    if (pawn.y === 1 && board.isEmpty(pawn.n()) && board.isEmpty(pawn.n().n()))
      moves.push({ kind: 'normal', from: pawn, to: pawn.n().n() })
    // captures if there's something to capture
    if (board.isOccupied(pawn.ne()) && color(board.at(pawn.ne())) === BLACK)
      moves.push({ kind: 'normal', from: pawn, to: pawn.ne() })
    if (board.isOccupied(pawn.nw()) && color(board.at(pawn.ne())) === BLACK)
      moves.push({ kind: 'normal', from: pawn, to: pawn.nw() })
  }
  if (piece === BLACK_PAWN) {
    // going down 1 if empty
    if (board.isEmpty(pawn.s()))
      moves.push({ kind: 'normal', from: pawn, to: pawn.s() })
    // going down 2 if empty && we are on the seventh rank
    if (pawn.y === 6 && board.isEmpty(pawn.s()) && board.isEmpty(pawn.s().s()))
      moves.push({ kind: 'normal', from: pawn, to: pawn.s().s() })
    // captures if there's something to capture
    if (board.isOccupied(pawn.se()) && color(board.at(pawn.ne())) === WHITE)
      moves.push({ kind: 'normal', from: pawn, to: pawn.se() })
    if (board.isOccupied(pawn.sw()) && color(board.at(pawn.ne())) === WHITE)
      moves.push({ kind: 'normal', from: pawn, to: pawn.sw() })
  }
  return moves
}

/**
 *
 * @param {Board} board
 * @param {Coord} rook
 * @returns {Move[]}
 */
function rookQuasiLegalMoves(board, rook) {
  /** @type {Move[]} */
  let moves = []
  const deltas = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ]
  for (let delta of deltas) {
    let xy = rook.shift(delta)
    while (board.isEmpty(xy)) {
      moves.push({ kind: 'normal', from: rook, to: xy })
      xy = xy.shift(delta)
    }
    if (board.isOccupied(xy) && color(board.at(xy)) !== color(board.at(rook))) {
      moves.push({ kind: 'normal', from: rook, to: xy })
    }
  }
  return moves
}

/**
 *
 * @param {Board} board
 * @param {Coord} bishop
 * @returns {Move[]}
 */
function bishopQuasiLegalMoves(board, bishop) {
  /** @type {Move[]} */
  let moves = []
  const deltas = [
    { x: 1, y: 1 },
    { x: -1, y: 1 },
    { x: 1, y: -1 },
    { x: -1, y: -1 },
  ]
  for (let delta of deltas) {
    let xy = bishop.shift(delta)
    while (board.isEmpty(xy)) {
      moves.push({ kind: 'normal', from: bishop, to: xy })
      xy = xy.shift(delta)
    }
    if (
      board.isOccupied(xy) &&
      color(board.at(xy)) !== color(board.at(bishop))
    ) {
      moves.push({ kind: 'normal', from: bishop, to: xy })
    }
  }
  return moves
}

/** Generates possible moves for a specific piece based on how pieces move, but without advanced checks.
 *
 * @param {Board} board
 * @param {Coord} coord
 * @returns {Move[]}
 */
function quasiLegalNormalMoves(board, coord) {
  const piece = board.at(coord)
  /** @type {Move[]} */
  let moves = []

  if (piece === EMPTY) return []

  if (isKing(piece)) {
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        if (x === 0 && y === 0) continue
        const target = coord.shift({ x, y })
        if (target.isValid() && color(board.at(target)) !== color(piece)) {
          moves.push({ kind: 'normal', from: coord, to: target })
        }
      }
    }
  }

  if (isQueen(piece)) {
    moves.push(...rookQuasiLegalMoves(board, coord))
    moves.push(...bishopQuasiLegalMoves(board, coord))
  }

  if (isRook(piece)) moves.push(...rookQuasiLegalMoves(board, coord))

  if (isBishop(piece)) moves.push(...bishopQuasiLegalMoves(board, coord))

  if (isKnight(piece)) {
    const deltas = [
      { x: 2, y: 1 },
      { x: 2, y: -1 },
      { x: 1, y: 2 },
      { x: 1, y: -2 },
      { x: -2, y: 1 },
      { x: -2, y: -1 },
      { x: -1, y: 2 },
      { x: -1, y: -2 },
    ]
    for (const delta of deltas) {
      const target = coord.shift(delta)
      if (target.isValid() && color(board.at(target)) !== color(piece)) {
        moves.push({ kind: 'normal', from: coord, to: target })
      }
    }
  }

  if (isPawn(piece)) moves.push(...pawnQuasiLegalMoves(board, coord))

  return moves
}
