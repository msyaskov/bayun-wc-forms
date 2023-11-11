import {HTMLAttributes} from "react";

export type PropsFooter = HTMLAttributes<HTMLDivElement>

export default function Footer(props: PropsFooter) {

    return <footer {...props}>
        <div className='px-4 py-2 text-xs font-logo text-center'>
            <span className='font-medium'>Bayun <span className='text-blue-500'>Forms</span> &copy; 2023</span>
        </div>
    </footer>
}