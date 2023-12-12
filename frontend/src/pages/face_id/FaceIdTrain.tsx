import * as React from "react";
import StudentService from "../../services/StudentService";
import { useNavigate } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import FaceIdDetector, {
  IFaceDirection,
} from "../../components/face_id/FaceIdDetector";
import Layout from "../../components/layouts/Layout";
import PrimaryButton from "../../components/form/auth/PrimaryButton";

const requiredImageSize = 3;

export default function FaceIdTrain() {
  const [capturedImages, setCapturedImages] = React.useState<
    Record<IFaceDirection, File | null>
  >({
    straight: null,
    left: null,
    right: null,
  });
  const detectCounter = React.useRef<number>(0);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [ready, setReady] = React.useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = () => {
    const formData = new FormData();
    Object.keys(capturedImages).forEach((key, index) => {
      if (index >= requiredImageSize) {
        return;
      }
      formData.append(`images`, capturedImages[key as IFaceDirection] as File);
    });
    setLoading(true);
    StudentService.trainFace(formData).then(() => {
      navigate("/dashboard/profile");
      setLoading(false);
      window.location.reload();
    });
  };
  const handleCountChange = (count: number) => {
    detectCounter.current = count;
    if (detectCounter.current > requiredImageSize) {
      detectCounter.current = requiredImageSize;
    } else if (detectCounter.current === 0) {
      setCapturedImages({
        straight: null,
        left: null,
        right: null,
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto">
        <FaceIdDetector
          onCountChange={handleCountChange}
          right_left_check={{
            use: true,
            onDetectSuccess(data: File, direction: IFaceDirection) {
              setCapturedImages((capturedImages) => ({
                ...capturedImages,
                [direction]: data,
              }));
              if (direction === "right") {
                setReady(true);
              }
            },
            onFullDetectSuccess() {},
          }}
        />
        <div className="mt-10 w-full flex flex-col">
          <span className="mx-auto text-lg mb-6">{detectCounter.current}</span>
          <PrimaryButton
            onClick={handleSubmit}
            processing={!ready && !loading}
            type="button"
            className="bg-green mx-auto mb-6"
          >
            <FormattedMessage id="app.submit.label" />
          </PrimaryButton>
        </div>
      </div>
    </Layout>
  );
}
