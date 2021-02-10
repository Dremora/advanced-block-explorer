import styled, { css } from "styled-components";

import { gray } from "src/styles/colors";

export const Table = styled.table`
  /* width: 100%; */
  border-collapse: collapse;
`;

type Align = "left" | "center" | "right";

export const Thead = styled.thead``;

export const Tbody = styled.tbody``;

export const Tr = styled.tr``;

type ThProps = {
  align?: Align;
};

export const Th = styled.th<ThProps>`
  padding: 4px 8px;
  color: ${gray};

  ${({ align }) =>
    align &&
    css`
      text-align: ${align};
    `}
`;

type TdProps = {
  align?: Align;
};

export const Td = styled.td<TdProps>`
  padding: 4px 8px;

  ${({ align }) =>
    align &&
    css`
      text-align: ${align};
    `}
`;
