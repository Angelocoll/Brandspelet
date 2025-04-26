import React from "react";

const MarkerRenderer = ({ savedData, selectedImageName, isGameStarted, temporaryPopup, handleMarkerClick, handleMouseEnter, handleMouseLeave, hoveredElement }) => {
  return (
    <>
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
    </>
  );
};

export default MarkerRenderer;