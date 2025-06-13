import React from 'react';
import './StartScreen.css';

function StartScreen({ onStart }) {
  return (
    <div className="start-screen">
      <div className="pixel-title">Maze Solver: <br />Kitty Protocol</div>
      <button className="press-start" onClick={onStart}>
        PRESS START !
      </button>
      <p className="credits">SU DUNG THUA TOAN A*<br/>NHOM 04</p>
    </div>
  );
}

export default StartScreen;
