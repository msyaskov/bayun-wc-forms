import {Form, Option, Question} from "~/model/Form";
import Optional, {getEmptyOptional} from "~/utils/Optional";
import {createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useEffect, useState} from "react";
import {getFormById} from "~/services/FormService";
import {ifNullThrow} from "~/utils/Checker";
import User from "~/model/User";
import {getUserById} from "~/services/UserService";
import LoadingPage from "~/pages/LoadingPage";
import {FormRestObject} from "~/rest/RestDocument";

export type FormContextType = {
    form: Optional<FormRestObject>
    author: Optional<User>
    update: Dispatch<SetStateAction<Optional<FormRestObject>>>
    get: {
        question: (qId: string) => Optional<Question>
        option: (qId: string, oId: string) => Optional<Option>
    }
}

const FormContext = createContext<FormContextType | undefined>(undefined)

function FormNotFoundPage() {
    return <div className='w-full grid place-content-center'>
        Form not found
    </div>
}

export function FormProvider({id, children}: PropsWithChildren<{id: string}>) {

    const [loading, setLoading] = useState<boolean>(true)
    const [form, setForm] = useState<Optional<FormRestObject>>(getEmptyOptional)
    const [author, setAuthor] = useState<Optional<User>>(getEmptyOptional<User>())

    useEffect(() => {
        (async function() {
            getFormById(id).then(f => {
                setForm(f)
                setLoading(false)
                f.ifPresent(f => getUserById(f.authorId).then(setAuthor))
            })
        })()
    }, [id])

    return <FormContext.Provider value={{
        form,
        author,
        update: setForm,
        get: {
            question: (qId: string) => form.flatMap(f => new Optional(f.questions.find(q => q.id == qId))),
            option: (qId: string, oId: string) => form.flatMap(f => new Optional(f.questions.find(q => q.id == qId)?.options?.find(o => o.id == oId)))
        },
    }}>
        {loading ? <LoadingPage/> : form.isEmpty() ? <FormNotFoundPage/> : children}
    </FormContext.Provider>
}

export function useForm(): FormContextType {
    return ifNullThrow(useContext(FormContext), "Use FormProvider before useForm()")!
}