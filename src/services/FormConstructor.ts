import {FormContextType} from "~/context/FormContext";
import {patchForm} from "~/services/FormService";
import {doIfTrue} from "~/utils/Checker";
import Optional from "~/utils/Optional";
import {Form, FormScope, Option, Question, QuestionType} from "~/model/Form";
import axios, {AxiosResponse} from "axios";
import RestDocument, {FormRestObject, IdRestObject} from "~/rest/RestDocument";

export default class FormConstructor {
    private readonly fc: FormContextType

    constructor(fc: FormContextType) {
        this.fc = fc
    }

    private form(): FormRestObject {
        return this.fc.form.get()!
    }

    async setName(name: string): Promise<boolean> {
        name = name.trim()
        if (name.length == 0) {
            console.log('name', name, 'return false')
            return false
        }

        if (this.form().name != name) {
            return patchForm(this.form().id, {
                name: name
            }).then(status => {
                doIfTrue(status == 200, () => this.update(f => {
                    f.name = name
                    return new Optional<FormRestObject>(f)
                }))
                return status == 200
            })
        }
        return true
    }

    async setScope(scope: FormScope): Promise<boolean> {
        return patchForm(this.form().id, {
            scope: scope
        }).then(status => {
            doIfTrue(status == 200, () => this.update(f => {
                f.scope = scope
                return new Optional<FormRestObject>(f)
            }))
            return status == 200
        })
    }

    private update(updater: (f: FormRestObject) => Optional<FormRestObject>) {
        this.fc.update(form => form.flatMap(updater))
    }

    async addQuestion(type: QuestionType): Promise<boolean> {
        let newQuestion: object = {
            id: '',
            comment: undefined,
            label: this.getQuestionTypeDescription(type),
            type: type
        }

        switch (type) {
            case QuestionType.SHORT_TEXT:
            case QuestionType.LONG_TEXT:
                newQuestion = {...newQuestion, required: false}; break
            case QuestionType.CHECKBOX:
            case QuestionType.RADIO:
            case QuestionType.DROPDOWN:
                newQuestion = {...newQuestion, required: false, options: []}; break
        }

        return axios.post<RestDocument, AxiosResponse<RestDocument>>(`/v1/forms/${this.form().id}/questions`, newQuestion)
            .then(ar => {
                if (ar.status !== 201) {
                    return false
                }

                (newQuestion as Question).id = (ar.data["questionId"] as IdRestObject).id
                this.update(f => {
                    f.questions.push(newQuestion as Question)
                    return new Optional<FormRestObject>(f)
                })
                return true
            })
    }

    async setQuestionLabel(qId: string, label: string): Promise<boolean> {
        return axios.patch<RestDocument, AxiosResponse<RestDocument>>(`/v1/forms/${this.form().id}/questions/${qId}`, {
            label: label
        })
            .then(ar => {
                if (ar.status !== 200) {
                    return false
                }

                this.update(f => {
                    f.questions.find(q => q.id === qId)!.label = label
                    return new Optional<FormRestObject>(f)
                })
                return true
            })
    }

    async setQuestionComment(qId: string, comment: string): Promise<boolean> {
        comment = comment.trim()

        return axios.patch<RestDocument, AxiosResponse<RestDocument>>(`/v1/forms/${this.form().id}/questions/${qId}`, {
            comment: comment
        })
            .then(ar => {
                if (ar.status !== 200) {
                    return false
                }

                this.update(f => {
                    f.questions.find(q => q.id === qId)!.comment = comment
                    return new Optional<FormRestObject>(f)
                })
                return true
            })
    }


    async setQuestionRequired(qId: string, required: boolean) {
        return axios.patch<RestDocument, AxiosResponse<RestDocument>>(`/v1/forms/${this.form().id}/questions/${qId}`, {
            required: required
        })
            .then(ar => {
                if (ar.status !== 200) {
                    return false
                }

                this.update(f => {
                    f.questions.find(q => q.id === qId)!.required = required
                    return new Optional<FormRestObject>(f)
                })
                return true
            })
    }

    async removeQuestion(qId: string) {
        return axios.delete<RestDocument, AxiosResponse<RestDocument>>(`/v1/forms/${this.form().id}/questions/${qId}`)
            .then(ar => {
                if (ar.status !== 200) {
                    return false
                }

                this.update(f => {
                    f.questions = f.questions.filter(q => q.id !== qId)
                    return new Optional<FormRestObject>(f)
                })
                return true
            })
    }

    async addOption(qId: string, label: string) {
        if (label.trim().length === 0) {
            return false
        }

        const newOption: Option = {
            id: '',
            label: label.trim()
        }

        return axios.post<RestDocument, AxiosResponse<RestDocument>>(`/v1/forms/${this.form().id}/questions/${qId}/options`, newOption)
            .then(ar => {
                if (ar.status !== 201) {
                    return false
                }

                newOption.id = (ar.data["optionId"] as IdRestObject).id
                this.update(f => {
                    f.questions.find(q => q.id === qId)!.options!.push(newOption)
                    return new Optional<FormRestObject>(f)
                })
                return true
            })
    }

    async setOptionLabel(qId: string, oId: string, label: string) {
        return axios.patch<RestDocument, AxiosResponse<RestDocument>>(`/v1/forms/${this.form().id}/questions/${qId}/options/${oId}`, {
            label: label.trim()
        })
            .then(ar => {
                if (ar.status !== 200) {
                    return false
                }

                this.update(f => {
                    f.questions.find(q => q.id === qId)!.options!.find(o => o.id === oId)!.label = label.trim()
                    return new Optional<FormRestObject>(f)
                })
                return true
            })
    }

    async removeOption(qId: string, oId: string) {
        return axios.delete<RestDocument, AxiosResponse<RestDocument>>(`/v1/forms/${this.form().id}/questions/${qId}/options/${oId}`)
            .then(ar => {
                if (ar.status !== 200) {
                    return false
                }

                this.update(f => {
                    const q = f.questions.find(q => q.id === qId)!
                    q.options = q.options!.filter(o => o.id !== oId)
                    return new Optional<FormRestObject>(f)
                })
                return true
            })
    }

    getQuestionTypeDescription(type: QuestionType): string {
        switch (type) {
            case QuestionType.EMPTY: return 'Текст без вопроса'
            case QuestionType.SHORT_TEXT: return 'Короткий текст'
            case QuestionType.LONG_TEXT: return 'Длинный текст'
            case QuestionType.CHECKBOX: return 'Несколько вариантов'
            case QuestionType.RADIO: return 'Один вариант'
            case QuestionType.DROPDOWN: return 'Выпадающий список'
        }

        throw new Error("Unknown QuestionType")
    }
}