import React from "react";
import "./App.css";
import { Map } from "./components/Map";
import { MOCK_MAP_DATA } from "./mockMapData";
import styled from "styled-components";

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100vw;
`;

function App() {
  return (
    <AppContainer>
      <Map data={MOCK_MAP_DATA} />
    </AppContainer>
  );
}

export default App;
