import logo from "./logo.svg";
import "./App.css";
import Quiz from "./Components/Quiz";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Quiz />
      </header>
    </div>
  );
}

export default App;
