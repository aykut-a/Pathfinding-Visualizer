import { startingPoint, endingPoint, clearTheBoard, freezeConsole } from '../script.js'

// Staircase Model 
function generateStairCase() {
  freezeConsole('freeze')
  clearTheBoard()
  let up = 2
  let down = 2
  const downstairs = setInterval(() => {
    if (up === 20) {
      document.querySelector('.start').classList.remove('obstacle')
      document.querySelector('.ending').classList.remove('obstacle')
      clearInterval(downstairs)
    }
    document.getElementById(`${up + (up - 2) * 40}`).classList.add('obstacle')
    up += 1
  }, 20)
  const upstairs = setInterval(() => {
    if (down === 19) {
      document.querySelector('.start').classList.remove('obstacle')
      document.querySelector('.ending').classList.remove('obstacle')
      freezeConsole('unfreeze')
      clearInterval(upstairs)
    }
    document.getElementById(`${740 - (down - 2) * 39}`).classList.add('obstacle')
    down += 1
  }, 20)
}

//  Random Maze Generation

function generateRandomMaze() {
  freezeConsole('freeze')
  clearTheBoard()
  let allSquares = Array.from(document.querySelectorAll('.square'))
  for (let i = 0; i < allSquares.length; i++) {
    let random = Math.floor(Math.random() * 4)
    if (random === 1) { allSquares[i].classList.add('obstacle') }
  }
  document.querySelector('.start').classList.remove('obstacle')
  document.querySelector('.ending').classList.remove('obstacle')
  freezeConsole('unfreeze')
}


// Vertical Maze Generation

function generateVerticalMaze() {
  freezeConsole('freeze')
  clearTheBoard()
  for (let i = 0; i < 40; i++) {
    document.getElementById(`${i}`).classList.add('obstacle')
    document.getElementById(`${760 + i}`).classList.add('obstacle')
  }
  for (let i = 1; i < 20; i++) {
    document.getElementById(`${i * 40}`).classList.add('obstacle')
    document.getElementById(`${(i * 40) - 1}`).classList.add('obstacle')
  }
  let ceiling = []
  for (let i = 1; i < 38; i++) {
    ceiling.push(document.getElementById(`${i}`))
  }
  divideEm(ceiling)
}


function divideEm(array) {
  for (let i = 0; i < array.length; i++) {
    let number = (Number(array[i].getAttribute('id')))
    if (number % 4 === 0) {
      let wall = []
      for (let j = 1; j < 19; j++) {
        document.getElementById(`${number + j * 40}`).classList.add('obstacle')
        wall.push(document.getElementById(`${number + j * 40}`))
      }
      generateGaps(wall)
    }
  }
}


function generateGaps(array) {
  let random1 = Math.floor(Math.random() * array.length)
  let a = 2
  if (array.length === 2) { a = 1 }
  for (let i = 0; i < a; i++) {
    if (random1 === array.length - 1) { array[random1 - 1 - i].classList.remove('obstacle') }
    if (random1 !== array.length - 1) { array[random1 + i].classList.remove('obstacle') }
  }
  horizontalDivison(array)
}

function horizontalDivison(array) {
  for (let i = 0; i < array.length; i++) {
    if (!array[i].classList.contains('obstacle') || i % 3 !== 1) { continue }
    let random = Math.floor(Math.random() * 2)
    if (random === 0) { setTimeout(() => { pivotHorizontally(array[i], 'right') }, 500) }
    if (random === 1) { setTimeout(() => { pivotHorizontally(array[i], 'left') }, 500) }
  }
}


function pivotHorizontally(element, direction) {
  if (direction === 'left') {
    let tip
    for (let i = 0; i < 3; i++) {
      let number = Number(element.getAttribute('id'))
      if (myNeighboor(document.getElementById(`${number - i}`), 'left')) {
        document.getElementById(`${number - i}`).classList.add('obstacle')
        tip = document.getElementById(`${number - i}`)
      }
    }
    pivotVertically(tip)
  }
  if (direction === 'right') {
    let tip
    for (let i = 0; i < 3; i++) {
      let number = Number(element.getAttribute('id'))
      if (myNeighboor(document.getElementById(`${number + i}`), 'right')) {
        document.getElementById(`${number + i}`).classList.add('obstacle')
        tip = document.getElementById(`${number + i}`)
      }
    }
    pivotVertically(tip)
  }

}


function pivotVertically(element) {
  let center = Number(element.getAttribute('id'))
  for (let i = 0; i < 4; i++) {
    if (center % 40 === 37) { continue }
    let upper = document.getElementById(`${center - i * 40}`)
    if (myNeighboor(upper, 'upper')) { upper.classList.add('obstacle') }
  }
  for (let i = 0; i < 4; i++) {
    if (center % 40 === 37) { continue }
    let lower = document.getElementById(`${center + i * 40}`)
    if (myNeighboor(lower, 'lower')) { lower.classList.add('obstacle') }
  }
  startingPoint.classList.remove('obstacle')
  endingPoint.classList.remove('obstacle')
  freezeConsole('unfreeze')
}


function myNeighboor(element, direction) {
  if (element === null) { return false }
  let center = Number(element.getAttribute('id'))
  let state = true
  if (direction === 'left') {
    let left = document.getElementById(`${center - 1}`)
    if (left.classList.contains('obstacle')) { state = false }
  }
  if (direction === 'right') {
    let right = document.getElementById(`${center + 1}`)
    if (right.classList.contains('obstacle')) { state = false }
  }
  if (direction === 'upper') {
    let upper = document.getElementById(`${center - 40}`) || ''
    if (upper === '') { return }
    if (upper.classList.contains('obstacle')) { state = false }
  }
  if (direction === 'lower') {
    let lower = document.getElementById(`${center + 40}`) || ''
    if (lower === '') { return }
    if (lower.classList.contains('obstacle')) { state = false }
  }
  return state
}



export { generateRandomMaze, generateVerticalMaze, generateStairCase }