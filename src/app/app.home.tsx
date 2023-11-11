import {postNewForm} from "~/services/FormService";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import Optional, {getEmptyOptional} from "~/utils/Optional";
import {Form} from "~/model/Form";
import {useAuthenticationContext} from "~/context/AuthenticationContext";
import axios from "axios";
import RestDocument, {ListFormRestObject} from "~/rest/RestDocument";
import LoadingPage from "~/pages/LoadingPage";

function HomePage({forms}:{forms: Form[]}) {

    const navigate = useNavigate()

    function onCreateNewForm() {
        postNewForm().then(id => {
            console.log(id)
            id.ifPresent(id => navigate('/forms/'+id.id+"/edit"))
        })
    }

    useEffect(() => {
        console.log(forms)
    }, [forms])

    return <div className='w-full'>
        <div className='flex justify-between items-center'>
            <span className='text-lg'>Мои формы</span>
            <button className='btn normal-case text-base bg-blue-500 hover:bg-blue-700 text-white h-10 p-2 min-h-0 tooltip tooltip-left before:text-white before:bg-blue-700' data-tip='Создать форму' onClick={onCreateNewForm}>
                <span className="material-symbols-outlined">add</span>
            </button>
        </div>
        <div className="divider mt-0 mb-2"></div>
        <div className='flex flex-wrap gap-4'>
            {forms.map(f => <Link to={`/forms/${f.id}/edit`} className='w-48 h-fit border border-gray-200 hover:border-gray-400 p-4 bg-white rounded-lg ' key={`f-${f.id}`}>
                <span className='font-extrabold'>{f.name}</span>
            </Link>)}
        </div>
    </div>
}
export default function HomeRoute() {

    const auth = useAuthenticationContext()
    const [loading, setLoading] = useState<boolean>(true)
    const [forms, setForms] = useState<Optional<Form[]>>(getEmptyOptional)

    useEffect(() => {
        async function loadFormsByAuthorId() {
            const ar = await axios.get('/v1/forms?authorId='+auth.principal.id)
            if (ar.status === 200) {
                // @ts-ignore
                setForms(new Optional<Form[]>(((ar.data as RestDocument)["list_form"] as ListFormRestObject)["object"]))
            }
            setLoading(false)
        }

        loadFormsByAuthorId()
    }, [])

    return <>
        {loading ? <LoadingPage/> : <HomePage forms={forms.orElse([])}/>}

    </>
}