import React, { useState, useRef } from 'react';
import Item from './Item';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { Divider, Box, Button } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';

const Transcriptions = () => {
  const [items, setItems] = useState([
    { id: 1, fileName: 'file1.txt', timestamp: '2024-05-23 10:00', size: '15KB', language: 'EN', noOfSpeakers: 1, audioType: "General" },
    { id: 2, fileName: 'file2.txt', timestamp: '2024-05-23 11:00', size: '20KB', language: 'EN', noOfSpeakers: 1, audioType: "Telephone" },
    { id: 3, fileName: 'file3.txt', timestamp: '2024-05-23 12:00', size: '25KB', language: 'EN', noOfSpeakers: 1, audioType: "General" },
    // Add more items as needed
  ]);

  const fileInputRef = useRef(null);

  const handleShowTranscription = (id) => {
    console.log('Show transcription for item', id);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('File selected:', file);
    }
  };

  return (
    <Container maxWidth="lg" className="p-4">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" fontWeight="bold" className="text-gray-200">
          <FontAwesomeIcon icon={faEdit} /> Transcriptions
        </Typography>
        <Button variant="contained" color="primary" startIcon={<UploadIcon />} onClick={handleUploadClick}>
          Upload
        </Button>
      </Box>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <Divider />
      <br />
      {items.map(item => (
        <Item
          key={item.id}
          item={item}
          onShowTranscription={handleShowTranscription}
        />
      ))}
    </Container>
  );
};

export default Transcriptions;
