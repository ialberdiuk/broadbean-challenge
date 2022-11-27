const responseBuilder = require('../helpers/response-builder')
let throws = 1
let expectedOutcome = false

const randomIntFromInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const assignValues = () => {
  return {
    values: {
      dieOne: randomIntFromInterval(1, 6),
      dieTwo: randomIntFromInterval(1, 6),
      dieThree: randomIntFromInterval(1, 6),
      dieFour: randomIntFromInterval(1, 6),
      dieFive: randomIntFromInterval(1, 6)
    },
    throws: throws++
  }
}

const checkThrow = () => {
  const payload = assignValues()
  let arr = Object.values(payload.values)
  arr = arr.sort()

  if (new Set(arr).size === 2) {
    expectedOutcome = arr[0] !== arr[3] || arr[1] !== arr[4] // it meets no fourfold condition after sorting
    return expectedOutcome === true ? { dice: payload.values, throws: payload.throws } : null
  }
}

const throwDice = () => {
  return checkThrow()
}

const startGame = () => {
  let outcomeValues
  while (!expectedOutcome) {
    outcomeValues = throwDice()
  }

  return outcomeValues
}

/**
 * A simple example includes a HTTP get method to start the game
 */
exports.handler = async (event) => {
  const { httpMethod } = event
  if (event.path === '/start' && httpMethod === 'GET') {
    console.time('time')
    const values = startGame()
    throws = 1 // reset throws
    expectedOutcome = false // reset outcome
    console.timeEnd('time')
    // All log statements are written to CloudWatch
    console.info(`In the throw number ${values.throws} the outcome two of kind and three of kind has been found ${values.dice}`)
    return responseBuilder(200, JSON.stringify(values), { 'Access-Control-Allow-Methods': 'GET, OPTIONS' })
  }
}
