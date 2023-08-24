import * as React from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { IDetetctStatus } from '../../../models/IProctoring';
import { setAudioStatus } from '../../../redux/store/reducers/quizProctoringSlice';

export interface IQuizProctoringFieldProps {
    videoRef: React.LegacyRef<any> | undefined
    microphoneStream: any
}

const audio_sound_level_limits = [4,18]

const audioStatus: Record<IDetetctStatus, string> = {
    'ok': 'border-green-500',
    'warning': 'border-orange-500',
    'dangerous': 'border-red-400',
}

export default function QuizProctoringField({ videoRef, microphoneStream }: IQuizProctoringFieldProps) {
    const dispatch = useAppDispatch()
    const { proctoringRecordState } = useAppSelector(state => state.quizProctoring)
    const [soundLevel, setSoundLevel] = React.useState(0);

    const handleStartRecording = () => {
        if (!microphoneStream) return;

        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const microphone = audioContext.createMediaStreamSource(microphoneStream);
        const analyser = audioContext.createAnalyser();

        microphone.connect(analyser);

        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const updateMicrophoneLevel = () => {
            analyser.getByteFrequencyData(dataArray);
            const avgSoundLevel = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
            setSoundLevel(avgSoundLevel);
        };

        const interval = setInterval(updateMicrophoneLevel, 100);
        return () => {
          clearInterval(interval);
          audioContext.close();
          microphoneStream.getTracks().forEach((track: any) => track.stop());
        };
    };
    React.useEffect(() => {
        let tmp_status: IDetetctStatus = 'ok'
        if(soundLevel > audio_sound_level_limits[0] && soundLevel < audio_sound_level_limits[1]){
            tmp_status = 'warning'
        } else if(soundLevel > audio_sound_level_limits[1]){
            tmp_status = 'dangerous'
        }
        dispatch(setAudioStatus(tmp_status))
    }, [soundLevel])
    React.useEffect(() => {
        if (proctoringRecordState.audio.active) {
            handleStartRecording()
        }
    }, [proctoringRecordState.audio.active, microphoneStream])
    return (
        <div className={`relative w-40 h-40 border-4 ${audioStatus[proctoringRecordState.audio.frontend_process.status]}`}>
            <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                muted
            />
            {soundLevel.toString()}
        </div>
    );
}
