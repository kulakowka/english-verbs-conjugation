import React, { Component } from "react";
import ConjugationService, {
  TIME,
  TENSE
} from "../../services/ConjugationService";
import Select from "react-virtualized-select";
import "react-select/dist/react-select.css";
import "react-virtualized/styles.css";
import "react-virtualized-select/styles.css";
import "./Conjugation.css";

const tableScheme = [
  [
    [TIME.PRESENT, TENSE.SIMPLE],
    [TIME.PRESENT, TENSE.PROGRESSIVE],
    [TIME.PRESENT, TENSE.PERFECT],
    [TIME.PRESENT, TENSE.PERFECT_PROGRESSIVE]
  ],
  [
    [TIME.PAST, TENSE.SIMPLE],
    [TIME.PAST, TENSE.PROGRESSIVE],
    [TIME.PAST, TENSE.PERFECT],
    [TIME.PAST, TENSE.PERFECT_PROGRESSIVE]
  ],
  [
    [TIME.FUTURE, TENSE.SIMPLE],
    [TIME.FUTURE, TENSE.PROGRESSIVE],
    [TIME.FUTURE, TENSE.PERFECT],
    [TIME.FUTURE, TENSE.PERFECT_PROGRESSIVE]
  ],
  [
    [TIME.CONDITIONAL, TENSE.SIMPLE],
    [TIME.CONDITIONAL, TENSE.PROGRESSIVE],
    [TIME.CONDITIONAL, TENSE.PERFECT],
    [TIME.CONDITIONAL, TENSE.PERFECT_PROGRESSIVE]
  ]
];

const conjugationService = new ConjugationService();
const listOptions = conjugationService.list().map(([verb]) => ({
  value: verb,
  label: verb
}));

export default class Conjugation extends Component {
  state = {
    verb: "be"
  };

  handleChange = verb => {
    if (verb) {
      const conjugation = conjugationService.find(verb);
      this.conjugationTable = conjugation.getConjugationTable();
    }
    this.setState({ verb });
  };

  render() {
    return (
      <div className="conjugation">
        <div className="conjugation-header">
          <Select
            className="conjugation-select"
            simpleValue
            searchable
            value={this.state.verb}
            onChange={this.handleChange}
            options={listOptions}
          />
        </div>

        {tableScheme.map(this.renderTenses)}
      </div>
    );
  }
  renderTenses = (tenses, index) => {
    return (
      <div className="conjugation-tenses" key={index}>
        {tenses.map(this.renderTense)}
      </div>
    );
  };
  renderTense = ([time, tense]) => {
    const title = `${time} ${tense}`;

    const conjugationTable = conjugationService
      .find(this.state.verb)
      .getConjugationTable();

    const rows = conjugationTable[tense][time];

    return (
      <div className="conjugation-tense" key={tense}>
        <h3>{title}</h3>
        {Object.keys(rows).map(person => (
          <div className="conjugation-item" key={person}>
            {rows[person].map((word, index, words) => {
              let className = "conjugation-item-verb";
              if (index === 0) {
                className = "conjugation-item-person";
              } else if (index === 1 && words.length === 3) {
                className = "conjugation-item-auxiliary";
              }
              return (
                <div className={className} key={word}>
                  {word}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };
}
