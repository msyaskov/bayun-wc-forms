import {ChangeEvent, Dispatch, useState} from "react";
import {useForm} from "~/context/FormContext";
import {Question, QuestionType} from "~/model/Form";
import {ifNullThen} from "~/utils/Checker";

export default function QuestionView({ qId, errorMessage, valueCallback }: {qId: string, errorMessage: string | undefined, valueCallback: Dispatch<string | string[] | null>}) {

    const fc = useForm()
    const [question] = useState<Question>(() => fc.get.question(qId).get()!)

    const [values, setValues] = useState<string[] | null>(null)

    function shortTextValueCallback(e: ChangeEvent<HTMLInputElement>) {
        valueCallback(e.currentTarget.value)
    }

    function longTextValueCallback(e: ChangeEvent<HTMLTextAreaElement>) {
        valueCallback(e.currentTarget.value)
    }

    function checkboxValueCallback(e: ChangeEvent<HTMLInputElement>) {
        let newValues = ifNullThen(values, [])!
        newValues = (e.target.checked ? [...newValues, e.target.value] : newValues.filter(v => v !== e.target.value)).sort()
        setValues(newValues)
        valueCallback(newValues)
    }

    function radioValueCallback(e: ChangeEvent<HTMLInputElement>) {
        valueCallback(e.target.checked ? [e.target.value] : [])
    }

    function dropdownValueCallback(e: ChangeEvent<HTMLSelectElement>) {
        const option = e.target.selectedOptions[0]
        if (option) {
            valueCallback(option.value !== '-' ? [option.value] : [])
        }
    }

    return <>
        <div className='px-4 bg-white'>
            <div className='relative font-extrabold'>
                {question.label}
                {question.required && <div className='absolute top-0 -left-2.5 cursor-pointer text-red-500 tooltip tooltip-left tooltip-error' data-tip='Обязательный'>&bull;</div>}
            </div>
            {question.comment && <div className='text-xs text-gray-500 mt-2'>{question.comment}</div>}
            <div className='mt-2'></div>
            { question.type == QuestionType.SHORT_TEXT && <>
                <div className="form-control">
                    <input name={qId} type="text" onChange={shortTextValueCallback} className="input input-bordered px-2 rounded-tl-none border-gray-300 focus:outline-none focus:border-gray-600"/>
                </div>
            </>}
            { question.type == QuestionType.LONG_TEXT && <>
                <textarea name={qId} onChange={longTextValueCallback} className="textarea textarea-bordered w-full leading-5 rounded-tl-none px-2 border-gray-300 focus:outline-none focus:border-gray-600"></textarea>
            </>}
            { question.type == QuestionType.CHECKBOX && question.options?.map(o => <label className="label justify-start gap-4 cursor-pointer" key={`o-${question.id}-${o.id}`}>
                <input name={`q-${qId}`} value={o.id} aria-valuetext={o.id}  onChange={checkboxValueCallback} type="checkbox" className="checkbox rounded-tl-none" />
                <span className="text-sm">{o.label}</span>
            </label>)}
            { question.type == QuestionType.RADIO && question.options?.map(o => <label className="label justify-start gap-4 cursor-pointer" key={`o-${question.id}-${o.id}`}>
                <input name={qId} onChange={radioValueCallback} value={o.id} type="radio" className="radio rounded-tl-none" />
                <span className="text-sm">{o.label}</span>
            </label>)}
            { question.type == QuestionType.DROPDOWN && <select name={qId} onChange={dropdownValueCallback} defaultValue='-' className='select select-bordered rounded-tl-none w-full border-gray-300 focus:outline-none focus:border-gray-600'>
                <option disabled={question.required!} value='-'>-</option>
                {question.options?.map(o => <option value={o.id} key={`o-${question.id}-${o.id}`}>{o.label}</option>)}
            </select>}
            <div className='text-red-500 text-sm mt-1'>{errorMessage}</div>
            {/*<label className="label justify-start gap-4 cursor-pointer">*/}
            {/*    <input type="checkbox" className="checkbox" />*/}
            {/*    <span className="text-sm">Remember me</span>*/}
            {/*</label>*/}
        </div>
    </>
}