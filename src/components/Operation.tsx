import Chip, { ChipProps } from "@material-ui/core/Chip";
import { Message } from "@parsiq/block-tracer";
import chroma from "chroma-js";
import styled, { css } from "styled-components";

import { blue, gray, green, purple, white } from "src/styles/colors";
import { medium } from "src/styles/typography";

type ItemMessage = Omit<Message<never>, "parent">;

type Props = {
  operation: ItemMessage["op"] | "DEPLOYMENT" | "TRANSFER";
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
            background-color: ${chroma(purple).brighten().hex()};
          `;
        }
        case "CREATE": {
          return css`
            background-color: ${green};
          `;
        }
        case "LOG0": {
          return css`
            background-color: ${chroma(blue).hex()};
          `;
        }
        case "LOG1": {
          return css`
            background-color: ${chroma(blue).brighten(0.5).hex()};
          `;
        }
        case "LOG2": {
          return css`
            background-color: ${chroma(blue).brighten(1).hex()};
          `;
        }
        case "LOG3": {
          return css`
            background-color: ${chroma(blue).brighten(1.5).hex()};
          `;
        }
        case "LOG4": {
          return css`
            background-color: ${chroma(blue).brighten(2).hex()};
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
