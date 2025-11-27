import { useContext, useEffect } from "react";
import { useState } from "react";

import { useParams, useHistory } from "react-router-dom";

import { UserContext } from "../../providers/User";

import { getPetById, getUserById } from "../../services/petService";

import defaultImg from "../../assets/proprietario-default-img.svg";

import ButtonOutlined from "../../components/ButtonOutlined";
import Button from "../../components/Button";
import WantAdopt from "../../components/AdoptModal";
import FooterChat from "../../components/footer-Chat";

import * as S from "./styles";

const PagePet = () => {
  const [dataPet, setDataPet] = useState({});
  const [dataOwner, setDataOwner] = useState({});
  const [openModal, setOpenModal] = useState(false);

  const params = useParams();
  const history = useHistory();

  const { userData } = useContext(UserContext);

  const getAnimalById = async (id) => {
    try {
      const pet = await getPetById(id);
      setDataPet(pet);
    } catch (error) {
      console.error("Erro ao buscar pet:", error);
    }
  };

  const getOwnerData = async (userId) => {
    try {
      const owner = await getUserById(userId);
      setDataOwner(owner);
    } catch (error) {
      console.error("Erro ao buscar proprietário:", error);
    }
  };

  const showModal = (data) => {
    setOpenModal(true);
  };

  const hideModal = () => {
    setOpenModal(false);
  };

  const wantToAdopt = () => {
    if (userData?.id) {
      showModal();
    } else {
      history.push("/login");
    }
  };

  useEffect(() => {
    getAnimalById(params.id);
  }, [params.id]);

  useEffect(() => {
    if (dataPet.userId) getOwnerData(dataPet.userId);
  }, [dataPet.userId]);

  return (
    <S.GenericContainer>
      <S.Main>
        <S.Figcaption>
          <img src={dataPet.img} alt="" />
        </S.Figcaption>

        <S.DivMoreImgs>
          <img src={dataPet.img} alt="" />
          <img src={dataPet.img} alt="" />
          <img src={dataPet.img} alt="" />
          <img src={dataPet.img} alt="" />
        </S.DivMoreImgs>

        <S.DivInfoPet>
          <h1>{dataPet.name}</h1>

          <S.DivInfoUser>
            <img src={dataOwner.avatar || defaultImg} alt="" />
            <div>
              <h5>{dataOwner.name}</h5>
              <h6>proprietário</h6>
            </div>
          </S.DivInfoUser>

          <h2>{dataPet.sex === "m" ? "Macho" : "Fêmea"}</h2>

          <h2>
            {dataPet.size === "small"
              ? "Pequeno"
              : dataPet.size === "medium"
              ? "Médio"
              : "Grande"}
          </h2>

          <span>{dataPet.moreInfo}</span>
        </S.DivInfoPet>

        <WantAdopt
          dataOwner={dataOwner}
          handleClose={hideModal}
          show={openModal}
        />

        <S.DivButtons>
          <ButtonOutlined callback={() => history.goBack()}>
            voltar
          </ButtonOutlined>
          {dataPet.userId && userData?.id && dataPet.userId === userData.id && (
            <ButtonOutlined
              callback={() => history.push(`/user/pet/${dataPet.id}`)}
            >
              Editar Pet
            </ButtonOutlined>
          )}
          <Button onClick={wantToAdopt} orangeSchema>
            Quero Adotar
          </Button>
        </S.DivButtons>

        <FooterChat />
      </S.Main>
    </S.GenericContainer>
  );
};

export default PagePet;
