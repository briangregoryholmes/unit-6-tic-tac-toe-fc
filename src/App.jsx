import { useState, useEffect, useId } from 'react';
import './App.css';
import { atom, useAtom } from 'jotai';

const boardStructure = Array(3).fill(new Array(3).fill('-'));
const boardAtom = atom(boardStructure);
const lastMoveAtom = atom([0, 0]);
const playerAtom = atom('X');
const winningTripletAtom = atom([]);

function App() {
  return <Board />;
}

function Board() {
  const [board, setBoard] = useAtom(boardAtom);
  const [player, setPlayer] = useAtom(playerAtom);
  const [lastMove, setLastMove] = useAtom(lastMoveAtom);
  const [winningTriplet, setWinningTriplet] = useAtom(winningTripletAtom);

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
    const row = board[lastMove[0]];
    if (row[0] === row[1] && row[1] === row[2] && row[0] !== '-') {
      setWinningTriplet([
        [lastMove[0], 0],
        [lastMove[0], 1],
        [lastMove[0], 2],
      ]);
    }
  }

  function checkColumns() {
    const column = board.map((row) => {
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
    const diagonal1 = [board[0][0], board[1][1], board[2][2]];
    const diagonal2 = [board[0][2], board[1][1], board[2][0]];
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
          />
        );
      })}
      <button className="reset" onClick={() => resetBoard()}>
        Reset
      </button>
    </div>
  );
}

function Row({ rowArray, rowNum }) {
  return (
    <div className="row">
      {rowArray.map((sign, columnNum) => {
        const boxId = useId();
        return <Box key={boxId} rowNum={rowNum} columnNum={columnNum} />;
      })}
    </div>
  );
}

function Box({ rowNum, columnNum }) {
  const [winningTriplet] = useAtom(winningTripletAtom);
  const [board, setBoard] = useAtom(boardAtom);
  const [lastMove, setLastMove] = useAtom(lastMoveAtom);
  const [player, setPlayer] = useAtom(playerAtom);

  let sign = board[rowNum][columnNum];

  const isWinner = winningTriplet.some((box) => {
    return box[0] === rowNum && box[1] === columnNum;
  });

  function setSign(row, column) {
    const boardCopy = JSON.parse(JSON.stringify(board));
    setLastMove([row, column]);

    if (boardCopy[row][column] === '-') {
      boardCopy[row][column] = player;
      setBoard(boardCopy);
      setPlayer(player === 'X' ? 'O' : 'X');
    }
  }

  return (
    <button
      disabled={sign !== '-' || winningTriplet.length}
      className={isWinner ? 'winner' : ''}
      style={{ width: '100px', height: '100px' }}
      onClick={() => setSign(rowNum, columnNum)}
    >
      <p>{sign}</p>
    </button>
  );
}

export default App;
