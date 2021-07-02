import type React from "react";

import { useRef, useLayoutEffect } from "react";
import { animated, useSpring } from "@react-spring/web";
import clamp from "lodash/clamp";
import useMeasure from "react-use-measure";
import { useDrag } from "react-use-gesture";

import { FlexItemStatic, FlexRow } from "../components/styled";

/**
 * For this attempt, I used one single div with one single slider.
 * However, I ran into issues keeping the slider in place when resizing the browser.
 * Being the genius I am, I attempted to use percentages to drive a pixel-based spring.
 * Yeah, don't do that.
 *
 * I did learn in this one that inline-flex will grow to the size of its children. that's handy.
 */

// TODO works except for resizing

// U T I L I T Y   F U N C T I O N S
const percent = (decimal: number): number => {
  return 100 * decimal;
};

const invert = (n: number): number => {
  return -1 * n;
};

/**
 * Invert Percent
 * @param {number} decimal
 * Returns the inverted percentage of a number.
 */
const ip = (decimal: number): number => {
  return invert(percent(decimal));
};

// END -- U T I L I T Y   F U N C T I O N S

export default function PanningPrototype({ spacing = 16, numVisible = 3 }) {
  const currentItem = useRef<number>(0);
  const dragOffset = useRef<number>(0);

  const colors: string[] = ["red", "blue", "green"];
  const items: string[] = [...colors, ...colors, colors[0]];
  const [spring, api] = useSpring(() => ({ x: 0 }));

  const [containerRef, { width: containerWidth }] = useMeasure();
  const containerWidthPrevious = useRef(containerWidth);
  const [sliderRef, { width: sliderWidth }] = useMeasure();
  const sliderWidthPrevious = useRef(sliderWidth);

  const panningBounds = useRef([0, 0]);
  const limit = Math.floor(items.length / numVisible);

  useLayoutEffect(() => {
    panningBounds.current = [
      0,
      ip((sliderWidth - containerWidth + 32) / sliderWidth),
    ];
    // ! commented out to suppress assigned value but never used warning. I know.
    // const diff = {
    //   container: containerWidth - containerWidthPrevious.current,
    //   slider: sliderWidth - sliderWidthPrevious.current
    // };
    const nextOffset =
      (dragOffset.current * sliderWidthPrevious.current) / sliderWidth;
    // console.log(
    //   panningBounds.current,
    //   nextOffset,
    //   dragOffset.current,
    //   nextOffset <= panningBounds.current[1]
    // );

    dragOffset.current = nextOffset;
    api.start({ x: percent(dragOffset.current), immediate: true });
    containerWidthPrevious.current = containerWidth;
    sliderWidthPrevious.current = sliderWidth;
  }, [containerWidth, api, sliderWidth]);

  const updateItemIndex = (
    index: React.MutableRefObject<number>,
    change: number
  ) => {
    index.current = clamp(
      index.current + change, // current value
      0, // don't go past 0
      limit /* num visibleitems per row = 2 */
    );
    const next = ip((index.current * containerWidth) / sliderWidth);
    const _limit = ip((sliderWidth - containerWidth + 32) / sliderWidth);
    api.start(
      {
        x: next < _limit ? _limit : next,
      } // negative because transform is in inverse direction. Same for all because we are animating the default layout.
    );
  };

  const handleClick = (event: React.MouseEvent, direction: string) => {
    event.preventDefault();
    switch (direction) {
      case "previous":
        updateItemIndex(currentItem, -1);
        break;
      case "next":
        updateItemIndex(currentItem, 1);
        break;
      default:
        console.warn(
          'you must pass either "previous" or "next" as the second argument for this to work'
        );
        break;
    }
  };

  const bind = useDrag(
    ({ down, offset: [ox] }) => {
      dragOffset.current = ox / sliderWidth;
      api.start({ x: percent(dragOffset.current) });
    },
    {
      bounds: {
        // panning scrolls the object the opposite direction, so the limits are chiral mirrors of each other.
        right: 0, // left-hand limit
        left: -(sliderWidth - containerWidth + 32), // right-hand limit
      },
      rubberband: true, // allow the drag to go a little over the limit and bounce back.
    }
  );

  return (
    <div className="App">
      <FlexRow className="bg-gray all-caps" as={"header"}>
        header
      </FlexRow>
      <FlexRow as={"main"} ref={containerRef}>
        <animated.div
          {...bind()}
          ref={sliderRef}
          style={{
            transform: spring.x.to((dx) => `translate3d(${dx}%, 0, 0)`),
          }}
          className="slidable-container"
        >
          {items.map((_, i: number) => (
            <FlexItemStatic
              className={`bg-${items[i]}`}
              /* @ts-ignore -> the prop is being passed, but TS assumes it isn't */
              contentWidth={containerWidth / numVisible}
              key={`item-${i}`}
            >
              <h1 className="no-select">{`0${i + 1}`}</h1>
            </FlexItemStatic>
          ))}
        </animated.div>
      </FlexRow>
      <FlexRow
        className="controls"
        style={{ margin: `0 ${spacing}px ${spacing}px` }}
      >
        <button
          style={{
            flex: "1 1 auto",
            marginRight: `${spacing}px`,
            padding: "24px",
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
