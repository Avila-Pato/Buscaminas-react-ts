import { useState } from 'react'; // Importa el hook useState de React para manejar estados en el componente
import './index.css'; // Importa el archivo CSS de Tailwind

const GRID_SIZE = 8; // Define el tamaño de la cuadrícula
const MATCHES = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
]; // Define los desplazamientos para verificar las celdas adyacentes (diagonales, verticales y horizontales)

const MATRIX = Array.from({ length: GRID_SIZE }, () => 
  Array.from({ length: 10 }, () => 0 as number | string)
); // Crea una matriz (arreglo bidimensional) de tamaño GRID_SIZE x 10, inicializada con ceros

// Coloca las bombas en posiciones aleatorias dentro de la matriz
for (let count = GRID_SIZE; count > 0; count--) {
  const rowRandom = Math.floor(Math.random() * GRID_SIZE); // Genera una posición aleatoria para la fila
  const colRandom = Math.floor(Math.random() * GRID_SIZE); // Genera una posición aleatoria para la columna
  
  MATRIX[rowRandom][colRandom] = 'B'; // Coloca una bomba ('B') en la posición aleatoria
}

// Recorre la matriz y cuenta el número de bombas adyacentes para cada celda
for (let rowIndex = 0; rowIndex < MATRIX.length; rowIndex++) {
  for (let colIndex = 0; colIndex < MATRIX[rowIndex].length; colIndex++) {
    if (MATRIX[rowIndex][colIndex] === 'B') continue; // Si la celda ya tiene una bomba, salta a la siguiente
    
    let bombCount = 0; // Inicializa el contador de bombas adyacentes
    
    for (const match of MATCHES) {
      // Verifica si hay una bomba en la celda adyacente
      if (MATRIX[rowIndex + match[0]]?.[colIndex + match[1]] === 'B') {
        bombCount++; // Incrementa el contador si encuentra una bomba
      }
    }
    MATRIX[rowIndex][colIndex] = bombCount; // Asigna el número de bombas adyacentes a la celda actual
  }
}

function App() {
  // Crea un estado para almacenar las celdas que han sido clickeadas
  const [clicked, setClicked] = useState<string[]>([]);
  // Crea un estado para manejar el estado del juego ('playing', 'won', 'lost')
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');

  // Función que maneja el evento de click en una celda
  function handleClick(rowIndex: number, colIndex: number) {
    // Evita que se clickee una celda ya clickeada
    if (clicked.includes(`${rowIndex}-${colIndex}`)) return;
  
    const newClicked = clicked.concat(`${rowIndex}-${colIndex}`); // Actualiza el estado de celdas clickeadas
    setClicked(newClicked);
  
    // Si la celda clickeada contiene una bomba, el estado del juego cambia a 'lost'
    if (MATRIX[rowIndex][colIndex] === 'B') {
      setStatus('lost');
    }
    // Si todas las celdas sin bombas han sido clickeadas, el estado del juego cambia a 'won'
    else if (newClicked.length === GRID_SIZE ** 2 - GRID_SIZE) {
      setStatus('won');
    }
  }

  return (
    <main className='container m-auto grid min-h-screen items-center justify-center'>
      <header className='text-xl font-bold leading-[3rem] flex text-center justify-center'>Buscaminas</header>
      <section className='flex items-center justify-center flex-col gap-3 text-center'>
        <section className='grid grid-cols-10 gap-2 items-center justify-center'> 
          {MATRIX.map((row, rowIndex) => (
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`h-8 w-8 border flex items-center justify-center 
                  ${clicked.includes(`${rowIndex}-${colIndex}`) 
                ? 'bg-white/20' : 'bg-gray-500'}`}
              >
                {clicked.includes(`${rowIndex}-${colIndex}`) ? (
                  <span> {cell === 'B' ? '🎃' : cell === 0 ? null : cell}</span> // Muestra el número de bombas adyacentes o una bomba si la celda contiene una
                ) : (
                  <button
                    className='w-full h-full bg-gray-500'
                    type='button'
                    onClick={() => status === "playing" && handleClick(rowIndex, colIndex)}
                  /> // Muestra un botón que puede ser clickeado si el juego está en estado 'playing'
                )}
              </div>
            ))
          ))}
        </section>
        {status === 'lost' && ( // Muestra un mensaje de "Perdiste" y un botón para reiniciar si el jugador pierde
          <div className="flex flex-col items-center justify-center gap-4 mt-4">
            <p className="text-xl font-semibold text-red-600">Perdiste</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition duration-200"
            >
              Reiniciar
            </button>
          </div>
        )}
        {status === 'won' && ( // Muestra un mensaje de "Ganaste" y un botón para reiniciar si el jugador gana
          <div className="flex flex-col items-center justify-center gap-4 mt-4">
            <p className="text-xl font-semibold text-green-600">Ganaste</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-200"
            >
              Reiniciar
            </button>
          </div>
        )}
      </section>
      <footer className="text-center mt-8 leading-[3rem] opacity-70">
        © {new Date().getFullYear()} 
      </footer>
    </main>
  );
}

export default App; 