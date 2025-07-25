
export type CSVRecord = Record<string, any>;

export type Result<T, E = Error> = | { success: true; data: T } | { success: false; error: E };