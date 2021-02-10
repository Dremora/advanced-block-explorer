import Link from "next/link";
import { ReactNode } from "react";
import styled from "styled-components";

import { blue } from "src/styles/colors";
import { body } from "src/styles/typography";

type Props = {
  children: ReactNode;
  href: string;
};

const StyledLink = styled.a`
  color: ${blue};
  cursor: pointer;
  text-decoration: underline;
  ${body};
`;

export function Anchor({ href, children }: Props) {
  return (
    <Link href={href} passHref>
      <StyledLink>{children}</StyledLink>
    </Link>
  );
}
