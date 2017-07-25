import React, { Component } from "react";
import { inject, observer } from "mobx-react";

// components
import Map from "components/Map";
import Strawberries from "models/Strawberries";
import BlueberryMaggot from "models/BlueberryMaggot";

// styled-components
import { Header, TextIcon, IconStyled, MainContent } from "./styles";

@inject("store")
@observer
class RightContent extends Component {
  render() {
    const {
      areRequiredFieldsSet,
      isMap,
      toggleSidebar,
      subject,
      state
    } = this.props.store.app;
    return (
      <div
        style={{ display: "flex", flexDirection: "column", height: "100vh" }}
      >
        {this.props.mobile
          ? <Header>
              <TextIcon>
                <IconStyled
                  type="menu-unfold"
                  onClick={toggleSidebar}
                  style={{ marginRight: 10 }}
                />
                <div>Blueberry Forecast Models</div>
              </TextIcon>
              <div>NEWA</div>
            </Header>
          : <Header>
              <div>Berry Model</div>
              <div>
                <div style={{ textAlign: "right" }}>NEWA</div>
                <div style={{ fontSize: ".7rem", letterSpacing: "1px" }}>
                  Network for Environment and Weather Applications
                </div>
              </div>
            </Header>}

        <MainContent>
          {state.name === "All States" &&
            <h3>
              Click one of the icons on the map or select a state and a station
              from the left panel.
            </h3>}
          <br />
          {isMap && <Map {...this.props} />}
          {areRequiredFieldsSet &&
            <div>
              {subject.name === "Strawberries"
                ? <Strawberries {...this.props} />
                : <BlueberryMaggot {...this.props} />}
            </div>}
        </MainContent>
      </div>
    );
  }
}

export default RightContent;
