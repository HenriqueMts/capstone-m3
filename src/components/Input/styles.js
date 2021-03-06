import styled, { css } from "styled-components";

export const Container = styled.div`
  text-align: left;

  span {
    color: var(--color-error-form);
    font-size: 0.9rem;
  }
`;

export const InputContainer = styled.div`
  ${(props) =>
    props.orangeSchema
      ? css`
          background: var(--input-background-color-primary);
          input::placeholder {
            color: var(--color-second);
          }
        `
      : css`
          background: #fff9f2;
        `}
  border-radius: 25px;
  border: none;
  padding: 1rem;
  width: 100%;
  height: 45px;
  display: flex;
  transition: 0.4s;
  margin-bottom: 10px;

  input {
    background: transparent;
    align-items: center;
    flex: 1;
    border: 0;
    color: var(--color-title);
    height: 18px;
  }

  label {
    color: var(--color-title-50);
  }

  svg {
    margin-right: 10px;
  }
`;
