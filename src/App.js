import React from "react";
import "./App.css";
import Quiz from "./Components/Quiz";
import Countdown from "react-countdown";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Countdown date={Date.now() + 100000}/>
          <Quiz />
        </header>
      </div>
    );
  }
}
export default App;
