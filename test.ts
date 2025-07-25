
import type { CSVRecord, Result } from './types';
import { chain, pipeline, parseCSV, filterByDepartment, increaseSalary } from './functions';


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