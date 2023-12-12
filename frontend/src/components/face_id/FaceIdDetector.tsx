import React from "react";
import { FormattedMessage } from "react-intl";
import Loader from "../loader/Loader";
import * as faceapi from "face-api.js";
import useInterval from "../../hooks/useInterval";

const MODEL_URL =
  "https://cdn.jsdelivr.net/gh/cgarciagl/face-api.js@0.22.2/weights";

export type IFaceDirection = "left" | "right" | "straight";

const face_direction_labels: Record<IFaceDirection, string> = {
  straight: "Straight",
  left: "Left",
  right: "Right",
};

export interface IFaceIdProps {
  onCountChange?: (count: number) => void;
  delay_interval?: number;
  simple_check?: {
    use: boolean;
    detectLimit: number;
    onFullDetectSuccess: (data: File) => void;
  };
  right_left_check?: {
    use: boolean;
    onDetectSuccess?: (data: File, direction: IFaceDirection) => void;
    onFullDetectSuccess: () => void;
  };
}

function dataURLtoFile(dataURL: string, filename: string): File {
  const arr = dataURL.split(",");
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

const geIFaceDirection = (detection: any): IFaceDirection => {
  const landmarks = detection.landmarks;
  const nose = landmarks.getNose();
  const leftEye = landmarks.getLeftEye();
  const rightEye = landmarks.getRightEye();
  const left_diff = get_mean_x(nose) - get_mean_x(leftEye);
  const right_diff = get_mean_x(rightEye) - get_mean_x(nose);

  if (left_diff > right_diff && Math.abs(right_diff - left_diff) > 20) {
    return "left";
  } else if (left_diff < right_diff && Math.abs(right_diff - left_diff) > 20) {
    return "right";
  } else {
    return "straight";
  }
};

const get_mean_x = (landmarks: Array<{ x: number; y: number }>): number => {
  let total = 0;
  let counter = 0;
  landmarks.forEach((item) => {
    total += item.x;
    counter++;
  });
  return total / counter;
};

export default function FaceIdDetector({
  delay_interval,
  onCountChange,
  right_left_check,
  simple_check,
}: IFaceIdProps) {
  const [modelsLoaded, setModelsLoaded] = React.useState(false);
  const [captureVideo, setCaptureVideo] = React.useState(false);
  const detectCounter = React.useRef<number>(0);
  const [currentFaceState, setCurrentFaceState] =
    React.useState<IFaceDirection | null>(null);
  const [currentUpdateInterval, setUpdateInterval] = React.useState<
    number | null
  >(null);

  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const loadModels = async () => {
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]).then(() => {
        setModelsLoaded(true);
      });
    };
    loadModels();
  }, []);

  const startVideo = () => {
    setCaptureVideo(true);
    navigator.mediaDevices
      .getUserMedia({ video: { width: 300 } })
      .then((stream: any) => {
        let video: any = videoRef.current;
        if (video) {
          video.srcObject = stream;
          video.play();
        }
      })
      .catch((error) => {
        console.error("error:", error);
      });
  };

  const check = (detection: any) => {
    if (right_left_check?.use) {
      const direction = geIFaceDirection(detection);
      if (direction === currentFaceState) {
        const image = faceapi.createCanvasFromMedia(videoRef.current!);
        const base64Image = image.toDataURL("image/jpeg");
        const file = dataURLtoFile(base64Image, `image-${direction}.jpg`);
        if (currentFaceState === "straight") {
          setCurrentFaceState("left");
        } else if (currentFaceState === "left") {
          setCurrentFaceState("right");
        }
        if (right_left_check.onDetectSuccess) {
          right_left_check.onDetectSuccess(file, direction);
        }
        if (currentFaceState === "right") {
          closeWebcam();
        }
      } else if (currentFaceState === null && direction === "straight") {
        setCurrentFaceState("straight");
      }
    } else if (simple_check?.use) {
      if (detectCounter.current + 1 > simple_check.detectLimit) {
        const image = faceapi.createCanvasFromMedia(videoRef.current!);
        const base64Image = image.toDataURL("image/jpeg");
        const file = dataURLtoFile(base64Image, "image.jpg");
        if (simple_check.onFullDetectSuccess) {
          simple_check.onFullDetectSuccess(file);
          closeWebcam();
        }
      }
      detectCounter.current = detectCounter.current + 1;
      if (onCountChange !== undefined) {
        onCountChange(detectCounter.current);
      }
    } else if (detectCounter.current !== 0) {
      detectCounter.current = 0;
      if (onCountChange !== undefined) {
        onCountChange(detectCounter.current);
      }
    }
  };
  const handleVideoOnPlay = () => {
    setUpdateInterval(delay_interval || 300);
  };
  useInterval(async () => {
    if (modelsLoaded && canvasRef.current && videoRef.current) {
      const faceDetectionOptions = new faceapi.TinyFaceDetectorOptions({
        inputSize: 128,
      });
      const detection = await faceapi
        .detectSingleFace(videoRef.current, faceDetectionOptions)
        .withFaceLandmarks(true)
        .withFaceDescriptor();
      const ctx = (canvasRef.current as any).getContext("2d");
      ctx.clearRect(
        0,
        0,
        canvasRef.current.offsetWidth,
        canvasRef.current.offsetHeight
      );
      if (detection) {
        check(detection);
        const detectionsForSize = faceapi.resizeResults(detection, {
          width: videoRef.current.offsetWidth,
          height: videoRef.current.offsetHeight,
        });
        canvasRef.current.width = videoRef.current.offsetWidth;
        canvasRef.current.height = videoRef.current.offsetHeight;
        faceapi.draw.drawDetections(canvasRef.current, detectionsForSize);
        faceapi.draw.drawFaceLandmarks(canvasRef.current, detectionsForSize);

        if (right_left_check?.use && currentFaceState) {
          const text = face_direction_labels[currentFaceState];
          const textWidth = ctx.measureText(text).width;
          const x = (canvasRef.current.width - textWidth) / 2;
          const y = canvasRef.current.height / 2;
          ctx.fillStyle = "green";
          ctx.font = "30px Arial";
          ctx.fillText(text, x, y);
        }
      }
    }
  }, currentUpdateInterval);

  const closeWebcam = () => {
    if (videoRef.current !== null) {
      videoRef.current.pause();
      (videoRef.current as any).srcObject.getTracks()[0].stop();
    }
    setCaptureVideo(false);
  };
  return (
    <div className="py-12 container mx-auto">
      <div className="flex justify-center">
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
            <FormattedMessage id="app.face_id.close.label" />
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
            <FormattedMessage id="app.face_id.open.label" />
          </button>
        )}
      </div>
      {captureVideo ? (
        modelsLoaded ? (
          <>
            <div className="w-full flex justify-center">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "10px",
                }}
                className="max-w-[800px] w-full"
              >
                <video
                  ref={videoRef}
                  onPlay={handleVideoOnPlay}
                  className="w-full"
                  style={{ borderRadius: "10px" }}
                />
                <canvas ref={canvasRef} style={{ position: "absolute" }} />
              </div>
            </div>

            <p className="mt-10">
              <FormattedMessage id="app.face_id.warning.reload.label" />
            </p>
          </>
        ) : (
          <Loader />
        )
      ) : (
        <></>
      )}
    </div>
  );
}
