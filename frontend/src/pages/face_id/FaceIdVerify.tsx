import * as React from "react";
import StudentService from "../../services/StudentService";
import { useNavigate } from "react-router-dom";
import FaceIdDetector from "../../components/face_id/FaceIdDetector";
import QuizSessionService, {
  ISessionData,
} from "../../services/QuizSessionService";
import Layout from "../../components/layouts/Layout";
import { openErrorModal } from "../../redux/store/reducers/errorModalSlice";
import { useAppDispatch } from "../../hooks/redux";

export interface IFaceIdVerifyProps {}

export default function FaceIdVerify(_: IFaceIdVerifyProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const routeFor = React.useRef<string>("");

  const handleSubmit = (data: FormData) => {
    StudentService.verifyViaFace(data)
      .then((_: any) => {
        const sessionData: ISessionData = {
          verified: true,
          for: routeFor.current,
        };
        QuizSessionService.setSessionData(sessionData);
        if (sessionData.for) {
          navigate(sessionData.for);
          window.location.reload();
        }
      })
      .catch((error) => {
        if (error.response.status === 403 && error.response.data) {
          dispatch(
            openErrorModal({
              status: 403,
              message: error.response.data.message,
            })
          );
          return;
        }
        console.error("error:", error);
      });
  };
  const handleFullDetect = (file: any) => {
    const formData = new FormData();
    formData.append("image", file);
    handleSubmit(formData);
  };

  React.useEffect(() => {
    const storedSessionData = QuizSessionService.getSessionData();
    if (storedSessionData === null) {
      return navigate("/");
    }
    routeFor.current = storedSessionData.for;
  }, []);

  return (
    <Layout>
      <div className="container mx-auto">
        <FaceIdDetector
          simple_check={{
            use: true,
            detectLimit: 2,
            onFullDetectSuccess: handleFullDetect,
          }}
        />
      </div>
    </Layout>
  );
}
