import axios from "axios";
import React, { Component } from "react";
import categories from "./categories.json";
import Form from "react-bootstrap/Form";

export default class Instructions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionCount: "",
      category: "",
      difficulty: "easy",
    };
  }

  componentDidUpdate() {
    const { questionCount, category, difficulty } = this.state;
    axios
      .get(
        `https://opentdb.com/api.php?amount=${questionCount}&category=${category}&difficulty=${difficulty}&type=multiple`
      )
      .then((data) => console.log(data, data.data.results[0].question));
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  render() {
    const categoriesOptionTag = categories.map((category) => (
      <option value={category.id} key={category.id}>
        {category.name}
      </option>
    ));

    return (
      <div>
        <h1>Welcome to Quizzzz!!!</h1>
        <br />

        <Form.Label>Enter number of questions (1 to 4000):</Form.Label>
        <br />
        <input
          type="number"
          name="questionCount"
          value={this.state.questionCount}
          required
          onChange={this.handleChange}
          min={1}
          max={4000}
        />
        <br />

        <Form.Label>Select a Category:</Form.Label>
        <br />
        <Form.Select
          name="category"
          value={this.state.category}
          required
          onChange={this.handleChange}
        >
          {categoriesOptionTag}
        </Form.Select>

        <Form.Label>Choose a Difficulty:</Form.Label>
        <br />
        <Form.Select
          name="difficulty"
          value={this.state.difficulty}
          required
          onChange={this.handleChange}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </Form.Select>

        <button>START</button>
      </div>
    );
  }
}
