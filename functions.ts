import {
    CSVRecord,
    Result,
} from './types';

export const parseCSV = (csvString: string): Result<CSVRecord[], Error> => {

    try {
        const lines = csvString.trim().split('\n');

        if (lines.length === 0) {
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

