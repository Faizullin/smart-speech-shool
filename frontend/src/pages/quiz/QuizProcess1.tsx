import * as React from 'react';
import ExamService from '../../services/ExamService';
import { useNavigate, useParams } from 'react-router-dom';
import { IMarked, IMarkedObj, IQuestion } from '../../models/IQuiz';
import PrimaryButton from '../../components/form/auth/PrimaryButton';
import { FormattedMessage } from 'react-intl';
import { Pagination } from '../../components/table/Table';
import QuizLayout from '../../components/layouts/QuizLayout';
import SecondaryButton from '../../components/form/auth/SecondaryButton';
import { AxiosError } from 'axios';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import QuestionItem from '../../components/quiz/QuestionItem';
import { ILangOption, Lang } from '../../lang/LangConfig';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { startRecording, stopRecording } from '../../redux/store/reducers/quizProctoringSlice';
import QuizProctoringField from '../../components/quiz/proctoring/QuizProctoringField';
import QuizSubmitPreviewModal from '../../components/modal/QuizSubmitPreviewModal';



export interface IQuizProcess1Props {
}

interface IQuizConfig {
    paginted: boolean,
    lazy: boolean,
}

const languageOptions: ILangOption[] = [
    { code: 'en', name: 'English' },
    { code: 'ru', name: 'Russian' },
    { code: 'kk', name: 'Kazakh' },
];

