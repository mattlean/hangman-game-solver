/**
 * HANGMAN SOLVER
 * A simple bot program that tries to bruteforce a Hangman game.
 * For the first 2 guesses of a game it will guess random unused vowels.
 * For the remaining guesses of the game, it will guess random unused characters.
 */
const { spawn } = require('child_process')
const SimpleCLIOptionMan = require('./SimpleCLIOptionMan')
const { getRandInt } = require('./util')

/**
 * Object that manages state for Hangman solver
 */
const state = {
  /**
   * Tracks if solver is running in debug mode or not
   */
  debugMode: false,

  /**
   * Tracks how many guesses are remaining before game over
   */
  remaining: 6,

  /**
   * Tracks how many guesses were correct.
   * Starts at -1 just because of how the input string reading works.
   * Once the game starts it will be set to 0.
   */
  correct: -1,

  /**
   * Tracks how many unique characters were guessed.
   * Prevents infinite loops since there can be no more than 26 tries.
   */
  tries: 0,

  /**
   * Tracks how many wins were acquired.
   */
  wins: 0,

  /**
   * Tracks how many losses were acquired.
   */
  losses: 0,

  /**
   * Used for randomly generating a character
   */
  charArr: [
    'A',
    'E',
    'I',
    'O',
    'U',
    'B',
    'C',
    'D',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L',
    'M',
    'N',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'V',
    'W',
    'X',
    'Y',
    'Z'
  ],

  /**
   * Keeps track of what characters have already been guessed
   */
  charStateMap: {
    'A': false,
    'E': false,
    'I': false,
    'O': false,
    'U': false,
    'B': false,
    'C': false,
    'D': false,
    'F': false,
    'G': false,
    'H': false,
    'J': false,
    'K': false,
    'L': false,
    'M': false,
    'N': false,
    'P': false,
    'Q': false,
    'R': false,
    'S': false,
    'T': false,
    'V': false,
    'W': false,
    'X': false,
    'Y': false,
    'Z': false
  },

  /**
   * Generates random character that has not been guessed yet
   * @returns {string} An unused character
   */
  getRandUnusedChar() {
    while(this.tries < 26) {
      const randChar = this.charArr[getRandInt(0, this.charArr.length-1)]

      if(!this.charStateMap[randChar]) {
        this.charStateMap[randChar] = true
        this.tries += 1
        return randChar
      } else {
        print(`< Already guessed ${randChar}. Trying again... >`)
      }
    }

    throw new Error('Something went wrong when trying to find an unused character.')
  },

  /**
   * Attempts to generate random vowel character that has not been guessed yet.
   * If all of the vowels have been guessed, it will call getRandUnusedChar().
   * @returns {string} An unused character
   */
  getRandUnusedVowel() {
    while(
      !this.charStateMap['A'] ||
      !this.charStateMap['E'] ||
      !this.charStateMap['I'] ||
      !this.charStateMap['O'] ||
      !this.charStateMap['U'] &&
      this.tries < 26
    ) {
      const randChar = this.charArr[getRandInt(0, 4)]

      if(!this.charStateMap[randChar]) {
        this.charStateMap[randChar] = true
        this.tries += 1
        return randChar
      } else {
        print(`< Already guessed ${randChar}. Trying again... >`)
      }
    }

    return this.getRandUnusedChar()
  },

  /**
   * Reset the state
   */
  reset() {
    this.remaining = 6
    this.correct = -1
    this.tries = 0
    
    for(let key in this.charStateMap) {
      this.charStateMap[key] = false
    }
  }
}

/**
 * Prints text to command line if solver is running in debug mode
 * @param {string} txt 
 */
const print = (txt) => {
  if(state.debugMode) {
    console.log(txt)
  }
}

let lexiconLoc = null
if(process.argv.length === 3) {
  lexiconLoc = process.argv[2]
} else if(process.argv.length === 4) {
  const options = new SimpleCLIOptionMan(process.argv[2])
  state.debugMode = options.getFlag('d')
  lexiconLoc = process.argv[3]
  print('< DEBUG MODE ACTIVATED >')
} else if(process.argv.length > 4) {
  throw new Error('Too many command line arguments.')
}

// Handle case where no text file is passed in
if(!lexiconLoc) {
  throw new Error('Please specify lexicon to read from.')
}

console.log('< Starting Hangman solver... >')

// Run game as child process
const child = spawn('node', ['./hangman', '-dhr', lexiconLoc])

// Handle when the child process outputs data
child.stdout.on('data', (data) => {
  const msg = data.toString() // Convert buffer data to readable string

  // Look for case where guess failed
  if(msg.search(/There are no /g) > -1) {
    state.remaining -= 1
  // Look for case where guess succeeded
  } else if(msg.search(/The word now looks like this: /g) > -1) {
    state.correct += 1
  }

  // Output child process output so you can see it in the terminal
  print(msg)

  // Look for case where a game is completed.
  if(msg.search(/You win./g) > -1) {
    print(`< Guesses remaining: ${state.remaining} >`)
    print(`< Guesses correct: ${state.correct} >\n`)
    state.reset()

    state.wins += 1
    print(`< Win Encountered >`)
    print(`< Total Wins: ${state.wins} >`)
    print(`< Total Losses: ${state.losses} >`)
  } else if(msg.search(/You lose./g) > -1) {
    print(`< Guesses remaining: ${state.remaining} >`)
    print(`< Guesses correct: ${state.correct} >\n`)
    state.reset()

    state.losses += 1
    print(`< Loss Encountered >`)
    print(`< Total Wins: ${state.wins} >`)
    print(`< Total Losses: ${state.losses} >`)
  }

  // Look for case where child process is waiting for input
  if(msg.search(/guesses left.|guess left./g) > -1) {
    print(`< Guesses remaining: ${state.remaining} >`)
    print(`< Guesses correct: ${state.correct} >`)
    const charGuess = state.correct < 3 ? state.getRandUnusedVowel() : state.getRandUnusedChar()
    print(`< ${charGuess} >`)
    child.stdin.write(`${charGuess}\n`) // Send unused character to child process
  }

  // Look for case when rush mode is complete
  if(msg.search(/Entire lexicon has been played./g) > -1) {
    console.log(`\n< SCORE: ${state.wins}/${state.wins + state.losses} >`)
  }
})

// Handle when the child process encounters error
child.on('error', (data) => {
  console.error(`Child process error:\n${data}`)
})

// Handle when the child process exits
child.on('exit', (code, signal) => {
  print(`Child process exit: Code - ${code} | Signal - ${signal}`)
})
