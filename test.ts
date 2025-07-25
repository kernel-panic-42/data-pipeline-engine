
type CSVRecord = Record<string, any>;

type Result<T, E = Error> = | { success: true; data: T } | { success: false; error: E };

const chain = <T, U>(result: Result<T, Error>, fn: (data: T) => Result<U, Error>): Result<U, Error> => {
    if (result.success) {
        return fn(result.data);
    } else {
        return result; // pass the error through unchanged
    }
};

const pipeline = <T>(initialValue: Result<T, Error>, ...steps: Array<(data: T) => Result<T, Error>>): Result<T, Error> => {
    let current = initialValue;

    for (const step of steps) {
        if (!current.success) break;
        current = step(current.data);
    }

    return current;
};

const parseCSV = (csvString: string): Result<CSVRecord[], Error> => {
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

const filterByDepartment = (records: CSVRecord[], department: string): Result<CSVRecord[], Error> => {
    try {
        const filtered = records.filter(record => record.department === department);
        return { success: true, data: filtered };
    } catch (error) {
        return { success: false, error: error as Error };
    }
};

const increaseSalary = (records: CSVRecord[], percentage: number): Result<CSVRecord[], Error> => {
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

const processCSV = (CSVstring: string, department: string): Result<CSVRecord[], Error> => {
    return chain(parseCSV(CSVstring), (records) => filterByDepartment(records, department));
};

const processCSVAdvanced = (CSVstring: string, department: string, salaryIncrease: number): Result<CSVRecord[], Error> => {
    return chain(
        chain(parseCSV(CSVstring),
            (records) => filterByDepartment(records, department)),
        (records) => increaseSalary(records, salaryIncrease));
};

const processCSVPipeline = (csvString: string, department: string, salaryIncrease: number): Result<CSVRecord[], Error> => {
    return pipeline(
        parseCSV(csvString),
        (records) => filterByDepartment(records, department),
        (records) => increaseSalary(records, salaryIncrease)
    );
};



// Test data
const emptyCSV = '';

const sampleCSV =
    `name,age,department
Alice,25,Engineering
Bob,30,Marketing
Charlie,35,Engineering`;

const sampleCSVSalary =
    `name,age,salary,department
Alice,25,50000,Engineering
Bob,30,60000,Engineering  
Charlie,35,75000,Marketing
Diana,28,55000,Engineering
Eve,32,70000,Marketing`;


// Run the test
console.log('Testing parseCSV...');
const result = processCSVPipeline(sampleCSVSalary, 'Engineering', 10);

if (result.success) {
    console.log('Records:', result.data);
} else {
    console.log('Error:', result.error.message);
}