import { languages } from "./languages"
import { useState, useEffect } from "react"
import {clsx} from "clsx"
import { getFarewellText } from "./util"
import getRandomWord from "./words.js"
import Confetti from "react-confetti"




export default function App() {


  const [currentWord, setCurrentWord] = useState("")
  const [userGuessed, setUserGuessed] = useState([])

  useEffect(() => {
    getRandomWord().then(setCurrentWord)
  }, [])

   if (!currentWord) {
    return (
      <main className="main">
        <div className="spinner" role="status" aria-label="Loading..."></div>
      </main>
    );
  }

  const lastLetter = userGuessed.at(-1) || ""
  const wordLetters = currentWord.split("")
  const wrongGuess = lastLetter && !wordLetters.includes(lastLetter)

  function startNewGame() {
    getRandomWord().then(setCurrentWord)
    setUserGuessed([])
  }



  function handleClick(letter) {
    setUserGuessed(prev => 
      prev.includes(letter) ?
      prev :
      [...prev, letter]
    )
  }


  const numGuessesLeft = languages.length - 1
  const wrongGuessCount = userGuessed.filter(letter => !currentWord.includes(letter)).length
  const isGameWon = currentWord && wordLetters.every(letter => userGuessed.includes(letter))
  const isGameLost = wrongGuessCount >= numGuessesLeft
  const isGameOver = isGameWon || isGameLost



  
  const languageElements = languages.map((letter, index) => {
    const isLanguageLost = index < wrongGuessCount
    const styles = {
      backgroundColor : letter.backgroundColor,
      color : letter.color
    }
    const className = clsx("chip", isLanguageLost && "lost")
    return (
      <span
        className={className}
        style={styles}
        key={letter.name}
      >
        {letter.name}
      </span>
    )
  })

  const letters = wordLetters.map((letter, index) => {
    const shouldRevealLetter = isGameLost || userGuessed.includes(letter)
    const letterClassName = clsx(
      isGameLost && !userGuessed.includes(letter) && "missed-letter"
    )
    return (
      <span key={index} className={letterClassName}>
        {shouldRevealLetter ? letter.toUpperCase() : ""}
    </span>
    )
})

  const alphabet = "qwertyuiopasdfghjklzxcvbnm"


  const keyboardElements = alphabet.split("").map(letter => {
    const isGuessed = userGuessed.includes(letter)
    const isCorrect = isGuessed && currentWord.includes(letter)
    const isWrong = isGuessed && !currentWord.includes(letter)
    const classname = clsx({
      correct : isCorrect,
      wrong : isWrong
    })
    return (
      <button 
        className = {classname}
        disabled = {!currentWord || isGameOver}
        aria-disabled = {userGuessed.includes(letter)}
        aria-label = {`Letter ${letter}`}
        onClick={() => handleClick(letter)} 
        key={letter}
        >
          {letter.toUpperCase()}
      </button>
    )
  })


  const gameStatus = clsx("status",{
    won : isGameWon,
    lost : isGameLost,
    farewell : !isGameOver && wrongGuess
  })

  function renderGameStatus() {
    if(!isGameOver && wrongGuess) {
      return <p className="farewell-message">{getFarewellText(languages[wrongGuessCount-1].name)}</p>
    }
    if(isGameWon) {
      return (
      <>
        <h2>You Win!</h2>
        <p>Well done! 🎉</p>
      </>
      )
    }
    if(isGameLost) {
      return (
      <>
        <h2>Game Over!</h2>
        <p>You lose! Better start learning Assembly 😭</p>
      </>
      )
    }
    return null
  }


 
  return (
    <main className="main">
      {isGameWon && <Confetti recycle={false} numberOfPieces={1000} />}
        <div className="header">
          <h1>Assembly Endgame</h1>
          <p id="header-para">Guess the word in under 8 attempts to keep the programming world safe from Assembly!</p>
        </div>
        <div className={gameStatus}>
          {renderGameStatus()}
        </div>
        <section 
          className = "language-chips"
          aria-live = "polite"
          role = "status"
        >
                {languageElements}
            </section>
        <div className="word">
          {letters}
        </div>

        {/* This is sr-only div */}
        <div
          className = "sr-only"
          aria-live = "polite"
          role = "status"
        >
          <p>
            {currentWord.includes(lastLetter) ? 
              `Correct, the letter ${lastLetter} is in the word` :
              `Sorry, the letter ${lastLetter} is not in the word`}
          </p>

          <p>{`You have ${numGuessesLeft} attempts left.`}</p>

          <p>
            Current word: {wordLetters.map(letter => {
              return userGuessed.includes(letter) ? letter : "blank"
            }).join(" ")}
        </p>
        </div>


        <div className="keyboard">
          {keyboardElements}
        </div>
       {isGameOver && <button onClick={startNewGame} className="new-game">New Game</button>}
    </main>
  )
}