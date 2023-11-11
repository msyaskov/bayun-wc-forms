import {useForm} from "~/context/FormContext";
import {KeyboardEvent, useState} from "react";
import {doIfTrue, ifNullThen} from "~/utils/Checker";
import {Form, FormScope, QuestionType} from "~/model/Form";
import OwnFormMenu from "~/component/OwnFormMenu";
import FormConstructor from "~/services/FormConstructor";
import {useModal} from "~/context/ModalContext";

function LinkModal({form}:{form: Form}) {
    const [link] = useState(`http://forms.bayun.dev/forms/${form.id}`)
    return <div className=''>
        <div className='font-bold'>Ссылка</div>
        <div className='flex gap-4 items-center'>
            <div className='w-full truncate underline'>{link}</div>
            <button onClick={() => navigator.clipboard.writeText(link)} className='text-gray-300 hover:text-gray-600'><span className="material-symbols-outlined">content_copy</span></button>
        </div>
    </div>
}

function FormsByIdEditPage() {

    const modal = useModal()

    const fc = useForm()
    const [constructor] = useState<FormConstructor>(() => new FormConstructor(fc))

    function nonQuestionsClassWrapper(classes: string): string {
        return fc.form.get()!.questions.length > 0 ? classes : (classes + ' tooltip-open')
    }

    function nonRequirableQuestionsClassWrapper(classes: string, qId: string): string {
        return fc.form.get()!.questions.find(q => q.id === qId)!.type !== QuestionType.EMPTY ? classes : (classes + ' ml-4')
    }

    return <>
        <div className='lg:w-md md:w-sm w-full mx-auto space-y-2'>
            <OwnFormMenu/>
            <input type="text" onBlur={e => constructor.setName(e.currentTarget.value).then(status => doIfTrue(!status, () => e.target.value = fc.form.get()!.name))} defaultValue={fc.form.get()!.name}
                   className="input px-6 h-12 truncate rounded-none rounded-t-2xl rounded-bl-0 border border-gray-100 shadow bg-white truncate text-center focus:outline-none border-x-0 border-t-0 focus:border-gray-600 w-full font-bold text-xl" />
            <div className='flex gap-2'>
                <ul className='space-y-1'>
                    {/*текст без вопроса*/}
                    <li><button onClick={() => constructor.addQuestion(QuestionType.EMPTY)} className={nonQuestionsClassWrapper('btn btn-square bg-white shadow rounded-none hover:bg-gray-100 tooltip tooltip-right before:normal-case before:bg-white before:text-black')} data-tip='Текст без вопроса'><span className="material-symbols-outlined">format_quote</span></button></li>
                    {/*короткий текс*/}
                    <li><button onClick={() => constructor.addQuestion(QuestionType.SHORT_TEXT)} className={nonQuestionsClassWrapper('btn btn-square bg-white shadow rounded-none hover:bg-gray-100 tooltip tooltip-right before:normal-case before:bg-white before:text-black')} data-tip='Короткий текст'><span className="material-symbols-outlined">short_text</span></button></li>
                    {/*длинный текст*/}
                    <li><button onClick={() => constructor.addQuestion(QuestionType.LONG_TEXT)} className={nonQuestionsClassWrapper('btn btn-square bg-white shadow rounded-none hover:bg-gray-100 tooltip tooltip-right before:normal-case before:bg-white before:text-black')} data-tip='Длинный текст'><span className="material-symbols-outlined">text_ad</span></button></li>
                    {/*один вариант*/}
                    <li><button onClick={() => constructor.addQuestion(QuestionType.RADIO)} className={nonQuestionsClassWrapper('btn btn-square bg-white shadow rounded-none hover:bg-gray-100 tooltip tooltip-right before:normal-case before:bg-white before:text-black')} data-tip='Один вариант'><span className="material-symbols-outlined">radio_button_checked</span></button></li>
                    {/*несколько вариантов*/}
                    <li><button onClick={() => constructor.addQuestion(QuestionType.CHECKBOX)} className={nonQuestionsClassWrapper('btn btn-square bg-white shadow rounded-none hover:bg-gray-100 tooltip tooltip-right before:normal-case before:bg-white before:text-black')} data-tip='Несколько вариантов'><span className="material-symbols-outlined">check_box</span></button></li>
                    {/*выпадающий список*/}
                    <li><button onClick={() => constructor.addQuestion(QuestionType.DROPDOWN)} className={nonQuestionsClassWrapper('btn btn-square bg-white shadow rounded-none rounded-bl-lg hover:bg-gray-100 tooltip tooltip-right before:normal-case before:bg-white before:text-black')} data-tip='Выпадающий список'><span className="material-symbols-outlined">unfold_more</span></button></li>
                </ul>
                <div className='grow divide-y'>
                    {/*question*/}
                    {fc.form.map(f => f.questions).ifPresentGet(qs => qs.map(q => <div className='px-2 py-2 bg-white' key={`q-${q.id}`}>
                        <div className='text-xs text-gray-500 px-4 pt-2'>{constructor.getQuestionTypeDescription(q.type)}</div>
                        <div className='relative flex items-center justify-between text-lg font-bold'>
                            <div className='flex items-center w-full'>
                                { q.type !== QuestionType.EMPTY && <label className="swap w-4">
                                    <input type="checkbox" className='tooltip tooltip-right checked:before:bg-red-500 before:text-white before:bg-gray-500' defaultChecked={!!q.required} data-tip={q.required ? 'Ответ обязателен' : 'Ответ не обязателен'} onChange={e => constructor.setQuestionRequired(q.id, e.currentTarget.checked).then(status => doIfTrue(!status, () => e.target.checked = !!q.required))}/>
                                    <div className='swap-on w-2 text-red-500'>&bull;</div>
                                    <div className='swap-off text-gray-500'>&bull;</div>
                                </label>}
                                <input type="text" onBlur={e => constructor.setQuestionLabel(q.id, e.currentTarget.value).then(status => doIfTrue(!status, () => e.target.value = q.label))} defaultValue={q.label}
                                       className={nonRequirableQuestionsClassWrapper("input w-full h-7 px-0 truncate rounded-none rounded-bl-0 border-0 border-b bg-white focus:outline-none focus:border-gray-600 font-bold text-lg", q.id)} />
                            </div>
                            {/*remove*/}
                            <button className='btn btn-square text-gray-400 hover:text-black hover:bg-transparent border-none bg-transparent tooltip tooltip-left before:normal-case before:bg-white before:text-black' data-tip='Удалить' onClick={() => constructor.removeQuestion(q.id)}><span className="material-symbols-outlined">delete</span></button>
                        </div>
                        {/*comment*/}
                        <div className='px-4'>
                            <input type="text" onBlur={e => constructor.setQuestionComment(q.id, e.currentTarget.value).then(status => doIfTrue(!status, () => e.target.value = q.comment ? q.comment : ''))} defaultValue={ifNullThen(q.comment, '')!}
                                   placeholder='Комментарий'
                                   className="input w-full h-5 px-0 truncate rounded-none rounded-bl-0 border-0 border-b bg-white focus:outline-none focus:border-gray-600 text-gray-500 text-sm" />
                        </div>
                        {/*options*/}
                        {(q.type === QuestionType.RADIO || q.type === QuestionType.DROPDOWN || q.type === QuestionType.CHECKBOX) && <>
                            <div className='px-4'>
                                <div className='text-xs text-gray-500 pt-2 mb-1'>Варианты</div>
                                <div className='divide-y'>
                                    {q.options?.map(o => <div className='flex items-center w-full' key={`o-${q.id}-${o.id}`}>
                                        <input type="text" onBlur={e => constructor.setOptionLabel(q.id, o.id, e.currentTarget.value).then(status => doIfTrue(!status, () => e.target.value = o.label))} defaultValue={o.label}
                                               className="input w-full h-6 px-0 truncate rounded-none rounded-bl-0 border-0 border-b bg-white focus:outline-none focus:border-gray-600" />
                                        {/*remove option*/}
                                        <button onClick={() => constructor.removeOption(q.id, o.id)} className='btn btn-square h-6 w-6 min-h-0 text-gray-400 hover:text-black hover:bg-transparent border-none bg-transparent tooltip tooltip-left before:normal-case before:bg-white before:text-black'><span className="material-symbols-outlined">close</span></button>
                                    </div>)}
                                </div>
                                <input type="text" onBlur={e => {constructor.addOption(q.id, e.currentTarget.value).then(() => e.target.value = '')}} placeholder='Добавить новый вариант'
                                       onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                                           if (e.key.toLowerCase() === 'enter') {
                                               // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                               // @ts-expect-error
                                               constructor.addOption(q.id, e.target["value"]).then(() => e.target["value"] = '')
                                           }
                                       }}
                                       className="input w-full h-6 mt-1 px-0 truncate rounded-none rounded-bl-0 border-0 border-b bg-white focus:outline-none focus:border-gray-600" />
                            </div>
                        </>}
                    </div>))}
                </div>
                <ul className='space-y-1 '>
                    <li><button onClick={() => modal.show(<LinkModal form={fc.form.get()!}/>)} className={nonQuestionsClassWrapper('btn btn-square bg-white rounded-none shadow hover:bg-gray-100 tooltip tooltip-left before:normal-case before:bg-white before:text-black')} data-tip='Поделиться'><span className="material-symbols-outlined">share</span></button></li>
                    <li className='h-12'>
                        <label className="swap">
                            <input type="checkbox" className={nonQuestionsClassWrapper('tooltip tooltip-left checked:before:bg-red-500 before:text-white before:bg-green-500')} data-tip={fc.form.get()?.scope === FormScope.PRIVATE ? 'Сделать форму публичной' : 'Сделать форму приватной'} checked={fc.form.get()?.scope === FormScope.PRIVATE} onChange={e => constructor.setScope(e.currentTarget.checked ? FormScope.PRIVATE : FormScope.PUBLIC)}/>
                            <div className='swap-on grid place-content-center shadow h-12 w-12 rounded-none text-white bg-red-500'><span className="material-symbols-outlined">lock</span></div>
                            <div className='swap-off grid place-content-center shadow h-12 w-12 rounded-none text-white bg-green-500'><span className="material-symbols-outlined">lock_open</span></div>
                        </label>
                    </li>
                    {/*<li><button className={nonQuestionsClassWrapper('btn btn-square bg-blue-500 shadow text-white rounded-none rounded-br-lg hover:bg-blue-700 tooltip tooltip-left before:normal-case before:bg-blue-700')} data-tip='Сохранить'><span className="material-symbols-outlined">save</span></button></li>*/}
                    <li><button className={nonQuestionsClassWrapper('btn btn-square bg-blue-500 shadow text-white rounded-none rounded-br-lg hover:bg-blue-700 tooltip tooltip-left before:normal-case before:bg-blue-700')} data-tip='Удалить'><span className="material-symbols-outlined">delete</span></button></li>
                </ul>
            </div>
        </div>

    </>
}

export default function FormsByIdEditRoute() {
    return <>
        <FormsByIdEditPage/>
    </>
}