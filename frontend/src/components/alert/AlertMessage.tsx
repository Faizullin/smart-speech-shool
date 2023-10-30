import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

export default function AlertMessage({
  bold,
  description,
  link,
}: {
  bold: string;
  description: string;
  link: string;
}) {
  return (
    <div
      className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
      role="alert"
    >
      <strong className="font-bold mr-3">{bold}</strong>
      <span className="block sm:inline">{description}</span>
      <div className="">
        <Link to={link} className="py-3 font-bold">
          <FormattedMessage id="app.start.label" />
        </Link>
      </div>
    </div>
  );
}
