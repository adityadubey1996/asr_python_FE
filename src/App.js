import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://127.0.0.1:5000', { transports: ['websocket'] });

function App() {
  const [transcription, setTranscription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioContext, setAudioContext] = useState(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [mediaStreamSource, setMediaStreamSource] = useState(null);
  const [processor, setProcessor] = useState(null);
  const [audioUrl, setAudioUrl] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  useEffect(() => {
    socket.on('transcription_result', data => {
      console.log('data from transcription_result', data)
      setTranscription(prev => `${prev}\n${data.transcription}`);
    });

    socket.on('error', data => {
      console.error('Error:', data.error);
    });

    // Cleanup on component unmount
    return () => {
      socket.off('transcription_result');
      socket.off('error');
    };
  }, []);

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        setTranscription('')
        console.log('listening', stream)
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.start();

        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        console.log("AudioContext Sample Rate:", audioCtx.sampleRate, "Hz");

        const mediaStreamSrc = audioCtx.createMediaStreamSource(stream);
        const scriptProcessor = audioCtx.createScriptProcessor(4096, 1, 1);

        scriptProcessor.onaudioprocess = (e) => {
          const chunk = e.inputBuffer.getChannelData(0);
          const buffer = chunk.buffer;
          console.log(buffer);
          socket.emit('audio_chunk', buffer, { binary: true });
          // const chunk = e.inputBuffer.getChannelData(0);
          // socket.emit('audio_chunk', { audio: chunk.buffer });
        };

        mediaStreamSrc.connect(scriptProcessor);
        scriptProcessor.connect(audioCtx.destination);

        // Set states
        setAudioContext(audioCtx);
        setMediaStream(stream);
        setMediaStreamSource(mediaStreamSrc);
        setProcessor(scriptProcessor);
        setIsRecording(true);
      })
      .catch(err => console.error('Error getting audio', err));
  };

  const stopRecording = () => {
    // Stop and clean up the media stream
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
    }
    if (processor) {
      processor.disconnect();
    }
    if (mediaStreamSource) {
      mediaStreamSource.disconnect();
    }
    if (audioContext) {
      audioContext.close();
    }
    mediaRecorderRef.current.stop();

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);

      // Reset the state and refs
      // setIsRecording(false);
      audioChunksRef.current = [];
    };

    // Reset states
    setMediaStream(null);
    setMediaStreamSource(null);
    setProcessor(null);
    setAudioContext(null);
    setIsRecording(false);
  };

  return (
    <div className="App">
      <h2>Live Transcription</h2>
      {isRecording ? (
        <button onClick={stopRecording}>Stop Recording</button>
      ) : (
        <button onClick={startRecording}>Start Recording</button>
      )}
      <pre>{transcription}</pre>
      {audioUrl && (
        <div>
          <audio controls src={audioUrl} style={{ width: '100%', marginTop: '20px' }} />
          <a href={audioUrl} download="recording.wav" style={{ display: 'block', marginTop: '10px' }}>Download Recording</a>
        </div>
      )}
    </div>
  );
}

export default App;
