import React from "react";
import { Box, Button, Switch, Typography } from "@mui/material";

const AdminControls = ({ isEditorEnabled, setIsEditorEnabled, handleLogout, handleOpenUploadInput, showUploadInput }) => {
  return (
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
  );
};

export default AdminControls;