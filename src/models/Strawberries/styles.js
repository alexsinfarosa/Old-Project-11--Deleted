import styled from "styled-components";
import { Box } from "reflexbox";

export const Value = styled(Box)`
  font-size: .75rem;

  @media (max-width: 992px) {
    font-size: .6rem;
  }
  @media (max-width: 768px) {
    font-size: .5rem;
  }
  @media (max-width: 319px) {
    font-size: .4rem;
  }

`;
export const Info = styled(Box)`
  color: white;
  border-radius: 5px;
  letter-spacing: 1px;
  margin: 0 auto;
  padding-top: 1px;
  padding-bottom: 1px;

  @media (max-width: 992px) {
    font-size: .6rem;
  }
  @media (max-width: 768px) {
    font-size: .5rem;
  }
  @media (max-width: 319px) {
    font-size: .4rem;
  }

`;
