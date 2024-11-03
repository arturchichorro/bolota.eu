"use client"

import { useState } from 'react';
import { GameState, initGameState, makeMove, hasWon, hasWonPositions, isDraw, minimax, evaluation, getValidMoves, wherePieceWouldLand } from '../../lib/connect4/cfour';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import DArrow from '@/components/svg/darrowSvg';

const ConnectFour = () => {
  const [gameState, setGameState] = useState<GameState>(initGameState);
  const [message, setMessage] = useState<string>('');
  const [isProcessingMove, setIsProcessingMove] = useState(false);
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);
  const [humanVsHuman, setHumanVsHuman] = useState<boolean>(false);
  const [evalScore, setEvalScore] = useState<number>(0);
  const [showEvalBar, setShowEvalBar] = useState<boolean>(true);

  const checkGameOver = (game: GameState): boolean => {
      if (hasWon(game, 'r')) {
          setMessage('Player 1 wins!');
          return true
      } else if (hasWon(game, 'y')) {
          setMessage('Player 2 wins!');
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

      const plEvalMove = minimax(newGameState, 6, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, evaluation);

      setEvalScore(plEvalMove[0]);
      
      if (!checkGameOver(newGameState) && !humanVsHuman) {
          setTimeout(() => {
              const aiGameState = { 
                  ...newGameState, 
                  position: newGameState.position.map(row => [...row])
              };
              
              const aiEvalMove = minimax(aiGameState, 6, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, evaluation);

              makeMove(aiGameState, aiEvalMove[1]);
              setGameState(aiGameState);
              checkGameOver(aiGameState);

              setEvalScore(aiEvalMove[0]);

              setIsProcessingMove(false);
          }, 250)
      } else {
          setIsProcessingMove(false);
      }
  };

  const restartGame = (option: string) => {
    setMessage('')

    if (option === 'start') {
      setEvalScore(0);

      setHumanVsHuman(false);
      setGameState(initGameState)
    } else if (option === 'second') {
      setHumanVsHuman(false);
      setIsProcessingMove(true);
      setTimeout(() => {
        const aiGameState = { 
            ...initGameState, 
            position: initGameState.position.map(row => [...row])
        };
        
        const aiEvalMove = minimax(aiGameState, 6, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, evaluation);

        makeMove(aiGameState, aiEvalMove[1]);
        setGameState(aiGameState);
        checkGameOver(aiGameState);

        setEvalScore(aiEvalMove[0]);

        setIsProcessingMove(false);
    }, 250)
    } else {
      setEvalScore(0);

      setHumanVsHuman(true);
      setGameState(initGameState)
    }
  }

  const renderCell = (row: number, col: number) => {
    const cellValue = gameState.position[row][col];
    const landingSquare = hoveredCol !== null ? wherePieceWouldLand(gameState, hoveredCol) : undefined;
    const isLandingSquare = landingSquare && !isProcessingMove ? landingSquare[0] === row && landingSquare[1] === col : false;

    return (
      <div
        key={`${row}-${col}`}
        onClick={() => handleMove(col)}
        onMouseEnter={() => setHoveredCol(col)}
        onMouseLeave={() => setHoveredCol(null)}
        className={`
          ${cellValue ? 'fade-in' : ''} 
          w-10 sm:w-12 
          h-10 sm:h-12
          ${cellValue === 'r' ? "bg-secondary-foreground" : cellValue === 'y' ? "bg-secondary" : ""}
          border border-border rounded-[30px]
          ${cellValue === '' ? "cursor-pointer" : "cursor-default"}
          transition-colors duration-300 ease-in
          ${isLandingSquare ? "border-2 border-accent" : ""}
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

  const renderEval = () => {
    const MAX_EVAL = 500
    const MIN_EVAL = -500

    const actualEval = evalScore > MAX_EVAL ? 500 : evalScore < MIN_EVAL ? -500 : evalScore; 

    const normalizedScore = (actualEval - MIN_EVAL) / (MAX_EVAL - MIN_EVAL);

    const redValue = `${normalizedScore * 100}%`;
    const yellowValue = `${(1 - normalizedScore) * 100}%`;

    
    
    return (
      <div className="flex items-center justify-center">
        <div className="w-6 h-[80%] relative border-border border-2">
          <div
            className="absolute bottom-0 w-full transition-all duration-300 bg-secondary-foreground"
            style={{ height: redValue}}
          />
          <div
            className="absolute top-0 w-full transition-all duration-300 bg-secondary"
            style={{ height: yellowValue}}
          />
        </div>
      </div>
    )
  }

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
    <div className="flex flex-col sm:flex-row">
      <div className="flex flex-row">
        {showEvalBar && renderEval()}
        {renderBoard()}
      </div>
      <div className="flex flex-col justify-center items-center gap-2">
        {message && <span className="text-lg text-center text-accent">{message}</span>}
        <p className="text-sm text-center">Play as:</p>
        <Button className="w-60 sm:w-40" size="sm" variant="outline" onClick={() => restartGame('start')}>Player 1</Button>
        <Button className="w-60 sm:w-40" size="sm" variant="outline" onClick={() => restartGame('second')}>Player 2</Button>
        <Button className="w-60 sm:w-40" size="sm" variant="outline" onClick={() => restartGame('human')}>Human vs Human</Button>
        <div className="text-sm flex flex-row items-center justify-center gap-2">
          Eval Bar:
          <Switch className="my-2" checked={showEvalBar} onCheckedChange={(checked) => {setShowEvalBar(checked)}}/>
        </div>
      </div>
    </div>
  );
  
};

export default ConnectFour;
