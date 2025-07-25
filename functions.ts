import type { CSVRecord, Result } from './types';

export const chain = <T, U>(result: Result<T, Error>, fn: (data: T) => Result<U, Error>): Result<U, Error> => {
    if (result.success) {
        return fn(result.data);
    } else {
        return result; // pass the error through unchanged
    }
};

export const pipeline = <T>(initialValue: Result<T, Error>, ...steps: Array<(data: T) => Result<T, Error>>): Result<T, Error> => {
    let current = initialValue;

    for (const step of steps) {
        if (!current.success) break;
        current = step(current.data);
    }

    return current;
};

export const parseCSV = (csvString: string): Result<CSVRecord[], Error> => {
    try {
        const lines = csvString.trim().split('\n');

        if (lines.length < 2) {
            return { success: false, error: new Error('Empty CSV') };
        }

        const headers = lines[0].split(',');
        const records: CSVRecord[] = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            const record: CSVRecord = {};

            headers.forEach((header, index) => {
                record[header.trim()] = values[index]?.trim() || '';
            });

            records.push(record);
        }

        return { success: true, data: records };
    } catch (error) {
        return { success: false, error: error as Error };
    }
};

export const filterByDepartment = (records: CSVRecord[], department: string): Result<CSVRecord[], Error> => {
    try {
        const filtered = records.filter(record => record.department === department);
        return { success: true, data: filtered };
    } catch (error) {
        return { success: false, error: error as Error };
    }
};

export const increaseSalary = (records: CSVRecord[], percentage: number): Result<CSVRecord[], Error> => {
    try {
        const transformed = records.map(record => ({
            ...record,
            salary: (Number(record.salary) * (1 + percentage / 100)).toFixed(2)
        }));

        return { success: true, data: transformed };
    } catch (error) {
        return { success: false, error: error as Error };
    }
}