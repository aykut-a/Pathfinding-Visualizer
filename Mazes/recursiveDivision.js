import { clearTheBoard, freezeConsole } from '../script.js'


function generateFrames() {
  freezeConsole('freeze')
  clearTheBoard()
  for (let i = 0; i < 40; i++) {
    document.getElementById(i).classList.add('obstacle')
    document.getElementById(`${i + 40 * 19}`).classList.add('obstacle')
  }
  for (let i = 1; i < 19; i++) {
    document.getElementById(`${0 + i * 40}`).classList.add('obstacle')
    document.getElementById(`${39 + i * 40}`).classList.add('obstacle')
  }
  let topAndSide = [[], []]
  for (let i = 2; i < 38; i++) { topAndSide[0].push(document.getElementById(`${i + 40}`)) }
  for (let i = 2; i < 18; i++) { topAndSide[1].push(document.getElementById(`${38 + i * 40}`)) }
  recursivelyDivide(topAndSide)
}

let horizontalGap = []
let verticalGap = []

function makingGapsIn() {
  setTimeout(() => {
    horizontalGap.forEach(index => { gapMaker(index, 'horizontal') })
    verticalGap.forEach(index => { gapMaker(index, 'vertical') })
    document.querySelector('.start').classList.remove('obstacle')
    document.querySelector('.ending').classList.remove('obstacle')
    freezeConsole('unfreeze')
    horizontalGap = []
    verticalGap = []
  }, 2000)
}


function recursivelyDivide(array) {
  let random1 = Math.floor(Math.random() * 2) // Which direction shall we divide the grid
  if (array[0].length === 0 || array[1].length === 0) { return }
  if (array[0].length === 2) { random1 === 1 }
  if (array[1].length === 2) { random1 === 0 }
  let newArray1 = [[], []] // Division 1
  let newArray2 = [[], []] // Division 2
  if (random1 === 0) {
    let randomWall = (Math.floor(Math.random() * array[0].length))
    let randomGap = (Math.floor(Math.random() * array[1].length + 2))
    let center = Number(array[0][randomWall].getAttribute('id'))
    for (let i = 0; i < array[1].length + 2; i++) {
      if (i === randomGap) { horizontalGap.push(document.getElementById(`${center + i * 40}`)) }
      document.getElementById(`${center + i * 40}`).classList.add('obstacle')
    }
    for (let i = 0; i < array[0].length; i++) {
      if (i < randomWall - 1 && array[0][randomWall - 1] !== undefined) { newArray1[0].push(array[0][i]) }
      if (i > randomWall + 1 && array[0][randomWall + 1] !== undefined) { newArray2[0].push(array[0][i]) }
    }
    array[1].forEach(square => {
      newArray2[1].push(square)
      let id = Number(square.getAttribute('id'))
      newArray1[1].push(document.getElementById(`${id - (array[0].length - randomWall + 1)}`))
    })
  }
  if (random1 === 1) {
    let randomWall = (Math.floor(Math.random() * array[1].length))
    let randomGap = (Math.floor(Math.random() * array[0].length + 2))
    let center = Number(array[1][randomWall].getAttribute('id'))
    for (let i = 0; i < array[0].length + 2; i++) {
      if (i === randomGap) { verticalGap.push(document.getElementById(`${center - i}`)) }
      document.getElementById(`${center - i}`).classList.add('obstacle')
    }
    for (let i = 0; i < array[1].length; i++) {
      if (i < randomWall - 1 && array[1][randomWall - 1] !== undefined) { newArray1[1].push(array[1][i]) }
      if (i > randomWall + 1 && array[1][randomWall + 1] !== undefined) { newArray2[1].push(array[1][i]) }
    }
    array[0].forEach(square => {
      newArray1[0].push(square)
      let id = Number(square.getAttribute('id'))
      newArray2[0].push(document.getElementById(`${id + (randomWall + 2) * 40}`))
    })
  }
  setTimeout(() => {
    recursivelyDivide(newArray1)
    recursivelyDivide(newArray2)
  }, 100)
}


function gapMaker(index, direction) {
  if (direction === 'vertical') {
    let center = Number(index.getAttribute('id'))
    index.classList.remove('obstacle')
    index.style.animation = 'pulse 500ms ease-in-out'
    document.getElementById(`${center - 40}`).classList.remove('obstacle')
    document.getElementById(`${center + 40}`).classList.remove('obstacle')
  }
  if (direction === 'horizontal') {
    let center = Number(index.getAttribute('id'))
    index.classList.remove('obstacle')
    index.style.animation = 'pulse 500ms ease-in-out'
    document.getElementById(`${center + 1}`).classList.remove('obstacle')
    document.getElementById(`${center - 1}`).classList.remove('obstacle')
  }
}





export { generateFrames, makingGapsIn }