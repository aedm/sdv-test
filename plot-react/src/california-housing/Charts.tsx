import { useState } from 'react'
import Plot from 'react-plotly.js';

import orig from './CaliforniaHousing.csv.json';
import gaussian from './CaliforniaHousing-gaussian.csv.json';
import copulaGan from './CaliforniaHousing-copula_gan.csv.json';
import ctGan from './CaliforniaHousing-ctgan.csv.json';

import filtered_orig from './filtered-CaliforniaHousing.csv.json';
import filtered_gaussian from './filtered-CaliforniaHousing-gaussian.csv.json';
import filtered_copulaGan from './filtered-CaliforniaHousing-copula_gan.csv.json';
import filtered_ctGan from './filtered-CaliforniaHousing-ctgan.csv.json';

function Charts() {
  const layout = {
    width: 800,
    height: 1000,
    autosize: true,

    title: 'n/a',
    scene: {
      zaxis: {
        nticks: 10,
        range: [-1, 500],
      },
    },
    margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 100,
    },
  };
  const plots = [orig, gaussian, copulaGan, ctGan, filtered_orig, filtered_gaussian, filtered_copulaGan, filtered_ctGan];

  return (
    <div className="App">
      {plots.map((plot) => <Plot
        data={[plot.plot]}
        layout={{
          ...layout,
          title: plot.name,
        }}
      />)}
    </div>
  )
}

export default Charts
