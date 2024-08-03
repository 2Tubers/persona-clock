import React, { useState } from "react";
import * as faceapi from "face-api.js";


function CreateAlarm(props) {
  const [hrs, setHrs] = useState("");
  const [min, setMin] = useState("");
  const [song, setSong] = useState("");
  // const [isRecognized, setIsRecognized] = useState(false);

  let faceMatcher;
  let descriptions = [];
  let userFaceDescriptor;
  let stream;

  function handleHrs(event) {
    var val = event.target.value;
    if (val >= 0 && val < 24) setHrs(val);
    else {
      alert("Invalid Hrs given");
      setHrs(0);
    }
  }

  function handleMins(event) {
    var val = event.target.value;
    if (val >= 0 && val <= 60) setMin(val);
    else {
      alert("Invalid Mins Given");
      setMin(0);
    }
  }
  async function handleSong(event) {
    setSong(event.target.value);
  }

  async function loadModels() {
    const MODEL_URL = "/models";

    await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
  }

  async function myFunc() {
    const video = document.getElementById("video");
    const canvas = document.getElementById("overlay");

    try {
      await loadModels();
      const displaySize = { width: video.width, height: video.height };
      faceapi.matchDimensions(canvas, displaySize);
      const intervalId =   setInterval(async () => {
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptors();

        // Ensure detections are valid before proceeding
        if (!detections) {
          console.log("No face detected");
          return;
        }

        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize
        );
         
        resizedDetections.forEach(d=> descriptions.push(d.descriptor));

         // Initialize LabeledFaceDescriptors with the detected face descriptors
    userFaceDescriptor = new faceapi.LabeledFaceDescriptors(
      "user",
      descriptions
    );

    // Initialize faceMatcher with the labeled face descriptor
    faceMatcher = new faceapi.FaceMatcher(userFaceDescriptor, 0.4);
    props.setFaceMatcher(faceMatcher);
    console.log("user face captured");
  

        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      }, 150);

    

      setTimeout(async() => {
        clearInterval(intervalId);
        console.log("Stopped capturing user face after 10 seconds");
        await clearCanvas(canvas);
      stopCamera();
       
      }, 10000);

    
    } catch (error) {
      console.error("Error in face detection:", error);
    }
  }

  async function setupCamera() {
    const video = document.getElementById("video");
    video.style.display="inline-block";
    const constraints = {
      video: true,
    };
    try {
      stream = await navigator.mediaDevices.getUserMedia(constraints);
      video.srcObject = stream;
      video.addEventListener("loadeddata", myFunc);
      
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  }


  async function clearCanvas(canvas) {
    return new Promise((resolve) => {
        const canvas = document.getElementById("overlay");
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
      resolve();
    });
  }

async function stopCamera() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
}
  // async function getUser() {
  //   const video = document.getElementById("video");
  //   const results = await faceapi
  //     .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
  //     .withFaceLandmarks()
  //     .withFaceDescriptor();
  //   const displaySize = { width: video.width, height: video.height };
  //   const resizedDetections = faceapi.resizeResults(results, displaySize);

  //   if (!resizedDetections) {
  //     console.log("No face detected from get user");
  //     return;
  //   }

  //   // Extract descriptors from the resized detections
  //   descriptions.push(resizedDetections.descriptor);

  //   // Initialize LabeledFaceDescriptors with the detected face descriptors
  //   userFaceDescriptor = new faceapi.LabeledFaceDescriptors(
  //     "user",
  //     descriptions
  //   );

  //   // Initialize faceMatcher with the labeled face descriptor
  //   faceMatcher = new faceapi.FaceMatcher(userFaceDescriptor, 0.4);
  //   console.log("user face captured");
  // }

  // async function recognizeUser() {
  //   await loadModels();
  //   const video = document.getElementById("video");
  //   // const video= await faceapi.fetchImage("https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Lionel-Messi-Argentina-2022-FIFA-World-Cup.jpg/400px-Lionel-Messi-Argentina-2022-FIFA-World-Cup.jpg?20221207131116")
  //   const displaySize = { width: video.width, height: video.height };
  //   const singleResult = await faceapi
  //     .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
  //     .withFaceLandmarks()
  //     .withFaceDescriptors();
  //   const resizedDetections = faceapi.resizeResults(singleResult, displaySize);
  //   if (!resizedDetections) {
  //     console.log("No face detected ");
  //     return;
  //   }

  //   if (!faceMatcher) {
  //     console.log("User face not captured yet");
  //     return;
  //   }

  //   resizedDetections.forEach((detection) => {
  //     const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
  //     console.log(bestMatch.toString());

  //     if (bestMatch.label != "user") {
  //       console.log("You are  not the user");
  //       // Here you can add logic to turn off the alarm
  //     } else {
  //       console.log("You are the user");
  //     }
  //   });
  // }

  return (
    <div>
      <form className="create">
      <div className="stylingInputs">
        <textarea
          className="creation"
          type="number"
          onChange={handleHrs}
          name="hour"
          placeholder="Hrs.."
          value={hrs}
          rows="3"
        />
        <textarea
          className="creation"
          type="number"
          onChange={handleMins}
          name="min"
          placeholder="Mins.."
          value={min}
          rows="3"
        />
        <textarea
          className="creation"
          type="text"
          onChange={handleSong}
          name="song"
          placeholder="Enter song name"
          value={song}
          rows="3"
        />
        </div>

<button className="neon-button"
        onClick={async (event) => {
          event.preventDefault();
          await setupCamera(); 
          document.getElementById("add").style.display="inline";
        }}
      >
        Enable Webcam to capture my image
      </button>
  
      <div  style={{ position: "relative", display: "inline-block" }}>
        <video id="video" width="1080" height="720" style={{display:'none'}}autoPlay muted></video>
        <canvas
          id="overlay"
          style={{ position: "absolute", top: 0, left: 0 }}
        ></canvas>
        </div>
      
        <button id="add" style={{display:'none'}}
          
          onClick={async (event) => {
            event.preventDefault();
            props.handler({ hrs: hrs, min: min, song: song,set:true });
            props.handleClicker();
            setHrs(0);
            setMin(0);
            setSong("");
          
          }}
        >
          Add
        </button>
      </form>

      
       
      
    </div>
  );
}

export default CreateAlarm;
