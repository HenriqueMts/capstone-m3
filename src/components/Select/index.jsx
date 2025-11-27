import { Container } from "./style";

const Select = ({ name, register, orangeSchema = false, children }) => {
  return (
    <Container orangeSchema={orangeSchema}>
      <select name={name} {...register(name)} id="">
        {/* Default options map to backend role values: 'adotante' and 'ong'.
            Consumers can pass custom children to override. */}
        {children || (
          <>
            <option value="adotante">Pessoa</option>
            <option value="ong">Instituição</option>
          </>
        )}
      </select>
    </Container>
  );
};

export default Select;
