export type Answer = {
    id: string,
    replierId: string,
    formId: string,
} & NewAnswer

export type NewAnswer = {
    values: Record<string, string | string[] | undefined>
}