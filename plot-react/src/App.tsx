import { useState } from 'react'
import './App.css'
import Plot from 'react-plotly.js';

import orig from './medical_orig.csv.json';
import syn from './medical_syn.csv.json';
import copulaGan from './medical_copula_gan.csv.json';
import ctGan from './medical_ctgan.csv.json';

import filtered_orig from './filtered-medical_orig.csv.json';
import filtered_syn from './filtered-medical_syn.csv.json';
import filtered_copulaGan from './filtered-medical_copula_gan.csv.json';
import filtered_ctGan from './filtered-medical_ctgan.csv.json';

function App() {
  const layout = {
    width: 800,
    height: 1000,
    autosize: true,

    title: 'n/a',
    scene: {
      zaxis: {
        nticks: 10,
        range: [-1, 1000],
      },
    },
    margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 100,
    },
  };
  const plots = [orig, syn, copulaGan, ctGan, filtered_orig, filtered_syn, filtered_copulaGan, filtered_ctGan];

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

export default App
