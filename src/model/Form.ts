export type Option = {
    id: string,
    label: string
}

export enum QuestionType {
    EMPTY = "empty",
    SHORT_TEXT = "short_text",
    LONG_TEXT = "long_text",
    RADIO = "radio",
    DROPDOWN = "dropdown",
    CHECKBOX = "checkbox"
}

export type Question = {
    id: string,
    label: string,
    comment?: string,
    type: QuestionType
    required?: boolean,
    validations?: string[],
    options?: Option[]
}

export enum FormScope {
    PRIVATE = "private",
    PUBLIC = "public"
}

export type Form = {
    id: string,
    authorId: string,
    name: string,
    scope: FormScope,
    questions: Question[]
}