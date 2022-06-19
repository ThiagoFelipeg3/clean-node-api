export interface LogErrorRespository {
    logError: (stack: string) => Promise<void>
}
