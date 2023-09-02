
interface IProtactorDisplayFieldProps {
    recording: boolean
    frame?: any
}

export default function ProtactorDisplayField({ recording, frame }: IProtactorDisplayFieldProps) {
    if (!recording) {
        return;
    }
    return (
        <div>
            <video src={frame}></video>
        </div>
    )
}