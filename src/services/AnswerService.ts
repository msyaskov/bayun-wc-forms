import axios, {AxiosResponse} from "axios";
import RestDocument, {IdRestObject, ListAnswerRestObject} from "~/rest/RestDocument";
import Optional, {getEmptyOptional} from "~/utils/Optional";
import {Id} from "~/model/Id";
import {Answer, NewAnswer} from "~/model/Answer";

export async function postAnswer(formId: string, answer: NewAnswer): Promise<Optional<Id>> {
    const ar = await axios.post<RestDocument, AxiosResponse<RestDocument>, NewAnswer>("/v1/forms/"+formId+"/answers", answer)
    if (ar.status == 201) {
        return new Optional((ar.data as RestDocument)["answerId"] as IdRestObject)
    }
    return getEmptyOptional<IdRestObject>()
}

export async function getAnswersByFormId(formId: string): Promise<Optional<Answer[]>> {
    const ar = await axios.get<RestDocument, AxiosResponse<RestDocument>, NewAnswer>("/v1/forms/"+formId+"/answers")
    if (ar.status == 200) {
        // @ts-ignore
        return new Optional(((ar.data as RestDocument)["list_answer"] as ListAnswerRestObject)["object"])
    }
    return getEmptyOptional<Answer[]>()
}

// 654d2cb6a25dd9518f4b1936