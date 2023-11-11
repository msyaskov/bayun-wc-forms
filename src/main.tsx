import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import AppRoute from "~/app/app";
import FormsLayout from "~/app/forms/forms";
import FormsByIdRoute from "~/app/forms/[formId]/forms.[formId]";
import FormsByIdViewRoute from "~/app/forms/[formId]/forms.[formId].view";
import FormsByIdEditRoute from "~/app/forms/[formId]/forms.[formId].edit";
import HomeRoute from "~/app/app.home";
import FormsByIdAnswersRoute from "~/app/forms/[formId]/forms.[formId].answers";
import UnauthenticatedRoute from "~/app/app.unauthenticated";
import axios from "axios";
import FormsByIdSuccessRoute from "~/app/forms/[formId]/forms.[formId].success";

// <span className="material-symbols-outlined">radio_button_checked</span>
// <span className="material-symbols-outlined">select_check_box</span>
// <span className="material-symbols-outlined">check_box</span>
// <span className="material-symbols-outlined">share</span>
// <span className="material-symbols-outlined">visibility</span>

axios.defaults.validateStatus = () => true

const router = createBrowserRouter([{
    id: 'index',
    path: '/',
    element: <AppRoute/>,
    children: [{
        id: 'home',
        path: '/',
        element: <HomeRoute/>
    },{
        id: 'forms',
        path: '/forms',
        element: <FormsLayout/>,
        children: [{
            id: 'forms.byId',
            path: '/forms/:formId',
            element: <FormsByIdRoute/>,
            children: [{
                id: 'forms.byId.view',
                path: '/forms/:formId',
                element: <FormsByIdViewRoute/>
            },{
                id: 'forms.byId.edit',
                path: '/forms/:formId/edit',
                element: <FormsByIdEditRoute/>
            },{
                id: 'forms.byId.answers',
                path: '/forms/:formId/answers',
                element: <FormsByIdAnswersRoute/>
            },{
                id: 'forms.byId.success',
                path: '/forms/:formId/success',
                element: <FormsByIdSuccessRoute/>
            }]
        }]
    }]
}])

ReactDOM.createRoot(document.getElementById('root')!).render(<RouterProvider router={router}/>)
