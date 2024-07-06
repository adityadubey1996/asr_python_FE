import React, { useState } from 'react';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');



  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    if (file) {
      uploadFile(file);
    }
  };

  const uploadFile = (file) => {
    const CHUNK_SIZE = (1024 * 1024) / 2; // 512KB chunk sizes
    let offset = 0;
    const fileId = Date.now(); // or generate a unique ID in another way

    // Example socket initialization (replace with your socket setup)
    const socket = { emit: () => {}, on: (event, callback) => {} };

    // First, signal the start of the upload
    socket.emit('start_upload', { fileName: file.name, fileId });

    const readSlice = o => {
      const slice = file.slice(offset, o + CHUNK_SIZE);
      const reader = new FileReader();
      reader.onload = (e) => {
        socket.emit('upload_chunk', {
          chunk: e.target.result,
          fileName: file.name,
          fileId
        });
      };
      reader.readAsArrayBuffer(slice);
    };

    socket.on('chunk_ack', () => {
      if (offset < file.size) {
        offset += CHUNK_SIZE;
        readSlice(offset);
        setUploadStatus(`Uploading... ${Math.min((offset / file.size) * 100, 100).toFixed(2)}%`);
      } else {
        socket.emit('end_upload', { fileName: file.name, fileId });
        setUploadStatus('Upload completed');
      }
    });

    readSlice(0);
  };

  return (
    <div className="bg-gray-50 flex items-center justify-center h-screen">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Upload file</h2>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input type="file" id="file-upload" className="hidden" onChange={handleFileInputChange} accept="audio/*,video/*" />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex flex-col items-center">
              <p className="mt-2 text-gray-500">Drag and Drop file here or <span className="text-blue-500">Choose file</span></p>
              <p className="text-xs text-gray-400 mt-1">Supported formats: MP3, WAV, MP4, MOV. Maximum size: 50MB</p>
            </div>
          </label>
        </div>
        {file && (
          <div className="mt-4 flex items-center">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            <p className="ml-2 text-gray-500">{file.name}</p>
          </div>
        )}
                {uploadStatus &&
                 <p className="text-center text-sm text-blue-500 mt-2">{uploadStatus}</p>
                 }

        <div className="mt-6 flex justify-end">
          <button className="text-gray-500 hover:text-gray-700 px-4 py-2">Cancel</button>
          <button disabled={uploadStatus !== 'Upload completed'} className={`bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-lg ml-2 ${uploadStatus !== 'Upload completed' && 'opacity-50 cursor-not-allowed'}`}>
            {uploadStatus === 'Uploading...' ? 'Uploading...' : uploadStatus === 'Upload completed' ? 'Next' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
