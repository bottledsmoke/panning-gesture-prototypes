import "./styles.css";
import type React from "react";
import Iteration001 from "./iterations/Iteration001";
import Iteration002 from "./iterations/Iteration002";
import Iteration003 from "./iterations/Iteration003";
import Iteration004 from "./iterations/Iteration004";
import { useState, useRef } from "react";

import { BigButton, FlexRow } from "./components/styled";
const App = () => {
  const [appState, setAppState] = useState({
    iteration: 4,
    selector: { collapsed: true }
  });
  const currentIteration = useRef<React.ReactElement>(<></>);

  switch (appState.iteration) {
    case 1:
      currentIteration.current = <Iteration001 />;
      break;
    case 2:
      currentIteration.current = <Iteration002 />;
      break;
    case 3:
      currentIteration.current = <Iteration003 />;
      break;
    case 4:
      currentIteration.current = <Iteration004 />;
      break;
    default:
      currentIteration.current = <Iteration003 />;
      break;
  }

  return (
    <>
      <div className="App">{currentIteration.current}</div>
      <FlexRow>
        <BigButton onClick={() => setAppState({ ...appState, iteration: 1 })}>
          1
        </BigButton>
        <BigButton onClick={() => setAppState({ ...appState, iteration: 2 })}>
          2
        </BigButton>
        <BigButton onClick={() => setAppState({ ...appState, iteration: 3 })}>
          3
        </BigButton>
        <BigButton onClick={() => setAppState({ ...appState, iteration: 4 })}>
          4
        </BigButton>
      </FlexRow>
    </>
  );
};

export default App;
