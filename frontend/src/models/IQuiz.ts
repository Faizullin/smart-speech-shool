export interface IQuiz {
    questions: IQuestion[],
    showCrrectAnswers?: boolean
}
export interface IQuestion {
    id: string
    answers: IAnswer[]
    prompt: string
    selectedValue: string
    question_type?: 'c' | 'o'
}
export interface IAnswer {
    content: string,
    question: string,
    correct: boolean,
    id: string,
}
export type IMarked = string[]
export type IMarkedObj = {
    [key: string]: IMarked;
}