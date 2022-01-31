export interface LogErrorRespository {
    log: (stack: string) => Promise<void>
}
