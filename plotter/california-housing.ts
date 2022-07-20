import * as fs from 'fs';
import * as Papa from 'papaparse';

const INPUT_BASE_NAME = 'CaliforniaHousing';
const MODELS = ['', '-copula_gan', '-ctgan', '-gaussian', '-tabular', '-tvae'];
const OUTPUT_FOLDER = '../plot-react/src/california-housing/';
const X_COLUMN = 'median_house_value'
const Y_COLUMN = 'population'

const FILTER_COLUMN = 'ocean_proximity';
const FILTER_VALUE = 'NEAR BAY';

const RESOLUTION = 25;
const X_RANGE = 600_000;
const Y_RANGE = 6_000;

function get_bucket(value: number, min: number, max: number, res: number): number {
  const a = Math.floor((value - min) * res / (max - min));
  if (a < 0) {
    return 0;
  }
  if (a >= res) {
    return res - 1;
  }
  return a;
}

function processFile(file: string, filterValue: string, filterColumn: string | undefined) {
  const fileContent = fs.readFileSync(`../${file}`, 'utf8');
  const csv = Papa.parse(fileContent, { header: true });
  const hasFilter = typeof filterColumn === 'string' && filterColumn !== '';
  console.log("Rows:", csv.data.length);

  const m = Array.from({ length: RESOLUTION }, () => Array.from({ length: RESOLUTION }, () => 0));

  csv.data.forEach((row) => {
    if (hasFilter && row[filterColumn] !== filterValue) {
      return;
    }
    const xv = parseFloat(row[X_COLUMN]);
    const yv = parseFloat(row[Y_COLUMN]);
    const x = get_bucket(xv, 0, X_RANGE, RESOLUTION);
    const y = get_bucket(yv, 0, Y_RANGE, RESOLUTION);
    if (!isNaN(x) && !isNaN(y)) {
      m[y][x] += 1;
    }
  });

  const xax = [];
  const yax = [];
  for (let i = 0; i < RESOLUTION; i++) {
    xax.push(i * X_RANGE / RESOLUTION);
    yax.push(i * Y_RANGE / RESOLUTION);
  }

  const namePostfix = hasFilter ? FILTER_VALUE : 'full data';
  const data = {
    plot: {
      type: 'surface',
      z: m,
      x: xax,
      y: yax,
      showscale: false,
    },
    name: `${file}\n${namePostfix}`,
  };

  const filterPrefix = hasFilter ? 'filtered-' : '';
  fs.writeFileSync(`${OUTPUT_FOLDER}${filterPrefix}${file}.json`, JSON.stringify(data, null, 2));
}

const inputFiles = MODELS.map(model => `${INPUT_BASE_NAME}${model}.csv`);

for (let file of inputFiles) {
  processFile(file, FILTER_VALUE, FILTER_COLUMN);
  processFile(file, '', '');
}
