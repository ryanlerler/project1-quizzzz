import React from "react";
import Categories from "./categories.json";
import Form from "react-bootstrap/Form";

export default class HomePage extends React.Component {
  render() {
    const { questionCount, category, difficulty, handleChange } = this.props;

    const categoriesOptionTag = Categories.map((category) => (
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
        <Form.Label className="form-label">
          Select Number of Questions:
        </Form.Label>
        <br />
        <Form.Select
          name="questionCount"
          value={questionCount}
          required
          onChange={handleChange}
          className="form-select"
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
          <option value="">Any</option>
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
          <option value="">Any</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </Form.Select>
      </div>
    );
  }
}
