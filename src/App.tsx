import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import ufo from './ufo.png'
import ray from './ray.png'
import cow from './cow.png'

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
    // if(!init){
      // window.addEventListener("keydown", handleKeyDown, true);
      // setInit(true)
    // }
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

function App() {
  return (
    <div className="App">
      <ImageSlider/>
      <img style={{width: "14vw" , position: 'fixed', bottom: '20px'}} src={cow} />
    </div>
  );
}

export default App;
