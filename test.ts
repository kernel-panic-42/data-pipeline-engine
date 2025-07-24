import {
    parseCSV
} from './functions'

const sampleCSV = `name,age,department
Alice,25,Engineering
Bob,30, Marketing
Charlie,35, Engineering
`;

console.log('Testing CSV parsing');
const result = parseCSV(sampleCSV);

if (result.success) {
    console.log('Records: ', result.data);
} else {
    console.log('Error: ', result.error.message);
}