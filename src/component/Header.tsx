import {useAuthenticationContext} from "~/context/AuthenticationContext";
import {HTMLAttributes} from "react";
import {Link} from "react-router-dom";

export type PropsHeader = HTMLAttributes<HTMLDivElement>

export default function Header(props: PropsHeader) {

    const auth = useAuthenticationContext()

    return <header {...props}>
        <div className='flex items-center justify-between px-6 py-3 bg-white'>
            <Link to='/' className='text-2xl font-logo'>
                <span className='font-medium'>Bayun</span> <span className='text-blue-500'>Формы</span>
            </Link>

            <div className="avatar rounded-full ring-2 ring-blue-500 ring-offset-2">
                <div className="w-10 mask mask-circle">
                    <img src={auth.principal.picture} alt=''/>
                </div>
            </div>
        </div>
    </header>
}