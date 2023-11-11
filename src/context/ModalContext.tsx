import {createContext, createRef, Dispatch, PropsWithChildren, useContext, useState} from "react";
import {JSX} from "react/ts5.0";

export type ModalContextType = {
    show: Dispatch<JSX.Element>
    hide: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function ModalProvider({children}: PropsWithChildren) {

    const [node, setNode] = useState<JSX.Element | null>(null)
    // ts-ignore
    const dialogRef = createRef<HTMLDialogElement>()

    function show(node: JSX.Element) {
        setNode(node)
        dialogRef.current!.showModal()
    }

    function hide() {
        setNode(null)
        dialogRef.current!.close()
    }

    return <ModalContext.Provider value={{show, hide}}>
        <dialog ref={dialogRef} className="modal">
            <div>
                <form className='flex flex-row-reverse' method="dialog">
                    <button className="btn btn-sm place-self-end btn-circle bg-transparent border-0 text-white hover:bg-white hover:text-black">✕</button>
                </form>
                <div className="modal-box">
                    {node}
                </div>
            </div>
        </dialog>
        {children}
    </ModalContext.Provider>
}

export function useModal(): ModalContextType {
    const context = useContext(ModalContext)
    if (!context) {
        throw new Error("Use ModalProvider before using useModal()")
    }

    return context
}