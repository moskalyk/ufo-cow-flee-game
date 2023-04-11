import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import ufo from './ufo.png'
import ray from './ray.png'
import cow from './cow.png'

function getRandomValue() {
  return Math.floor(Math.random() * (520 - (-520) + 1) + (-520));
}

function ImageSlider() {
  const [position, setPosition] = useState(0);
  const [init, setInit] = useState(false)

  const handleKeyDown = (event: any) => {
    console.log(position)
    console.log(position > -519)
      if (event.keyCode === 37) { // left arrow
        setPosition(position - 40);
      } else if (event.keyCode === 39) { // right arrow
        setPosition(position + 40);
      }
  };

  React.useEffect(() => {
    if(!init){
      setInterval(() => {
        setPosition(getRandomValue())
      }, 5000)
      // window.addEventListener("keydown", handleKeyDown, true);
      setInit(true)
    }
  }, [])

  return (
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
      <img src={ray} 
        style={{
          width: "20vw",
          position: "absolute",
          left: `${position}px`,
          transition: "left 2s",
          marginTop: '84vh',
          marginLeft: '40.5vw'
        }}/>
    </div>
  );
}

function CowControl() {

  const [position, setPosition] = useState(0);
  const [right, setRight] = useState<any>(null)
  const [init, setInit] = useState(false)

  const handleKeyDown = (event: any) => {
    console.log(position)
    console.log(position > -519)
    if(position != 520 && position != 520*-1){
      if (event.keyCode === 37) { // left arrow
        setPosition(position - 40);
        setRight(false)
      } else if (event.keyCode === 39) { // right arrow
        setPosition(position + 40);
        setRight(true)
      }
    }else {
      if(position == -520){
        setPosition(position + 40);
      }else {
        setPosition(position - 40);
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
          left: `${position}px`,
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
  return (
    <div className="App">
      <ImageSlider/>
      <CowControl/>
    </div>
  );
}

export default App;
