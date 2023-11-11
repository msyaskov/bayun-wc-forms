export default class Optional<T> {
    private readonly t: T | null
    constructor(t: T | null | undefined) {
        this.t = t == undefined ? null : t
    }

    get(): T | null {
        return this.t
    }

    orElse(t: T): T {
        return this.t == null ? t : this.t
    }

    orElseGet(supplier: () => T): T {
        return this.t == null ? supplier() : this.t
    }

    map<M>(mapper: (t: T) => M): Optional<M> {
        return this.t == null ? new Optional<M>(null): new Optional(mapper(this.t))
    }

    flatMap<M>(mapper: (t: T) => Optional<M>): Optional<M> {
        return this.t == null ? new Optional<M>(null) : mapper(this.t)
    }

    isEmpty() {
        return this.t == null
    }

    isPresent() {
        return !this.isEmpty()
    }

    ifPresent(callback: (t: T) => void) {
        if (this.t != null) {
            callback(this.t)
        }
    }

    ifPresentGet<M>(mapper: (t: T) => M): M | null {
        if (this.t != null) {
            return mapper(this.t)
        } else {
            return null
        }
    }

    ifEmpty(callback: () => void) {
        if (this.isEmpty()) {
            callback()
        }
    }

    ifPresentOrElse(ifPresentCallback: () => void, ifEmptyCallback: () => void) {
        if (this.t != null) {
            ifPresentCallback()
        } else {
            ifEmptyCallback()
        }
    }
}

export function getEmptyOptional<T>(): Optional<T> {
    return new Optional<T>(null)
}