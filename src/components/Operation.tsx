import styled from "styled-components";

import { gray, green, purple, white } from "src/styles/colors";
import { medium } from "src/styles/typography";

type Props = {
  operation: string;
};

const Root = styled.div<Props>`
  ${medium};
  text-transform: uppercase;
  border-radius: 2px;
  color: ${white};
  padding: 1px 5px;
  margin: 0 5px;
  font-weight: 700;

  background-color: ${({ operation }) => {
    if (operation === "CALL") {
      return purple;
    } else if (operation === "CREATE") {
      return green;
    } else {
      return gray;
    }
  }};
`;

export const Operation = ({ operation }: Props) => (
  <Root operation={operation}>{operation}</Root>
);
