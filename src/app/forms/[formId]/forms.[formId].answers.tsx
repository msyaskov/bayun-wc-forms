import {useForm} from "~/context/FormContext";
import {Question, QuestionType} from "~/model/Form";
import OwnFormMenu from "~/component/OwnFormMenu";
import {Answer} from "~/model/Answer";
import {useEffect, useState} from "react";
import {getAnswersByFormId} from "~/services/AnswerService";
import Optional, {getEmptyOptional} from "~/utils/Optional";

function FormsByIdAnswersPage({answers}:{answers: Answer[]}) {

    const fc = useForm()
    const [questions] = useState<Question[]>(() => fc.form.get()!.questions.filter(q => q.type != QuestionType.EMPTY))

    function getValue(a: Answer, q: Question): JSX.Element {
        let value = a.values[q.id];
        if (!value) {
            return <>-</>
        }

        if (q.type == QuestionType.SHORT_TEXT || q.type == QuestionType.LONG_TEXT) {
            return <>{value}</>
        }

        if (q.type == QuestionType.CHECKBOX || q.type == QuestionType.RADIO || q.type == QuestionType.DROPDOWN) {
            return (value as Array<string>).map(oId => q.options!.find(o => o.id == oId)!.label)
                .map(v => <>{v}</>).reduce((p,c) => <>{p}<br/>{c}</>)
        }

        return <>-</>
    }

    return <>
        <div className='w-full space-y-2'>
            <div className='lg:w-md md:w-sm w-full mx-auto space-y-2'>
                <OwnFormMenu/>
            </div>
            <div className="flex items-center justify-center px-6 h-12 rounded-none rounded-t-2xl rounded-bl-0 border border-gray-100 shadow bg-white focus:outline-none border-x-0 border-t-0 focus:border-gray-600 w-full font-bold text-xl">
                {fc.form.get()!.name}
            </div>
            <div className='flex gap-2 bg-white overflow-x-auto'>
                <table className="table table-xs">
                    <thead><tr>
                        <th>ID</th>
                        {questions.map(q => <th key={`th-${q.id}`}>{q.label}</th>)}
                    </tr></thead>
                    <tbody>
                        {answers.map(a => <tr key={`a-${a.id}`}>
                            <td className='w-4'><div className='w-12 overflow-x-hidden truncate'>{a.id.substring(5)}</div></td>
                            {questions.map(q => <td key={`a-${a.id}-${q.id}`}>
                                {getValue(a,q)}
                            </td>)}
                        </tr>)}
                    </tbody>
                    <tfoot><tr>
                        <th>ID</th>
                        {questions.map(q => <th key={`th-${q.id}`}>{q.label}</th>)}
                    </tr></tfoot>
                </table>
            </div>
        </div>

    </>
}
export default function FormsByIdAnswersRoute() {

    const fc = useForm()
    const [answers, setAnswers] = useState<Optional<Answer[]>>(getEmptyOptional)

    useEffect(() => {
        (async function() {
            getAnswersByFormId(fc.form.get()!.id).then(setAnswers)
        })()
    }, [])

    return <>
        <FormsByIdAnswersPage answers={answers.orElse([])}/>
    </>
}