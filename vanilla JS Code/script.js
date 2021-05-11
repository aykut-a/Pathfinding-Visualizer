import { modelAStar } from './Algo Types/aStar.js'
import { modelDijkstra, dijktraTimer } from './Algo Types/dijkstras.js'
import { modelDFS } from './Algo Types/depthF.js'
import { modelBFS } from './Algo Types/breadthF.js'
import { generateRandomMaze, generateVerticalMaze, generateStairCase } from './Mazes/mazes.js'
import { generateFrames, makingGapsIn } from './Mazes/recursiveDivision.js'

// States  
let creatingObstacles = false
let searchSpeed = 10
let resettingStartingPoint = false
let resettingEndingPoint = false
let startingPoint
let endingPoint
let endingNodeCoordinate
let chosenAlgorithm

const findThePathBtn = document.querySelector('[find-the-path-btn]')
const theMaze = document.querySelector('.the-maze')
const theConsole = document.querySelector('[the-console]')
const sideConsole = document.querySelector('[sideconsole]')



// Algo Types
document.querySelector('[astar-algo]').addEventListener('click', () => setAlgorithm('a*', 'Visualize A*'))
document.querySelector('[dijktras-algo]').addEventListener('click', () => setAlgorithm('dijktras', 'Visualize Dijktra'))
document.querySelector('[bfs-algo]').addEventListener('click', () => setAlgorithm('bfs', 'Visualize BFS'))
document.querySelector('[dfs-algo]').addEventListener('click', () => setAlgorithm('dfs', 'Visualize DFS'))

function setAlgorithm(type, button) {
  chosenAlgorithm = type
  findThePathBtn.innerText = button
  mainInstructionsHandler()
}



// Console Dropdowns

// Maze Dropdown 
const mazeDropdown = document.querySelector('[maze-dropdown]')
mazeDropdown.addEventListener('click', () => dropItDown('maze'))
const drop1 = document.querySelector('[drop1]')

// Algorithm Dropdown
const algoDropdown = document.querySelector('[algo-dropdown]')
algoDropdown.addEventListener('click', () => dropItDown('algo'))
const drop2 = document.querySelector('[drop2]')

// Speed Dropdown
const speedDropdown = document.querySelector('[speed-dropdown]')
speedDropdown.addEventListener('click', () => dropItDown('speed'))
const drop3 = document.querySelector('[drop3]')

function dropItDown(type) {
  creatingObstacles = false // I dont want it to mess with me
  sideInstructionsHandler()
  if (type === 'maze') { drop1.classList.toggle("show") }
  if (type === 'algo') { drop2.classList.toggle("show") }
  if (type === 'speed') { drop3.classList.toggle("show") }
}

window.onclick = function (event) {
  if (!event.target.matches('[maze-dropdown]')) { if (drop1.classList.contains("show")) { drop1.classList.remove('show') } }
  if (!event.target.matches('[algo-dropdown]')) { if (drop2.classList.contains('show')) { drop2.classList.remove('show') } }
  if (!event.target.matches('[speed-dropdown]')) { if (drop3.classList.contains('show')) { drop3.classList.remove('show') } }
}



// Find the shortest path button

findThePathBtn.addEventListener('click', () => {
  creatingObstacles = false // I dont want it to mess with me
  sideInstructionsHandler()
  if (chosenAlgorithm === undefined) {
    algoDropdown.style.animation = 'pulse 400ms ease-in-out'
    setTimeout(() => { algoDropdown.style.animation = '' }, 400)
    return
  }
  clearThePath()
  freezeConsole('freeze')
  if (chosenAlgorithm === 'a*') { modelAStar(startingPoint) }
  if (chosenAlgorithm === 'dijktras') {
    modelDijkstra(startingPoint)
    dijktraTimer()
  }
  startingPoint = document.querySelector('.start')
  if (chosenAlgorithm === 'bfs') { modelBFS(startingPoint) }
  if (chosenAlgorithm === 'dfs') { modelDFS(startingPoint) }
})

// Inability to Find A Path

function noPathVisible() {
  freezeConsole('unfreeze')
}



// Freezing the Console When Necessarry

function freezeConsole(command) {
  let toBeClassed = [findThePathBtn, clearPathBtn, clearBoardBtn, mazeDropdown, speedDropdown, algoDropdown, resetStartNodeBtn, resetEndNodeBtn]
  let toBeFrozen = [sideConsole, theConsole, theMaze]
  if (command === 'freeze') {
    toBeFrozen.forEach(section => { section.style.pointerEvents = 'none' })
    toBeClassed.forEach(element => { element.classList.add('orangefont') })
  }
  if (command === 'unfreeze') {
    toBeFrozen.forEach(section => { section.style.pointerEvents = 'auto' })
    toBeClassed.forEach(element => { element.classList.remove('orangefont') })
  }
}



// The Main and Side Console Instrcutions

const mainInstructions = document.querySelector('[main-instructions]')
const sideInstructions = document.querySelector('[side-console-instructions]')

