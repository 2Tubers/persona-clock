import React from "react";
import ReactDOM from "react-dom";
import App from "./App"


const MODEL_URL = '/models'

// await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
// await faceapi.loadFaceLandmarkModel(MODEL_URL);
// await faceapi.loadFaceRecognitionModel(MODEL_URL); 

// const input = document.getElementById('myImage');
// let fullFaceDescriptions = await faceapi.detectAllFaces(input).withFaceLandmarks().withFaceDescriptors();


// fullFaceDescriptions = faceapi.resizeResults(fullFaceDescriptions);
// faceapi.draw.drawDetections(canvas, fullFaceDescriptions);

// // faceapi.draw.drawLandmarks(canvas, fullFaceDescriptions);


// async function loadModels() {
//     await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
//     await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
//     await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
//     await faceapi.nets.faceExpressionNet.loadFromUri('/models');
// }

// async function captureFaceData() {
//     const video = await setupCamera();
//     video.play();

//     const canvas = document.getElementById('overlay');
//     const displaySize = { width: video.width, height: video.height };
//     faceapi.matchDimensions(canvas, displaySize);

//     const labeledDescriptors = [];

//     document.getElementById('captureButton').addEventListener('click', async () => {
//         const detections = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
//         if (detections) {
//             const faceDescriptor = detections.descriptor;
//             const label = 'User';
//             labeledDescriptors.push(new faceapi.LabeledFaceDescriptors(label, [faceDescriptor]));
//             alert('Face data captured successfully!');
//         } else {
//             alert('No face detected. Please try again.');
//         }
//     });

//     return labeledDescriptors;
// }

// loadModels().then(() => {
//     document.getElementById('setAlarmButton').addEventListener('click', captureFaceData);
// });




ReactDOM.render(<div>
    <App />
    </div>,
    document.getElementById("root"));

    