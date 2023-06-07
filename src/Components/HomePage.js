import React, { Component } from "react";
import categories from "./categories.json";
import Form from "react-bootstrap/Form";

export default class HomePage extends Component {
  render() {
    const { questionCount, handleChange, category, difficulty } = this.props;

    const categoriesOptionTag = categories.map((category) => (
      <option value={category.id} key={category.id}>
        {category.name}
      </option>
    ));

    const questionCountOptionTag = [];
    for (let i = 5; i <= 50; i += 5) {
      questionCountOptionTag.push(
        <option value={i} key={i}>
          {i}
        </option>
      );
    }

    return (
      <div>
        <h1>Welcome to Quizzzz!!!</h1>
        <br />

        <Form.Label>Select Number of Questions:</Form.Label>
        <br />
        <Form.Select
          name="questionCount"
          value={questionCount}
          required
          onChange={handleChange}
        >
          {questionCountOptionTag}
        </Form.Select>

        <Form.Label>Pick a Category:</Form.Label>
        <br />
        <Form.Select
          name="category"
          value={category}
          required
          onChange={handleChange}
        >
          <option>Any</option>
          {categoriesOptionTag}
        </Form.Select>

        <Form.Label>Choose a Difficulty:</Form.Label>
        <br />
        <Form.Select
          name="difficulty"
          value={difficulty}
          required
          onChange={handleChange}
        >
          <option value="any">Any</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </Form.Select>
      </div>
    );
  }
}
