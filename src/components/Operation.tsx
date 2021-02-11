import Chip, { ChipProps } from "@material-ui/core/Chip";
import { Message } from "@parsiq/block-tracer";
import styled, { css } from "styled-components";

import { gray, green, purple, white } from "src/styles/colors";
import { medium } from "src/styles/typography";

type ItemMessage = Omit<Message<never>, "parent">;

type Props = {
  operation: ItemMessage["op"];
};

const StyledChip = styled(Chip)<Props & ChipProps>`
  ${medium};
  text-transform: uppercase;
  border-radius: 2px;
  color: ${white};
  padding: 1px 5px;
  margin: 0 5px;
  font-weight: 700;

  &.MuiChip-root {
    ${({ operation }) => {
      switch (operation) {
        case "CALL": {
          return css`
            background-color: ${purple};
          `;
        }
        case "CREATE": {
          return css`
            background-color: ${green};
          `;
        }
        default: {
          return css`
            background-color: ${gray};
          `;
        }
      }
    }};
  }
`;

export const Operation = ({ operation }: Props) => (
  <StyledChip size="small" label={operation} operation={operation} />
);
