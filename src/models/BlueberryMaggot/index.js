import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import takeRight from "lodash/takeRight";
import format from "date-fns/format";

//  reflexbox
import { Flex, Box } from "reflexbox";

// styles
import "styles/table.styl";

// styled components
import { Value, Info } from "./styles";

import Table from "antd/lib/table";
import "antd/lib/table/style/css";

import Graph from "./Graph";

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

const emergence = cdd => {
  if (cdd > 913) {
    return (
      <Flex justify="center" align="center" column>
        <Value mb={1}>
          {cdd}
        </Value>
        <Info
          col={8}
          lg={5}
          md={5}
          sm={8}
          style={{ background: "#C44645", fontSize: ".6rem" }}
        >
          Emergence Occurred
        </Info>
      </Flex>
    );
  }
  return (
    <Flex justify="center" align="center" column>
      <Value>
        {cdd}
      </Value>
    </Flex>
  );
};

const description = record => {
  if (record.missingDays.length > 0) {
    return (
      <Flex style={{ fontSize: ".6rem" }} column>
        <Box col={12} lg={6} md={6} sm={12}>
          <Box col={12} lg={12} md={12} sm={12}>
            {record.missingDays.length > 1
              ? <div>
                  No data available for the following
                  {" "}
                  {record.cumulativeMissingDays}
                  {" "}
                  dates:
                  {" "}
                </div>
              : <div>No data available for the following date:</div>}
          </Box>
        </Box>
        <br />
        <Box col={12} lg={6} md={6} sm={12}>
          {record.missingDays.map((date, i) => (
            <div key={i}>
              - {format(date, "MMM Do")}
            </div>
          ))}
        </Box>
      </Flex>
    );
  }
  return null;
};

const columns = [
  {
    title: "Date",
    className: "table",
    dataIndex: "dateTable",
    key: "dateTable",
    render: date => forecastText(date)
  },
  {
    title: "Degree Days",
    children: [
      {
        title: "Daily",
        className: "table",
        dataIndex: "dd",
        key: "dd"
      },
      {
        title: "Cumulative",
        className: "table",
        dataIndex: "cdd",
        key: "cdd",
        render: cdd => emergence(cdd)
      }
    ]
  },
  {
    title: "Temperature (˚F)",
    children: [
      {
        title: "Min",
        className: "table",
        dataIndex: "Tmin",
        key: "Tmin"
      },
      {
        title: "Max",
        className: "table",
        dataIndex: "Tmax",
        key: "Tmax"
      },
      {
        title: "Avg",
        className: "table",
        dataIndex: "Tavg",
        key: "Tavg"
      }
    ]
  }
];

@inject("store")
@observer
export default class BlueberryMaggot extends Component {
  render() {
    const {
      ACISData,
      station,
      areRequiredFieldsSet,
      isGraph,
      displayPlusButton
    } = this.props.store.app;
    const { mobile } = this.props;

    return (
      <Flex column>
        <Box>
          {!mobile
            ? <h2>
                Blueberry Maggot Prediction for {" "}
                <em style={{ color: "#C44645" }}>{station.name}</em>
              </h2>
            : <h3>
                Blueberry Maggot Prediction for {" "}
                <em style={{ color: "#C44645" }}>{station.name}</em>
              </h3>}
        </Box>

        <Flex justify="center">
          <Box mt={1} col={12} lg={12} md={12} sm={12}>
            {displayPlusButton
              ? <Table
                  size={mobile ? "small" : "middle"}
                  columns={columns}
                  rowKey={record => record.dateTable}
                  loading={ACISData.length === 0}
                  pagination={false}
                  dataSource={
                    areRequiredFieldsSet ? takeRight(ACISData, 8) : null
                  }
                  expandedRowRender={record => description(record)}
                />
              : <Table
                  size={mobile ? "small" : "middle"}
                  columns={columns}
                  rowKey={record => record.dateTable}
                  loading={ACISData.length === 0}
                  pagination={false}
                  dataSource={
                    areRequiredFieldsSet ? takeRight(ACISData, 8) : null
                  }
                />}
          </Box>
        </Flex>
        {isGraph && <Graph />}
      </Flex>
    );
  }
}
