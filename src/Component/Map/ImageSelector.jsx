import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const ImageSelector = ({ imageNames, selectedImageName, handleImageNameChange }) => {
  return (
    <FormControl variant="outlined" size="small" sx={{ mr: 1, color: 'white' }}>
      <InputLabel id="image-name-label" sx={{ color: 'white' }}>
        Map
      </InputLabel>
      <Select
        labelId="image-name-label"
        id="image-name-select"
        value={selectedImageName}
        onChange={handleImageNameChange}
        label="Map"
        sx={{
          '& .MuiSelect-select': {
            minWidth: '150px',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'white',
          },
          '& .MuiSvgIcon-root': {
            color: 'white',
          },
          color: 'white',
        }}
      >
        {imageNames.map((image) => (
          <MenuItem key={image.id} value={image.name}>
            {image.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ImageSelector;