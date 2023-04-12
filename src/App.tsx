import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import ufo from './ufo.png'
import ray from './ray.png'
import cow from './cow_with_rollerblades.png'

import { SequenceIndexerClient } from '@0xsequence/indexer'

const indexer = new SequenceIndexerClient('https://mumbai-indexer.sequence.app')

function getRandomValue() {
  return Math.floor(Math.random() * (520 - (-520) + 1) + (-520));
}

function isBetween(num: number, lowerBound: number, upperBound: number, threshold: number) {
  return Math.abs(num - lowerBound) <= threshold && Math.abs(num - upperBound) <= threshold;
}

function Leaderboard(){
  const [init, setInit] = useState<boolean>(false)
  const [leaderboard, setLeaderboard] = useState<any>(new Map())

  const populateLeaderboard = () => {
    setInterval(async () => {
        // here we query the joy contract address
        const contractAddress = '0x761D7728FB98Fe451800e0346C8C6b8590477CFD'

        const filter = {
            contractAddress: contractAddress
        }

        // query Sequence Indexer for all token transaction history on mumbai
        const transactionHistory = await indexer.getTransactionHistory({
            filter: filter
        })

        const leaderboardRaw = new Map()

        transactionHistory.transactions.map((tx: any) => {
          tx.transfers.map((transfer: any) => {
            if(!leaderboard.has(transfer.to)){
              leaderboardRaw.set(transfer.to, Number(BigInt(transfer.amounts[0]) / BigInt(1e18)))
            }else {
              leaderboardRaw.set(transfer.to, leaderboard.get(transfer.to)+Number(BigInt(transfer.amounts[0] / BigInt(1e18))))
            }
          })
        })

        setLeaderboard(leaderboardRaw)
    }, 1000)
  }

  React.useEffect(() => {
    if(!init){
      populateLeaderboard()
      setInit(true)
    }
  })
  return (
  <div className='leaderboard'>
    <table>
      <tr>
        <th>Address</th>
        <th>Score</th>
      </tr>
      {
        Array.from(leaderboard.entries()).splice(0,5).sort( (x:any, y: any) => {
          return y[1] - x[1];
        }).map((peer: any, id: number) => {
          return <tr key={id}>
            <td>{peer[0].slice(0,6)}...</td>
            <td>{(peer[1]).toString()}</td>
          </tr>
        })
      }
    </table>
  </div>
  )
}

function UfoSky(props: any) {

  const [position, setPosition] = useState(0);
  const [init, setInit] = useState(false)
  const [rayTeleport, setRayTeleport] = useState(false)

  React.useEffect(() => {
     let timer = setInterval(() => {
      const ufoPosition = getRandomValue()
        setPosition(ufoPosition)
        setTimeout((ufoPosition: any) => {
          setRayTeleport(true)
          const gameOverInterval = setInterval(() => {
            if(isBetween(props.cowPosition, ufoPosition, ufoPosition, 120)){
              alert('GAME OVER')
              if(props.score > Number(localStorage.getItem('highscore'))){
                localStorage.setItem('highscore', String(props.score) )
              }
              props.setScore(0)
            }
            clearInterval(gameOverInterval)
          }, 200)
          setTimeout(() => {
            setRayTeleport(false)
          }, 2000)
        }, 1000, ufoPosition)
        props.setScore((prev: any) => prev + 10)
      }, 3000)
    return () => {
      window.clearInterval(timer)
    };
  }, [props.cowPosition, rayTeleport, position, props.score])

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        outline: 'none'
      }}
    >
      <img
        src={ufo}
        style={{
          width: "20vw",
          position: "relative",
          left: `${position}px`,
          transition: "left 2s",
        }}
        alt="Random Image"
      />
      {
        rayTeleport ? 
        <img src={ray} 
        style={{
          zIndex: 100,
          width: "20vw",
          position: "absolute",
          left: `${position}px`,
          transition: "left 2s",
          marginTop: '84vh',
          marginLeft: '40.5vw'
        }}/>
        : null
      }
      
    </div>
  );
}

function CowControl(props: any) {

  // const [position, setPosition] = useState(0);
  const [right, setRight] = useState<any>(null)
  const [init, setInit] = useState(false)

  const handleKeyDown = (event: any) => {
    if(props.cowPosition != 520 && props.cowPosition != 520*-1){
      if (event.keyCode === 37) { // left arrow
        props.setCowPosition(props.cowPosition - 40);
        setRight(false)
      } else if (event.keyCode === 39) { // right arrow
        props.setCowPosition(props.cowPosition + 40);
        setRight(true)
      }
    }else {
      if(props.cowPosition == -520){
        props.setCowPosition(props.cowPosition + 40);
      }else {
        props.setCowPosition(props.cowPosition - 40);
      }
    }
  };

  return(
  <>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        outline: 'none'
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <img src={cow} 
        style={{
          width: "14vw" , 
          position: 'fixed', 
          bottom: '20px',
          left: `${props.cowPosition}px`,
          transition: "left 2s",
          marginTop: '84vh',
          marginLeft: '40.5vw',
          transform: `${right ? 'scaleX(-1)': 'scaleX(1)'}`
        }}/>
    </div>
  </>
  )
}

function App() {
  const [cowPosition, setCowPosition] = useState(0)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(Number(localStorage.getItem("highscore")))

  React.useEffect(() => {

    if(score > Number(localStorage.getItem('highscore'))){
      console.log('setting high score')
      localStorage.setItem('highscore', String(score) )
    }

    setHighScore(Number(localStorage.getItem("highscore")))

    const listener = () => {
      setHighScore(Number(localStorage.getItem("highscore")))
    }

    window.addEventListener("storage", listener);

    return () => {
      window.removeEventListener("storage", listener);
    };
  }, [score])

  return (
    <div className="App">
      <Leaderboard />
      <UfoSky score={score} setScore={setScore} cowPosition={cowPosition}/>
      <CowControl cowPosition={cowPosition} setCowPosition={setCowPosition} />
      <div className='instructions'>{'click on the cow and navigate with < > keys'}</div>
      <div className='score'>{`score: ${score} | highscore: ${highScore}`}</div>
    </div>
  );
}

export default App;
