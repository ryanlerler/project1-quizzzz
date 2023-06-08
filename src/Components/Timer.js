import React from "react";

export default class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: new Date(),
    };
  }

  tick = () => {
    this.setState({
      timer: new Date(),
    });
  };

  componentDidMount() {
    this.timerId = setInterval(this.tick, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  render() {
    const { timer } = this.state;

    return <div>{timer.toLocaleTimeString()}</div>;
  }
}
