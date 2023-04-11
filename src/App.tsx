import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import ufo from './ufo.png'
import ray from './ray.png'
import cow from './cow.png'

function getRandomValue() {
  return Math.floor(Math.random() * (520 - (-520) + 1) + (-520));
}

function isBetween(num: number, lowerBound: number, upperBound: number, threshold: number) {
  return Math.abs(num - lowerBound) <= threshold && Math.abs(num - upperBound) <= threshold;
}

function ImageSlider(props: any) {
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
              console.log('cow ->', props.cowPosition)
              console.log(ufoPosition)
            }else {
              console.log('safe')
              console.log('cow ->', props.cowPosition)
              console.log('ufo ->', ufoPosition)
            }
            clearInterval(gameOverInterval)
          }, 200)
          setTimeout(() => {
            setRayTeleport(false)
          }, 2000)
        }, 1000, ufoPosition)
      }, 3000)
    return () => {
      window.clearInterval(timer)
    };
  }, [props.cowPosition, rayTeleport, position])

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

  return (
    <div className="App">
      <ImageSlider cowPosition={cowPosition}/>
      <CowControl cowPosition={cowPosition} setCowPosition={setCowPosition} />
    </div>
  );
}

export default App;
