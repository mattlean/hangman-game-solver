/**
 * HANGMAN GAME
 * Hangman game played with the command line.
 * 
 * The game will give the player 8 tries to guess the word.
 * The word is randomly selected from a pool of words determined in the lexicon text file.
 * Guessing an incorrect letter will decrement the amount of remaining guesses by 1.
 * Guessing a new correct letter will not change the amount of remaining guesses.
 * Guessing an already found correct letter will also not change the amount of remaining guesses.
 * Only 1 character can be guessed at a game.
 * 
 * When passing in the -h flag, the game will run in hard mode and reduces the amount of guesses to 6.
 * When passing in the -d flag, the game will run in debug mode which will show the answer when the game starts.
 */
const readline = require('readline')
const HangmanLexicon = require('./HangmanLexicon')
const SimpleCLIOptionMan = require('./SimpleCLIOptionMan')

// Use readline module to take user input from command line
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

/**
 * Hangman game
 * @member {string} answer Word that is the answer
 * @member {string} currWord Progress of current word being guessed
 * @member {HangmanLexicon} lexicon Lexicon used to handle answers
 * @member {boolean} debugMode Flag to determine if game is running in debug mode
 * @member {boolean} hardMode Flag to determine if game is running in hard mode
 * @member {boolean} rushMode Flag to determine if game is running in rush mode
 */
class HangmanGame {
  constructor() {
    let cliOptions = null
    
    if(process.argv.length === 4) {
      cliOptions = process.argv[2]
    } else if(process.argv.length > 4) {
      throw new Error('Too many command line arguments.')
    }

    if(cliOptions) {
      const options = new SimpleCLIOptionMan(cliOptions)
  
      if(options.getFlag('d')) {
        this.debugMode = true
      }
  
      if(options.getFlag('h')) {
        this.hardMode = true
      }
  
      if(options.getFlag('r')) {
        this.rushMode = true
      }
    }

    this.lexicon = new HangmanLexicon(this.rushMode, this.debugMode)
    this.answer = ''
    this.currWord = ''
    this.guesses = 0
    
    if(this.rushMode) {
      console.log(`[ RUSH MODE ACTIVATED ]`)
    }
    console.log('Welcome to Hangman!')

    this.startNewGame()
  }

  /**
   * Output current word progress
   */
  showWordProgress() {
    console.log(`The word now looks like this: ${this.currWord}`)
  }

  /**
   * Check to see if guessed character is in the word
   * and reveal the character positions in current word if they are present
   * @param {string} guessedChar Character being guessed
   * @returns {number} 1 if at least one new match was found, 2 if match was already found before, 0 otherwise
   */
  findMatch(guessedChar) {
    if(guessedChar.length > 1 || guessedChar.length < 1) {
      throw new Error('The findMatch function only accepts strings with a length of 1.')
    }

    let matchFound = 0

    // Find guessed character in answer
    for(let i=0; i < this.answer.length; i+=1) {
      if(this.currWord[i] === '-' && guessedChar === this.answer[i]) {
        // New match was found
        // Update current word
        this.currWord = `${this.currWord.slice(0, i)}${guessedChar}${this.currWord.slice(i+1)}`

        if(!matchFound) matchFound = 1
      } else if((this.currWord[i] === this.answer[i]) && (guessedChar === this.currWord[i])) {
        // Existing match was found
        return 2
      }
    }

    return matchFound
  }

  /**
   * End the game. Call endCallback if it was set.
   * @param {string} msg Message to output when game end is triggered
   * @param {forcedEnd} boolean Force the game to end. Used for stopping rush mode.
   */
  endGame(msg, forceEnd) {
    console.log(msg)

    if(forceEnd) this.rushMode = false

    if(this.rushMode) {
      this.startNewGame()
    } else {
      rl.close()
      process.exit()
    }
  }

  /**
   * Start new game.
   */
  startNewGame() {
    // Generate random unused word for answer from lexicon
    this.answer = this.lexicon.getRandUnusedAnswer()

    // Handle case where all words in lexicon have been played
    if(!this.answer) {
      return this.endGame('Entire lexicon has been played.', true)
    }

    // Set number of guesses depending on difficulty mode
    this.guesses = this.hardMode ? 6 : 8

    // Initialize word to a series of '-' characters
    this.currWord = ''
    for(let i=0; i < this.answer.length; i+=1) {
      this.currWord += '-'
    }

    this.showWordProgress()
    this.runTurn() // Start the first turn
  }

  /**
   * Execute a turn
   */
  runTurn() {
    // Ask user question and wait for user input
    rl.question(`You have ${this.guesses} ${this.guesses > 1 ? 'guesses' : 'guess'} left.\n`, (input) => {
      // Handle case where user does not input anything
      if(input.length < 1) {
        console.log('Please input the letter you would like to guess.')
        this.runTurn()
      // Handle case where user inputs more than one character
      } else if(input.length > 1) {
        console.log('Please input only one letter at a time.')
        this.runTurn()
      // Handle case where user inputs only one character
      } if(input.length === 1) {
        // Make sure input is capitalized to make consistent formatting for validation
        const inputUpperCase = input.toUpperCase()
        console.log(`You guess: ${inputUpperCase}`)

        const result = this.findMatch(inputUpperCase)

        // Handle case where input was already correctly guessed
        if(result === 2) {
          console.log(`You already correctly guessed: ${inputUpperCase}`)
        // Handle case where input is a new correct guess
        } else if(result === 1) {
          // Handle case where the user has guessed all characters correctly
          if(this.currWord === this.answer) {
            this.endGame(`You guessed the word: ${this.currWord}\nYou win.`)
            return
          } else {
            this.showWordProgress()
          }
        // Handle case where input is an incorrect guess
        } else {
          console.log(`There are no ${inputUpperCase}'s in the word.`)
          this.guesses -= 1
        }

        // Handle case where the user has used up all guesses
        // and has not guessed all characters correctly
        if(this.guesses === 0) {
          this.endGame(`You're completely hung.\nThe word was: ${this.answer}\nYou lose.`)
        // Continue running the game until an end game event is encountered...
        } else {
          this.runTurn()
        }
      }
    })
  }
}

module.exports = HangmanGame
