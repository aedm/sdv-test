import * as fs from 'fs';
import * as Papa from 'papaparse';

const INPUT_FILES = ['medical_orig.csv', 'medical_syn.csv', 'medical_copula_gan.csv', 'medical_ctgan.csv'];
const X_COLUMN = ' Average Covered Charges '
const Y_COLUMN = 'Average Medicare Payments'
const FILTER_COLUMN = 'DRG Definition';
// const FILTER_VALUE = '194 - SIMPLE PNEUMONIA & PLEURISY W CC';
// const FILTER_VALUE = '244 - PERMANENT CARDIAC PACEMAKER IMPLANT W/O CC/MCC';
// const FILTER_VALUE = '482 - HIP & FEMUR PROCEDURES EXCEPT MAJOR JOINT W/O CC/MCC';
// const FILTER_VALUE = '039 - EXTRACRANIAL PROCEDURES W/O CC/MCC';
// const FILTER_VALUE = '469 - MAJOR JOINT REPLACEMENT OR REATTACHMENT OF LOWER EXTREMITY W MCC';
const FILTER_VALUE = '064 - INTRACRANIAL HEMORRHAGE OR CEREBRAL INFARCTION W MCC';


const RESOLUTION = 100;
const X_RANGE = 100_000;
const Y_RANGE = 50_000;


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
  fs.writeFileSync(`../plot-react/src/${filterPrefix}${file}.json`, JSON.stringify(data, null, 2));
}

for (let file of INPUT_FILES) {
  processFile(file, FILTER_VALUE, FILTER_COLUMN);
  processFile(file, '', '');
}
