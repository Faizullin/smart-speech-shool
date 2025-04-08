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
  const [detectCounter, setDetectCounter] = React.useState<number>(0);
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
    let newCount = count;
    if (count > requiredImageSize) {
      newCount= requiredImageSize;
    } else if (newCount === 0) {
      setCapturedImages({
        straight: null,
        left: null,
        right: null,
      });
    }
    console.log("Count changed", newCount);
    setDetectCounter(newCount)
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
