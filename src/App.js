import React, { useRef, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://127.0.0.1:5000', { transports: ['websocket'] });

function App() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = event => {
    const file = event.target.files[0];
    if (!file) return;
    setIsUploading(true);
    setUploadProgress(0);
    setUploadSuccess(false);
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = () => {
      const arrayBuffer = reader.result;
      // const chunkSize = 1024 * 1024; // 1 MB
      const chunkSize = 1024 * 100; // 1 MB

      let offset = 0;

      socket.emit('start_upload', { fileName: file.name });

      const uploadChunk = () => {
        console.log('arrayBUffer', arrayBuffer)
        if (offset < arrayBuffer.byteLength) {
          const chunk = arrayBuffer.slice(offset, Math.min(offset + chunkSize, arrayBuffer.byteLength));
          socket.emit('upload_chunk', { chunk: chunk, fileName: file.name }, () => {
            offset += chunkSize;
            const progress = (offset / arrayBuffer.byteLength) * 100;
            setUploadProgress(progress);
            if (offset < arrayBuffer.byteLength) {
              uploadChunk(); // Upload next chunk after acknowledgment
            } else {
              socket.emit('end_upload', { fileName: file.name }); // Notify server of upload completion
            }
          });
        }
      };

      uploadChunk();
    };

    reader.onerror = () => {
      console.error('Error reading file.');
      setIsUploading(false);
    };
  };

  socket.on('upload_success', () => {
    setUploadProgress(100);
    setIsUploading(false);
    setUploadSuccess(true);
  });

  return (
    <div className="App">
      <h2>File Upload</h2>
      <button onClick={() => fileInputRef.current.click()}>Upload File</button>
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} style={{ display: 'none' }} />
      {isUploading && (
        <div style={{ marginTop: '10px' }}>
          <label>Uploading: </label>
          <progress value={uploadProgress} max="100"></progress>
          <span>{uploadProgress.toFixed(2)}%</span>
        </div>
      )}
      {uploadSuccess && <p>Upload Success!</p>}
    </div>
  );
}

export default App;
