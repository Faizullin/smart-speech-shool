import * as React from "react";
import * as faceapi from "face-api.js";
import Layout from "../../components/layouts/Layout";

// const requiredImageSize = 3;

export interface IFaceIdProps {
  detectLimit: number;
  onDetect?: (data: File) => void;
  onFullDetect?: (data: File) => void;
  onCountChange?: (count: number) => void;
}

// function dataURLtoFile(dataURL: string, filename: string): File {
//   const arr = dataURL.split(",");
//   const mime = arr[0].match(/:(.*?);/)![1];
//   const bstr = atob(arr[1]);
//   let n = bstr.length;
//   const u8arr = new Uint8Array(n);
//   while (n--) {
//     u8arr[n] = bstr.charCodeAt(n);
//   }
//   return new File([u8arr], filename, { type: mime });
// }

// function FaceIdDetector({
//   detectLimit,
//   onDetect,
//   onFullDetect,
//   onCountChange,
// }: IFaceIdProps) {
//   return <div className="py-12"></div>;
// }

export default function FaceIdTest() {
  const [modelsLoaded, setModelsLoaded] = React.useState<boolean>(false);
  const [captureVideo, setCaptureVideo] = React.useState(false);

  const videoRef = React.useRef();
  const videoHeight = 480;
  const videoWidth = 640;
  const canvasRef = React.useRef();

  function calculateFaceDirection(
    leftEye,
    rightEye,
    leftEyeBrow,
    rightEyeBrow
  ) {
    // You can implement your logic here to determine the face direction

    // For example, a simple logic could be checking the position of the eyes
    // and eyebrows to determine if the face is looking left, right, or direct

    const leftEyeX = calculateCenterX(leftEye);
    const rightEyeX = calculateCenterX(rightEye);

    const leftEyeBrowX = calculateCenterX(leftEyeBrow);
    const rightEyeBrowX = calculateCenterX(rightEyeBrow);

    // If right eye is more to the right than the left eye, the face is looking right
    if (rightEyeX > leftEyeX) {
      return "Face looks at right";
    }
    // If left eye is more to the left than the right eye, the face is looking left
    else if (leftEyeX > rightEyeX) {
      return "Head looks at left";
    }
    // Otherwise, the face is direct
    else {
      return "Face is direct";
    }
  }

  function calculateCenterX(points) {
    let totalX = 0;
    points.forEach((point) => {
      totalX += point.x;
    });
    return totalX / points.length;
  }
  const processDetectedImage = (detection: faceapi.FaceDetecion) => {
    const landmarks = detection.landmarks;
    const jawOutline = landmarks.getJawOutline();
    const nose = landmarks.getNose();
    const mouth = landmarks.getMouth();
    const leftEye = landmarks.getLeftEye();
    const rightEye = landmarks.getRightEye();
    const leftEyeBbrow = landmarks.getLeftEyeBrow();
    const rightEyeBrow = landmarks.getRightEyeBrow();
    console.log("Identified", { nose, leftEye, rightEye }, landmarks);
    const faceDirection = calculateFaceDirection(
      leftEye,
      rightEye,
      leftEyeBbrow,
      rightEyeBrow
    );

    // Log the face direction
    console.log("Face direction: " + faceDirection);
  };
  //   const onDetect = (detections) => {
  //     const landmarkPositions = landmarks.positions;
  //     const jawOutline = landmarks.getJawOutline();
  //     const nose = landmarks.getNose();
  //     const mouth = landmarks.getMouth();
  //     const leftEye = landmarks.getLeftEye();
  //     const rightEye = landmarks.getRightEye();
  //     const leftEyeBbrow = landmarks.getLeftEyeBrow();
  //     const rightEyeBrow = landmarks.getRightEyeBrow();
  //   };

  React.useEffect(() => {
    const MODEL_URL =
      "https://cdn.jsdelivr.net/gh/cgarciagl/face-api.js@0.22.2/weights"; //import.meta.env.BASE_URL + '/models'
    const loadModels = async () => {
      Promise.all([
        // faceapi.nets.ssdMobilenetv1.load(MODEL_URL),
        // faceapi.loadFaceRecognitionModel(MODEL_URL),
        // faceapi.loadFaceDetectionModel(MODEL_URL),
        // faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        // faceapi.loadFaceLandmarkModel(MODEL_URL),
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL),
      ]).then(() => {
        setModelsLoaded(true);
        console.log("Loaded");
      });
    };
    loadModels();
  }, []);

  const startVideo = () => {
    setCaptureVideo(true);
    navigator.mediaDevices
      .getUserMedia({ video: { width: 300 } })
      .then((stream) => {
        const video = videoRef.current;
        if (video !== undefined) {
          video.srcObject = stream;
          video.play();
        }
      })
      .catch((err) => {
        console.error("error:", err);
      });
  };

  const handleVideoOnPlay = () => {
    setInterval(async () => {
      if (canvasRef && canvasRef.current) {
        canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(
          videoRef.current
        );
        const displaySize = {
          width: videoWidth,
          height: videoHeight,
        };

        faceapi.matchDimensions(canvasRef.current, displaySize);
        const detection = await faceapi
          .detectSingleFace(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions({
              inputSize: 160,
            })
          )
          .withFaceLandmarks()
          .withFaceDescriptor();

        // const resizedDetection = faceapi.resizeResults(
        //   detection,
        //   displaySize
        // );

        if (canvasRef && canvasRef.current) {
          if (detection) {
            const dims = faceapi.matchDimensions(
              canvasRef.current,
              videoRef.current,
              true
            );
            const resizedResult = faceapi.resizeResults(detection, dims);
            const withBoxes = true;
            if (withBoxes) {
              faceapi.draw.drawDetections(canvasRef.current, resizedResult);
            }
            faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedResult);

            processDetectedImage(detection);
          }
        }
        // canvasRef &&
        //   canvasRef.current &&
        //   canvasRef.current
        //     .getContext("2d")
        //     .clearRect(0, 0, videoWidth, videoHeight);
        // canvasRef &&
        //   canvasRef.current &&
        //   faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
        // canvasRef &&
        //   canvasRef.current &&
        //   faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
        // canvasRef &&
        //   canvasRef.current &&
        //   faceapi.draw.drawFaceExpressions(
        //     canvasRef.current,
        //     resizedDetections
        //   );
      }
    }, 100);
  };

  const closeWebcam = () => {
    videoRef.current.pause();
    videoRef.current.srcObject.getTracks()[0].stop();
    setCaptureVideo(false);
  };

  return (
    <Layout>
      <div style={{ textAlign: "center", padding: "10px" }}>
        {captureVideo && modelsLoaded ? (
          <button
            onClick={closeWebcam}
            style={{
              cursor: "pointer",
              backgroundColor: "green",
              color: "white",
              padding: "15px",
              fontSize: "25px",
              border: "none",
              borderRadius: "10px",
            }}
          >
            Close Webcam
          </button>
        ) : (
          <button
            onClick={startVideo}
            style={{
              cursor: "pointer",
              backgroundColor: "green",
              color: "white",
              padding: "15px",
              fontSize: "25px",
              border: "none",
              borderRadius: "10px",
            }}
          >
            Open Webcam
          </button>
        )}
      </div>
      {captureVideo ? (
        modelsLoaded ? (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "10px",
              }}
            >
              <video
                ref={videoRef}
                height={videoHeight}
                width={videoWidth}
                onPlay={handleVideoOnPlay}
                style={{ borderRadius: "10px" }}
              />
              <canvas ref={canvasRef} style={{ position: "absolute" }} />
            </div>
          </div>
        ) : (
          <div>loading...</div>
        )
      ) : (
        <></>
      )}
    </Layout>
  );
}
