# Hangman Game & Solver
## About
This project is a Hangman game played through the command-line alongside a solver bot.

This was inspired by an [assignment from Stanford's CS 106A: Programming Methodologies class](https://web.stanford.edu/class/archive/cs/cs106a/cs106a.1124/handouts/200%20Assignment%204.pdf) and a [challenge from Code Golf Stack Exchange](https://codegolf.stackexchange.com/questions/25496/write-a-hangman-solver). The main differences are that the project is coded in JavaScript instead of Java, there are no graphics, and the solver does not actually use the game program code supplied by the Code Golf Stack Exchange post although it does still roughly follow the same rules.

## Playing the Game
This is the command for running the game:
```
node hangman [-dhr] [lexicon_text_file ...]
```

So a simple example of this is:
```
node hangman lexiconA.txt
```

### Rules
The game follows the following rules:
- By default, the game will give the player 8 tries to guess the word.
- Each word is randomly selected from a pool of words determined in the lexicon text file.
- Guessing an incorrect letter will decrement the amount of remaining guesses by 1.
- Guessing a new correct letter will not change the amount of remaining guesses.
- Guessing an already found correct letter will also not change the amount of remaining guesses.
- Only 1 character can be guessed at a game.
- The game ends when all letters in the answer are correctly guessed or when 0 guesses remain.

### Lexicon
A valid lexicon file must have the following properties:
- Must be a text file.
- Each line must contain only one word.
- Words can only be comprised of alphabetical characters.

The project comes with two premade lexicon files:
- lexiconA.txt: Taken from the CS 106A assignment. Contains 10 words.
- lexiconB.txt: Taken from the Code Golf Stack Exchange challenge. Contains 4096 words.

### Options
| Character | Description                                                                   |
|-----------|-------------------------------------------------------------------------------|
| **d**     | Activate debug mode. Logs extra information to the terminal.                  |
| **h**     | Activate hard mode. Reduces the amount of guesses from 8 to 6.                |
| **r**     | Activate rush mode. Play through a randomized sequence of the entire lexicon. |

## Running the Solver
This is the command for running the solver bot:
```
node hangmanSolver [-d] [lexicon_text_file ...]
```

So a simple example of this is:
```
node hangmanSolver lexiconB.txt
```

### How It Works
The solver bot runs the Hangman game in hard and rush mode, so it will need to solve all of the words in the given lexicon and only have 6 tries per word.

To prevent cheating, the solver does not read the lexicon, it is not allowed to know what the answer is, and the order of played words from the lexicon is randomized.

The algorithm uses a very rudimentary bruteforce strategy where for the first 2 guesses it will always guess a vowel (A, E, I, O, U, and never Y \*sadface\*). After that it will guess any letter from A to Z. It will never guess a letter that has already been tried.

After the entire lexicon is played, a score showing the amount of correctly guessed words over the total amount of words played will show.

### Options
| Character | Description                                                                   |
|-----------|-------------------------------------------------------------------------------|
| **d**     | Activate debug mode. Logs extra information to the terminal.                  |

## Code Structure
- [hangman.js](./hangman.js): Main file which creates `HangmanGame` instance.
- [HangmanGame.js](./HangmanGame.js): `HangmanGame` class that runs the game logic.
- [HangmanLexicon.js](./HangmanLexicon.js): `HangmanLexicon` class that handles lexicon file parsing and selecting words for `HangmanGame` to use as answers.
- [hangmanSolver.js](./HangmanSolver.js): Contains all Hangman solver bot code.
- [SimpleCLIOptionMan.js](./SimpleCLIOptionMan.js): `SimpleCLIOptionMan` class which is a simple CLI option manager.
- [util.js](./util.js): Some miscellaneous utility functions.
