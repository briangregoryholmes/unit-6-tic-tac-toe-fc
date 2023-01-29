import { useState, useEffect, useId } from 'react';
import './App.css';

function App() {
  return <Board />;
}

function Board() {
  const boardStructure = Array(3).fill(new Array(3).fill('-'));

  const [board, setBoard] = useState(boardStructure);
  const [player, setPlayer] = useState('X');
  const [winningTriplet, setWinningTriplet] = useState([]);
  const [lastMove, setLastMove] = useState([0, 0]);

  function setSign(row, column) {
    const boardCopy = JSON.parse(JSON.stringify(board));
    setLastMove([row, column]);

    if (boardCopy[row][column] === '-') {
      boardCopy[row][column] = player;
      setBoard(boardCopy);
      setPlayer(player === 'X' ? 'O' : 'X');
    }
  }

  //This checks if there's a winner every time the board changes
  useEffect(() => {
    checkWinner();
  }, [board]);

  function checkWinner() {
    checkRows();
    checkColumns();
    checkDiagonals();
  }

  //All these checks happen based on the latest move
  function checkRows() {
    const boardCopy = JSON.parse(JSON.stringify(board));
    const row = boardCopy[lastMove[0]];
    console.log(row);
    if (row[0] === row[1] && row[1] === row[2] && row[0] !== '-') {
      setWinningTriplet([
        [lastMove[0], 0],
        [lastMove[0], 1],
        [lastMove[0], 2],
      ]);
    }
  }

  function checkColumns() {
    const boardCopy = JSON.parse(JSON.stringify(board));
    const column = boardCopy.map((row) => {
      return row[lastMove[1]];
    });
    if (
      column[0] === column[1] &&
      column[1] === column[2] &&
      column[0] !== '-'
    ) {
      setWinningTriplet([
        [0, lastMove[1]],
        [1, lastMove[1]],
        [2, lastMove[1]],
      ]);
    }
  }

  function checkDiagonals() {
    const boardCopy = JSON.parse(JSON.stringify(board));
    const diagonal1 = [boardCopy[0][0], boardCopy[1][1], boardCopy[2][2]];
    const diagonal2 = [boardCopy[0][2], boardCopy[1][1], boardCopy[2][0]];
    if (
      diagonal1[0] === diagonal1[1] &&
      diagonal1[1] === diagonal1[2] &&
      diagonal1[0] !== '-'
    ) {
      setWinningTriplet([
        [0, 0],
        [1, 1],
        [2, 2],
      ]);
    }
    if (
      diagonal2[0] === diagonal2[1] &&
      diagonal2[1] === diagonal2[2] &&
      diagonal2[0] !== '-'
    ) {
      setWinningTriplet([
        [0, 2],
        [1, 1],
        [2, 0],
      ]);
    }
  }

  function resetBoard() {
    setBoard(boardStructure);
    setPlayer('X');
    setWinningTriplet([]);
    setLastMove([0, 0]);
  }

  return (
    <div className="board">
      {board.map((rowArray, rowNum) => {
        const rowId = useId();
        return (
          <Row
            className="row"
            key={rowId}
            rowArray={rowArray}
            rowNum={rowNum}
            setSign={(row, column) => setSign(row, column)}
            winningTriplet={winningTriplet}
          />
        );
      })}
      <button className="reset" onClick={() => resetBoard()}>
        Reset
      </button>
    </div>
  );
}

function Row({ rowArray, setSign, rowNum, winningTriplet }) {
  return (
    <div className="row">
      {rowArray.map((sign, columnNum) => {
        const boxId = useId();
        return (
          <Box
            key={boxId}
            rowNum={rowNum}
            columnNum={columnNum}
            sign={sign}
            setSign={setSign}
            winningTriplet={winningTriplet}
          />
        );
      })}
    </div>
  );
}

function Box({ rowNum, columnNum, sign, setSign, winningTriplet }) {
  const isWinner = winningTriplet.some((box) => {
    return box[0] === rowNum && box[1] === columnNum;
  });

  return (
    <button
      disabled={sign !== '-' || winningTriplet.length}
      className={isWinner ? 'winner' : ''}
      style={{ width: '100px', height: '100px' }}
      onClick={() => setSign(rowNum, columnNum)}
    >
      <p>{sign.slice(0, 1)}</p>
    </button>
  );
}

export default App;
