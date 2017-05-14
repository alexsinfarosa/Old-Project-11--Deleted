import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import takeRight from "lodash/takeRight";
import { autorun } from "mobx";

import "styles/table.styl";
import { Flex, Box } from "reflexbox";

import Table from "antd/lib/table";
import "antd/lib/table/style/css";

// styled components
import { RiskLevel } from "./styles";

// utils
import { leafWetnessAndTemps, botrytisModel, anthracnoseModel } from "utils";

const forecastText = date => {
  return (
    <div>
      <div>{date.split("-")[0]}</div>
      <div style={{ fontSize: ".5rem", color: "red" }}>
        {date.split("-")[1]}
      </div>
    </div>
  );
};

const riskLevel = (text, record, i) => {
  // console.log(text, record, i);
  return (
    <div>
      <span style={{ color: record.color }}>{text}</span>
      <RiskLevel style={{ background: record.color }}>
        {record.riskLevel}
      </RiskLevel>
    </div>
  );
};

const columns = [
  {
    title: "Date",
    className: "table",
    dataIndex: "date",
    key: "date",
    render: date => forecastText(date)
  },
  {
    title: "Index & Risk Levels",
    children: [
      {
        title: "Botrytis",
        className: "table",
        dataIndex: "botrytis.index",
        key: "botrytis",
        render: (text, record, i) => riskLevel(text, record.botrytis, i)
      },
      {
        title: "Anthracnose",
        className: "table",
        dataIndex: "anthracnose.index",
        key: "anthracnose",
        render: (text, record, i) => riskLevel(text, record.anthracnose, i)
      }
    ]
  }
];

@inject("store")
@observer
export default class Strawberries extends Component {
  constructor(props) {
    super(props);
    autorun(() => this.createDataModel());
  }

  createDataModel = () => {
    const { ACISData, currentYear, startDateYear } = this.props.store.app;

    for (const day of ACISData) {
      // Returns an object {W: Int, T: Int}
      const W_and_T = leafWetnessAndTemps(day, currentYear, startDateYear);

      let indexBotrytis = botrytisModel(W_and_T);
      if (indexBotrytis === "NaN") {
        indexBotrytis = "No Data";
      }
      let indexAnthracnose = anthracnoseModel(W_and_T);
      if (indexAnthracnose === "NaN") {
        indexAnthracnose = "No Data";
      }

      // setup botrytis risk level
      let botrytis = { index: indexBotrytis };
      if (indexBotrytis !== "No Data") {
        if (indexBotrytis < 0.50) {
          botrytis["riskLevel"] = "Low";
          botrytis["color"] = "#81C784";
        } else if (indexBotrytis >= 0.50 && indexBotrytis < 0.70) {
          botrytis["riskLevel"] = "Moderate";
          botrytis["color"] = "#FCCE00";
        } else {
          botrytis["riskLevel"] = "High";
          botrytis["color"] = "#f44336";
        }
      }

      // setup anthracnose risk level
      let anthracnose = { index: indexAnthracnose };
      if (indexAnthracnose !== "No Data") {
        if (indexAnthracnose < 0.50) {
          anthracnose["riskLevel"] = "Low";
          anthracnose["color"] = "#81C784";
        } else if (indexAnthracnose >= 0.50 && indexAnthracnose < 0.70) {
          anthracnose["riskLevel"] = "Moderate";
          anthracnose["color"] = "#FCCE00";
        } else {
          anthracnose["riskLevel"] = "High";
          anthracnose["color"] = "#f44336";
        }
      }

      let date = day.dateTable;

      this.props.store.app.setStrawberries({ date, botrytis, anthracnose });
    }
  };

  render() {
    const { ACISData, station, areRequiredFieldsSet } = this.props.store.app;
    const { strawberries } = this.props.store.app;
    // const { mobile } = this.props;
    return (
      <Flex column>
        <Box>
          <h2>Strawberry Prediction For {station.name}</h2>
        </Box>

        <Flex justify="center">
          <Box mt={1} col={12} lg={12} md={12} sm={12}>
            <Table
              size="middle"
              bordered
              columns={columns}
              rowKey={record => record.date}
              loading={ACISData.length === 0}
              pagination={false}
              dataSource={
                areRequiredFieldsSet
                  ? takeRight(strawberries, 8).map(day => day)
                  : null
              }
            />
          </Box>
        </Flex>
      </Flex>
    );
  }
}
