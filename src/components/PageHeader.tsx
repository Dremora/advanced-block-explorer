import Link from "next/link";
import styled from "styled-components";

import { gray, lightGray } from "src/styles/colors";

import PageContainer from "./PageContainer";

const Root = styled.div`
  height: 104px;
  background-color: ${lightGray};
  border-bottom: 2px solid ${gray};
`;

const ImageContainer = styled.span`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export const PageHeader = () => (
  <Root>
    <PageContainer>
      <Link href="/">
        <ImageContainer>
          <img height={104} src="/logo.svg" />
        </ImageContainer>
      </Link>
    </PageContainer>
  </Root>
);
