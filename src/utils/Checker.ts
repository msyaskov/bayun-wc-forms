export function ifNullThen<T>(obj: T, then: T): T {
    return obj == null ? then : obj
}

export function isNull(obj: unknown): boolean {
    return obj == null
}

export function isNotNull(obj: unknown): boolean {
    return obj != null
}

export function ifNullThrow<T>(obj: T, message?: string): T {
    if (obj == null) {
        throw new Error(ifNullThen(message, "null")!)
    }
    return obj
}

export function doIfTrue(condition: boolean, runnable: () => void) {
    if (condition) {
        runnable()
    }
}

