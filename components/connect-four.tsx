"use client"

import { useState } from 'react';
import { GameState, initGameState, makeMove, hasWon, isDraw, minimax, evaluation, getValidMoves } from '../lib/connect4/cfour';

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const ConnectFour = () => {
    const [gameState, setGameState] = useState<GameState>(initGameState);
    const [message, setMessage] = useState<string>('Your turn!');
    const [isProcessingMove, setIsProcessingMove] = useState(false);

    const checkGameOver = (game: GameState): boolean => {
        if (hasWon(game, 'r')) {
            setMessage('Red wins!');
            return true
        } else if (hasWon(game, 'y')) {
            setMessage('Yellow wins!');
            return true
        } else if (isDraw(game)) {
            setMessage('The game is a draw!');    
            return true
        }
        return false
    }

    const handleMove = (col: number) => {
        if (isProcessingMove || !getValidMoves(gameState).includes(col)) return;

        setIsProcessingMove(true);
        
        const newGameState = { 
            ...gameState, 
            position: gameState.position.map(row => [...row])
        };
        makeMove(newGameState, col);
        setGameState(newGameState);
        
        if (!checkGameOver(newGameState)) {
            setTimeout(() => {
                const aiGameState = { 
                    ...newGameState, 
                    position: newGameState.position.map(row => [...row])
                };
                
                makeMove(aiGameState, minimax(aiGameState, 5, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, evaluation)[1]);
                setGameState(aiGameState);
                checkGameOver(aiGameState);

                setIsProcessingMove(false);
            }, 250)
        } else {
            setIsProcessingMove(false);
        }

    };

  const renderCell = (row: number, col: number) => {
    const cellValue = gameState.position[row][col];
    const color = cellValue === 'r' ? '#FF4545' /* red */ : cellValue === 'y' ? '#F4FF5E' /* yellow */ : '';
    return (
      <div
        key={`${row}-${col}`}
        onClick={() => handleMove(col)}
        className={cellValue ? 'fade-in' : ''}
        style={{
          width: 50,
          height: 50,
          backgroundColor: color,
          border: '1px solid hsl(var(--border))',
          borderRadius: 30,
          display: 'inline-block',
          cursor: cellValue === '' ? 'pointer' : 'default',
          transition: 'background-color 0.3s ease',
        }}
      />
    );
  };

  const renderBoard = () => {
    return (
      <div className="grid grid-cols-7 grid-rows-6 gap-2 p-4 rounded-xl border-[1.5px]">
        {gameState.position.flatMap((row, i) =>
          row.map((_, j) => renderCell(5 - i, j))
        )}
      </div>
    );
  };
  
  return (
    <div>
      <h1>Connect Four</h1>
      <p>{message}</p>
      <div className="">{renderBoard()}</div>
    </div>
  );
  
};

export default ConnectFour;
