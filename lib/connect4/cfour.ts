import { shuffleArray } from "../utils";

export interface GameState {
    position: ('r' | 'y' | '')[][],
    turn: 'r' | 'y',
}

export const initGameState: GameState = {
    position: new Array(6).fill('').map(x => new Array(7).fill('')),
    turn: 'r',
}

export function printGame(game: GameState) {
    console.log(`Turn: ${game.turn}`);
    for (let i = 5; i > -1; i--) {
        let row = " |  ";
        for (let j = 0; j < 7; j++) {
            if (game.position[i][j] === '') {
                row += "_ ";
            } else {
                row += game.position[i][j] + " ";
            }
        }
        console.log(row + " |");
    }
}

export function getValidMoves(game: GameState): number[] {
    let r = []
    for (let j = 0; j<7; j++) {
        if (game.position[5][j] === '') {
            r.push(j) // valid moves from 0 to 6
        }
    }
    return r
}

export function makeMove(game: GameState, move: number) {
    

    if(!getValidMoves(game).includes(move) || gameIsOver(game)) return;
    
    for (let i = 0; i<7; i++) {
        if (game.position[i][move] === '') {
            game.position[i][move] = game.turn
            game.turn = game.turn === 'r' ? 'y' : 'r'
            break
        } 
    }
}

export function hasWon(game: GameState, player: 'r' | 'y'): boolean {
    const directions = [
        {dx: 1, dy: 0}, 
        {dx: 0, dy: 1}, 
        {dx: 1, dy: 1}, 
        {dx: 1, dy: -1}, 
    ];

    for (let i = 0; i<6; i++) {
        for (let j = 0; j<7; j++) {
            if (game.position[i][j] === player) {
                
                for (const {dx, dy} of directions) {
                    let count = 1;
                    for (let k=1; k<4; k++) {
                        const x = i + k*dx;
                        const y = j + k*dy;

                        if (x >= 0 && x < 6 && y >= 0 && y < 7 && game.position[x][y] == player) {
                            count++;
                        } else {
                            break;
                        }
                    }
                    if (count >= 4) {
                        return true
                    }
                }
            }
        }
    }
    return false
}

export function hasWonPositions(game: GameState, player: 'r' | 'y'): [number, number][] | null {
    const directions = [
        {dx: 1, dy: 0}, 
        {dx: 0, dy: 1}, 
        {dx: 1, dy: 1}, 
        {dx: 1, dy: -1}, 
    ];

    for (let i = 0; i<6; i++) {
        for (let j = 0; j<7; j++) {
            if (game.position[i][j] === player) {
                
                for (const {dx, dy} of directions) {
                    let count = 1;
                    for (let k=1; k<4; k++) {
                        const x = i + k*dx;
                        const y = j + k*dy;

                        if (x >= 0 && x < 6 && y >= 0 && y < 7 && game.position[x][y] == player) {
                            count++;
                        } else {
                            break;
                        }
                    }
                    if (count >= 4) {
                        return [[i, j], [i+count*dx, j+count*dy]]
                    }
                }
            }
        }
    }
    return null
}

export function isDraw(game: GameState): boolean {
    for (let j = 0; j<7; j++) {
        if (game.position[5][j] === '') {
            return false
        }
    }

    if (hasWon(game, 'r') || hasWon(game, 'y')) {
        return false
    }
    
    return true
}

export function gameIsOver(game: GameState): boolean {
    return (hasWon(game, 'r') || hasWon(game, 'y') || isDraw(game))
}

export function evaluation(game: GameState): number {

    if (hasWon(game, 'r')) {
        return Number.MAX_SAFE_INTEGER
    }
    if (hasWon(game, 'y')) {
        return Number.MIN_SAFE_INTEGER
    }

    return QualityOfPosition(game, 'r') - QualityOfPosition(game, 'y')
}

