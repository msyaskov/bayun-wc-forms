// type OwnFormMenuProps = HTMLProps<HTMLUListElement>

import {useParams} from "react-router-dom";
import {NavLink} from "react-router-dom";
import {PropsWithChildren} from "react";
import {To} from "react-router";

function MenuItem({to, children}: PropsWithChildren<{to: To}>) {
    return <li >
        <NavLink className='px-4 py-2 shadow rounded-full aria-[current=page]:text-white aria-[current=page]:bg-blue-500' to={to}>{children}</NavLink>
    </li>
}

export default function OwnFormMenu() {

    const params = useParams()
    return <div className='grid grid-cols-2'>
        <NavLink className='px-4 py-2 shadow rounded-2xl rounded-r-none aria-[current=page]:text-white aria-[current=page]:bg-blue-500' to={`/forms/${params["formId"]}/edit`}>Конструктор</NavLink>
        <NavLink className='px-4 py-2 shadow rounded-2xl rounded-l-none aria-[current=page]:text-white aria-[current=page]:bg-blue-500' to={`/forms/${params["formId"]}/answers`}>Ответы</NavLink>
    </div>
}