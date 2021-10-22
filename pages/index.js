import Head from 'next/head';
import { useState, useEffect } from 'react';
import { getSheetData } from './api/sheets';
import ConfettiExplosion from '@reonomy/react-confetti-explosion'
// import { getScore } from './api/scoreboard';

export default function Home(props) {

  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState([])
  const [answer, setAnswer] = useState('')
  const [visible, setVis] = useState(false)
  const [outcome, setOutcome] = useState('')
  // const [scoreboard, setScoreboard] = useState([])
  const [partytime, setPartytime] = useState(false)



  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  const nextQ = () => {
    setVis(false);
    setOutcome('')
    setPartytime(false)

    let randomSet = props.data[getRandomInt(44)]
    let optionsContainer = []
    let op = randomSet.options.split(',')
    op.map((ops) => {
      optionsContainer.push(ops.replace(/[^A-Za-z0-9\s\\_\\>]/g, ' '))
      console.log(ops)
    })
    setQuestion(randomSet.question.replace('\n', ' '))
    setOptions(optionsContainer)
    setAnswer(randomSet.answer.replace('\n', ' ').replace('Answer : ', ''))
  }


  useEffect(() => {
    nextQ()
    // setScoreboard(props.scoreData)
  }, [])

  const checkAnswer = async (choice) => {
    setVis(true)
    if (choice.includes(answer)) {
      correctAnswer()
      // update the score of user.
    } else {
      setOutcome('WRONG')
      console.log(answer)
    }
  }

  const correctAnswer = () => {
    setPartytime(true)
    setOutcome('CORRECT')
    updateScore()

    setTimeout(() => {
      setPartytime(false)
    }, 3000)
  }

  const updateScore = async () => {
    const sendScore = await fetch('/api/score', {
      method: 'POST',
      body: JSON.stringify({
        'person': 'Nate',
        'score': 10
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>CSA Tester</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {partytime ? <ConfettiExplosion /> : ('')}
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-5xl font-bold">
          Welcome to <span className='text-blue-400'>CSA Tester</span>
        </h1>

        <p className="m-8 p-8 border-t-2 text-4xl">
          {question}
        </p>
        {visible ? (
          <div className='flex flex-col justify-center'>
            <h2 className='text-4xl font-bold underline'>You are <span className={`${outcome == 'CORRECT' ? ('text-green-500') : ('text-red-500')}`}>{outcome}</span></h2>
            <p className="bg-green-300 p-10 rounded-xl m-8 p-8 border-t-2 text-4xl">
              {answer}
            </p></div>) : ('')
        }
        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
          {options.map((option) => {
            return (
              <button onClick={() => { checkAnswer(option) }} className={`p-6 mt-6 text-left border-2 w-96 rounded-xl hover:border-blue-600 focus:text-blue-600 shadow-xl
              ${visible ? (option.includes(answer) == true ? ('border-green-500 border-2 bg-green-400') : ('border-red-500 border-2 bg-red-400')) : ('')}
            `}>{option}
              </button>
            )
          })}
        </div>

        <button className='bg-blue-400 border-2 border-blue-500 rounded-xl shadow p-6 m-6' onClick={() => { nextQ() }}>Next Question &rarr;</button>

        {/* <div className='flex flex-col flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full'>
          <h1 className="text-5xl font-bold border-b-2">
            Score
          </h1>

          <table className='w-full rounded-xl'>
            {scoreboard.filter((titlefilter) => {
              if (titlefilter.person == 'name') {
                return false;
              }
              return true;
            }).map((score) => {
              return (
                <tr className='rounded-xl'>
                  <td className='border-2 border-gray-400 p-2 rounded-xl'>{score.person.toUpperCase()}</td>
                  <td className='border-2 border-gray-400 p-2 rounded-xl'>{score.score}</td>
                </tr>
              )

            })}
          </table>

        </div> */}


      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        <p
          className="flex items-center justify-center"
        >
          Made with ❤️+☕ by Nate
        </p>
      </footer>
    </div>
  )
}

export async function getStaticProps(context) {
  const data = await getSheetData();
  // const scoreData = await getScore();

  return {
    props: {
      data,
      // scoreData
    },
  };
}