export function QualityOfPosition(game: GameState, player: 'r' | 'y'): number {
    const THREE_IN_A_ROW_SCORE = 100;
    const TWO_IN_A_ROW_SCORE = 10;
    const CENTER_COLUMN_SCORE = 5;
    
    const directions = [
        {dx: 1, dy: 0}, // Horizontal
        {dx: 0, dy: 1}, // Vertical
        {dx: 1, dy: 1}, // Diagonal Down-Right
        {dx: 1, dy: -1} // Diagonal Up-Right
    ]

    let twoStreak = 0;
    let threeStreak = 0;
    let centerPieces = 0;

    // Count two and three streaks
    for (let i = 0; i<6; i++) {
        for (let j = 0; j<7; j++) {
            if (game.position[i][j] === player) {
                for (const { dx, dy } of directions) {
                    let streak = 1;
                    
                    for (let k=1; k<3; k++) {
                        const x = i + k*dx;
                        const y = j + k*dy;

                        if (x >= 0 && x < 6 && y >= 0 && y < 7 && game.position[x][y] === player) {
                            streak++;
                        } else {
                            break;
                        }
                    }

                    if (streak === 3) {
                        threeStreak++;
                    } else if (streak === 2) {
                        twoStreak++;
                    }
                }
            }
        }
    }

    // Count center pieces
    for (let i = 0; i <6; i++) {
        if (game.position[i][3] === player) {
            centerPieces++;
        }
    }

    return (THREE_IN_A_ROW_SCORE * threeStreak) + (TWO_IN_A_ROW_SCORE * twoStreak) + (CENTER_COLUMN_SCORE * centerPieces)
}

// This function is not complete. Quality of position function is a bit wonky when
// counting two streaks, but it's ok for now, it works. 
function test_QualityOfPosition() {
    const game1: GameState = {
        position: [
            ['', '', 'r', 'r', 'r', '', ''],
            ['', '', '', 'r', '', '', ''],
            ['', '', '', 'r', '', '', ''],
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
        ],
        turn: 'r'
    }

    console.log("Quality of position: " + QualityOfPosition(game1, 'r'))
    printGame(game1)
}

export function minimax(game: GameState, depth: number, alpha: number, beta: number, evalFunc: (arg: GameState) => number): [number, number] {
    if (gameIsOver(game) || depth == 0) {
        return [evalFunc(game), -1]
    }

    // Red is maximizing, Yellow is minimizing
    let best_value = game.turn === 'r' ? Number.MIN_SAFE_INTEGER : Number.MAX_SAFE_INTEGER
    let moves = getValidMoves(game)
    shuffleArray(moves)
    let best_move = moves[0]
    for (const move of moves) {
        let new_game: GameState = {
            position: [...game.position.map(row => [...row])],
            turn: game.turn
        }
        makeMove(new_game, move)
        let h_value = minimax(new_game, depth-1, alpha, beta, evalFunc)[0]
        if (game.turn === 'r') {
            if (h_value > best_value) {
                best_value = h_value
                best_move = move
            }
            alpha = Math.max(alpha, best_value)
        } else {
            if (h_value < best_value) {
                best_value = h_value
                best_move = move
            }
            beta = Math.min(beta, best_value)
        }
        if (alpha >= beta) {
            break
        }
    }
    return [best_value, best_move]
}

export function wherePieceWouldLand(game: GameState, col: number): [number, number] | void {
    if(!getValidMoves(game).includes(col) || gameIsOver(game)) return;
    
    for (let i = 0; i<7; i++) {
        if (game.position[i][col] === '') {
            return [i, col]
        } 
    }
    return;
}


async function playGameAgainstComputer(initialState: GameState) {
    
    let game = initialState;
    printGame(game);

    while (true) {
        const validMoves = getValidMoves(game);
        // const move = await askQuestion(`Enter your move (${validMoves.join(', ')}): `);
        const moveNumber = 3

        if (!validMoves.includes(moveNumber)) {
            console.log("Invalid move. Please try again.");
            continue; 
        }

        makeMove(game, moveNumber);
        printGame(game);

        const prevTurn = game.turn === 'r' ? 'y' : 'r';
        if (hasWon(game, prevTurn)) {
            console.log(`Player ${prevTurn} wins!`);
            break;
        }

        if (isDraw(game)) {
            console.log("The game is a draw!");
            break;
        }

        makeMove(game, minimax(game, 5, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, evaluation)[1])
        console.log("The AI has played:");
        printGame(game)

        const prevTurnAgain = game.turn === 'r' ? 'y' : 'r';
        if (hasWon(game, prevTurnAgain)) {
            console.log(`Player ${prevTurnAgain} wins!`);
            break;
        }

        if (isDraw(game)) {
            console.log("The game is a draw!");
            break;
        }

        console.log("Red: " + QualityOfPosition(game, 'r'))
        console.log("Yellow: " + QualityOfPosition(game, 'y'))
        console.log("Evaluation: " + evaluation(game))

    }
}
