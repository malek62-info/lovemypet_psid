import './App.css'
import Wrapper from './components/Wrapper'
import Plot from 'react-plotly.js'

const App = () => {
  // Données pour les hommes et les femmes
  const maleData: any = {
    x: [1, 2, 3],
    y: [2, 6, 3],
    type: 'scatter',
    mode: 'lines+markers',
    name: 'Male', // Nom dans la légende
    marker: { color: 'blue' },
  }

  const femaleData: any = {
    x: [1, 2, 3],
    y: [1, 4, 2],
    type: 'scatter',
    mode: 'lines+markers',
    name: 'Female', // Nom dans la légende
    marker: { color: 'pink' },
  }

  return (
    <Wrapper>
      <div className="flex flex-col">
        <Plot
          data={[maleData, femaleData]} // Affiche les deux traces
          config={{
            responsive: true,
            displayModeBar: true,
            displaylogo: false,
            staticPlot: false,
          }}
          layout={{  title: { text: 'A Fancy Plot' } }}
        />
      </div>
    </Wrapper>
  )
}

export default App
