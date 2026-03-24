import { useState, useCallback } from 'react';

const WIN_LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6],
];

function checkWinner(board) {
  for (const [a,b,c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c])
      return { winner: board[a], line: [a,b,c] };
  }
  return null;
}

function getBestMove(board, symbol) {
  const opp = symbol === 'X' ? 'O' : 'X';
  // Win if possible
  for (const [a,b,c] of WIN_LINES) {
    const cells = [board[a], board[b], board[c]];
    if (cells.filter(v => v === symbol).length === 2 && cells.includes(null)) {
      return [a,b,c].find(i => !board[i]);
    }
  }
  // Block opponent
  for (const [a,b,c] of WIN_LINES) {
    const cells = [board[a], board[b], board[c]];
    if (cells.filter(v => v === opp).length === 2 && cells.includes(null)) {
      return [a,b,c].find(i => !board[i]);
    }
  }
  // Center
  if (!board[4]) return 4;
  // Corner
  const corners = [0,2,6,8].filter(i => !board[i]);
  if (corners.length) return corners[Math.floor(Math.random() * corners.length)];
  // Any
  const open = board.map((v,i) => v === null ? i : null).filter(v => v !== null);
  return open[Math.floor(Math.random() * open.length)];
}

const TicTacToe = ({ onBack }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0, draw: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [status, setStatus] = useState('');

  const result = checkWinner(board);
  const isDraw = !result && board.every(Boolean);

  const handleClick = useCallback((i) => {
    if (board[i] || result || gameOver) return;
    const next = board.slice();
    next[i] = 'X';
    const afterPlayer = checkWinner(next);
    if (afterPlayer) {
      setBoard(next);
      setScores(s => ({ ...s, X: s.X + 1 }));
      setStatus('🏆 You win!');
      setGameOver(true);
      return;
    }
    if (next.every(Boolean)) {
      setBoard(next);
      setScores(s => ({ ...s, draw: s.draw + 1 }));
      setStatus("🤝 Draw!");
      setGameOver(true);
      return;
    }
    // AI move
    const aiIdx = getBestMove(next, 'O');
    if (aiIdx !== undefined) next[aiIdx] = 'O';
    const afterAI = checkWinner(next);
    if (afterAI) {
      setBoard(next);
      setScores(s => ({ ...s, O: s.O + 1 }));
      setStatus('🤖 AI wins!');
      setGameOver(true);
      return;
    }
    if (next.every(Boolean)) {
      setBoard(next);
      setScores(s => ({ ...s, draw: s.draw + 1 }));
      setStatus("🤝 Draw!");
      setGameOver(true);
      return;
    }
    setBoard(next);
  }, [board, result, gameOver]);

  const reset = () => {
    setBoard(Array(9).fill(null));
    setGameOver(false);
    setStatus('');
    setXIsNext(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '0.5rem' }}>
      {/* Score */}
      <div style={{ display: 'flex', gap: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
        <span style={{ color: '#22d3ee' }}>YOU: <strong>{scores.X}</strong></span>
        <span style={{ color: '#94a3b8' }}>DRAW: <strong>{scores.draw}</strong></span>
        <span style={{ color: '#f472b6' }}>AI: <strong>{scores.O}</strong></span>
      </div>

      {/* Board */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '6px', width: '252px'
      }}>
        {board.map((cell, i) => {
          const isWinCell = result?.line.includes(i);
          return (
            <button
              key={i}
              onClick={() => handleClick(i)}
              style={{
                width: '80px', height: '80px', fontSize: '2rem', fontWeight: 900,
                borderRadius: '10px', border: `2px solid ${isWinCell ? '#fde047' : 'rgba(168,85,247,0.3)'}`,
                background: isWinCell ? 'rgba(253,224,71,0.12)' : 'rgba(168,85,247,0.06)',
                color: cell === 'X' ? '#22d3ee' : '#f472b6',
                cursor: cell || gameOver ? 'default' : 'pointer',
                transition: 'all 0.15s',
                boxShadow: isWinCell ? '0 0 20px rgba(253,224,71,0.4)' : 'none',
              }}
            >
              {cell}
            </button>
          );
        })}
      </div>

      {/* Status */}
      {status && (
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 800,
          color: '#fde047', textShadow: '0 0 10px #f59e0b'
        }}>{status}</div>
      )}
      {!gameOver && !status && (
        <div style={{ color: '#94a3b8', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
          YOUR TURN (X)
        </div>
      )}

      <button
        onClick={reset}
        style={{
          padding: '0.4rem 1.2rem', borderRadius: '8px', fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
          background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.5)',
          color: '#c084fc', transition: 'all 0.2s',
        }}
      >
        ↺ NEW GAME
      </button>
    </div>
  );
};

export default TicTacToe;
