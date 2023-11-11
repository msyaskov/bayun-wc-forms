import "../index.css"

import {AuthenticationContextProvider} from "~/context/AuthenticationContext";

export function UnauthenticatedPage() {

    return <div className='flex flex-col justify-center items-center h-screen'>
        <div className='w-full py-4 px-4 sm:px-8 md:px-12 lg:px-16 space-y-8'>
            <div className='text-5xl font-logo'>
                <span className='font-medium'>Bayun</span> <span className='text-blue-500'>Формы</span>
            </div>
            <div>Сервис, в котором вы легко можете создавать формы, опросы и тесты.</div>
            <a href='https://api.forms.bayun.dev/oauth2/authorization/bayun' className='btn bg-blue-500 text-white normal-case hover:bg-blue-700'>Войти в сервис</a>
        </div>
    </div>
}
export default function UnauthenticatedRoute() {
    return <>
        <AuthenticationContextProvider>
            <UnauthenticatedPage/>
        </AuthenticationContextProvider>
    </>
}