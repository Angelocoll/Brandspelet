import React, { useState, useRef, useEffect } from "react";
import { Box, Button, Switch, Typography, Menu, MenuItem, TextField, Backdrop, FormControl, InputLabel, Select } from "@mui/material";
import { db, collection, addDoc, onSnapshot, doc, deleteDoc, updateDoc, getDoc } from "./firebaseConfig";
import { useNavigate } from "react-router-dom";
import MapView from "./Map/Mapview";
import ImageSelector from "./Map/ImageSelector";


const EditableClickListener = ({ onDataReady }) => {
  const [clickedPosition, setClickedPosition] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [savedData, setSavedData] = useState([]);
  const [editorContent, setEditorContent] = useState("Enter notes here...");
  const [formattedContent, setFormattedContent] = useState("");
  const [isEditorEnabled, setIsEditorEnabled] = useState(false);
  const [hoveredElement, setHoveredElement] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElLeftClick, setAnchorElLeftClick] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [htmlTextArray, setHtmlTextArray] = useState([]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [timer, setTimer] = useState(120);
  const editorRef = useRef(null);
  const navigate = useNavigate();
  const [temporaryPopup, setTemporaryPopup] = useState(null);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [currentScorePercentage, setCurrentScorePercentage] = useState(0);
  const [gameResult, setGameResult] = useState(null);
  const [gameCompleted, setGameCompleted] = useState(false);

  const [showUploadInput, setShowUploadInput] = useState(false);
  const [imageName, setImageName] = useState("");
  const [imageNames, setImageNames] = useState([]);
  const [selectedImageName, setSelectedImageName] = useState("");
  const [renderedImageUrl, setRenderedImageUrl] = useState("");

  const openMenu = (event) => {
    event.preventDefault();
    if (selectedImageName) {
      const x = (event.clientX / window.innerWidth) * 100;
      const y = (event.clientY / window.innerHeight) * 100;
      setClickedPosition({ x: Math.min(x, 95), y: Math.min(y, 95) });
      setAnchorEl(event.currentTarget);
    }
  };

  const closeMenu = () => setAnchorEl(null);

  const handleCreateElement = () => {
    setShowPopup(true);
    closeMenu();
  };

  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const goToNextQuestion = () => {
    resetColors();

    if (currentQuestionIndex < htmlTextArray.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setGameCompleted(true); // Sätt spelet som slutfört
      setIsGameStarted(false); // Stoppa spelet
    }
  };

  // Ny funktion för att visa inputfältet vid uppladdning
  const handleOpenUploadInput = () => {
    setShowUploadInput(true);
  };

  // Uppdaterad handleUpload-funktion för att inkludera namnet
  const handleUpload = () => {
    const myWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
        uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
        sources: ["local"],
        multiple: false,
        showAdvancedOptions: false,
        autoMinify: true,
        maxFileSize: 2000000,
      },
      async (error, result) => {
        if (!error && result && result.event === "success") {
          setImageUrl(result.info.secure_url);
          try {
            await addDoc(collection(db, "Image"), {
              url: result.info.secure_url,
              name: imageName, // Spara namnet från inputfältet
            });
            setShowUploadInput(false); // Stäng inputfältet efter uppladdning
            setImageName(""); // Rensa namnet
          } catch (firestoreError) {
            console.error("Firestore: uppladdnings fel", firestoreError);
          }
        } else if (error) {
          console.error("Cloudinary uppladdnings fel", error);
        }
      }
    );
    myWidget.open();
  };

  const resetColors = () => {
    setSavedData((prevData) =>
      prevData.map((item) => {
        if (item.color === "red" || item.color === "purple") {
          return { ...item, color: "rgb(0, 0, 0)" };
        }
        return item;
      })
    );
  };

  const resetColorss = () => {
    setSavedData((prevData) =>
      prevData.map((item) => ({
        ...item,
        color: "rgb(0, 0, 0)",
      }))
    );
  };

  const saveData = async () => {
    if (!formattedContent.trim()) {
      alert("Vänligen skriv adressen i rutan.");
      return;
    }

    const newData = {
      htmlText: formattedContent,
      position: selectedElement ? selectedElement.position : { x: clickedPosition.x, y: clickedPosition.y },
      to: selectedImageName,
    };


    try {
      if (selectedElement && selectedElement.id) {

        const docRef = doc(db, "Markers", selectedElement.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          await updateDoc(docRef, newData);
        } else {

          await addDoc(collection(db, "Markers"), newData);
        }
      } else {

        await addDoc(collection(db, "Markers"), newData);
      }

      closePopup();
      setSelectedElement(null);
    } catch (error) {
      console.error("Fel vid sparning av markör:", error);
    }
  };


  const closePopup = () => {
    setShowPopup(false);
    setEditorContent("Enter notes here...");
    setFormattedContent("");
    setSelectedElement(null);
  };

  const handleMouseEnter = (data) => {
    if (isEditorEnabled) {
      setHoveredElement(data);
    }
  };

  const handleMouseLeave = () => {
    if (isEditorEnabled) {
      setHoveredElement(null);
    }
  };

  const execCmd = (command, value = null) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, value);
    }
  };

  useEffect(() => {
    const handleRightClick = (event) => {
      if (isEditorEnabled && localStorage.getItem("auth") === "true" && selectedImageName) {
        openMenu(event);
      }
    };

    window.addEventListener("contextmenu", handleRightClick);
    return () => window.removeEventListener("contextmenu", handleRightClick);
  }, [isEditorEnabled, selectedImageName]);

  useEffect(() => {
    const unsubscribeMarkers = onSnapshot(collection(db, "Markers"), (snapshot) => {
      const fetchedData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filteredData = fetchedData.filter(marker => marker.to === selectedImageName);
      const htmlTexts = filteredData.map((item) => item.htmlText);

      setSavedData(filteredData);
      setHtmlTextArray(htmlTexts);

      if (typeof onDataReady === "function") {
        onDataReady(htmlTexts);
      }
    });

    const unsubscribeImages = onSnapshot(collection(db, "Image"), (snapshot) => {
      const fetchedImageNames = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        url: doc.data().url,
      }));
      setImageNames(fetchedImageNames);
    });

    return () => {
      unsubscribeMarkers();
      unsubscribeImages();
    };
  }, [onDataReady, selectedImageName]);

  useEffect(() => {
    const selectedImage = imageNames.find((img) => img.name === selectedImageName);
    if (selectedImage) {
      setRenderedImageUrl(selectedImage.url);
    } else {
      setRenderedImageUrl("");
    }
  }, [selectedImageName, imageNames]);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/");
  };

  const handleDelete = async () => {
    if (localStorage.getItem("auth") !== "true") {
      alert("Du måste vara inloggad för att ta bort markörer.");
      return;
    }

    if (selectedElement) {
      try {
        await deleteDoc(doc(db, "Markers", selectedElement.id));
      } catch (err) {
        console.error("Fel vid borttagning:", err);
      }
    }

    setAnchorElLeftClick(null);
  };

  const handleStartGame = () => {
    if(!selectedImageName) {
      alert("Vänligen välj en karta först.");
      return;
    }
    const filteredQuestions = savedData.map(item => item.htmlText);
    const shuffledQuestions = shuffleArray(filteredQuestions);
    setHtmlTextArray(shuffledQuestions);
    setIsGameStarted(true);
    setCurrentQuestionIndex(0);
    setCorrectAnswers(0);
    setTimer(120);
    setCurrentScorePercentage(0);
    setGameCompleted(false);
    resetColorss();
  };

  useEffect(() => {
    let countdownInterval;
    if (isGameStarted && timer > 0) {
      countdownInterval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    if (!isGameStarted || gameCompleted) {
      clearInterval(countdownInterval);
    }

    if (timer === 0 && isGameStarted) {
      setGameCompleted(true);
      setIsGameStarted(false);
    }

    return () => clearInterval(countdownInterval);
  }, [isGameStarted, timer, correctAnswers, htmlTextArray.length, gameCompleted]);

  const getTimerColor = () => {
    if (timer < 30) return "red";
    if (timer < 60) return "yellow";
    return "lightgreen";
  };

  const handleMarkerClick = (event, data) => {
    if (isGameStarted) {
      const correctAnswer = htmlTextArray[currentQuestionIndex];
      const userAnswer = data.htmlText;

      const totalQuestions = htmlTextArray.length;
      const currentCorrect = userAnswer === correctAnswer ? correctAnswers + 1 : correctAnswers;
      const percentage = totalQuestions > 0 ? (currentCorrect / totalQuestions) * 100 : 0;
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
          const correctData = savedData.find(item => item.htmlText === correctAnswer);
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
                  item.id === correctData.id && item.color === "purple" ? { ...item, color: "rgb(169, 169, 169)" } : item
                )
              );
            }
            resetColors();
            setWrongAttempts(0);
          }, 5000);
        }
      }
    }

    if (!isEditorEnabled) {
      setTemporaryPopup(data);
      setTimeout(() => {
        setTemporaryPopup(null);
      }, 5000);
    } else if (isEditorEnabled && localStorage.getItem("auth") === "true") {
      setSelectedElement(data);
      setAnchorElLeftClick(event.currentTarget);
    }
  };

  const handleImageNameChange = (event) => {
    setSelectedImageName(event.target.value);
  };

  return (
    <Box className="fade" sx={{ width: "100%" }}>
      {/* Bakgrundssuddighet när uppladdningsinput visas */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showUploadInput}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            backgroundImage: 'linear-gradient(180deg, rgb(255, 255, 255) 0%, rgb(132, 132, 132) 50%, rgb(0, 0, 0) 100%)',
            color: 'white',
            padding: 3,
            borderRadius: 2,
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
          }}
        >
          <TextField
            label="District Name"
            value={imageName}
            onChange={(e) => setImageName(e.target.value)}
            variant="outlined"

          />
          <Box display={"flex"} gap={2}>

          <Button onClick={handleUpload} variant="contained" color="primary" sx={{ backgroundColor: "black" }}>
            Done
          </Button>
          <Button onClick={() => setShowUploadInput(false)} variant="outlined" color="white">
            Cancel
          </Button>
          </Box>
        </Box>
      </Backdrop>

      <Box
        top={20}
        right={20}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        p={1}
        zIndex={999}
        mt={0}
        width="100%"
        boxSizing="border-box"
      >
        <Box display="flex" alignItems="center" flexDirection="row">
          <Typography color="white" variant="body1" mr={1}>
            Markers Control:
          </Typography>
          <Switch
            checked={isEditorEnabled}
            onChange={() => setIsEditorEnabled(!isEditorEnabled)}
            sx={{
              "& .MuiSwitch-thumb": {
                backgroundColor: isEditorEnabled ? "rgb(0, 255, 217) !important" : "white",
              },
              "& .MuiSwitch-track": {
                backgroundColor: isEditorEnabled ? "rgb(0, 255, 255) !important" : "grey",
              },
            }}
          />
        </Box>
        <Box display="flex" alignItems="center">
          <Button
            onClick={handleLogout}
            variant="outlined"
            size="small"
            sx={{ ml: 1, color: "white", borderColor: "white" }}
          >
            Logout
          </Button>
          <Button
            onClick={handleOpenUploadInput}
            variant="outlined"
            size="small"
            sx={{ ml: 1, color: "white", borderColor: "white" }}
            disabled={showUploadInput}
          >
            Upload Map
          </Button>
        </Box>
      </Box>
      <Box
        backgroundColor="#6d0000"
        display={"flex"}
        alignItems="center"
        justifyContent="start"
        padding={1}
        gap={4}
      >
       <ImageSelector
          imageNames={imageNames}
          selectedImageName={selectedImageName}
          handleImageNameChange={handleImageNameChange}
        />
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
        {gameResult && (
          <Typography variant="h6" color="yellow">
            {gameResult}
          </Typography>
        )}
      </Box>

      <MapView
        renderedImageUrl={renderedImageUrl}
        isEditorEnabled={isEditorEnabled}
        openMenu={openMenu}
      />

      {savedData
        .filter(data => data.to === selectedImageName)
        .map((data) => (
          <div
            key={data.id}
            className="custom-marker"
            style={{
              position: "absolute",
              top: `${data.position.y}%`,
              left: `${data.position.x}%`,
              transform: "translate(-50%, -50%)",
              width: "20px",
              height: "20px",
              backgroundColor: data.color || "rgb(0, 0, 0)",
              color: "black",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 1000,
            }}
            onMouseEnter={() => handleMouseEnter(data)}
            onMouseLeave={handleMouseLeave}
            onClick={(event) => handleMarkerClick(event, data)}
          ></div>
        ))}

      {(hoveredElement || temporaryPopup) && (hoveredElement?.position || temporaryPopup?.position) && (
        <div
          className="popup-container"
          style={{
            position: "absolute",
            top: `${(hoveredElement?.position?.y ?? temporaryPopup?.position?.y)}%`,
            left: `${(hoveredElement?.position?.x ?? temporaryPopup?.position?.x)}%`,
            transform: "translate(-50%, -100%)",
            backgroundColor: "white",
            padding: "10px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            zIndex: 2000,
            width: "auto",
            maxWidth: "200px",
            pointerEvents: "none",
            textAlign: "center",
            color: "black",
          }}
          dangerouslySetInnerHTML={{ __html: (hoveredElement?.htmlText ?? temporaryPopup?.htmlText) }}
        />
      )}

      {isEditorEnabled && localStorage.getItem("auth") === "true" && anchorEl && (
        <Menu
          open={Boolean(anchorEl)}
          onClose={closeMenu}
          anchorReference="anchorPosition"
          anchorPosition={{
            top: (clickedPosition.y / 100) * window.innerHeight,
            left: (clickedPosition.x / 100) * window.innerWidth,
          }}
        >
          <MenuItem onClick={handleCreateElement}>Edit Helpbox</MenuItem>
        </Menu>
      )}
      {isEditorEnabled && showPopup && localStorage.getItem("auth") === "true" && (
        <div
          className="popup-container"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "black",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(255, 255, 255, 0.1)",
            zIndex: 2000,
            width: "90%",
            maxWidth: "600px",
            boxSizing: "border-box",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            ref={editorRef}
            contentEditable
            onInput={() => {
              setFormattedContent(editorRef.current.innerHTML);
              setEditorContent(editorRef.current.innerHTML);
            }}
            style={{
              width: "100%",
              background: "linear-gradient(0, #6d0000, #333)",
              color: "white",
              border: "none",
              padding: "10px",
              height: "40vh",
              fontSize: "16px",
              boxSizing: "border-box",
              outline: "none",
              textAlign: "center",
              marginBottom: "10px",
            }}
          ></div>

          <Button
            onClick={saveData}
            variant="contained"
            disabled={localStorage.getItem("auth") !== "true"}
            sx={{  backgroundColor: "black", border: "1px solid white", color: "white", padding: "5px 15px" }}
          >
            Save
          </Button>
          <Button
            onClick={closePopup}
            variant="outlined"
            style={{ marginLeft: "10px", color: "red", borderColor: "red" }}
          >
            Close
          </Button>
        </div>
      )}

      <Menu
        open={Boolean(anchorElLeftClick)}
        onClose={() => setAnchorElLeftClick(null)}
        anchorEl={anchorElLeftClick}
      >
        <MenuItem
          onClick={() => {
            if (selectedElement) {
              setEditorContent(selectedElement.htmlText);
              setFormattedContent(selectedElement.htmlText);
              setShowPopup(true);
              setAnchorElLeftClick(null);
            }
          }}
        >
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </Box>
  );
};

export default EditableClickListener;
    