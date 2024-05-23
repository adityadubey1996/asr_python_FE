import React, {useState} from "react";
import TextField from "@mui/material/TextField";
import ActivityTable from "./ActivityTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileUpload } from "@fortawesome/free-solid-svg-icons";
import RecentRecordings from "./RecentRecordings";
import io from 'socket.io-client';

// const socket = io('http://127.0.0.1:5005', { transports: ['websocket'] });

const socket = null

const ActivityDashBoard = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');





  // const handleFileUploadClick = () => {
  //   document.getElementById("fileInput").click();
  // };

  // const handleFileInputChange = (e) => {
  //   const file = e.target.files[0];
  //   console.log("Selected file:", file);
  // };
  const handleFileUploadClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    if (file) {
      uploadFile(file);
    }
  };

  const uploadFile = (file) => {
    const CHUNK_SIZE = (1024 * 1024)/2; // 1MB chunk sizes
    let offset = 0;
    const fileId = Date.now(); // or generate a unique ID in another way

    // First, signal the start of the upload
    socket.emit('start_upload', { fileName: file.name });

    const readSlice = o => {
      const slice = file.slice(offset, o + CHUNK_SIZE);
      const reader = new FileReader();
      reader.onload = (e) => {
        socket.emit('upload_chunk', {
          chunk: e.target.result,
          fileName: file.name,
          fileId: fileId
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
        socket.emit('end_upload', { fileName: file.name, fileId: fileId });
        setUploadStatus('Upload completed');
      }
    });

    readSlice(0);
  };

 



 


  return (
    <div className="w-full">
      <div className="flex flex-row ">
        <ActivityTable />
        <div className="flex flex-col mt-10 w-[20%] ml-4">
          <h1 className="mb-2 font-medium text-lg">Transcription Language</h1>
          <TextField
            className="w-full"
            variant="outlined"
            name="language"
            type="text"
            value="en-English (United Kingdom)"
            disabled
          />
          <h1 className="mb-2 font-medium mt-5 text-lg">
            Transcription Options
          </h1>
          <h1
            className="text-center cursor-pointer bg-blue-600 py-2 rounded-md text-white mb-4"
            onClick={handleFileUploadClick}
          >
            <span>
              <FontAwesomeIcon icon={faFileUpload} /> Upload from device
            </span>
            <input
              id="fileInput"
              type="file"
              className="hidden"
              onChange={handleFileInputChange}
            />
          </h1>
        </div>
        <div>
        {uploadStatus && <p>{uploadStatus}</p>}
      </div>
      </div>
      <RecentRecordings />
    </div>
  );
};

export default ActivityDashBoard;
