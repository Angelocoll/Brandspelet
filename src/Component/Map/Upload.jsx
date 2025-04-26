import React from 'react';
import { Box, Button, TextField, Backdrop } from '@mui/material';

const UploadModal = ({ showUploadInput, imageName, setImageName, handleUpload, onClose }) => {
  if (!showUploadInput) {
    return null;
  }

  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={showUploadInput}
      onClick={onClose} // Stänger modalen om man klickar utanför
    >
      <Box
        onClick={(e) => e.stopPropagation()} // Förhindrar att klick inuti stänger modalen direkt
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
          sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 1, '& .MuiOutlinedInput-input': { color: 'white' }, '& .MuiInputLabel-outlined': { color: 'white' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' } }}
        />
        <Box display={"flex"} gap={2}>
          <Button onClick={handleUpload} variant="contained" color="primary" sx={{ backgroundColor: "black" }}>
            Done
          </Button>
          <Button onClick={onClose} variant="outlined" color="white">
            Cancel
          </Button>
        </Box>
      </Box>
    </Backdrop>
  );
};

export default UploadModal;