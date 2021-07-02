import type React from "react";
import { useRef } from "react";
import { useSprings } from "@react-spring/web";
import clamp from "lodash/clamp";
import useMeasure from "react-use-measure";
import { useDrag } from "react-use-gesture";
import { FlexItem, FlexRow } from "../components/styled";

/**
 * In this first attempt, I used a spring for each slider item.
 * However, bounds are set on the gesture config, so each item has it's own bounds.
 * That means you can scroll as far as you want to the right, but you can't go back past the left bound.
 * In the next iteration, I would animate just a container div.
 */

export default function PanningPrototype({ spacing = 16 }) {
  const currentItem = useRef(0);
  const colors: string[] = ["red", "blue", "green"];
  const items: string[] = [...colors, ...colors, colors[0]];
  const [springs, api] = useSprings(items.length, (index) => ({ x: 0 }));

  const [measureRef, { width }] = useMeasure();

  const updateItemIndex = (
    index: React.MutableRefObject<number>,
    change: number
  ) => {
    index.current = clamp(
      index.current + change, // current value
      0, // don't go past 0
      items.length - (1 + 1) /* num visibleitems per row = 2 */
    );
    api.start((spring) => {
      return { x: index.current * -(width + spacing) }; // negative because transform is in inverse direction. Same for all because we are animating the default layout.
    });
  };

  const handleClick = (event: React.MouseEvent, direction: string) => {
    event.preventDefault();
    switch (direction) {
      case "previous":
        updateItemIndex(currentItem, -2);
        break;
      case "next":
        updateItemIndex(currentItem, 2);
        break;
      default:
        console.warn(
          'you must pass either "previous" or "next" as the second argument for this to work'
        );
        break;
    }
  };

  const bind = useDrag(
    ({ down, movement: [mx], lastOffset: [ox] }) => {
      api.start((springIndex) => ({ x: ox + mx }));
    },
    {
      bounds: {
        right: 0
      },
      rubberband: true
    }
  );

  return (
    <div className="App">
      <FlexRow className="bg-gray all-caps" as={"header"}>
        header
      </FlexRow>
      <FlexRow as={"main"}>
        {springs.map(({ x }, i: number) => (
          <FlexItem
            className={`bg-${items[i]} no-select`}
            key={`item-${i}`}
            {...bind()}
            ref={i === 0 ? measureRef : null}
            style={{ transform: x.to((dx) => `translate3d(${dx}px, 0, 0)`) }}
          >
            {x.to((dx) => Math.floor(dx * -1))}
          </FlexItem>
        ))}
      </FlexRow>
      <FlexRow
        className="controls"
        style={{ margin: `0 ${spacing}px ${spacing}px` }}
      >
        <button
          style={{
            flex: "1 1 auto",
            marginRight: `${spacing}px`,
            padding: "24px"
          }}
          onClick={(e) => handleClick(e, "previous")}
        >
          Previous
        </button>
        <button
          style={{ flex: "1 1 auto", padding: "24px" }}
          onClick={(e) => handleClick(e, "next")}
        >
          Next
        </button>
      </FlexRow>
      <FlexRow className="bg-gray all-caps" as={"footer"}>
        footer
      </FlexRow>
    </div>
  );
}
