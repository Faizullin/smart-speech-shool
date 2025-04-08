import { FormattedMessage } from "react-intl";
import { Document, Page, pdfjs } from "react-pdf";
import PrimaryButton from "../form/auth/PrimaryButton";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function FileViewer({ src }: { src: string }) {
  const isVideo = src.endsWith(".mp4");
  const isPDF = src.endsWith(".pdf");

  if (isVideo) {
    return (
      <>
        <div className="my-4">
          <PrimaryButton onClick={() => window.open(src)} className="font-bold w-auto">
            <FormattedMessage id="app.watch.label" defaultMessage="Watch" />
          </PrimaryButton>
        </div>
        <video width="100%" controls>
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </>
    );
  } else if (isPDF) {
    return (
      <>
        <div className="my-4">
          <PrimaryButton onClick={() => window.open(src)} className="font-bold w-auto">
            <FormattedMessage id="app.read.label" defaultMessage="Read" />
          </PrimaryButton>
        </div>
        {/* <Document file={src}>
          <Page pageNumber={1} />
        </Document> */}
      </>
    );
  } else {
    return (
      <div className="my-4">
        <PrimaryButton onClick={() => window.open(src)}className="font-bold w-auto">
          <FormattedMessage id="app.watch.label" defaultMessage="Watch" />
        </PrimaryButton>
        <div>Unsupported file format</div>
      </div>
    );
  }
}

export default FileViewer;
