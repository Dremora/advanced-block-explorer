import Link from "next/link";
import { ReactNode } from "react";
import styled from "styled-components";

import { blue } from "src/styles/colors";

type Props = {
  children: ReactNode;
  href: string;
};

const StyledLink = styled.a`
  color: ${blue};
  cursor: pointer;
`;

export function Anchor({ href, children }: Props) {
  return (
    <Link href={href} passHref>
      <StyledLink>{children}</StyledLink>
    </Link>
  );
}
