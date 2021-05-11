import { endingPoint, freezeConsole, searchSpeed, noPathVisible } from '../script.js'

let dfsArray = []

function modelDFS(node) {
  if (node === endingPoint) {
    visualizeDFS(dfsArray)
    return
  }
  if (dfsArray.length === 0) { dfsArray.push(node) }
  if (node === undefined) {
    noPathVisible()
    return
  }
  node.style.animation = 'dfs-scanning 600ms'
  setTimeout(() => { node.style.animation = 'none' }, 500)
  node.classList.add('checked')
  let center = Number(node.getAttribute('id'))
  if (node.getAttribute('upper') !== 'tried' && (center - 40) >= 0) {
    let upper = document.getElementById(`${center - 40}`)
    haveIcheckedYou(upper, node, 'upper')
    return
  }
  if (node.getAttribute('right') !== 'tried' && (center + 1) % 40 !== 0 && center < 799) {
    let right = document.getElementById(`${center + 1}`)
    haveIcheckedYou(right, node, 'right')
    return
  }
  if (node.getAttribute('lower') !== 'tried' && (center + 40) <= 799) {
    let lower = document.getElementById(`${center + 40}`)
    haveIcheckedYou(lower, node, 'lower')
    return
  }
  if (node.getAttribute('left') !== 'tried' && (center - 1) % 40 !== 39 && center > 0) {
    let left = document.getElementById(`${center - 1}`)
    haveIcheckedYou(left, node, 'left')
    return
  }
  dfsArray.pop()
  setTimeout(() => { modelDFS(dfsArray[dfsArray.length - 1]) }, searchSpeed - 2)
}

function haveIcheckedYou(element, node, direction) { // I should keep in mind which node was visited already 
  node.setAttribute(`${direction}`, 'tried')
  if (element.classList.contains('obstacle') || element.classList.contains('checked')) {
    setTimeout(() => { modelDFS(dfsArray[dfsArray.length - 1]) }, searchSpeed - 2)
    return
  }
  dfsArray.push(element)
  setTimeout(() => { modelDFS(dfsArray[dfsArray.length - 1]) }, searchSpeed - 2)
  return
}


function visualizeDFS(array) {
  let counter = 0
  const anInterval = setInterval(() => {
    if (counter === array.length - 1) {
      dfsArray = []
      clearInterval(anInterval)
      setTimeout(() => { freezeConsole('unfreeze') }, 300)
    }
    array[counter].classList.add('path-square')
    array[counter].style.animation = 'pop-up 700ms'
    counter += 1
  }, searchSpeed - 2)
}




export { modelDFS }