# Hangman Game & Solver
## About
This project is a Hangman game played through the command-line alongside a solver bot.

This was inspired by an [assignment from Stanford's CS 106A: Programming Methodologies class](https://web.stanford.edu/class/archive/cs/cs106a/cs106a.1124/handouts/200%20Assignment%204.pdf) and a [challenge from Code Golf Stack Exchange](https://codegolf.stackexchange.com/questions/25496/write-a-hangman-solver). The main differences are that the project is coded in JavaScript instead of Java, there are no graphics, and the solver does not actually use the game program code supplied by the Code Gold Stack Exchange post although it does still roughly follow the same rules.

## Playing the Game
This is the command for running the game:
```
node hangman [-dhr] [lexicon_text_file ...]
```

So a simple example of this is:
```
node hangman lexiconA.txt
```

*Note: lexiconA.txt was taken from the CS 106A assignment, and lexiconB.txt was taken from the Code Golf Stack Exchange challenge. lexiconB.txt is much larger than lexiconA.txt.*

### Rules
The game follows the following rules:
- By default, the game will give the player 8 tries to guess the word.
- Each word is randomly selected from a pool of words determined in the lexicon text file.
- Guessing an incorrect letter will decrement the amount of remaining guesses by 1.
- Guessing a new correct letter will not change the amount of remaining guesses.
- Guessing an already found correct letter will also not change the amount of remaining guesses.
- Only 1 character can be guessed at a game.

### Lexicon
A valid lexicon must have the following properties:
- Must be a text file.
- Each line must contain only one word.
- Words can only be comprised of alphabetical characters.

### Options
| Character | Description                                                                   |
|-----------|-------------------------------------------------------------------------------|
| **d**     | Activate debug mode. Logs extra information to the terminal.                  |
| **h**     | Activate hard mode. Reduces the amount of guesses from 8 to 6.                |
| **r**     | Activate rush mode. Play through a randomized sequence of the entire lexicon. |