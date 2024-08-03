import React, { useState } from "react";
import * as faceapi from 'face-api.js';
function Content(props) {
  const [isChecked, setIsChecked] = useState(true);
 

  const handleToggle = () => {
    setIsChecked(!isChecked);
  };

  //if the alarm needs to be toggled or deleted facial recognition needs to be done.

  async function loadModels() {
    const MODEL_URL = "/models";

    await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
  }
let stream;
  async function setupCamera() {
    const video = document.getElementById("video");
    video.style.display="inline-block";
    const constraints = {
      video: true,
    };
    try {
     stream = await navigator.mediaDevices.getUserMedia(constraints);
      video.srcObject = stream;
      video.addEventListener("loadeddata", recognizeUser);
      
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  }
  async function stopCamera() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  }

  async function recognizeUser() {
    const canvas = document.getElementById("overlay");

    await loadModels();
   
   let faceMatcher=props.faceMatcher;
   console.log(faceMatcher);
    const video = document.getElementById("video");
    // const video= await faceapi.fetchImage("https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Lionel-Messi-Argentina-2022-FIFA-World-Cup.jpg/400px-Lionel-Messi-Argentina-2022-FIFA-World-Cup.jpg?20221207131116")
    const displaySize = { width: 1080, height: 720 };
    faceapi.matchDimensions(canvas, displaySize);
    const singleResult = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptors();
   
    const resizedDetections = faceapi.resizeResults(singleResult, displaySize);

    // const context = canvas.getContext("2d");
    // context.clearRect(0, 0, canvas.width, canvas.height);
    // faceapi.draw.drawDetections(canvas, resizedDetections);
    // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

    if (!resizedDetections || resizedDetections.length === 0) {
      console.log("No face detected ");
      setTimeout(recognizeUser, 1000);
      return;
    }
  
  

    if (!faceMatcher) {
      console.log("User face not captured yet");
      return;
    }
    
    const leftEye = resizedDetections[0].landmarks.getLeftEye();
    const rightEye =  resizedDetections[0].landmarks.getRightEye();
   
 
    const leftEAR = calculateEAR(leftEye);
    console.log(leftEAR);
    const rightEAR = calculateEAR(rightEye);
   console.log(rightEAR);


   //0.235
    const EAR_THRESHOLD = 0.195;  // Threshold value to determine if eyes are closed


    resizedDetections.forEach((detection) => {
      const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
      console.log(bestMatch.toString());

      if (bestMatch.label != "user") {
        console.log("You are  not the user");
    
      } else if((bestMatch.label=='user') && (leftEAR > EAR_THRESHOLD) && (rightEAR > EAR_THRESHOLD)) {
        console.log("You are the user")
        props.del(props.id)
        return;
        }
        else
        console.log("eyes are closed");
      recognizeUser();
        
    });
  }
  

  function euclideanDistance(point1, point2) {
    const dx = point2._x - point1._x;
    const dy = point2._y - point1._y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function calculateEAR(eye) {
    console.log(eye[1]._x);
  

    const p2_p6 = euclideanDistance(eye[1], eye[5]);
    const p3_p5 = euclideanDistance(eye[2], eye[4]);
    const p1_p4 = euclideanDistance(eye[0], eye[3]);
  
    console.log('p2_p6:', p2_p6);
    console.log('p3_p5:', p3_p5);
    console.log('p1_p4:', p1_p4);
  
    if (p1_p4 === 0) {
      console.error('Division by zero error in EAR calculation');
      return NaN;
    }
  
    const ear = (p2_p6 + p3_p5) / (2.0 * p1_p4);
    // console.log('EAR:', ear);
  
    return ear;
  }
  return (
    <div className="content">
    <div>
     <span>
        {props.hrs} : {props.min}
      </span>
      </div>
      <div>
      <input
        type="checkbox"
        id={`check-${props.id}`}
        checked={isChecked}
        onChange={handleToggle}
      ></input>
      <label htmlFor={`check-${props.id}`} className="alarm-turn"></label>
      </div>
      <div>
      <p>{props.song}</p>
      <button className="delete-button" onClick={async ()=>{await setupCamera(); 
                                                            }}  
                                                            >Delete</button>
      </div>
      <div>
      <div  style={{ position: "relative", display: "inline-block" }}>
        <video id="video" width="1080" height="720" style={{display:'none'}}autoPlay muted></video>
        <canvas
          id="overlay"
          style={{ position: "absolute", top: 0, left: 0 }}
        ></canvas>
        </div>
      <button
          onClick={(event) => {
            event.preventDefault();
            setupCamera();
          }}
        >
          Recognize User
        </button>
      </div>
    </div>
  );
}

export default Content;