function mainInstructionsHandler() {
  if (chosenAlgorithm === 'a*') { mainInstructions.innerHTML = 'A* Search algorithm uses <span>heuristic</span> to find the shortest path to the end node.' }
  if (chosenAlgorithm === 'dijktras') { mainInstructions.innerHTML = 'Dijktras algorithm uses <span>distance between the nodes</span> to find the shortest path to the end node.' }
  if (chosenAlgorithm === 'bfs') { mainInstructions.innerHTML = 'Breadth-First Search algorithm checks the <span>first</span> nodes added to the <span>queue</span> to find the shortest path.' }
  if (chosenAlgorithm === 'dfs') { mainInstructions.innerHTML = 'Depth-First Search algorithm checks the <span>last</span> nodes added to the <span>stack</span>, shortest path is <span>not guaranteed.</span>' }
}

function sideInstructionsHandler() {
  if (creatingObstacles === false && resettingStartingPoint === false && resettingEndingPoint === false) {
    sideInstructions.innerHTML = 'Click on a square to <span class="blue">start</span> creating <span class="blue">obstacles.</span>'
  }
  if (creatingObstacles) {
    sideInstructions.innerHTML = 'Click on a square to <span class="blue">stop</span> creating <span class="blue">obstacles.</span>'
  }
  if (resettingStartingPoint) {
    sideInstructions.innerHTML = 'Click on a square to set it the new <span class="orange">starting node.</span>'
  }
  if (resettingEndingPoint) {
    sideInstructions.innerHTML = 'Click on a square to set it the new <span class="green">ending node.</span>'
  }
}



// More info handling 

const theOverlay = document.querySelector('.overlay')
const moreInfoButton = document.querySelector('[more-info-btn]')
const closeInfoButton = document.querySelector('[close-info-btn]')

moreInfoButton.addEventListener('click', () => { theOverlay.style.display = 'flex' })
closeInfoButton.addEventListener('click', () => {
  resettingEndingPoint = false
  resettingStartingPoint = false
  creatingObstacles = false
  sideInstructionsHandler()
  pageNumber = 0
  previousPageButton.style.display = 'none'
  nextPageButton.style.display = 'flex'
  theOverlay.style.display = 'none'
  infoPages.forEach(page => page.style.display = 'none')
  infoPages[pageNumber].style.display = 'flex'
})

const previousPageButton = document.querySelector('[prev-btn]')
const nextPageButton = document.querySelector('[next-btn]')

previousPageButton.addEventListener('click', () => turnInfoPages('prev'))
nextPageButton.addEventListener('click', () => turnInfoPages('next'))

const infoPages = Array.from(document.querySelectorAll('.more-info-div'))
let pageNumber = 0

function turnInfoPages(direction) {
  if (direction === 'next') {
    infoPages[pageNumber].style.display = 'none'
    pageNumber += 1
    previousPageButton.style.display = 'flex'
    infoPages[pageNumber].style.display = 'flex'
    if (pageNumber === 3) { nextPageButton.style.display = 'none' }
    return
  }
  if (direction === 'prev') {
    infoPages[pageNumber].style.display = 'none'
    pageNumber -= 1
    nextPageButton.style.display = 'flex'
    infoPages[pageNumber].style.display = 'flex'
    if (pageNumber === 0) { previousPageButton.style.display = 'none' }
    return
  }
}







// Clear the Path Button 

const clearPathBtn = document.querySelector('[clear-path-button]')
clearPathBtn.addEventListener('click', clearThePath)

function clearThePath() {
  creatingObstacles = false
  sideInstructionsHandler()
  let obstacles = Array.from(document.querySelectorAll('.obstacle'))
  let startingPointId = startingPoint.getAttribute('id')
  let endingPointId = endingPoint.getAttribute('id')
  createBoard()
  obstacles.forEach(square => {
    let id = square.getAttribute('id')
    document.getElementById(id).classList.add('obstacle')
    document.getElementById(id).style.animation = 'none'
  })
  // End Node
  document.getElementById(endingPointId).classList.add('ending')
  resettingEndingPoint = false
  setTimeout(() => { handleEndingPoint() }, 10)
  // Start Node
  document.getElementById(startingPointId).classList.add('start')
  resettingStartingPoint = false
  setTimeout(() => { handleStartingPoint() }, 10)
}



// Clear the Board Button

const clearBoardBtn = document.querySelector('[clear-board-button]')
clearBoardBtn.addEventListener('click', clearTheBoard)

function clearTheBoard() {
  creatingObstacles = false
  sideInstructionsHandler()
  let startingPointId = startingPoint.getAttribute('id')
  let endingPointId = endingPoint.getAttribute('id')
  createBoard()
  // End Node
  document.getElementById(endingPointId).classList.add('ending')
  resettingEndingPoint = false
  setTimeout(() => { handleEndingPoint() }, 10)
  // Start Node
  document.getElementById(startingPointId).classList.add('start')
  resettingStartingPoint = false
  setTimeout(() => { handleStartingPoint() }, 10)
}




