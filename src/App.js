import React, {useState, useCallback, useRef} from 'react';
import produce from 'immer';

let NO_COLS = 50;
let NO_ROWS = 50;

const neighborOps = [
  [0, 1],
  [0,-1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
];

function App() {

  let [started, setStarted] = useState(false);
  const startedRef = useRef();
  startedRef.current = started;
  let [grid, setGrid] = useState(() => {
    const rows = [];
    for(let i=0;i<NO_ROWS;i++){
      rows.push(new Array(NO_COLS).fill(0));
    }
    return rows;
  });

  const runSimulation = useCallback(()=> {
    if(!startedRef.current){
      return;
    }
    //Simulate
    setGrid((currGrid)=> {
      return produce(currGrid, (nextGrid) => {
        for(let i=0;i<NO_ROWS;i++){
          for(let j=0;j<NO_COLS;j++){
            let neighbours = 0;
            neighborOps.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j+y;

              if(newI >= 0 && newI < NO_ROWS && newJ >= 0 && newJ <NO_COLS){
                neighbours +=  currGrid[newI][newJ];
              }
            })
            if(neighbours < 2 || neighbours > 3){
              nextGrid[i][j] = 0;
            }

            if(neighbours === 3 && currGrid[i][j] === 0){
              nextGrid[i][j] = 1;
            }
          }
        }
      });
    });
    setTimeout(runSimulation, 400);
  }, []);

  return (
    <>
      <button onClick={()=>{
        setStarted(!started);
        startedRef.current = true;
        runSimulation();
      }}>{started ? 'Stop': 'Start'}</button>
      <div style={{display: 'grid', padding: 20, gridTemplateColumns: `repeat(${NO_COLS}, 20px)`}}>
        {
          grid.map((row, rowIndex)=>{
            return row.map((col, colIndex)=> {
              return <div 
                key={`${rowIndex}-${colIndex}`} 
                onClick={()=> {
                  const newGrid = produce(grid, (copyGrid)=>{
                    copyGrid[rowIndex][colIndex] = grid[rowIndex][colIndex] === 0 ? 1: 0;
                  });
                  setGrid(newGrid);
                }}
                style={{"width": "20px", "height": "20px", backgroundColor: grid[rowIndex][colIndex] ? 'pink': 'white', border:"1px solid black"}
              }/>
            })
          })
        }
      </div>
    </>
  );
}

export default App;
