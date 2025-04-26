import { useState, useEffect } from "react";

export const useGameLogic = (
  htmlTextArray,
  resetColorss,
  setGameCompleted,
  setIsGameStarted
) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [timer, setTimer] = useState(120);
  const [currentScorePercentage, setCurrentScorePercentage] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);

  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const goToNextQuestion = () => {
    resetColorss();
    if (currentQuestionIndex < htmlTextArray.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setGameCompleted(true);
      setIsGameStarted(false);
    }
  };

  useEffect(() => {
    let countdownInterval;
    if (setIsGameStarted && timer > 0) {
      // Korrigering: Använd setIsGameStarted för att kontrollera spelets status
      countdownInterval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    if (!setIsGameStarted || setGameCompleted) {
      // Korrigering: Använd setIsGameStarted och setGameCompleted för att kontrollera spelets status
      clearInterval(countdownInterval);
    }

    if (timer === 0 && setIsGameStarted) {
      // Korrigering: Använd setIsGameStarted för att kontrollera spelets status
      setGameCompleted(true);
      setIsGameStarted(false);
    }

    return () => clearInterval(countdownInterval);
  }, [
    setIsGameStarted,
    timer,
    correctAnswers,
    htmlTextArray.length,
    setGameCompleted,
  ]);

  const getTimerColor = () => {
    if (timer < 30) return "red";
    if (timer < 60) return "yellow";
    return "lightgreen";
  };

  const handleMarkerClick = (event, data, savedData, setSavedData) => {
    if (setIsGameStarted) {
      // Korrigering: Använd setIsGameStarted för att kontrollera spelets status
      const correctAnswer = htmlTextArray[currentQuestionIndex];
      const userAnswer = data.htmlText;

      const totalQuestions = htmlTextArray.length;
      const currentCorrect =
        userAnswer === correctAnswer ? correctAnswers + 1 : correctAnswers;
      const percentage =
        totalQuestions > 0 ? (currentCorrect / totalQuestions) * 100 : 0;
      setCurrentScorePercentage(percentage);

      if (userAnswer === correctAnswer) {
        setSavedData((prevData) =>
          prevData.map((item) =>
            item.id === data.id ? { ...item, color: "green" } : item
          )
        );
        setCorrectAnswers((prev) => prev + 1);
        setWrongAttempts(0);
        goToNextQuestion();
      } else {
        setSavedData((prevData) =>
          prevData.map((item) =>
            item.id === data.id ? { ...item, color: "red" } : item
          )
        );
        setWrongAttempts((prev) => prev + 1);

        if (wrongAttempts + 1 >= 3) {
          const correctData = savedData.find(
            (item) => item.htmlText === correctAnswer
          );
          if (correctData) {
            setSavedData((prevData) =>
              prevData.map((item) =>
                item.id === correctData.id ? { ...item, color: "purple" } : item
              )
            );
          }

          setTimeout(() => {
            if (correctData) {
              setSavedData((prevData) =>
                prevData.map((item) =>
                  item.id === correctData.id && item.color === "purple"
                    ? { ...item, color: "rgb(169, 169, 169)" }
                    : item
                )
              );
            }
            // resetColors(); // Denna funktion finns i huvudkomponenten, behöver eventuellt flyttas eller skickas som prop
            setWrongAttempts(0);
          }, 5000);
        }
      }
    }
  };

  return {
    currentQuestionIndex,
    correctAnswers,
    timer,
    currentScorePercentage,
    goToNextQuestion,
    getTimerColor,
    handleMarkerClick,
  };
};
