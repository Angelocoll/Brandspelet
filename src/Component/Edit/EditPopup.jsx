import React, { useRef } from "react";
import { Box, Button } from "@mui/material";

const EditPopup = ({ showPopup, editorContent, formattedContent, closePopup, saveData, setFormattedContent, setEditorContent }) => {
  const editorRef = useRef(null);

  if (!showPopup) {
    return null;
  }

  return (
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
      >
        {editorContent}
      </div>

      <Button
        onClick={saveData}
        variant="contained"
        disabled={localStorage.getItem("auth") !== "true"}
        sx={{ backgroundColor: "black", border: "1px solid white", color: "white", padding: "5px 15px" }}
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
  );
};

export default EditPopup;