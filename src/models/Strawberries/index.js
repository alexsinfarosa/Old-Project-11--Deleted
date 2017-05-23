import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import takeRight from "lodash/takeRight";
import { autorun } from "mobx";

import "styles/table.styl";
import { Flex, Box } from "reflexbox";

import Table from "antd/lib/table";
import "antd/lib/table/style/css";

// styled components
import { Value, Info } from "./styles";

// utils
import { leafWetnessAndTemps, botrytisModel, anthracnoseModel } from "utils";

// To display the 'forecast text' and style the cell
const forecastText = date => {
  return (
    <Flex justify="center" align="center" column>
      <Value>
        {date.split("-")[0]}
      </Value>

      <Info style={{ color: "red" }}>
        {date.split("-")[1]}
      </Info>
    </Flex>
  );
};

const riskLevel = (text, record, i) => {
  // console.log(text, record, i);
  return (
    <Flex justify="center" align="center" column>
      <Value mb={1} style={{ color: record.color }}>
        {text}
      </Value>
      <Info col={7} lg={4} md={4} sm={7} style={{ background: record.color }}>
        {record.riskLevel}
      </Info>
    </Flex>
  );
};

const columns = [
  {
    title: "Date",
    width: "30%",
    dataIndex: "date",
    key: "date",
    className: "table",
    render: date => forecastText(date)
  },
  {
    title: "Index & Risk Levels",
    children: [
      {
        title: "Botrytis",
        width: "35%",
        className: "table",
        dataIndex: "botrytis.index",
        key: "botrytis",
        render: (text, record, i) => riskLevel(text, record.botrytis, i)
      },
      {
        title: "Anthracnose",
        width: "35%",
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
    const { mobile } = this.props;
    return (
      <Flex column>
        <Box>
          {!mobile
            ? <h2>
                Strawberry Prediction for {" "}
                <em style={{ color: "#C44645" }}>{station.name}</em>
              </h2>
            : <h3>
                Strawberry Prediction for {" "}
                <em style={{ color: "#C44645" }}>{station.name}</em>
              </h3>}
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