// The obstacles handling
theMaze.addEventListener('click', () => {
  if (creatingObstacles) {
    creatingObstacles = false
    sideInstructionsHandler()
    return
  }
  if (resettingEndingPoint === false && resettingStartingPoint === false) {
    creatingObstacles = true
    sideInstructionsHandler()
    return
  }
})




// Creation of the Whole Maze 

createBoard()

function createBoard() {
  theMaze.innerHTML = ''
  for (let i = 0; i < 800; i++) {
    const square = document.createElement('div')
    square.classList.add('square')
    square.setAttribute('id', i)
    theMaze.append(square)
    // Create the obstacles
    square.addEventListener('mouseenter', () => {
      if (creatingObstacles && square !== startingPoint && square !== endingPoint) {
        square.classList.toggle('obstacle')
        return
      }
    })
  }
}




// Starting and Ending Nodes 

// Starting Node
document.getElementById('325').classList.add('start') // This in the beginning
handleStartingPoint()

function handleStartingPoint() {
  startingPoint = document.querySelector('.start')
  startingPoint.style.backgroundColor = 'var(--orange)'
  startingPoint.innerText = 'S'
  startingPoint.innerHTML += '<p class="gCost">0</p>'
}

// Ending Node 
document.getElementById('349').classList.add('ending')
handleEndingPoint()

function handleEndingPoint() {
  endingPoint = document.querySelector('.ending')
  endingPoint.style.backgroundColor = 'green'
  endingPoint.innerText = 'E'
  endingNodeCoordinate = [Math.ceil(Number(endingPoint.getAttribute('id')) % 40) + 1, Math.ceil(Number(endingPoint.getAttribute('id')) / 40)]
}

// Resetting Start and End Nodes 

const resetStartNodeBtn = document.querySelector('[reset-start-node]')
const resetEndNodeBtn = document.querySelector('[reset-end-node]')

resetStartNodeBtn.addEventListener('click', () => {
  resettingStartingPoint = true
  creatingObstacles = false
  resettingEndingPoint = false
  sideInstructionsHandler()
  let allSquares = Array.from(document.querySelectorAll('.square'))
  allSquares.forEach(square => {
    square.addEventListener('click', () => {
      if (resettingStartingPoint && !square.classList.contains('obstacle') && square !== endingPoint) {
        startingPoint.classList.remove('start')
        startingPoint.innerHTML = ''
        startingPoint.style.backgroundColor = 'white'
        square.classList.add('start')
        handleStartingPoint()
        setTimeout(() => {
          resettingStartingPoint = false
          sideInstructionsHandler()
        }, 10)
        return
      }
      setTimeout(() => {
        resettingStartingPoint = false
        sideInstructionsHandler()
      }, 10)
    })
  })
})


resetEndNodeBtn.addEventListener('click', () => {
  resettingEndingPoint = true
  creatingObstacles = false
  resettingStartingPoint = false
  sideInstructionsHandler()
  let allSquares = Array.from(document.querySelectorAll('.square'))
  allSquares.forEach(square => {
    square.addEventListener('click', () => {
      if (resettingEndingPoint && !square.classList.contains('obstacle') && square !== startingPoint) {
        endingPoint.classList.remove('ending')
        endingPoint.innerHTML = ''
        endingPoint.style.backgroundColor = 'white'
        square.classList.add('ending')
        handleEndingPoint()
        setTimeout(() => {
          resettingEndingPoint = false
          sideInstructionsHandler()
        }, 10)
        return
      }
      setTimeout(() => {
        resettingEndingPoint = false
        sideInstructionsHandler()
      }, 10)
    })
  })
})





// Maze Generation 
const randomMaze = document.querySelector('[random-maze]')
const verticalMaze = document.querySelector('[vertical-maze]')
const recursiveDivision = document.querySelector('[recursive-division]')
const staircaseModel = document.querySelector('[staircase]')

recursiveDivision.addEventListener('click', () => {
  creatingObstacles = false
  sideInstructionsHandler()
  generateFrames()
  makingGapsIn()
})

randomMaze.addEventListener('click', () => {
  creatingObstacles = false
  sideInstructionsHandler()
  generateRandomMaze()
})

verticalMaze.addEventListener('click', () => {
  creatingObstacles = false
  sideInstructionsHandler()
  generateVerticalMaze()
})

staircaseModel.addEventListener('click', () => {
  creatingObstacles = false
  sideInstructionsHandler()
  generateStairCase()
})


// Speed Settings
const fastSearch = document.querySelector('[fast-speed]')
const slowSearch = document.querySelector('[slow-speed]')
fastSearch.addEventListener('click', () => { searchSpeed = 10 })
slowSearch.addEventListener('click', () => { searchSpeed = 30 })

export { endingNodeCoordinate, startingPoint, endingPoint, freezeConsole, searchSpeed, clearTheBoard, noPathVisible, creatingObstacles }