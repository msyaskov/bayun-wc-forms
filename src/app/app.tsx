import {AuthenticationContextProvider} from "~/context/AuthenticationContext";
import Header from "~/component/Header";
import Footer from "~/component/Footer";
import {Outlet} from "react-router";
import {ModalProvider} from "~/context/ModalContext";

function AppPage() {
    return <div className='flex flex-col font-main h-full min-h-screen'>
        <Header/>
        <main className='flex grow items-stretch py-4 px-6'>
            <Outlet/>
        </main>
        <Footer/>
    </div>
}
export default function AppRoute() {
    return <>
        <AuthenticationContextProvider>
            <ModalProvider>
                <AppPage/>
            </ModalProvider>
        </AuthenticationContextProvider>
    </>
}