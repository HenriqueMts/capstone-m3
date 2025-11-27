import Input from "../../components/Input";
import Button from "../../components/Button";
import * as yup from "yup";
import { Container, ExternalContainer } from "./style.js";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../providers/AuthProvider"; // <--- Importante: Caminho para seu novo AuthProvider

const Login = () => {
  const history = useHistory();

  // Extraímos a função de login e o usuário atual do nosso novo contexto
  const { login, user } = useAuth();

  const formSchema = yup.object().shape({
    email: yup.string().required("Email obrigatório").email("E-mail inválido"),
    password: yup.string().required("Senha obrigatória"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);

      toast.success("Você foi logado!");

      history.push("/user/pets");
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Email ou senha incorretos");
    }
  };

  // Se o usuário já estiver logado, nem mostra o form, manda pra dentro
  if (user) {
    history.push("/user/pets");
    return null;
  }

  return (
    <ExternalContainer>
      <Container>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1>Login</h1>

          <Input
            label="Email"
            type="text"
            name="email"
            placeholder="Digite seu email"
            error={errors.email?.message}
            register={register}
          />

          <Input
            label="Senha"
            type="password"
            name="password"
            placeholder="Digite sua senha"
            error={errors.password?.message}
            register={register}
          />

          <Button type="submit">Entrar</Button>

          <h3>
            Ainda não possui uma conta? <Link to="/cadastro">Cadastre-se</Link>
          </h3>
        </form>
      </Container>
    </ExternalContainer>
  );
};

export default Login;
