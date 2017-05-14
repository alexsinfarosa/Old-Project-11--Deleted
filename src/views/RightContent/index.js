import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { MatchMediaProvider } from "mobx-react-matchmedia";

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
      subject,
      isMap,
      breakpoints,
      toggleSidebar
    } = this.props.store.app;

    return (
      <MatchMediaProvider breakpoints={breakpoints}>
        <div
          style={{ display: "flex", flexDirection: "column", height: "100vh" }}
        >
          {!breakpoints.su
            ? <Header>
                <TextIcon>
                  <IconStyled
                    type="menu-unfold"
                    onClick={toggleSidebar}
                    style={{ marginRight: 10 }}
                  />
                  <div>Berry Model</div>
                </TextIcon>
                <div>NEWA</div>
              </Header>
            : <Header>
                <div>Berry Model</div>
                <div>NEWA</div>
              </Header>}

          <MainContent>
            {isMap && <Map />}
            {areRequiredFieldsSet &&
              <div>
                {subject.name === "Strawberries"
                  ? <Strawberries />
                  : <BlueberryMaggot />}
              </div>}

          </MainContent>
        </div>
      </MatchMediaProvider>
    );
  }
}

export default RightContent;
