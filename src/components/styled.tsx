import styled from "styled-components";
import { animated } from "@react-spring/web";

export const BigButton = styled.button<{ spacing?: number }>`
  flex: 1 1 auto;
  /* @ts-ignore */
  margin-right: ${({ spacing }) => spacing}px;
  padding: 24px;

  &:last-child {
    margin-right: 0;
  }
`;

export const FlexItem = styled(animated.div)`
  flex: 1 0 200px;
  height: 100%;
  margin-right: 16px;
  will-change: transform;
  /* text styles */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 108px;
  font-weight: 600;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.5);

  &:last-child {
    margin-right: 0;
  }
`;

export const FlexItemStatic = styled.div<{ contentWidth?: number }>`
  width: ${(props) => props.contentWidth || 500}px;
  /* flex: 1 0 ${(props) => props.contentWidth || 500}px; */
  height: 100%;
  margin-right: 16px;
  will-change: transform;
  /* text styles */
  display: flex;
  align-items: stretch;
  justify-content: center;
  font-size: 108px;
  font-weight: 600;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.5);

  &:last-child {
    margin-right: 0;
  }
`;

export const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
