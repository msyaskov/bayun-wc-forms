import axios, {AxiosResponse} from "axios";
import RestDocument, {FormRestObject, IdRestObject} from "~/rest/RestDocument";
import Optional, {getEmptyOptional} from "~/utils/Optional";
import {Form, FormScope} from "~/model/Form";
import {Id} from "~/model/Id";

const DEFAULT_NEW_FORM: Readonly<Form> = {
    id: '',
    authorId: '',
    name: 'Новая форма',
    scope: FormScope.PRIVATE,
    questions: []
}

export async function getFormById(formId: string): Promise<Optional<FormRestObject>> {
    const ar = await axios.get("/v1/forms/" + formId)
    if (ar.status === 200) {
        return new Optional((ar.data as RestDocument)["form"] as FormRestObject)
    }
    return getEmptyOptional<FormRestObject>()
}

export async function postNewForm(): Promise<Optional<Id>> {
    const ar = await axios.post<RestDocument, AxiosResponse<RestDocument>, Form>("/v1/forms", DEFAULT_NEW_FORM)
    if (ar.status == 201) {
        return new Optional((ar.data as RestDocument)["formId"] as IdRestObject)
    }
    return getEmptyOptional<IdRestObject>()
}

export async function patchForm(fId: string, patch: Partial<Form>): Promise<number> {
    return (await axios.patch("/v1/forms/"+fId, patch)).status
}

// 654d2cb6a25dd9518f4b1936