import {Outlet, useParams} from "react-router";
import {FormProvider} from "~/context/FormContext";
import ScrollToTop from "~/component/ScrollToTop";
import React from "react"
import {useNavigate} from "react-router-dom";

function FormsByIdPage() {
    return <>
        <Outlet/>
    </>
}

export default function FormsByIdRoute() {

    const navigate = useNavigate()
    const { formId } = useParams();

    if (!formId) {
        navigate('/')
    }

    return <FormProvider id={formId!}>
        <FormsByIdPage/>
        <ScrollToTop/>
    </FormProvider>
}