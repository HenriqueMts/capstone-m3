import { useHistory } from "react-router-dom";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { createPet } from "../../services/petService";

import Button from "../../components/Button";
import ButtonOutlined from "../../components/ButtonOutlined";
import InputInternal from "../../components/InputInternal";
import FooterChat from "../../components/footer-Chat";

import * as S from "./styles";
import InputTextArea from "../../components/InputTextArea";
import DivSelect from "../../components/DivSelect";

import { toast } from "react-toastify";
import { useEffect } from "react";
import { useAuth } from "../../providers/AuthProvider";

const DoePet = () => {
  const history = useHistory();

  // Usar useAuth para obter usuário autenticado
  const { user: authUser } = useAuth();

  useEffect(() => {
    if (!authUser?.id) {
      history.push("/login");
    }
  }, [history, authUser?.id]);

  const formSchema = yup.object().shape({
    name: yup.string().required("Campo Obrigatório!"),
    img: yup
      .string()
      .required("Campo Obrigatório!")
      .matches(
        /^https?:\/\/.*\/.*\.(png|gif|webp|jpeg|jpg)($|\?.*$)/,
        "Precisar ser uma URL"
      ),
    moreInfo: yup.string().required("Campo Obrigatório!"),
    species: yup.string().required("Campo Obrigatório!"),
    sex: yup.string().required("Campo Obrigatório!"),
    size: yup.string().required("Campo Obrigatório!"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(formSchema) });

  const onSubmit = (data) => {
    // Usar authUser.id em vez de userData?.id
    data.userId = authUser?.id;
    registerPet(data);
  };

  const registerPet = async (dataBody) => {
    try {
      await createPet(dataBody);
      toast.success("O Pet foi cadastrado");
      history.push("/");
    } catch (err) {
      console.error("Erro ao cadastrar pet:", err);
      toast.error("Ops! Houve algum erro");
    }
  };

  return (
    <S.GenericContainer>
      <S.Main>
        <h1>Doe um Pet</h1>

        <S.Form onSubmit={handleSubmit(onSubmit)}>
          <InputInternal
            label="Nome"
            type="text"
            placeholder="Nome do Pet"
            name="name"
            register={register}
            error={errors.name?.message}
          />
          <InputInternal
            label="Link da imagem"
            type="text"
            placeholder="Link"
            name="img"
            register={register}
            error={errors.img?.message}
          />

          <DivSelect
            label="Porte"
            placeholder="Selecione porte do animal"
            name="size"
            register={register}
            error={errors.size?.message}
            isForm
          >
            <option value="Pequeno">Pequeno</option>
            <option value="Médio">Médio</option>
            <option value="Grande">Grande</option>
          </DivSelect>

          <DivSelect
            label="Tipo"
            placeholder="Selecione tipo do animal"
            name="species"
            register={register}
            error={errors.species?.message}
            isForm
          >
            <option value="Gato">Gato</option>
            <option value="Cachorro">Cachorro</option>
          </DivSelect>

          <DivSelect
            label="Sexo"
            type="text"
            placeholder="Selecione sexo do animal"
            name="sex"
            register={register}
            error={errors.sex?.message}
            isForm
          >
            <option value="Fêmea">Fêmea</option>
            <option value="Macho">Macho</option>
          </DivSelect>

          <InputTextArea
            cols="30"
            rows="10"
            label="Outras informações"
            placeholder="Conte-nos um pouco mais sobre o seu bichinho."
            name="moreInfo"
            register={register}
            error={errors.moreInfo?.message}
          />

          <S.DivButtons>
            <ButtonOutlined type="button" callback={() => history.goBack()}>
              voltar
            </ButtonOutlined>
            <Button type="submit" orangeSchema>
              Registrar
            </Button>
          </S.DivButtons>
        </S.Form>
        <FooterChat />
      </S.Main>
    </S.GenericContainer>
  );
};

export default DoePet;
