import styled, {css} from 'styled-components';
import {Map} from 'react-yandex-maps';

type ContainerProps = {
	isMobile?: boolean;
	fixedHeight?: number;
};
export const Container = styled.div<ContainerProps>`
  position: relative;
  display: flex;
  flex: 1;
  background: darkgrey;
  overflow: hidden;
  ${props =>
	props.isMobile &&
	props.fixedHeight &&
	css`
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: ${props.fixedHeight}px;
    `}
`;

export const StyledMap = styled(Map)`
  position: relative;
  display: flex;
  flex-grow: 1;
  overflow: hidden;
`;
