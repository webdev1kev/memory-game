import { createContext, useState, useEffect } from "react";
import generateGrid from "../helpers/generateGrid";

const initialState = {
  themes: {
    Numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    Symbols: [
      "bug",
      "car",
      "flask",
      "futbol",
      "hand-spock",
      "lira-sign",
      "moon",
      "snowflake",
      "sun",
      "anchor",
    ],
  },
  currentTheme: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
  numOfPlayers: 1,
  gridSize: "4X4",
  currentPlayer: 1,
  currentGameGrid: [],
  scoreOfPlayer: { 1: 0, 2: 0, 3: 0, 4: 0 },
  totalPairsLeft: 0,
  isSinglePlayer: true,
  reset: false,
  moves: 0,
};

export const GameContext = createContext({});

export default (props) => {
  const [gameState, setGameState] = useState(initialState);

  //MENU ACTIONS

  const setTheme = (theme) => {
    setGameState((state) => {
      state.currentTheme = state.themes[theme];
      return { ...state };
    });
  };

  const setNumberOfPlayers = (number) => {
    setGameState((state) => {
      state.numOfPlayers = number;
      if (number > 1) {
        state.isSinglePlayer = false;
      }
      return { ...state };
    });
  };

  const setGridSize = (grid) => {
    setGameState((state) => {
      state.gridSize = grid;
      return { ...state };
    });
  };

  const loadGameGrid = () => {
    setGameState((state) => {
      const gridTheme = state.currentTheme;
      const gridSize = state.gridSize === "4X4" ? 8 : 18;
      state.totalPairsLeft = gridSize;
      state.currentGameGrid = generateGrid(gridTheme, gridSize);

      return { ...state };
    });
  };

  //GAME ACTIONS

  const nextPlayer = () => {
    setGameState((state) => {
      if (state.currentPlayer === state.numOfPlayers) {
        state.currentPlayer = 1;
        return { ...state };
      }

      state.currentPlayer = state.currentPlayer + 1;
      return { ...state };
    });
  };

  const updatePlayerScore = () => {
    setGameState((state) => {
      const currentPlayer = state.currentPlayer;
      state.totalPairsLeft = state.totalPairsLeft - 1;
      state.scoreOfPlayer[currentPlayer] =
        state.scoreOfPlayer[currentPlayer] + 1;

      return { ...state };
    });
  };

  const updateMovesCounter = () => {
    setGameState((state) => {
      state.moves = state.moves + 1;
      return { ...state };
    });
  };

  const reset = () => {
    setGameState((state) => {
      state.reset = true;
      state.moves = 0;
      state.scoreOfPlayer = { 1: 0, 2: 0, 3: 0, 4: 0 };
      state.currentPlayer = 1;
      return { ...state };
    });
    loadGameGrid();
  };

  const newGame = () => {
    setGameState({ ...initialState });
    reset();
  };

  useEffect(() => {
    if (gameState.reset) {
      setGameState((state) => {
        state.reset = false;
        return { ...state };
      });
    }
  }, [gameState.reset]);

  return (
    <GameContext.Provider
      value={{
        gameState,
        menuActions: {
          setTheme,
          setNumberOfPlayers,
          setGridSize,
          loadGameGrid,
        },
        gameActions: {
          nextPlayer,
          updatePlayerScore,
          reset,
          newGame,
          updateMovesCounter,
        },
      }}
    >
      {props.children}
    </GameContext.Provider>
  );
};
