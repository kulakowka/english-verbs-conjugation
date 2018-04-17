import React from "react";
import ConjugationService from "../../services/ConjugationService";
import "./VerbsList.css";

const conjugationService = new ConjugationService();
const verbs = conjugationService.list();

export default () => (
  <table className="verbs-list">
    <thead>
      <tr>
        <th>v1</th>
        <th>v2</th>
        <th>v3</th>
        <th>v4</th>
      </tr>
    </thead>
    <tbody>
      {verbs.map(([v1, v2, v4, v3]) => (
        <tr key={v1}>
          <td>{v1}</td>
          <td>{v2}</td>
          <td>{v3}</td>
          <td>{v4}</td>
        </tr>
      ))}
    </tbody>
  </table>
);
