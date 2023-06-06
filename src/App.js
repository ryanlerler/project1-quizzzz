import logo from "./logo.svg";
import React from "react";
import "./App.css";
import Quiz from "./Components/Quiz";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Quiz />
        </header>
      </div>
    );
  }
}
export default App;
