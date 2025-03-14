
import './App.css'
import Wrapper from './components/Wrapper'
import Plot from 'react-plotly.js';

function App() {


  return (
    <Wrapper >
 <Plot
        data={[
          {
            x: [1, 2, 3],
            y: [2, 6, 3],
            type: 'scatter',
            mode: 'lines+markers',
            marker: {color: 'red'},
          },
          {type: 'bar', x: [1, 2, 3], y: [2, 5, 3]},
        ]}
        layout={ {width: 320, height: 240, title: {text: 'A Fancy Plot'}} }
      />
    </Wrapper>
  )
}

export default App
