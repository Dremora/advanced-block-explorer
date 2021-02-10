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

type AProps = React.ComponentProps<"a">;

export function Anchor({ href, children, ...rest }: Props & AProps) {
  return (
    <Link href={href} passHref {...rest}>
      <StyledLink>{children}</StyledLink>
    </Link>
  );
}
