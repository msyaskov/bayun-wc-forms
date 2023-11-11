import {useForm} from "~/context/FormContext";
import Box from "~/component/Box";
import QuestionView from "~/component/QuestionView";
import {Dispatch, FormEvent, useState} from "react";
import {QuestionType} from "~/model/Form";
import {postAnswer} from "~/services/AnswerService";
import {useNavigate} from "react-router-dom";

function SuccessView() {
    return <>успешно</>
}

function FormsByIdViewPage() {

    const fc = useForm()
    const navigate = useNavigate()
    const [values, setValues] = useState<Map<string, string | string[] | null>>(new Map())
    const [valueErrors, setValueErrors] = useState<Map<string, string | undefined>>(new Map())
    const [formError, setFormError] = useState<string | undefined>(undefined)

    function getQuestionValueCallback(qId: string): Dispatch<string | string[] | null> {
        return (value: string | string[] | null) => {
            setValues(prevValues => {
                prevValues.set(qId, value)
                console.log("Values:", prevValues)
                return new Map(prevValues)
            })
        }
    }

    function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        // validation
        setFormError(undefined)
        setValueErrors(new Map())
        // @ts-ignore
        const answer = {}
        fc.form.get()!.questions.forEach(question => {
            if (question.type === QuestionType.EMPTY) {
                return
            }

            const value = values.get(question.id)
            if (question.required) {
                if (question.type == QuestionType.SHORT_TEXT || question.type == QuestionType.LONG_TEXT) {
                    if (value == null || (value as string).trim().length == 0) {
                        console.error("Это поле обязательно")
                        setValueErrors(errors => new Map(errors.set(question.id, "Это поле обязательно")))
                        return;
                    }
                } else if (question.type == QuestionType.RADIO || question.type == QuestionType.CHECKBOX || question.type == QuestionType.DROPDOWN) {
                    if (value == null || (Array.isArray(value) && value.length == 0)) {
                        console.error("Это поле обязательно")
                        setValueErrors(errors => new Map(errors.set(question.id, "Это поле обязательно")))
                        return;
                    }
                }
            }

            // @ts-ignore
            answer[question.id] = value
        })

        // console.log(answer)
        if (valueErrors.size != 0) {
            setFormError('Не все поля заполнены верно')
        }
        postAnswer(fc.form.get()!.id, { values: answer }).then(aId => aId.ifPresentOrElse(() => navigate('success'), () => setFormError('Что-то пошло не так')))
    }

    return <>
        <div className='lg:w-md md:w-sm w-full mx-auto'>
            <form className='box' onSubmit={onSubmit}>
                <div className='flex items-center gap-4 px-4 pt-4'>
                    <div className='grow align-middle font-bold text-xl'>{fc.form.get()?.name}</div>
                    <div className="avatar tooltip tooltip-right" data-tip='Автор'>
                        <div className="w-10 rounded-full">
                            {fc.author.map(a => <img src={a.picture} alt=''/>).get()}
                        </div>
                    </div>
                </div>
                <div className='mt-6 space-y-4'>
                    { fc.form.ifPresentGet(f => f.questions)?.map(q => <QuestionView errorMessage={valueErrors.get(q.id)} valueCallback={getQuestionValueCallback(q.id)} key={`q-${q.id}`} qId={q.id}/>)}
                </div>
                <div className='flex justify-between items-center px-4 py-4'>
                    <div className='text-red-500 text-sm'>{formError ? formError : <>&nbsp;</>}</div>
                    <input type='submit' className='btn-blue' defaultValue='Отправить'/>
                </div>
            </form>
        </div>
    </>
}

export default function FormsByIdViewRoute() {
    return <>
        <FormsByIdViewPage/>
    </>
}