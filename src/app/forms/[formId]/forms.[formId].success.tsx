import {useForm} from "~/context/FormContext";
import Box from "~/component/Box";
import QuestionView from "~/component/QuestionView";
import {Dispatch, FormEvent, useState} from "react";
import {QuestionType} from "~/model/Form";
import {postAnswer} from "~/services/AnswerService";
import {Link} from "react-router-dom";

function FormsByIdSuccessPage() {

    const fc = useForm()

    return <>
        <div className='lg:w-md md:w-sm w-full mx-auto'>
            <div className='box shadow'>
                <div className='text-lg font-bold'>Спасибо</div>
                <div className='text-sm'>Ваше сообщение отправлено</div>
                <Link to={`/forms/${fc.form.get()!.id}`} className='btn-blue mt-4'>
                    <span className="material-symbols-outlined">refresh</span>
                    Заполнить форму ещё раз
                </Link>
            </div>
            <div className='grid rounded-2xl shadow grid-cols-2 mt-4'>
                <button className='btn text-sm normal-case min-h-0 h-min py-2 px-4 bg-white hover:bg-gray-200 rounded-s-2xl rounded-e-none'><span className="material-symbols-outlined">share</span>Поделиться формой</button>
                <button className='btn text-sm normal-case min-h-0 h-min py-2 px-4 text-white bg-blue-500 hover:bg-blue-700 rounded-s-none rounded-e-2xl'><span className="material-symbols-outlined">library_add</span>Создать форму</button>
            </div>
        </div>
    </>
}

export default function FormsByIdSuccessRoute() {
    return <>
        <FormsByIdSuccessPage/>
    </>
}