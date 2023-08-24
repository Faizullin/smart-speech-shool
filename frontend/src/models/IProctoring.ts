export type IDetetctStatus = 'ok' | 'warning' | 'dangerous'
interface IAudioState {
    active: boolean
    frontend_process: {
        status: IDetetctStatus
    }
}
interface IVideoState {
    active: boolean
}
export interface IProctoringRecordState {
    active: boolean
    audio: IAudioState
    video: IVideoState
}