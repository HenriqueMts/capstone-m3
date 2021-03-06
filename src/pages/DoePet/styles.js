import styled from "styled-components";

export const GenericContainer = styled.div`
  width: 100%;
  min-height: 100vh;

  background-color: var(--color-fourth);

  display: flex;
  justify-content: center;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 100px;
`;

export const Main = styled.main`
  width: 100%;
  align-items: center;
  min-width: var(--min-width);
  height: fit-content;

  display: flex;
  flex-direction: column;
  gap: 16px;

  padding: 16px;

  background-color: var(--color-fourth);

  h1 {
    width: 100%;
    text-align: center;
    font-size: 2.25rem;
    font-weight: 700;
    color: var(--color-title);

    border-bottom: 1px solid var(--color-title-50);

    padding-bottom: 8px;
  }
`;

export const Form = styled.form`
  width: 100%;
  max-width: 768px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const DivButtons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 16px 0;

  width: 100%;
  max-width: 768px;

  background-color: var(--color-fourth);
`;
