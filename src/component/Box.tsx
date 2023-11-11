import {PropsWithChildren} from "react";

export default function Box({ children }: PropsWithChildren) {
    return <div className='p-4 rounded-2xl border border-gray-100 bg-white'>
        {children}
    </div>
}

export function ShadowBox({ children }: PropsWithChildren) {
    return <div className='px-6 py-2 rounded-2xl border border-gray-100 bg-white shadow'>
        {children}
    </div>
}