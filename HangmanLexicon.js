/**
 * HANGMAN LEXICON
 * Reads in text file of words and uses it to build
 * pool of words to be used as answers for Hangman game.
 * Text file should have one word per line.
 * All words should only be comprised of alphabetical characters.
 */
const { readFileSync } = require('fs')
const { getRandInt, shuffle } = require('./util')

/**
 * Hangman lexicon
 * @member {string} words Words in lexicon
 * @member {number} index Used to keep track of unused words for rush mode
 */
class HangmanLexicon {
  /**
   * Creates Hangman lexicon
   * @param {boolean} rushMode True if rush mode is enabled, false otherwise
   * @param {boolean} debugMode True if debug mode is enabled, false otherwise
   */
  constructor(rushMode, debugMode) {
    let lexiconLoc = null

    // Handle case where options are not passed in command line
    if(process.argv.length === 3) {
      lexiconLoc = process.argv[2]
    // Handle case where options are passed in command line
    } else if(process.argv.length === 4) {
      lexiconLoc = process.argv[3]
    }

    // Handle case where no text file is passed in
    if(!lexiconLoc) {
      throw new Error('Please specify lexicon to read from.')
    }

    // Read in text file and convert it into an array
    this.words = readFileSync(lexiconLoc, 'utf8').split('\n')

    // Make sure answers are in all caps to make consistent formatting for validation
    this.words.forEach((word, i) => this.words[i] = word.toUpperCase())

    this.debugMode = debugMode
    this.rushMode = rushMode

    if(this.rushMode) {
      // Shuffle words so every rush mode session plays in a random order
      shuffle(this.words)
      this.index = 0
    }
  }

  /**
   * Get total amount of words in lexicon
   * @returns {number} Number of words in lexicon
   */
  getWordCount() {
    return this.words.length
  }

  /**
   * Get word in lexicon at specified index
   * @param {number} i Index of desired word within lexicon
   * @returns {string} Word at index in lexicon
   */
  getWord(i) {
    return this.words[i]
  }

  /**
   * Generate random word that has not been played yet
   * @returns {string|null} Returns word that has not been played yet, or null if all of the words have been played already
   */
  getRandUnusedAnswer() {
    let answer = ''
    let lexiconIndex = -1

    // Get random unused word if in rush mode
    if(this.rushMode) {
      if(this.index >= this.getWordCount()) {
        return null
      }

      lexiconIndex = this.index
      answer = this.getWord(this.index)
      this.index += 1
    // Just choose 1 random word if not in rush mode
    } else {
      lexiconIndex = getRandInt(0, this.getWordCount()-1)
      answer = this.getWord(lexiconIndex)
    }
    
    if(this.debugMode) {
      console.log(`[ DEBUG MODE - lexicon[${lexiconIndex}]: ${answer} ]`)
    }

    return answer
  }
}

module.exports = HangmanLexicon
