import User from "~/model/User";
import {getUserById} from "~/src/services/UserService";
import Optional from "~/utils/Optional";
import {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import {useLoading} from "~/context/LoadingContext";
import LoadingPage from "~/pages/LoadingPage";

export type AuthenticationContextType = {
    principal: User
}

const AuthenticationContext = createContext<AuthenticationContextType | undefined>(undefined);

export function useAuthenticationContext(): AuthenticationContextType {
    const context = useContext(AuthenticationContext);
    if (!context) {
        throw new Error("Use AuthenticationContextProvider before call useAuthenticationContext()")
    }

    return context;
}

function UnauthenticatedPage() {

    return <div className='flex flex-col justify-center items-center h-screen'>
        <div className='w-full py-4 px-4 sm:px-8 md:px-12 lg:px-16 space-y-8'>
            <div className='text-5xl font-logo'>
                <span className='font-medium'>Bayun</span> <span className='text-blue-500'>Формы</span>
            </div>
            <div>Сервис, в котором вы легко можете создавать формы, опросы и тесты.</div>
            {/*<a href='http://api.forms.bayun.localhost:8046/oauth2/authorization/bayun' className='btn bg-blue-500 text-white text-base normal-case hover:bg-blue-700'>Войти в сервис</a>*/}
            <a href='/oauth2/authorization/bayun' className='btn bg-blue-500 text-white text-base normal-case hover:bg-blue-700'>Войти в сервис</a>
        </div>
    </div>
}

export function AuthenticationContextProvider({children} : PropsWithChildren) {

    const [loading, setLoading] = useState<boolean>(true)
    const [principal, setPrincipal] = useState<Optional<User>>(new Optional<User>(null))

    async function loadAuthenticatedPrincipal() {
        getUserById('me').then(user => {
            setPrincipal(user)
            setLoading(false)
        })
    }

    useEffect(() => {
        loadAuthenticatedPrincipal()
    }, [])

    return <AuthenticationContext.Provider value={principal.isEmpty() ? undefined : {principal: principal.get()!}}>
        {loading ? <LoadingPage/> : principal.isEmpty() ? <UnauthenticatedPage/> : children}
    </AuthenticationContext.Provider>
}