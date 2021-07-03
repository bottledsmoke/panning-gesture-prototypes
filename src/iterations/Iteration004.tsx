import { BigButton, FlexRow } from "components/styled";

import Slider from "components/Slider";
import Slider004 from "components/Slider004";

// ITEMS
const colors: string[] = ["green", "blue", "red"];
const items: string[] = [...colors, ...colors, colors[0]];
// END ITEMS

/**
 * This one works.
 *
 * I figured out the math behind keeping the scroller stationary when the window is resized.
 * I also learned that the initial config property of a gesture hook can accept a function.
 * Setting the initial value to the spring value will allow you to use just delta movements
 * instead of keeping the overall offset of a gesture function in check with outside influences
 * on the same spring. Beautiful.
 *
 * The next iteration would be code removal and condensing for clarity, but this one works for now.
 *
 */

export default function Iteration004() {
  const spacing = 16;
  const handleClick = (e: React.MouseEvent, action = "") => {
    e.preventDefault();
    console.log(`Action -- ${action}`);
  };

  const springConfig = {
    tension: items.length * 100,
    mass: 3,
    friction: 125,
  };

  return (
    <>
      <FlexRow className="bg-gray all-caps" as={"header"}>
        header
      </FlexRow>
      <Slider config={springConfig} spacing={spacing}>
        {items.map((color, i) => (
          <div
            className={`bg-${color}`}
            style={{
              flex: "1 0 100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
            key={`item=${i}`}
          >
            <h1 className="no-select">{`0${i}`}</h1>
          </div>
        ))}
      </Slider>
      <FlexRow
        className="controls"
        style={{ margin: `0 ${spacing}px ${spacing}px` }}
      >
        <BigButton
          spacing={spacing}
          onClick={(e) => handleClick(e, "previous")}
        >
          Previous
        </BigButton>
        <BigButton spacing={spacing} onClick={(e) => handleClick(e, "next")}>
          Next
        </BigButton>
      </FlexRow>
      <Slider004 spacing={spacing} />
      <Slider004 spacing={spacing} />
      <FlexRow className="bg-gray all-caps" as={"footer"}>
        footer
      </FlexRow>
    </>
  );
}
