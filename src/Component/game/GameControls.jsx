import React from 'react';
import { Box, Button, Typography } from '@mui/material';

const GameControls = ({ isGameStarted, handleStartGame, currentQuestionIndex, htmlTextArray, timer, currentScorePercentage, gameCompleted, getTimerColor }) => {
  return (
    <>
      <Button
        onClick={handleStartGame}
        variant="contained"
        sx={{ ml: 1, color: "white", backgroundColor: "rgb(0, 0, 0)" }}
        id="start-game-button"
      >
        {isGameStarted ? "Restart Game" : "Start Game"}
      </Button>

      {isGameStarted && (
        <Box display={"flex"} gap={8} sx={{ zIndex: 100 }}>
          <Typography color="white" variant="h5">
            {htmlTextArray[currentQuestionIndex]}
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: getTimerColor(),
              animation:
                timer < 60
                  ? "pulse 1s infinite ease-in-out"
                  : "none",
              transition: "color 0.5s ease",
            }}
          >
            Time: {timer}
          </Typography>
          <Typography variant="h6" color="lightgreen">
            Points: {currentScorePercentage.toFixed(0)}%
          </Typography>
        </Box>
      )}
      {gameCompleted && (
        <Box display={"flex"} gap={8} sx={{ zIndex: 100 }}>
          <Typography color="white" variant="h5">
            Completed
          </Typography>
          <Typography variant="h5" sx={{ color: getTimerColor() }}>
            Time: {timer}
          </Typography>
          <Typography variant="h6" color="yellow">
            Result: {currentScorePercentage.toFixed(0)}%
          </Typography>
        </Box>
      )}
    </>
  );
};

export default GameControls;