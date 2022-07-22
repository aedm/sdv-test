import * as fs from 'fs';
import * as Papa from 'papaparse';

const INPUT_BASE_NAME = 'Airlines';
const MODELS = ['', '-gaussian', '-tabular'];
const OUTPUT_FOLDER = '../plot-react/src/airlines/';

function processFile(file: string) {
  const fileContent = fs.readFileSync(`../${file}`, 'utf8');
  const csv = Papa.parse(fileContent, { header: true });
  const data = csv.data.filter(row => !!row['id']);
  console.log("Rows:", data.length);
  fs.writeFileSync(`${OUTPUT_FOLDER}${file}.json`, JSON.stringify(data, null, 2));
}

const inputFiles = MODELS.map(model => `${INPUT_BASE_NAME}${model}.csv`);

for (let file of inputFiles) {
  processFile(file);
}
