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
import axios from "../../../../utils/axios-interceptor";
import baseUrl from "../../../../utils/url";
import ReactPlayer from "react-player";
import { FilePreview, Metrics } from "./ModalData";
import Workflow from "../Workflow";

const Transcriptions = () => {
  const [socket, setSocket] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [onUploadClick, setOnUploadClick] = useState(false)
  const fileInputRef = useRef(null);
  const [modalIndex, setModalIndex] = useState(0);
  const [fileIdUploading, setFileIdUploading] = useState(null)
  const[uploadPercentage, setUploadPercentage] = useState(null)
  const token = useSelector((state) => state?.user?.userData?.access_token)

  const showModalContent = () => {
    if (modalIndex === 0 && selectedFile) {
      return <FilePreview selectedFile={selectedFile} />;
    }
    if (modalIndex === 1) {
      return <Metrics />;
    }
  };

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
    // const newSocket = null
    const newSocket = io("http://localhost:5005",{
      query: { token }
  });
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
        const res = await axios.post(`${baseUrl()}/api/update-audio-file`, {
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

 const handleBack=()=>{
    if(modalIndex > 0){
      setModalIndex(modalIndex - 1)
    }
  }

  const uploadFile = async (file) => {
    const response = await axios.post(`${baseUrl()}/api/audio-file`, { status: "processing" });
    if(response.status === 200 && response.data){
    setFileIdUploading(response.data.fileId)
    setFileList((prev) => 
      
      [...prev, response.data]
    )

    socket.emit('start_upload', { fileName: file.name, fileId: response.data.fileId });
    }
    
  }

 


 

  const startChunkUpload = async (file, fileId) => {
  if(fileId && file){
      const CHUNK_SIZE = 512 * 1024;
      const reader = new FileReader();
      reader.onload = () => {
        const chunk = reader.result;
        socket.emit("upload_chunk", {
          chunk,
          fileName: file.name,
          fileId: fileId,
        });

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
      reader.readAsArrayBuffer(file.slice(0, CHUNK_SIZE));
  }
  else{
    console.error('error while uploading file')
  }
  };

  useEffect(() => {
    if (!socket) return;
    socket.on('start_ack', () => {
      startChunkUpload(selectedFile, fileIdUploading)})

    socket.on('chunk_did_not_received', () => {
      console.log('upload failed')
      setFileIdUploading(null)
      setSelectedFile(null)
      alert('failed to upload file to server')
    })
    socket.on('upload_failed', () => {
      console.log('upload failed')
      setFileIdUploading(null)
      setSelectedFile(null)
      alert('failed to upload file to server')
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
            />
          ))}
      <Modal
        open={onUploadClick}
        onClose={() => {
          setSelectedFile(null);
          setModalIndex(0);
          setOnUploadClick(false)
        }}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "30px",
          marginBottom: "40px",
        }}
      >
        <Paper
          className="modal-content"
          style={{
            width: "40%",
            height: "100%",
            backgroundColor: "#1f2937",
            borderColor: "#1f2937",
            borderWidth: "1px",
            borderStyle: "solid",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {showModalContent()}
          <span className="flex justify-end">
            {modalIndex > 0 && (
              <Box p={2} style={{ alignSelf: "flex-end" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleBack}
                >
                  Back
                </Button>
              </Box>
            )}

            <Box p={2} style={{ alignSelf: "flex-end" }}>
              <Button variant="contained" color="primary" onClick={handleNext}>
                {modalIndex === 1 ? "Upload & Next" : "Next"}
              </Button>
            </Box>
          </span>
        </Paper>
      </Modal>
    </Container>
  );
};

export default Transcriptions;

//handlefilechange
// const file = event.target.files[0];
// console.log(file);
// if (file) {
//   uploadFile(file);
// }
