import * as React from "react";
import Table from "../../../components/table/Table";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import ExamService from "../../../services/ExamService";
import FeedbackDetailModal from "../../../components/modal/FeedbackDetailModal";
import { IFeedback } from "../../../models/IFeedback";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";
import { openErrorModal } from "../../../redux/store/reducers/errorModalSlice";
import { useAppDispatch } from "../../../hooks/redux";

export interface IResultIndexProps {}

interface TabsProps {
  tabs: {
    label: string;
    content: any;
  }[];
}

const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = React.useState(0);
  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };
  return (
    <div>
      <div>
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => handleTabClick(index)}
            className={`py-2 px-4 mr-2 rounded ${
              activeTab === index
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>{tabs[activeTab].content}</div>
    </div>
  );
};
const TableTab: React.FC<{ intl: IntlShape }> = ({ intl }) => {
  const dispatch = useAppDispatch();
  const [results, setResults] = React.useState<any[]>([]);
  const [showFeedback, setShowFeedback] = React.useState<boolean>(false);
  const [feedbackPayload, setFeedbackPayload] = React.useState<IFeedback>();
  const handleShowFeedback = (id: string) => {
    ExamService.fetchExamFeedback(id)
      .then((response) => {
        setFeedbackPayload(response.data);
        setShowFeedback(true);
      })
      .catch((error) => {
        if (error.response.status === 404) {
          dispatch(
            openErrorModal({
              status: 404,
              message: "No feedback!",
            })
          );
        }
      });
  };
  const columns = React.useMemo(
    () => [
      {
        key: "id",
        title: "ID",
        sortable: true,
        render: (exam: any, key: string | number) => (
          <th
            key={key}
            scope="row"
            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
          >
            {exam.id}
          </th>
        ),
      },
      {
        key: "exam",
        title: intl.formatMessage({
          id: "app.dashboard.results.exam.label",
        }),
        render: (result: any, key: string | number) => (
          <td key={key} className="px-6">
            {result.exam.id} ({result.exam.exam_type})
          </td>
        ),
      },
      {
        key: "subject",
        title: intl.formatMessage({
          id: "app.subject.label",
        }),
        render: (result: any, key: string | number) => (
          <td key={key} className="px-6">
            {result.exam.subject}
          </td>
        ),
      },
      {
        key: "practical_marks",
        title: intl.formatMessage({
          id: "app.dashboard.results.practical_marks.label",
        }),
      },
      {
        key: "theory_marks",
        title: intl.formatMessage({
          id: "app.dashboard.results.theory_marks.label",
        }),
      },
      {
        key: "total_marks",
        title: intl.formatMessage({
          id: "app.dashboard.results.total_marks.label",
        }),
      },
      {
        key: "actions",
        title: intl.formatMessage({
          id: "app.table.columns.actions.label",
        }),
        render: (result: any, key: string | number) => (
          <td key={key} className="px-6 py-4 text-right">
            <button
              onClick={(_) => handleShowFeedback(result.exam.id)}
              className="relative font-medium bg-transparent hover:bg-blue-500 text-blue-700 hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded mx-1 my-1"
            >
              <FormattedMessage id="app.dashboard.results.show_feedback.label" />
              {!result.feedback_watched && (
                <div className="absolute w-7 h-7 transform -translate-x-1/2 -translate-y-1/2 rounded-full top-0 left-0 bg-red-500"></div>
              )}
            </button>
          </td>
        ),
      },
    ],
    []
  );
  React.useEffect(() => {
    ExamService.fetchResultsMy().then((response) => {
      setResults(response.data);
    });
  }, []);
  return (
    <>
      <div className="overflow-x-auto">
        <Table data={results} columns={columns} />
      </div>
      <FeedbackDetailModal
        show={showFeedback}
        setShow={setShowFeedback}
        payload={feedbackPayload}
      />
    </>
  );
};

export default function ResultIndex(_: IResultIndexProps) {
  const intl = useIntl();
  const tabs = [
    {
      label: intl.formatMessage({
        id: "app.dashboard.results.table.label",
      }),
      content: <TableTab intl={intl} />,
    },
  ];
  return (
    <DashboardLayout>
      <div className="bg-white p-3 shadow-sm rounded-sm">
        <Tabs tabs={tabs} />
      </div>
    </DashboardLayout>
  );
}
