import Input from "../../components/Input";
import Select from "../../components/Select";
import Button from "../../components/Button";
import * as yup from "yup";
import { Container } from "./style.js";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useHistory } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../providers/AuthProvider"; // IMPORTANTE: Ajuste o caminho se necessário

const Cadastro = () => {
  const history = useHistory();

  const { register: registerUser, user, loading } = useAuth();
  const [signupError, setSignupError] = useState("");

  const formSchema = yup.object().shape({
    name: yup
      .string()
      .required("Nome obrigatório")
      .min(3, "Mínimo 3 caracteres"),
    email: yup.string().required("Email obrigatório").email("E-mail inválido"),
    phone: yup
      .string()
      .min(11, "Mínimo 11 números")
      .matches(
        /^\(?[1-9]{2}\)? ?(?:[2-8]|9[1-9])[0-9]{3}-?[0-9]{4}$/,
        "Deve conter apenas números ou formato válido"
      ),
    password: yup
      .string()
      .required("Senha obrigatória")
      .min(6, "Mínimo 6 caracteres")
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{6,}$/,
        "Senha deve conter uma letra maiúscula, um número e um símbolo ($*&@#)"
      ),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Senhas não conferem"),
    avatar: yup.string().optional(), // Deixei opcional, ajuste se for obrigatório
    type: yup.string().required("Selecione um tipo"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  const onSubmit = async (data) => {
    setSignupError("");
    try {
      await registerUser(data);

      toast.success("Cadastro realizado! Faça login para continuar.");

      history.push("/login");
    } catch (err) {
      console.error("Register error:", err);

      const message = err?.message?.includes("already registered")
        ? "Este e-mail já está em uso."
        : err?.message || "Falha ao cadastrar. Verifique os dados.";

      toast.error(message);
      setSignupError(message);
    }
  };

  // Wait for auth initialization before redirecting — avoids premature navigation
  if (!loading && user) {
    history.push("/");
    return null;
  }

  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>Cadastro</h1>
        <Input
          label="Nome*"
          type="text"
          name="name"
          placeholder="Digite seu nome"
          error={errors.name?.message}
          register={register}
        />
        <Input
          label="Email*"
          type="text"
          name="email"
          placeholder="Digite seu email"
          error={errors.email?.message}
          register={register}
        />
        <Input
          label="Telefone*"
          type="text"
          placeholder="Digite o Telefone"
          name="phone"
          error={errors.phone?.message}
          register={register}
        />
        <Input
          label="Senha*"
          type="password"
          name="password"
          placeholder="Digite sua senha"
          error={errors.password?.message}
          register={register}
        />
        <Input
          label="Confirme sua senha*"
          type="password"
          placeholder="Digite a senha novamente"
          name="confirmPassword"
          error={errors.confirmPassword?.message}
          register={register}
        />
        <Input
          label="Avatar"
          type="text" // Mudei de 'avatar' para 'text' pois input type='avatar' não existe em HTML padrão
          name="avatar"
          placeholder="URL da imagem"
          error={errors.avatar?.message}
          register={register}
        />

        <label htmlFor="type">Tipo</label>
        {/* Certifique-se que seu Select retorna o valor correto para o 'register' */}
        <Select name="type" register={register} />

        {signupError && <h4>{signupError}</h4>}

        <Button type="submit">Registrar</Button>

        <h3>
          Já possui conta? <Link to="/login">Faça login</Link>
        </h3>
        <p>*Campos obrigatórios</p>
      </form>
    </Container>
  );
};

export default Cadastro;
