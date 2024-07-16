import React, { useState, useRef, useEffect } from "react";
import Item from "./Item";
import { useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { Divider, Box, Button, Paper, Modal } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import io from "socket.io-client";
import {axiosInstance as axios,baseUrl, uploadFileToGCS, } from 'utils'
// import axios from "../../../../utils/axios-interceptor";
// import baseUrl from "../../../../utils/url";
import ReactPlayer from "react-player";
import { FilePreview, Metrics } from "./ModalData";
import UploadModal from './UploadModal'


const Transcriptions = () => {
  const [socket, setSocket] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [onUploadClick, setOnUploadClick] = useState(false)
  const fileInputRef = useRef(null);
  const [modalIndex, setModalIndex] = useState(0);
  const [fileIdUploading, setFileIdUploading] = useState(null)
  const[uploadPercentage, setUploadPercentage] = useState(null)
  const  [selectedMetric,  setSelectedMetric] = useState(null);
  const [progress, setProgress]= useState(null)
  const token = useSelector((state) => state?.user?.userData?.access_token)

  const deleteFileDueToProcessingError = async (fileId) => {
    try{
    const res = await axios.delete(`${baseUrl()}/api/audio-files/${fileId}`);
    if (res.status === 200) {
    
    const _copy =  [...fileList]
  const index = _copy.findIndex((e) => e.fileId === fileId)
  if(index !== -1 && _copy[index]){
    
    setFileList(...[_copy.filter((e) => e.fileId !== fileId)])
  }

  } else {
      alert("Something went wrong while deleting the file");
    }
  }
  catch(e){
    alert('something went wrong with error', e)
  }
  }



  const getFiles = async () => {
    const res = await axios.get(`${baseUrl()}/api/audio-files`);
    if (res.status === 200) {
    
      setFileList(res.data);
    } else {
      alert("Something went wrong");
    }
  };

  useEffect(() => {
    getFiles();
    if(!token){
      alert('File Upload not available')
      return;
    }
    const newSocket = null
  //   const newSocket = io("http://localhost:5005",{
  //     query: { token }
  // });
    setSocket(newSocket);
    return () => {
      if(newSocket){
      newSocket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("connect", () => {
      console.log("Connected to server");
    });
    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });
    socket.on("reconnect", () => {
      console.log("Reconnected to server");
    });

    socket.on("upload_success", async (data) => {
      console.log('data from upload_success', data)
      try {
        const res = await axios.put(`${baseUrl()}/api/audio-files`, {
          fileUrl: data.url,
          fileId: data.fileId,
          status: "uploaded",
        });
        if (res.status === 200) {
          await getFiles();
        }
      } catch (error) {
        console.error("Error:", error);
      }
    });

  
    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    socket.on('chunk_ack', () => {
      console.log('chunk_ack')
    })

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("reconnect");
      socket.off("error");
    };
  }, [socket]);

  const handleShowTranscription = (id) => {
    console.log("Show transcription for item", id);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    console.log('event',event.target.files[0])
    setSelectedFile(event.target.files[0]);
    event.target.value = null;
    setOnUploadClick(true)
  };

  const handleNext = () => {

    if(modalIndex === 1){
      setOnUploadClick(false)
      uploadFile(selectedFile)
      setModalIndex(null)
    } else {
      setModalIndex(modalIndex + 1);
    }
  };




  const uploadFile = async (file) => {
  //   try {
  //     const response = await axios.post(`${baseUrl()}/api/audio-file`, { status: "processing", userMetricId :selectedMetric  });
  //     if (response.status === 200 && response.data) {
  //         setFileIdUploading(response.data.fileId);
  //         setFileList((prev) => [...prev, response.data]);
  //         socket.emit('start_upload', { fileName: file.name, fileId: response.data.fileId });
  //     }
  // } catch (error) {
  //     console.error('Upload initialization failed', error);
  //     alert('Failed to start upload. Please try again.');
  // }

  try {
    console.log('file', file)
    await uploadFileToGCS(file, setProgress)

    // const response = await axios.post(`${baseUrl()}/api/audio-file`, { status: "processing", userMetricId :selectedMetric  });
    // if (response.status === 200 && response.data) {
    //     setFileIdUploading(response.data.fileId);
    //     setFileList((prev) => [...prev, response.data]);
    //     socket.emit('start_upload', { fileName: file.name, fileId: response.data.fileId });
    // }
} catch (error) {
    console.error('Upload initialization failed', error);
    alert('Failed to start upload. Please try again.');
}
    
  }

  useEffect(() => {
    console.log('progress from useEffect', progress)
  },[progress])

 


 

  const startChunkUpload = async (file, fileId) => {
    try{
  if(fileId && file){
      const CHUNK_SIZE = 512 * 1024;
      const reader = new FileReader();
      // let uploaded = 0; // To keep track of the number of bytes uploaded
      reader.onload = (event) => {
        const chunk = reader.result;
        // const chunk = event.target.result;
        // uploaded += chunk.byteLength; // Update the uploaded bytes
        socket.emit("upload_chunk", {
          chunk,
          fileName: file.name,
          fileId: fileId,
        });
  //       const progressPercentage = (uploaded / file.size) * 100;
  // setProgress({fileId: fileId, progressPercentage : progressPercentage}); // Update the progress state

  // if (uploaded < file.size) {
  //   const nextChunk = file.slice(uploaded, uploaded + CHUNK_SIZE);
  //   reader.readAsArrayBuffer(nextChunk);
  // } else {
  //   socket.emit("end_upload", { fileName: file.name });
  //   setProgress(100); // Ensure the progress is set to 100% at the end
  // }


        if (reader.readyState !== FileReader.DONE) {
          const nextChunk = file.slice(
            reader.loaded,
            reader.loaded + CHUNK_SIZE
          );
          reader.readAsArrayBuffer(nextChunk);
        } else {
          socket.emit("end_upload", { fileName: file.name });
        }
      };
      reader.onerror = () => {
        console.log('fileId from startChunkUpload onerror', fileId)
        console.log('file from startChunkUpload onerror', file)
        deleteFileDueToProcessingError(fileId)
        setSelectedFile(null);

      }
      reader.readAsArrayBuffer(file.slice(0, CHUNK_SIZE));
  }
  else{
    console.error('error while uploading file')
    console.log('fileId from startChunkUpload', fileId)
    console.log('file from startChunkUpload', file)
    setSelectedFile(null);
  }
}
catch(e){
  alert(e)
  console.log('error while startChunkUpload',e)
  setSelectedFile(null);
  if(fileId){
    deleteFileDueToProcessingError(fileId)
  }
}
  };

  const deleteFile = async (fileId) => {
    try{
      if(!fileId){
        throw new Error('File Id not Found')
      }
    const response = await axios.delete(`${baseUrl()}/api/audio-file`, { data : {fileId: fileId} });
  console.log('response from deleteFile', response)  
  }
    catch(e){
      alert(e)
    }
  }

  useEffect(() => {
    console.log('selectedFile',selectedFile)
    if (!socket) return;
    socket.on('start_ack', () => {
      startChunkUpload(selectedFile, fileIdUploading)})

    socket.on('chunk_did_not_received', (data) => {
      console.log('upload failed')
      setFileIdUploading(null)
      setSelectedFile(null)
      // alert('failed to upload file to server')
      // if(data.fileId){
      //   deleteFileDueToProcessingError(data.fileId)

      // }
    })
    socket.on('upload_failed', (data) => {
      console.log('upload failed for data', data)
      setFileIdUploading(null)
      setSelectedFile(null)
      alert('failed to upload file to server')
      if(data.fileId){
        deleteFileDueToProcessingError(data.fileId)

      }
    })

      },[selectedFile, fileIdUploading, socket])

  return (
    <Container maxWidth="lg" className="p-4">
      <form onSubmit={(e) => e.preventDefault()}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h6" fontWeight="bold" className="text-gray-200">
            <FontAwesomeIcon icon={faEdit} /> Transcriptions
          </Typography>
          <Button
            
            variant="contained"
            color="primary"
            startIcon={<UploadIcon />}
            onClick={handleUploadClick}
          >
            Upload
          </Button>
         
        </Box>
        <input
          type="file"
          accept="audio/*,video/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
         
        />
      </form>
      <Divider />
      <br />
      {fileList && Array.isArray(fileList) &&  fileList.length === 0
        ? "No file"
        : fileList.map((item) => (
            <Item
              
              key={item.id}
              item={item}
              onShowTranscription={handleShowTranscription}
              onDeleteClick={() => {deleteFileDueToProcessingError(item.fileId)}}
              progress={progress}
            />
          ))}
    { onUploadClick && <UploadModal
      modalIndex ={modalIndex}
      onUploadClick={onUploadClick}
      setOnUploadClick={setOnUploadClick}
      setModalIndex={setModalIndex}
      setSelectedFile={setSelectedFile}
      uploadFile={uploadFile}
      selectedFile={selectedFile}
      selectedMetric={selectedMetric}
      setSelectedMetric = {setSelectedMetric}
     />}
    </Container>
  );
};

export default Transcriptions;

