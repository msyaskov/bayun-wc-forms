import User from "~/model/User";
import {Form} from "~/model/Form";
import {Id} from "~/model/Id";
import {Answer} from "~/model/Answer";

export enum RestObjectType {
    ID = "id",
    USER = "user",
    FORM = "form"
}

export type RestObject<OBJECT, META = unknown> = OBJECT & {
    _type: RestObjectType
    meta?: META
}

type RestDocument = Record<string, RestObject<unknown>>
export default RestDocument

export type UserRestObject = RestObject<User>
export type FormRestObject = RestObject<Form> & {meta: { replier: boolean }}
export type IdRestObject = RestObject<Id>
export type ListFormRestObject = RestObject<Form[]>
export type ListAnswerRestObject = RestObject<Answer[]>