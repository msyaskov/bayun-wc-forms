import {createContext, PropsWithChildren, useContext, useState} from "react";

export type LoadingContextType = {
    start: () => void,
    stop: () => void,
    isLoading: () => boolean
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

function LoadingPage({show}: {show: boolean}) {
    return <div className={'fixed grid place-content-center inset-0 bg-white z-[9999]' + (!show ? ' hidden' : '')}>
        <div className='text-center space-y-8'>
            <div><span className="loading loading-ring ring-blue-500 w-40"></span></div>
            <div>Loading..</div>
        </div>
    </div>
}

export function LoadingProvider({children}: PropsWithChildren) {

    const [loading, setLoading] = useState<boolean>(true)

    function start() {
        console.log('start')
        setLoading(true)
    }

    function stop() {
        console.log('stop')
        setLoading(false)
    }

    function isLoading() {
        return loading
    }

    return <LoadingContext.Provider value={{start, stop, isLoading}}>
        <LoadingPage show={loading}/>
        {children}
    </LoadingContext.Provider>
}

export function useLoading(def?: boolean): LoadingContextType {
    const context = useContext(LoadingContext)
    if (!context) {
        throw new Error("Use LoadingProvider before call useLoading()")
    } else if (def) {
        context.start()
    }

    console.log("useLoading")
    return context
}