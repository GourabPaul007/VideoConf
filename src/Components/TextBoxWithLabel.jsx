import React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

const TextBoxWithLabel = ({ label, value, onChange }) => {
  return (
    <Box>
      <TextField
        label={label}
        variant="outlined"
        value={value}
        onChange={onChange}
      />
    </Box>
  );
};

export default TextBoxWithLabel;
