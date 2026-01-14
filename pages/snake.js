import { useState, useEffect, useCallback } from 'react'

const GRID_SIZE = 20
const INITIAL_SNAKE = [{ x: 10, y: 10 }]
const INITIAL_FOOD = { x: 15, y: 15 }
const INITIAL_DIRECTION = { x: 0, y: -1 }

export default function Snake() {
  const [snake, setSnake] = useState(INITIAL_SNAKE)
  const [food, setFood] = useState(INITIAL_FOOD)
  const [direction, setDirection] = useState(INITIAL_DIRECTION)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)

  const generateFood = useCallback(() => {
    let newFood
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      }
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y))
    return newFood
  }, [snake])

  const moveSnake = useCallback(() => {
    if (gameOver) return

    setSnake(currentSnake => {
      const newSnake = [...currentSnake]
      const head = { ...newSnake[0] }
      head.x += direction.x
      head.y += direction.y

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true)
        return currentSnake
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true)
        return currentSnake
      }

      newSnake.unshift(head)

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 1)
        setFood(generateFood())
      } else {
        newSnake.pop()
      }

      return newSnake
    })
  }, [direction, food, gameOver, generateFood])

  const changeDirection = useCallback((e) => {
    const { key } = e
    if (key === 'ArrowUp' && direction.y === 0) {
      setDirection({ x: 0, y: -1 })
    } else if (key === 'ArrowDown' && direction.y === 0) {
      setDirection({ x: 0, y: 1 })
    } else if (key === 'ArrowLeft' && direction.x === 0) {
      setDirection({ x: -1, y: 0 })
    } else if (key === 'ArrowRight' && direction.x === 0) {
      setDirection({ x: 1, y: 0 })
    }
  }, [direction])

  const resetGame = () => {
    setSnake(INITIAL_SNAKE)
    setFood(INITIAL_FOOD)
    setDirection(INITIAL_DIRECTION)
    setGameOver(false)
    setScore(0)
  }

  useEffect(() => {
    const gameInterval = setInterval(moveSnake, 200)
    return () => clearInterval(gameInterval)
  }, [moveSnake])

  useEffect(() => {
    window.addEventListener('keydown', changeDirection)
    return () => window.removeEventListener('keydown', changeDirection)
  }, [changeDirection])

  const renderGrid = () => {
    const grid = []
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const isSnakeHead = snake[0] && snake[0].x === col && snake[0].y === row
        const isSnakeBody = snake.slice(1).some(segment => segment.x === col && segment.y === row)
        const isFood = food.x === col && food.y === row

        let cellClass = 'w-4 h-4 border border-gray-300'

        if (isSnakeHead) {
          cellClass += ' bg-green-600'
        } else if (isSnakeBody) {
          cellClass += ' bg-green-400'
        } else if (isFood) {
          cellClass += ' bg-red-500'
        } else {
          cellClass += ' bg-gray-100'
        }

        grid.push(
          <div key={`${row}-${col}`} className={cellClass}></div>
        )
      }
    }
    return grid
  }

  return (
    <main className="min-h-screen flex items-start justify-center p-6">
      <div className="w-full max-w-lg mt-10">
        <div className="card">
          <h1 className="text-2xl font-semibold mb-4">Snake Game</h1>
          <div className="mb-4">
            <p className="text-lg">Score: {score}</p>
            {gameOver && <p className="text-red-500">Game Over!</p>}
          </div>
          <div className="grid grid-cols-20 gap-0 mb-4 border-2 border-gray-400">
            {renderGrid()}
          </div>
          <div className="flex justify-between">
            <button
              onClick={resetGame}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Reset Game
            </button>
            <a
              href="/"
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Back to Home
            </a>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>Use arrow keys to control the snake.</p>
          </div>
        </div>
      </div>
    </main>
  )
}