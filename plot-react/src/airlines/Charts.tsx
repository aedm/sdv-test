import { useState } from 'react'
import Plot from 'react-plotly.js';

import orig from './Airlines.csv.json';
import gaussian from './Airlines-gaussian.csv.json';
import tabular from './Airlines-tabular.csv.json';

const X_COLUMN = 'Time';
const Y_COLUMN = 'Length';

// const FILTER_COLUMN = 'AirportFrom';
// const FILTER_VALUE = 'SFO';
const FILTER_COLUMN = 'Delay';
const FILTER_VALUE = '1';

const CHART_TYPE = 'histogram2d';
// const CHART_TYPE = 'histogram2dcontour';

const ZMAX = 2000;
const ZMAX_FILTERED = 800;

const RANGES = {
  autobinx: false,
  xbins: {
    start: 0,
    end: 1800,
    size: 20
  },
  autobiny: false,
  ybins: {
    start: 0,
    end: 500,
    size: 10
  },
  zauto: false,
  ncontours: 10,
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
    },
  };

  const tables = [
    { table: orig, name: 'original' }, 
    { table: gaussian, name: 'gaussian' }, 
    { table: tabular, name: 'tabular' }, 
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
