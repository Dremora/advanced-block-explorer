import styled from "styled-components";

import { gray, lightGray } from "src/styles/colors";

import PageContainer from "./PageContainer";

const Root = styled.div`
  height: 104px;
  background-color: ${lightGray};
  border-bottom: 2px solid ${gray};
`;

const ImageContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const PageHeader = () => (
  <Root>
    <PageContainer>
      <ImageContainer>
        <img height={104} src="/logo.svg" />
      </ImageContainer>
    </PageContainer>
  </Root>
);
