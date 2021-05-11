import { startingPoint, endingPoint, endingNodeCoordinate, freezeConsole, searchSpeed, noPathVisible } from '../script.js'

function modelAStar(node) {
  let center = Number(node.getAttribute('id')) // Current node
  let upper = document.getElementById(`${center - 40}`) || ''
  let right = document.getElementById(`${center + 1}`) || ''
  let lower = document.getElementById(`${center + 40}`) || ''
  let left = document.getElementById(`${center - 1}`) || ''
  let upperRight = document.getElementById(`${center - 39}`) || ''
  let lowerRight = document.getElementById(`${center + 41}`) || ''
  let lowerLeft = document.getElementById(`${center + 39}`) || ''
  let upperLeft = document.getElementById(`${center - 41}`) || ''
  if (center % 40 === 0) { // Edges
    left = ''
    upperLeft = ''
    lowerLeft = ''
  }
  if (center % 40 === 39) { // Edges
    right = ''
    upperRight = ''
    lowerRight = ''
  }
  if (upper !== '' && lower !== '' && right !== '' && left !== '') { // Obstacle Handling
    if (upper.classList.contains('obstacle') && right.classList.contains('obstacle')) { upperRight = '' }
    if (upper.classList.contains('obstacle') && left.classList.contains('obstacle')) { upperLeft = '' }
    if (lower.classList.contains('obstacle') && right.classList.contains('obstacle')) { lowerRight = '' }
    if (lower.classList.contains('obstacle') && left.classList.contains('obstacle')) { lowerLeft = '' }
  }
  node.classList.remove('checkme') // No rechecking  
  node.classList.add('checked') // State updates 
  if (node === endingPoint) { // Means the path is found
    node.innerHTML = ''
    node.innerText = 'E'
    displayAStarSolution(node)
    return
  }
  [upper, right, lower, left].forEach(direction => {
    if (direction !== '' && !direction.classList.contains('checked')) { aStarHandle(direction, 10, node) }
  })
  const arr = [upperRight, lowerRight, lowerLeft, upperLeft]
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== '' && arr[i].style.backgroundColor !== 'red') { aStarHandle(arr[i], 14, node) }
  }
  let whichNext = [] // Next square to check
  Array.from(document.querySelectorAll('.checkme')).forEach(checkable => {
    whichNext.push([checkable, Number(checkable.querySelector('.fCost').innerText)])
  })
  whichNext.sort(function (a, b) { return a[1] - b[1] })
  if (whichNext.length === 0) { // Means the path could not be found
    noPathVisible()
    return
  }
  setTimeout(() => { modelAStar(whichNext[0][0]) }, searchSpeed)
}


function aStarHandle(element, cost, origin) { // Basically assigning weights to the nodes
  if (element.classList.contains('obstacle')) { return } // No obstacles
  if (element === startingPoint) { return } // We are done here
  if (element.classList.contains('checked')) { return } // No rechecking
  element.classList.add('checkme') // New possibilities
  let coordinate = [Math.ceil(Number(element.getAttribute('id')) % 40) + 1, Math.ceil(Number(element.getAttribute('id')) / 40)]
  let currentGCost = 10000  // Just a dummy value
  if (element.children.length !== 0) { currentGCost = Number(element.querySelector('.gCost').innerText) }
  let gCost = Math.min((Number(origin.querySelector('.gCost').innerText) + Number(cost)), currentGCost)
  let hCost
  if (Math.abs(coordinate[0] - endingNodeCoordinate[0]) * Math.abs(coordinate[1] - endingNodeCoordinate[1]) === 0) {
    hCost = Math.max(Math.abs(coordinate[0] - endingNodeCoordinate[0]), Math.abs(coordinate[1] - endingNodeCoordinate[1])) * 10
  }
  if (Math.abs(coordinate[0] - endingNodeCoordinate[0]) * Math.abs(coordinate[1] - endingNodeCoordinate[1]) !== 0) {
    hCost = Math.min(Math.abs(coordinate[0] - endingNodeCoordinate[0]), Math.abs(coordinate[1] - endingNodeCoordinate[1])) * 14 + Math.abs(Math.abs(coordinate[0] - endingNodeCoordinate[0]) - Math.abs(coordinate[1] - endingNodeCoordinate[1])) * 10
  }
  let fCost = hCost + gCost
  element.innerHTML = `<p class="gCost">${gCost}</p> <p class="fCost">${fCost}</p> <p class="hCost">${hCost}</p>`
}

let shortestPath = []

function displayAStarSolution(node) {
  node.classList.add('rechecked') // No re-re chekcing is allowed
  let center = Number(node.getAttribute('id'))
  let upper = document.getElementById(`${center - 40}`) || ''
  let right = document.getElementById(`${center + 1}`) || ''
  let lower = document.getElementById(`${center + 40}`) || ''
  let left = document.getElementById(`${center - 1}`) || ''
  let upperRight = document.getElementById(`${center - 39}`) || ''
  let lowerRight = document.getElementById(`${center + 41}`) || ''
  let lowerLeft = document.getElementById(`${center + 39}`) || ''
  let upperLeft = document.getElementById(`${center - 41}`) || ''
  if (center % 40 === 0) { // Edge
    left = ''
    upperLeft = ''
    lowerLeft = ''
  }
  if (center % 40 === 39) { // Edge
    right = ''
    upperRight = ''
    lowerRight = ''
  }
  if (upper !== '' && lower !== '' && right !== '' && left !== '') { // Top and obstacle handling
    if (upper.classList.contains('obstacle') && right.classList.contains('obstacle')) { upperRight = '' }
    if (upper.classList.contains('obstacle') && left.classList.contains('obstacle')) { upperLeft = '' }
    if (lower.classList.contains('obstacle') && right.classList.contains('obstacle')) { lowerRight = '' }
    if (lower.classList.contains('obstacle') && left.classList.contains('obstacle')) { lowerLeft = '' }
  }
  if (upper === startingPoint || lower === startingPoint || right === startingPoint || left === startingPoint || lowerRight === startingPoint || lowerLeft === startingPoint || upperLeft === startingPoint || upperRight === startingPoint) { // We are done here
    showShortestPath(shortestPath)
    return
  }
  let possiblePathee = []
  let surrounding = [upper, right, left, lower, upperRight, lowerLeft, upperLeft, lowerRight]
  surrounding.forEach(square => {
    if (square === '') { return }
    if (square.classList.contains('checked') && !square.classList.contains('rechecked')) {
      possiblePathee.push([square, Number(square.querySelector('.gCost').innerText)])
    }
  })
  possiblePathee.sort(function (a, b) { return a[1] - b[1] })
  shortestPath.push(possiblePathee[0][0])
  displayAStarSolution(possiblePathee[0][0])
}


function showShortestPath(array) {
  let reversed = array.reverse()
  let counter = 0
  const ligthUpPath = setInterval(() => {
    if (counter === reversed.length - 1) {
      setTimeout(() => { freezeConsole('unfreeze') }, 300)
      shortestPath = []
      clearInterval(ligthUpPath)
    }
    reversed[counter].classList.add('path-square')
    counter += 1
  }, 15)
}

export { modelAStar }