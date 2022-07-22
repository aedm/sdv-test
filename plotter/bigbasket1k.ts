import * as fs from 'fs';
import * as Papa from 'papaparse';

const INPUT_BASE_NAME = 'BigBasketProducts1k';
const MODELS = ['', '-copula_gan', '-copula_gan_1k', '-copula_gan_10k', '-ctgan', '-gaussian', '-tabular', '-tvae'];
const OUTPUT_FOLDER = '../plot-react/src/bigbasket1k/';

function processFile(file: string) {
  const fileContent = fs.readFileSync(`../${file}`, 'utf8');
  const csv = Papa.parse(fileContent, { header: true });
  const data = csv.data.filter(row => !!row['index']);
  console.log("Rows:", data.length);
  fs.writeFileSync(`${OUTPUT_FOLDER}${file}.json`, JSON.stringify(data, null, 2));
}

const inputFiles = MODELS.map(model => `${INPUT_BASE_NAME}${model}.csv`);

for (let file of inputFiles) {
  processFile(file);
}
