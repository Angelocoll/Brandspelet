import { useState, useEffect } from "react";

export const useEditorInteraction = (
  selectedImageName,
  setAnchorEl,
  setClickedPosition
) => {
  const openMenu = (event) => {
    event.preventDefault();
    if (selectedImageName) {
      const x = (event.clientX / window.innerWidth) * 100;
      const y = (event.clientY / window.innerHeight) * 100;
      setClickedPosition({ x: Math.min(x, 95), y: Math.min(y, 95) });
      setAnchorEl(event.currentTarget);
    }
  };

  useEffect(() => {
    const handleRightClick = (event) => {
      // Kontrollera om högerklicket skedde på kartbilden eller inom MapView-komponenten
      const isOverMap =
        event.target.tagName === "IMG" ||
        event.target.closest("[data-map-view]");
      if (
        localStorage.getItem("auth") === "true" &&
        selectedImageName &&
        isOverMap
      ) {
        openMenu(event);
      }
    };

    window.addEventListener("contextmenu", handleRightClick);
    return () => window.removeEventListener("contextmenu", handleRightClick);
  }, [selectedImageName, setAnchorEl, setClickedPosition]);

  return { openMenu };
};
