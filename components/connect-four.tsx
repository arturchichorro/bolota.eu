"use client"

import { useState } from 'react';
import { GameState, initGameState, makeMove, hasWon, isDraw, minimax, evaluation, getValidMoves } from '../lib/connect4/cfour';
import DArrow from '@/components/svg/darrow';

const ConnectFour = () => {
    const [gameState, setGameState] = useState<GameState>(initGameState);
    const [message, setMessage] = useState<string>('Your turn!');
    const [isProcessingMove, setIsProcessingMove] = useState(false);
    const [hoveredCol, setHoveredCol] = useState<number | null>(null);

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
        onMouseEnter={() => setHoveredCol(col)}
        onMouseLeave={() => setHoveredCol(null)}
        className={`
          ${cellValue ? 'fade-in' : ''} 
          w-12 
          h-12 
          bg-[${color}]
          ${cellValue === 'r' ? "bg-secondary" : cellValue === 'y' ? "bg-secondary-foreground" : ""}
          border border-border rounded-[30px]
          ${cellValue === '' ? "cursor-pointer" : "cursor-default"}
          transition-colors duration-300 ease-in
        `}
      />
    );
  };

  const renderArrow = (col: number) => {
    return (
        <div
            key={`arrow-${col}`}
            className={`arrow ${hoveredCol === col ? 'visible' : 'invisible'} flex justify-center`}
        >
          <DArrow size={20} color="text-accent"/>
        </div>
    );
  };

  const renderBoard = () => {
    return (
      <div className="grid grid-cols-7 grid-rows-[auto, repeat(7, 1fr)] gap-2 p-4">
        {[...Array(7)].map((_, col) => renderArrow(col))}
        
        {gameState.position.flatMap((row, i) =>
          row.map((_, j) => renderCell(5 - i, j))
        )}

        {['a', 'b', 'c', 'd', 'e', 'f', 'g'].map((letter, index) => (
          <div key={index} className="text-center text-accent">
            {letter}
          </div>
        ))}
      

      </div>
    );
  };

  return (
    <div>
      <h1>Connect Four</h1>
      <p>{message}</p>
      <div >{renderBoard()}</div>
    </div>
  );
  
};

export default ConnectFour;
