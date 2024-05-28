import { useCallback, useEffect, useState } from "react";
import styles from "./Tetris.module.css";

const COLUMNS = 10;
const ROWS = 20;
const row = new Array(COLUMNS).fill("black");

const I = {
  shape: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  color: "cyan",
};

const L = {
  shape: [
    [1, 0, 0],
    [1, 0, 0],
    [1, 1, 0],
  ],
  color: "orange",
};
const J = {
  shape: [
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 0],
  ],
  color: "blue",
};

const T = {
  shape: [
    [0, 0, 0],
    [0, 1, 0],
    [1, 1, 1],
  ],
  color: "pink",
};

const O = {
  shape: [
    [1, 1],
    [1, 1],
  ],
  color: "yellow",
};

const S = {
  shape: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  color: "green",
};

const Z = {
  shape: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  color: "red",
};
type Shape = number[][];

const SHAPES = [I, O, T, J, L, S, Z];

type Piece = {
  shape: Shape;
  color: string;
  x: number;
  y: number;
};

const floor = row.map(() => "red");

const emptyBoard = [
  ...new Array(ROWS).fill([]).map(() => structuredClone(row)),
  floor,
];

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export default function Tetris() {
  const [board, setBoard] = useState(emptyBoard);
  const [score, setScore] = useState(0);

  const [currentPiece, setCurrentPiece] = useState({
    ...I,
    x: 5,
    y: 1,
  });

  const addPiece = () => {
    const piece = randomElement(SHAPES);

    setCurrentPiece({
      ...piece,
      x: Math.round((Math.random() * COLUMNS) / 2),
      y: piece.shape.length,
    });
  };

  const withPiece = useCallback((piece: Piece, board: string[][]) => {
    const boardCopy = structuredClone(board);
    const { shape, x, y, color } = piece;

    for (let rowIndex = 0; rowIndex < shape.length; rowIndex++) {
      for (let colIndex = 0; colIndex < shape[rowIndex].length; colIndex++) {
        if (shape[rowIndex][colIndex] === 1) {
          boardCopy[rowIndex + y][colIndex + x] = color;
        }
      }
    }
    return boardCopy;
  }, []);

  const solidify = useCallback(
    (piece: Piece) => {
      setBoard((prev) => withPiece(piece, prev));
    },
    [withPiece]
  );

  const intersects = useCallback(
    (piece: Piece) => {
      const { shape, x, y } = piece;

      for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[i].length; j++) {
          const blockX = x + j;
          const blockY = y + i;
          if (shape[i][j] && (blockX >= COLUMNS || blockX < 0)) return true;
          if (board[blockY]?.[blockX]) {
            const occupied = board[blockY][blockX] !== "black";
            if (shape[i][j] === 1) {
              if (occupied) return true;
            }
          }
        }
      }
      return false;
    },
    [board]
  );

  const previewDrop = useCallback(() => {
    const pieceCopy = structuredClone(currentPiece);
    let hitFloor = false;

    while (!hitFloor) {
      hitFloor = intersects({ ...pieceCopy, y: pieceCopy.y + 1 });
      if (hitFloor) break;
      pieceCopy.y++;
    }
    return pieceCopy;
  }, [currentPiece, intersects]);

  const clearFilledLines = useCallback(() => {
    setBoard((prev) => {
      const completedRows: number[] = [];
      for (let i = 0; i < prev.length - 1; i++) {
        if (prev[i].every((cell) => cell !== "black")) {
          completedRows.push(i);
        }
      }
      if (completedRows.length === 0) return prev;
      setScore((prev) => prev + completedRows.length);

      return [
        ...new Array(completedRows.length)
          .fill([])
          .map(() => structuredClone(row)),
        ...prev.filter((_, i) => !completedRows.includes(i)),
      ];
    });
  }, []);

  const moveCurrentPiece = useCallback(
    (right: number, down: number) => {
      if (intersects(currentPiece)) {
        setBoard(emptyBoard);
        setScore(0);
        return;
      }
      for (let row = 0; row < currentPiece.shape.length; row++) {
        for (let col = 0; col < currentPiece.shape[row].length; col++) {
          if (currentPiece.shape[row][col] === 1) {
            const realX = currentPiece.x + col + right;

            if (realX < 0 || realX >= COLUMNS) return false;
          }
        }
      }
      if (
        intersects({
          ...currentPiece,
          y: currentPiece.y + down,
          x: currentPiece.x + right,
        })
      ) {
        addPiece();
        solidify(currentPiece);
        clearFilledLines();
        return;
      }

      setCurrentPiece((prev) => ({
        ...prev,
        y: prev.y + down,
        x: prev.x + right,
      }));
    },
    [currentPiece, intersects, clearFilledLines, solidify]
  );

  const rotate = useCallback(() => {
    const { shape } = currentPiece;
    const height = shape.length;
    const width = Math.max(...shape.map((row) => row.length));
    const newRow: number[] = new Array(height).fill(0);
    const newShape: number[][] = new Array(width)
      .fill([])
      .map(() => structuredClone(newRow));

    for (let row = 0; row < newShape.length; row++) {
      for (let col = 0; col < newShape[row].length; col++) {
        if (shape[col][row] === 1) newShape[row][shape.length - 1 - col] = 1;
      }
    }
    const newPiece = { ...currentPiece, shape: newShape };
    if (!intersects(newPiece)) {
      setCurrentPiece(newPiece);
    }
  }, [currentPiece, intersects]);

  const drop = useCallback(() => {
    addPiece();
    solidify(previewDrop());
    clearFilledLines();
  }, [previewDrop, clearFilledLines, solidify]);

  useEffect(() => {}, [
    currentPiece,
    intersects,
    board,
    moveCurrentPiece,
    withPiece,
  ]);

  useEffect(() => {
    const listener = (event: KeyboardEvent): void => {
      if (event.key === "ArrowLeft") moveCurrentPiece(-1, 0);
      if (event.key === "ArrowRight") moveCurrentPiece(1, 0);
      if (event.key === "ArrowDown") moveCurrentPiece(0, 1);
      if (event.key === "ArrowUp") rotate();
      if (event.key === " ") drop();
    };
    addEventListener("keydown", listener);

    const interval = setInterval(() => {
      moveCurrentPiece(0, 1);
    }, 300);

    return () => {
      removeEventListener("keydown", listener);
      clearInterval(interval);
    };
  }, [
    currentPiece,
    drop,
    intersects,
    moveCurrentPiece,
    previewDrop,
    clearFilledLines,
    rotate,
    solidify,
  ]);

  return (
    <div className={styles.Tetris}>
      <h2>Score: {score}</h2>
      <div className={styles.matrix}>
        {withPiece(
          currentPiece,
          withPiece({ ...previewDrop(), color: "rgba(255,255,255,0.1)" }, board)
        ).map((row, ri) => {
          const isFloor = ri === ROWS;
          if (isFloor) return;
          return (
            <div key={`${row.join()}${ri}`} className={styles.row}>
              {row.map((cell, ci) => (
                <div
                  key={`${cell}${ci}`}
                  className={styles.cell}
                  style={
                    cell === "black"
                      ? {
                          border: "10px solid black",
                          background: "black",
                        }
                      : { backgroundColor: cell, borderColor: cell }
                  }
                ></div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