export default function QuizProcess1(_: IQuizProcess1Props) {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const params = useParams();
    const [selectedLanguage, setSelectedLanguage] = React.useState<Lang>('en');
    const [quizConfig] = React.useState<IQuizConfig>({
        paginted: true,
        lazy: false,
    })
    const [questions, setQuestions] = React.useState<IQuestion[]>([])
    const [marked, setMarked] = React.useState<IMarkedObj>({})
    const [currentQuestionPage, setCurrentQuestionPage] = React.useState<number>(0)
    const { proctoringRecordState } = useAppSelector(state => state.quizProctoring)
    const recordVideoRef = React.useRef<HTMLVideoElement | null>(null);
    const [recordedChunks, setRecordedChunks] = React.useState<Blob[]>([]);
    const mediaRecorder = React.useRef<MediaRecorder | null>(null);
    const [microphoneStream, setMicrophoneStream] = React.useState<any>(null);
    const quiz_id = params.id

    const [showQuizSubmitPreviewModal, setShowQuizSubmitPreviewModal] = React.useState<boolean>(false)
    const [quizSubmitPreviewPayload, setQuizSubmitPreviewPayload] = React.useState<IMarkedObj>({})


    const {
        listening,
        resetTranscript
    } = useSpeechRecognition();


    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        return null;
    }
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        console.log('Your browser does not support speech recognition software! Try Chrome desktop, maybe?');
    }
    const handleLanguageSelect = (langCode: Lang) => {
        setSelectedLanguage(langCode);
    };
    const handleMark = (question: IQuestion, answer: IMarked) => {
        const question_id = question.id
        let final_answer: IMarked;

        if (question.question_type === 'c') {
            let old_answer_ids: IMarked = []
            if (Object.keys(marked).includes(question_id)) {
                old_answer_ids = marked[question_id]
            }
            if (old_answer_ids.includes(answer[0])) {
                old_answer_ids = old_answer_ids.filter(element => element !== answer[0])
            } else {
                old_answer_ids.push(answer[0])
            }
            final_answer = old_answer_ids
        } else if (question.question_type === 'o') {
            final_answer = answer
        } else {
            console.log("Unrecognized question type: ", question.question_type)
            return
        }
        setMarked(marked => ({
            ...marked,
            [question_id]: final_answer,
        }))
    }
    const handleSendClick = (event: Event) => {
        event.preventDefault()
        setQuizSubmitPreviewPayload({
            ...marked,
        })
        setShowQuizSubmitPreviewModal(true)
    }
    // const handleQuizConfigChange = (e: any) => {
    //     setQuizConfig(quizConfig => ({
    //         ...quizConfig,
    //         ...e,
    //     }))
    // }
    const handleQuit = () => {
        sessionStorage.clear()
        dispatch(stopRecording())
        setTimeout(() => {
            navigate('/dashboard/exams')
            window.location.reload()
        }, 500)
    }
    const handleQuestionPageChange = (page: number) => {
        setCurrentQuestionPage(page)
    }

    React.useEffect(() => {
        if (!quiz_id) return;
        if (!quizConfig.lazy && questions.length === 0) {
            ExamService.fetchQuestions(quiz_id).then(response => {
                const tmpQuestions = response.data
                const tmpMarked: IMarkedObj = {}
                tmpQuestions.forEach(element => {
                    tmpMarked[element.id] = []
                })
                setQuestions(tmpQuestions)
                setMarked(tmpMarked)
                setCurrentQuestionPage(0)
            }).catch((error) => {
                if (error instanceof AxiosError && error.response) {
                    if (error.response.status.toString().startsWith('4')) {
                        return alert(error.response.data.message)
                    }
                }
            })
        }
    }, [quizConfig.lazy])


    React.useEffect(() => {
        console.log("Marked change ", marked)
    }, [marked])
    React.useEffect(() => {
        resetTranscript()
    }, [currentQuestionPage])
    React.useEffect(() => {
        if (selectedLanguage) {
            SpeechRecognition.stopListening().then(() => {
                SpeechRecognition.startListening({
                    continuous: true,
                    language: selectedLanguage,
                })
            })
        }
    }, [selectedLanguage])
    React.useEffect(() => {
        if (selectedLanguage) {
            SpeechRecognition.stopListening().then(() => {
                SpeechRecognition.startListening({
                    continuous: true,
                    language: selectedLanguage,
                })
            })
        }
    }, [selectedLanguage])


    const handleStartRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setMicrophoneStream(stream);
            mediaRecorder.current = new MediaRecorder(stream);

            mediaRecorder.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    setRecordedChunks(prevChunks => [...prevChunks, event.data]);
                }
            };
            mediaRecorder.current.start(1000);
            recordVideoRef.current!.srcObject = stream;
            console.log("started recording")
        } catch (error) {
            console.error('Error starting recording:', error);
        }
    };
    const handleStopRecording = () => {
        mediaRecorder.current?.stop();
        if (!proctoringRecordState.active) {
            dispatch(stopRecording())
        }
    };

    React.useEffect(() => {
        if (proctoringRecordState.active) {
            handleStartRecording()
        } else {
            handleStopRecording()
        }
    }, [proctoringRecordState.active])
    React.useEffect(() => {
        dispatch(startRecording())
    }, [])


    return (
        <QuizLayout listening={listening} onMicroClick={() => { }}>
            <section id='blog'>
                <div className="container mx-auto pt-5" data-aos="fade-up">
                    <div className='flex flex-col md:flex-row'>
                        <div className='justify-start mx-5 my-3'>
                            <QuizProctoringField videoRef={recordVideoRef} microphoneStream={microphoneStream} />
                        </div>
                        <div className='justify-end'>
                            {
                                !quizConfig.lazy ? (
                                    <div>
                                        {quizConfig.paginted ?
                                            (
                                                questions[currentQuestionPage] && (
                                                    <QuestionItem
                                                        marked={marked[questions[currentQuestionPage].id]}
                                                        question={questions[currentQuestionPage]}
                                                        index={currentQuestionPage + 1}
                                                        onMark={handleMark}
                                                        lang={selectedLanguage} />
                                                )
                                            ) :
                                            questions.map((question, index) => (
                                                <QuestionItem key={question.id}
                                                    marked={marked[question.id]}
                                                    question={question} index={index + 1} onMark={handleMark}
                                                    lang={selectedLanguage} />
                                            ))
                                        }
                                    </div>
                                ) : (
                                    <div>Lazy load</div>
                                )
                            }
                            {
                                quizConfig.paginted && (
                                    <Pagination showOnlyPrimitive={false} page={currentQuestionPage} rowsPerPage={1} count={questions.length} onChangePage={handleQuestionPageChange} />
                                )
                            }
                            <div className="language-options pb-4">
                                {languageOptions.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => handleLanguageSelect(lang.code)}
                                        className={`px-2 py-1 mr-2 ${selectedLanguage === lang.code ? 'bg-green-basic' : 'bg-default-basic'
                                            } text-white rounded-lg`}
                                    >
                                        {lang.name}
                                    </button>
                                ))}
                            </div>
                            <div className='mt-3 flex grid grid-cols-2 justify-between'>
                                <PrimaryButton onClick={handleSendClick} className='max-w-[300px]'>
                                    <FormattedMessage
                                        id="app.submit.label" />
                                </PrimaryButton>
                                <SecondaryButton onClick={handleQuit} className='max-w-[300px]'>
                                    <FormattedMessage
                                        id="app.close.label" />
                                </SecondaryButton>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <QuizSubmitPreviewModal
                show={showQuizSubmitPreviewModal}
                setShow={setShowQuizSubmitPreviewModal}
                payload={quizSubmitPreviewPayload}
                questions={questions}
                recordedChunks={recordedChunks}
                onConvertStart={handleStopRecording} />
        </QuizLayout>
    );
}
