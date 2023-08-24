import * as React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FormattedMessage } from 'react-intl';
import { IMarkedObj, IQuestion } from '../../models/IQuiz';
import Loader from '../loader/Loader';
import { useNavigate, useParams } from 'react-router-dom';
import ExamService from '../../services/ExamService';

export interface IQuizSubmitPreviewModalProps {
    show: boolean
    setShow: (a: boolean) => any
    payload: IMarkedObj
    questions: IQuestion[]
    recordedChunks: Blob[]
    onConvertStart?: (data?: any) => any
}

export default function QuizSubmitPreviewModal({ show, setShow, payload, questions, recordedChunks, onConvertStart }: IQuizSubmitPreviewModalProps) {
    const params = useParams()
    const navigate = useNavigate()
    const [videoReady, setVideoReady] = React.useState<boolean>(false)
    const [convertLoading, setConvertLoading] = React.useState<boolean>(false)
    const [videoData, setVideoData] = React.useState<any>()
    const quiz_id = params.id

    const handleSubmit = (e: any) => {
        e.preventDefault()
        if (!quiz_id) return;

        const data: any = {
            questions: []
        }
        const formData = new FormData()
        Object.keys(payload).forEach((element: string) => {
            data.questions.push({
                'answers': payload[element],
                'id': element,
            })
        })
        console.log(videoData, recordedChunks,)
        formData.append('questions', JSON.stringify(data.questions))
        formData.append('record', videoData,'record.mp4')
        
        ExamService.fetchSubmitQuiz(quiz_id, formData).then(_ => {
            sessionStorage.clear()
            handleClose()
            setTimeout(() => {
                navigate('/dashboard/results/')
                window.location.reload()
            }, 100)
        }).catch(error => {
            if(error.response) {
                alert("Error:  " + error.response.data.message)
            } else {
                console.error("Error:  " + error)
            }  
        })
    }
    const handleClose = () => {
        setShow(false)
    }
    const convertProcessing = async (videoChunks: any[], mimeType = 'video/mp4') => {
        // const videoBlob = new Blob(videoChunks, { type: mimeType });
        // const videoUrl = URL.createObjectURL(videoBlob);
        // setVideoURL(videoUrl);
        const combinedBlob = new Blob(videoChunks, { type: mimeType });
        return combinedBlob
    }
    const handleConvertVideo = () => {
        setVideoReady(false)
        setConvertLoading(true)
        if(onConvertStart) {
            onConvertStart()
        }
        convertProcessing(recordedChunks).then((res) => {
            setVideoReady(true)
            setConvertLoading(false)
            setVideoData(res)
        })
    }
    React.useEffect(() => {
        console.log('questions', questions, payload)
    }, [payload])
    return (
        <Transition show={show} as={React.Fragment}>
            <Dialog
                as="div"
                className="fixed inset-0 z-10 overflow-y-auto"
                onClose={() => { }}
            >
                <div className="min-h-screen px-4 text-center">
                    <Transition.Child
                        as={React.Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0">
                            <Dialog.Overlay className="fixed inset-0" />
                        </div>
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span
                        className="inline-block h-screen align-middle"
                        aria-hidden="true"
                    >
                        &#8203;
                    </span>

                    <Transition.Child
                        as={React.Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className="inline-block w-full max-w-screen-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                            {
                                (payload == undefined || Object.keys(payload).length !== questions.length) ? <Loader /> : (
                                    <>
                                        <h2 className="text-lg font-semibold mb-4">Submit Process</h2>
                                        <table className="table-fixed w-full">
                                            <thead>
                                                <tr>
                                                    <th className="w-1/4 px-4 py-2">#</th>
                                                    <th className="w-1/4 px-4 py-2">
                                                        <FormattedMessage id='app.dashboard.exams.exam_type.label' />
                                                    </th>
                                                    <th className="w-1/4 px-4 py-2">
                                                        <FormattedMessage id='app.answer.label' />
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    questions.map((question_item, index) => {
                                                        const ll = Object.keys(payload[question_item.id])
                                                        if (ll.length === 0) {
                                                            return (
                                                                <tr key={question_item.id}>
                                                                    <td className="px-4 py-2">{index + 1}</td>
                                                                    <td className="px-4 py-2">{question_item.question_type}</td>
                                                                    <td className="px-4 py-2"></td>
                                                                </tr>
                                                            )
                                                        } else {
                                                            const question_answers_ids = question_item.answers.map(item => item.id)
                                                            const answer_index = question_answers_ids.findIndex((item) => item == payload[question_item.id][0]) + 1
                                                            return (
                                                                <tr key={question_item.id}>
                                                                    <td className="px-4 py-2">{index + 1}</td>
                                                                    <td className="px-4 py-2">{question_item.question_type}</td>
                                                                    <td className="px-4 py-2">
                                                                        {ll.length > 0 ? answer_index : ''}
                                                                    </td>
                                                                </tr>
                                                            )
                                                        }
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </>
                                )
                            }
                            {
                                !videoReady ?
                                    convertLoading ? (
                                        <Loader />
                                    ) : '' : (
                                        <div>Video is ready</div>
                                    )
                            }
                            <div className="mt-4 flex flex-start">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="inline-flex mr-6 justify-center px-4 py-2 text-sm text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 duration-300 "
                                >
                                    <FormattedMessage id="app.close.label" />
                                </button>
                                <button
                                    type="button"
                                    onClick={handleConvertVideo}
                                    disabled={videoReady}
                                    className="bg-blue-500 mr-6 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    <FormattedMessage id="app.convert.label" defaultMessage="Convert"/>
                                </button>
                                <button
                                    type="button"
                                    disabled={!videoReady}
                                    onClick={handleSubmit}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    <FormattedMessage id="app.submit.label" />
                                </button>
                            </div>
                        </div>
                    </Transition.Child>
                </div >
            </Dialog>
        </Transition >
    )
}