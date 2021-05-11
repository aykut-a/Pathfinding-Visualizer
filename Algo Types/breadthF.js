import { endingPoint, startingPoint, freezeConsole, searchSpeed, noPathVisible } from '../script.js'

let bfsArray = []

function modelBFS(node) {
  if (node === endingPoint) {
    conjureBFSPath(endingPoint)
    return
  }
  if (bfsArray.length === 0) { bfsArray.push(node) }
  if (node === undefined) {
    noPathVisible()
    return
  }
  node.classList.add('checked')
  let center = Number(node.getAttribute('id'))
  if (node.getAttribute('upper') !== 'tried' && (center - 40) >= 0) {
    let upper = document.getElementById(`${center - 40}`)
    haveIcheckedYou(upper, node, 'upper')
    return
  }
  if (node.getAttribute('right') !== 'tried' && (center + 1) % 40 !== 0 && (center + 1) < 800) {
    let right = document.getElementById(`${center + 1}`)
    haveIcheckedYou(right, node, 'right')
    return
  }
  if (node.getAttribute('lower') !== 'tried' && (center + 40) <= 799) {
    let lower = document.getElementById(`${center + 40}`)
    haveIcheckedYou(lower, node, 'lower')
    return
  }
  if (node.getAttribute('left') !== 'tried' && (center - 1) % 40 !== 39 && (center - 1) > 0) {
    let left = document.getElementById(`${center - 1}`)
    haveIcheckedYou(left, node, 'left')
    return
  }
  bfsArray.shift()
  setTimeout(() => { modelBFS(bfsArray[0]) }, searchSpeed / 2)
}


function haveIcheckedYou(element, node, direction) { // I should keep in mind which node was visited already 
  node.setAttribute(`${direction}`, 'tried')
  if (element.classList.contains('obstacle') || element.classList.contains('checked')) {
    setTimeout(() => { modelBFS(bfsArray[0]) }, searchSpeed / 2)
    return
  }
  bfsArray.push(element)
  element.setAttribute('origin', `${node.getAttribute('id')}`)
  setTimeout(() => { modelBFS(bfsArray[0]) }, searchSpeed / 2)
  return
}


let BFSShortestPathArray = []

function conjureBFSPath(node) {
  if (node === startingPoint) {
    visualizeBFS(BFSShortestPathArray.reverse())
    return
  }
  BFSShortestPathArray.push(node)
  let newId = document.getElementById(node.getAttribute('origin'))
  conjureBFSPath(newId)
}


function visualizeBFS(array) {
  let counter = 0
  const anInterval = setInterval(() => {
    if (counter === array.length - 1) {
      clearInterval(anInterval)
      BFSShortestPathArray = []
      bfsArray = []
      setTimeout(() => { freezeConsole('unfreeze') }, 300)
    }
    array[counter].classList.add('path-square')
    counter += 1
  }, searchSpeed / 2)
}

export { modelBFS }