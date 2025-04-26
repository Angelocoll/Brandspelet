import React from "react";
import { Box } from "@mui/material";

const MapView = ({ renderedImageUrl, isEditorEnabled, openMenu }) => {
  const handleRightClick = (event) => {
    if (isEditorEnabled && renderedImageUrl) {
      openMenu(event);
    }
  };

  return (
    <Box
      sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}
      onContextMenu={handleRightClick}
    >
      {renderedImageUrl && (
        <img src={renderedImageUrl} alt="Rendered Map" style={{ maxWidth: '100%', height: 'auto', userSelect: 'none' }} />
      )}
    </Box>
  );
};

export default MapView;