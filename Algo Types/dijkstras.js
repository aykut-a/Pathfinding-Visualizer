import { endingPoint, startingPoint, freezeConsole, searchSpeed, noPathVisible } from '../script.js'

let dijktraStopper = false

let checkedNumber = 0

function dijktraTimer() { // To check if the path could ever be achieved or not
  const dijktraPathChecker = setInterval(() => {
    let checkedSquares = Array.from(document.querySelectorAll('.checked'))
    if (checkedNumber === checkedSquares.length && dijktraStopper === false) {
      clearInterval(dijktraPathChecker)
      noPathVisible()
    }
    if (dijktraStopper) { clearInterval(dijktraPathChecker) }
    checkedNumber = checkedSquares.length
  }, 500)
}


function modelDijkstra(square, direction) {

  if (dijktraStopper) { return } // Found the one ring

  if (square === endingPoint) {
    dijktraStopper = true
    let center = Number(square.getAttribute('id'))
    if (direction === 'lower') { visualizeDijktra(document.getElementById(`${center - 40}`)) }
    if (direction === 'upper') { visualizeDijktra(document.getElementById(`${center + 40}`)) }
    if (direction === 'right') { visualizeDijktra(document.getElementById(`${center - 1}`)) }
    if (direction === 'left') { visualizeDijktra(document.getElementById(`${center + 1}`)) }
    return
  }

  let center = Number(square.getAttribute('id'))
  square.classList.add('checked')

  if ((center - 1) % 40 !== 39 && center !== 0) { // Edge
    let left = document.getElementById(`${center - 1}`)
    directionHandle(square, left, 'left')
  }
  if ((center - 40) >= 0) { // Edge
    let upper = document.getElementById(`${center - 40}`)
    directionHandle(square, upper, 'upper')
  }
  if ((center + 1) % 40 !== 0) { // Edge  
    let right = document.getElementById(`${center + 1}`)
    directionHandle(square, right, 'right')
  }
  if ((center + 40) < 799) { // Edge
    let lower = document.getElementById(`${center + 40}`)
    directionHandle(square, lower, 'lower')
  }
}

function directionHandle(square, element, direction) { // Setting the surroundings
  if (!element.classList.contains('checked') && !element.classList.contains('obstacle')) {
    element.classList.add('checked')
    dijktraHandle(square, element)
    setTimeout(() => { modelDijkstra(element, `${direction}`) }, searchSpeed * 10) // speed
  }
}

function dijktraHandle(node, neighboor) { // Setting Up the gCost 
  let gCost = Number(node.querySelector('.gCost').innerText) + 10
  neighboor.innerHTML += `<p class="gCost">${gCost}</p>`
}

let dijktraSolution = []

function visualizeDijktra(node) {

  if (dijktraSolution.length === 0) { dijktraSolution.push(node) }
  if (node === startingPoint) {
    lightUpPath(dijktraSolution)
    return
  }

  let center = Number(node.getAttribute('id'))
  let upper = document.getElementById(`${center - 40}`) || ''
  let right = document.getElementById(`${center + 1}`) || ''
  let lower = document.getElementById(`${center + 40}`) || ''
  let left = document.getElementById(`${center - 1}`) || ''

  let possibleMoves = []
  let surroundings = [upper, right, lower, left]

  surroundings.forEach(direction => {
    if (direction === '') { return }
    if (direction.classList.contains('checked') && direction !== endingPoint) {
      possibleMoves.push([direction, Number(direction.querySelector('.gCost').innerText)])
    }
  })
  let smallestGCost = 10000
  let smallestGElement = ''
  for (let i = 0; i < possibleMoves.length; i++) {
    if (possibleMoves[i][1] < smallestGCost) {
      smallestGCost = possibleMoves[i][1]
      smallestGElement = possibleMoves[i]
    }
  }
  dijktraSolution.push(smallestGElement[0])
  visualizeDijktra(smallestGElement[0])
}


function lightUpPath(array) {
  let reversed = array.reverse()
  let counter = 0
  const anInterval = setInterval(() => {
    if (counter === array.length - 1) {
      dijktraSolution = []
      dijktraStopper = false
      setTimeout(() => { freezeConsole('unfreeze') }, 300)
      clearInterval(anInterval)
    }
    reversed[counter].classList.add('path-square')
    counter += 1
  }, searchSpeed)
}


export { modelDijkstra, dijktraTimer }
