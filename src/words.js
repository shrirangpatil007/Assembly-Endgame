import { useEffect } from "react";

export default async function getRandomWord() {

  const apiList = [
    "https://api.datamuse.com/words?sp=????",
    "https://api.datamuse.com/words?sp=?????",
    "https://api.datamuse.com/words?sp=??????",
    "https://api.datamuse.com/words?sp=???????",
    "https://api.datamuse.com/words?sp=????????"
  ]

  const randomAPI = apiList[Math.floor(Math.random() * apiList.length)]
  try {
    const res = await fetch(randomAPI)
    const data = await res.json()
    const filteredWords = data.map(item => item.word)
    const random = filteredWords[Math.floor(Math.random() * filteredWords.length)]
    return random
  } catch(error) {
    console.log("Error in fetching a word: ", error)
    return "error"
  }
}




