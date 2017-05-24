import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import takeRight from "lodash/takeRight";

//  reflexbox
import { Flex, Box } from "reflexbox";

// styles
import "styles/table.styl";

// styled components
import { Value, Info } from "./styles";

import Table from "antd/lib/table";
import "antd/lib/table/style/css";

import Graph from "./Graph";

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

    const emergence = (text, record, i) => {
      if (record.missingDay === 1)
        return (
          <Flex justify="center" align="center">
            <Value>
              No data
            </Value>
          </Flex>
        );
      if (record.cdd > 913) {
        return (
          <Flex justify="center" align="center" column>
            <Value>
              {record.cdd}
              <span style={{ color: "red", marginLeft: "5px" }}>
                {record.cumulativeMissingDays > 0
                  ? `(+${record.cumulativeMissingDays})`
                  : null}
              </span>
            </Value>
            {mobile
              ? <span style={{ color: "#108EE9" }}>Emergence</span>
              : <Info
                  mt={1}
                  col={7}
                  lg={4}
                  md={4}
                  sm={7}
                  style={{ color: "#108EE9" }}
                >
                  Emergence
                </Info>}
          </Flex>
        );
      }
      return (
        <Flex justify="center" align="center" column>
          <Value>
            {record.cdd}
            <span style={{ color: "red", marginLeft: "10px" }}>
              {record.cumulativeMissingDays > 0
                ? `(+${record.cumulativeMissingDays})`
                : null}
            </span>
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
                  - {date}
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
            render: (text, record, i) => emergence(text, record, i)
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
