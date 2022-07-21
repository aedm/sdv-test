import { useState } from 'react'
import Plot from 'react-plotly.js';

import orig from './BigBasketProducts1k.csv.json';
import gaussian from './BigBasketProducts1k-gaussian.csv.json';
import copulaGan from './BigBasketProducts1k-copula_gan.csv.json';
import copulaGan1k from './BigBasketProducts1k-copula_gan_1k.csv.json';
import copulaGan10k from './BigBasketProducts1k-copula_gan_10k.csv.json';
import ctGan from './BigBasketProducts1k-ctgan.csv.json';
import tabular from './BigBasketProducts1k-tabular.csv.json';
import tvae from './BigBasketProducts1k-tvae.csv.json';

const X_COLUMN = 'sale_price';
const Y_COLUMN = 'rating';

const FILTER_COLUMN = 'category';
const FILTER_VALUE = 'Kitchen, Garden & Pets';
// const FILTER_VALUE = 'Beauty & Hygiene';
// const FILTER_VALUE = 'Gourmet & World Food';

// const FILTER_COLUMN = "sub_category";
// const FILTER_VALUE = "Health & Medicine";

// const CHART_TYPE = 'histogram2d';
const CHART_TYPE = 'histogram2dcontour';

const ZMAX = 120;
const ZMAX_FILTERED = 20;

const RANGES = {
  autobinx: false,
  xbins: {
    start: 0,
    end: 800,
    size: 100
  },
  autobiny: false,
  ybins: {
    start: 0,
    end: 5,
    size: 0.25
  },
  zauto: false,
  ncontours: 30,
};

function Charts() {
  const layout = {
    width: 700,
    height: 700,
    autosize: true,

    title: 'n/a',
    scene: {
      zaxis: {
        nticks: 10,
        range: [-1, 500],
      },
      // camera: {
      //   eye: {x: 0, y: 0, z: 1.25},
      //   center: {x: 0, y: 0, z: -0.25},
      //   up: {x: 0, y:0.001, z: 1}
      // },
      // dragmode: 'turntable'
    },
    // margin: {
    //   l: 0,
    //   r: 0,
    //   b: 0,
    //   t: 100,
    // },
    
  };

  const tables = [
    { table: orig, name: 'original' }, 
    { table: gaussian, name: 'gaussian' }, 
    { table: copulaGan, name: 'copulaGan-300' },
    { table: copulaGan1k, name: 'copulaGan-1k' }, 
    { table: copulaGan10k, name: 'copulaGan-10k' }, 
    // { table: tabular, name: 'tabular' }, 
    // { table: tvae, name: 'tvae' }, 
    // { table: ctGan, name: 'ctGan' }
  ];

  const plots = tables.map(item => {
    const xData = item.table.map(row => row[X_COLUMN]);
    const yData = item.table.map(row => row[Y_COLUMN]);

    return {
      plot: {
        x: xData,
        y: yData,
        type: CHART_TYPE,
        zmax: ZMAX,
        ...RANGES
      },
      name: item.name,
    };
  });

  const fileredPlots = tables.map(item => {
    const rows = item.table.filter(row => row[FILTER_COLUMN] === FILTER_VALUE);
    const xData = rows.map(row => row[X_COLUMN]);
    const yData = rows.map(row => row[Y_COLUMN]);

    return {
      plot: {
        x: xData,
        y: yData,
        type: CHART_TYPE,
        zmax: ZMAX_FILTERED,
        ...RANGES
      },
      name: `${FILTER_VALUE} (${item.name})`,
    };
  });

  return (
    <>
    <div className="App">
      {plots.map((plot) => <Plot
        data={[plot.plot]}
        layout={{
          ...layout,
          title: plot.name,
        }}
      />)}
      </div>
      <div className="App">
      {fileredPlots.map((plot) => <Plot
        data={[plot.plot]}
        layout={{
          ...layout,
          title: plot.name,
        }}
      />)}
    </div>
    </>
  )
}

export default Charts
