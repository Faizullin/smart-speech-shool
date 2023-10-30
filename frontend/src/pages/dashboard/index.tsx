import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useAppSelector } from "../../hooks/redux";
import { FormattedMessage, useIntl } from "react-intl";
import AlertMessage from "../../components/alert/AlertMessage";

type Props = {};

const ProfileIndex = (_: Props) => {
  const intl = useIntl();
  const { student_payload, loading: loadingStudent } = useAppSelector(
    (state) => state.student
  );
  const { userData, loading: loadingUser } = useAppSelector(
    (state) => state.user
  );

  return (
    <DashboardLayout>
      <div className="bg-white p-3 shadow-sm rounded-sm">
        <div className="grid lg:grid-cols-2">
          <div>
            <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3">
              <span className="text-green-500">
                <svg
                  className="h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path fill="#fff" d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path
                    fill="#fff"
                    d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                  />
                </svg>
              </span>
              <span className="tracking-wide">
                <FormattedMessage id="app.education.label" />
              </span>
            </div>
            <ul className="list-inside space-y-2 mt-5">
              {!loadingUser && !userData.isStudent && (
                <AlertMessage
                  bold={intl.formatMessage({
                    id: "app.dashboard.alert.no_student.bold",
                  })}
                  description={intl.formatMessage({
                    id: "app.dashboard.alert.no_student.description",
                  })}
                  link="/dashboard/profile/edit/#student-form"
                />
              )}
              {!loadingStudent && !student_payload?.hasFaceId && (
                <AlertMessage
                  bold={intl.formatMessage({
                    id: "app.dashboard.alert.face_id.bold",
                  })}
                  description={intl.formatMessage({
                    id: "app.dashboard.alert.face_id.description",
                  })}
                  link="/face_id/train"
                />
              )}
              {!student_payload?.hasInitial && (
                <AlertMessage
                  bold={intl.formatMessage({
                    id: "app.dashboard.alert.initial_quiz.bold",
                  })}
                  description={intl.formatMessage({
                    id: "app.dashboard.alert.initial_quiz.description",
                  })}
                  link="/dashboard/exams"
                />
              )}
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfileIndex;
