"use client"

import { useState } from 'react';
import { GameState, initGameState, makeMove, hasWon, isDraw, minimax, evaluation, getValidMoves } from '../lib/connect4/cfour';

const ConnectFour = () => {
  const [gameState, setGameState] = useState<GameState>(initGameState);
  const [message, setMessage] = useState<string>('Your turn!');

  const handleMove = (col: number) => {
    if (!getValidMoves(gameState).includes(col)) return;
    
    const newGameState = { ...gameState, position: gameState.position.map(row => [...row]) };
    makeMove(newGameState, col);
    setGameState(newGameState);
    
    if (hasWon(newGameState, 'r')) {
      setMessage('Red wins!');
    } else if (hasWon(newGameState, 'y')) {
      setMessage('Yellow wins!');
    } else if (isDraw(newGameState)) {
      setMessage('The game is a draw!');
    } else {
      makeMove(newGameState, minimax(newGameState, 5, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, evaluation)[1]);
      setGameState(newGameState);
      if (hasWon(newGameState, 'r')) {
        setMessage('Red wins!');
      } else if (hasWon(newGameState, 'y')) {
        setMessage('Yellow wins!');
      } else if (isDraw(newGameState)) {
        setMessage('The game is a draw!');
      }
    }
  };

  const renderCell = (row: number, col: number) => {
    const cellValue = gameState.position[row][col];
    const color = cellValue === 'r' ? '#FF4545' /* red */ : cellValue === 'y' ? '#F4FF5E' /* yellow */ : '';
    return (
      <div
        key={`${row}-${col}`}
        onClick={() => handleMove(col)}
        style={{
          width: 50,
          height: 50,
          backgroundColor: color,
          border: '1px solid hsl(var(--border))',
          borderRadius: 30,
          display: 'inline-block',
          cursor: cellValue === '' ? 'pointer' : 'default',
        }}
      />
    );
  };

  const renderBoard = () => {
    return (
      <div className="grid grid-cols-7 grid-rows-6 gap-2">
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
