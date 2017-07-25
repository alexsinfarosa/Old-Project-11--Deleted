import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import takeRight from "lodash/takeRight";
import { autorun } from "mobx";

import "styles/shared.styl";
import { Flex, Box } from "reflexbox";

import Table from "antd/lib/table";
import "antd/lib/table/style/css";
import Button from "antd/lib/button";
import "antd/lib/button/style/css";

// styled components
import { Value, Info, CSVButton } from "./styles";

// utils
import { leafWetnessAndTemps, botrytisModel, anthracnoseModel } from "utils";

// To display the 'forecast text' and style the cell
const forecastText = date => {
  return (
    <Flex justify="center" align="center" column>
      <Value>
        {date.split("-")[0]}
      </Value>

      <Info style={{ color: "#595959" }}>
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
      <Info col={7} lg={3} md={3} sm={7} style={{ background: record.color }}>
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
        if (indexBotrytis < 0.5) {
          botrytis["riskLevel"] = "Low";
          botrytis["color"] = "#00A854";
        } else if (indexBotrytis >= 0.5 && indexBotrytis < 0.7) {
          botrytis["riskLevel"] = "Moderate";
          botrytis["color"] = "#FFBF00";
        } else {
          botrytis["riskLevel"] = "High";
          botrytis["color"] = "#F04134";
        }
      }

      // setup anthracnose risk level
      let anthracnose = { index: indexAnthracnose };
      if (indexAnthracnose !== "No Data") {
        if (indexAnthracnose < 0.5) {
          anthracnose["riskLevel"] = "Low";
          anthracnose["color"] = "#00A854";
        } else if (indexAnthracnose >= 0.5 && indexAnthracnose < 0.7) {
          anthracnose["riskLevel"] = "Moderate";
          anthracnose["color"] = "#FFBF00";
        } else {
          anthracnose["riskLevel"] = "High";
          anthracnose["color"] = "#F04134";
        }
      }

      let date = day.dateTable;
      this.props.store.app.setStrawberries({ date, botrytis, anthracnose });
    }
  };

  render() {
    const {
      ACISData,
      station,
      areRequiredFieldsSet,
      state,
      strawberries,
      strawberriesCSV
    } = this.props.store.app;
    const { mobile } = this.props;

    return (
      <Flex column mt={2}>
        <Flex justify="space-between" align="center">
          <Box>
            {!mobile
              ? <h2>
                  <i>Strawberry</i> prediction for {" "}
                  <span style={{ color: "#C44645" }}>
                    {station.name}, {state.postalCode}
                  </span>
                </h2>
              : <h3>
                  <i>Strawberry</i> prediction for {" "}
                  <span style={{ color: "#C44645" }}>
                    {station.name}, {state.postalCode}
                  </span>
                </h3>}
          </Box>

          <Box>
            <Button type="secondary" icon="download">
              <CSVButton
                data={strawberriesCSV.slice()}
                filename={"strawberryModel.csv"}
                target="_blank"
              >
                Download CSV
              </CSVButton>
            </Button>
          </Box>
        </Flex>

        <Flex mt={2} justify="center">
          <Box col={12} lg={12} md={12} sm={12}>
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
