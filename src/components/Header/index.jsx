import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import { getUserById } from "../../services/petService";

import Logo from "../../assets/Logo.svg";
import HomeIcon from "../../assets/HomeIcon.svg";
import SortIcon from "../../assets/SortIcon.svg";
import AddIcon from "../../assets/AddIcon.svg";
import GiftIcon from "../../assets/GiftIcon.svg";
import defaultImg from "../../assets/proprietario-default-img.svg";

import Button from "../Button";

import { Container, Content, DivInfoUser, ExternalContainer } from "./styles";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../providers/User";
import { useAuth } from "../../providers/AuthProvider";

const Header = () => {
  const history = useHistory();

  const [handleButton, setHandleButton] = useState(false);

  // Usar o user do AuthProvider (sempre sincronizado com Supabase)
  const { user: authUser, logout } = useAuth();

  const { userData, updateUserData } = useContext(UserContext);

  const buttonClick = () => {
    setHandleButton(!handleButton);
  };

  const closeMenu = () => {
    setHandleButton(false);
  };

  const goToLogin = () => {
    closeMenu();
    history.push("/login");
  };

  const loggoutAndGoToHome = async () => {
    try {
      await logout(); // Logout real via Supabase
      updateUserData({}); // Limpar dados do usuário no contexto
      localStorage.clear();
      history.push("/");
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
    }
  };

  const handleGetUserData = async (id) => {
    try {
      // Priorizar dados da metadata do auth (salvos no signup)
      // Esses dados SEMPRE existem se o cadastro foi feito
      if (authUser?.user_metadata?.full_name) {
        const userData = {
          id: authUser.id,
          name: authUser.user_metadata.full_name,
          email: authUser.email,
          phone: authUser.user_metadata.phone || "",
          avatar: authUser.user_metadata.avatar_url || "",
          role: authUser.user_metadata.role || "adotante",
        };
        updateUserData(userData);
      } else {
        // Fallback: se não houver full_name na metadata, tentar buscar de profiles
        const userData = await getUserById(id);
        updateUserData(userData);
      }
    } catch (err) {
      console.error("Erro ao buscar dados do usuário:", err);
      // Último fallback: criar userData com email ao menos
      if (authUser?.email) {
        updateUserData({
          id: authUser.id,
          name: authUser.email,
          email: authUser.email,
        });
      }
    }
  };

  // Quando authUser muda (login/logout), buscar dados do perfil
  useEffect(() => {
    if (authUser?.id) {
      handleGetUserData(authUser.id);
    } else {
      updateUserData({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser?.id]);

  return (
    <ExternalContainer>
      <Container>
        <Link className="logo--content" to="/" onClick={closeMenu}>
          <img src={Logo} alt="Logo" />
        </Link>

        <Content handleButton={handleButton}>
          <ul>
            <li>
              <Link to="/" onClick={closeMenu}>
                <img src={HomeIcon} alt="Home" /> Início
              </Link>
            </li>
            <li>
              <Link to="/adote" onClick={closeMenu}>
                <img src={AddIcon} alt="Add" /> Adote um Pet
              </Link>
            </li>
            <li>
              <Link
                to={authUser?.id ? "/user/pets" : "/login"}
                onClick={closeMenu}
              >
                <img src={SortIcon} alt="Sort" /> Doe um Pet
              </Link>
            </li>
            <li>
              <Link to="/contribua" onClick={closeMenu}>
                <img src={GiftIcon} alt="Gift" />
                Contribua
              </Link>
            </li>
            {userData?.id ? (
              <DivInfoUser>
                <img src={userData.avatar || defaultImg} alt="" />
                <div>
                  <h5>{userData.name || "undefined"}</h5>
                  <h6>perfil</h6>
                </div>
                <button onClick={loggoutAndGoToHome}>SAIR</button>
              </DivInfoUser>
            ) : (
              <Button isLogged onClick={goToLogin}>
                Entrar
              </Button>
            )}
          </ul>
        </Content>

        <button
          id="burger"
          className={handleButton ? "burger active" : "burger "}
          onClick={() => buttonClick()}
        >
          <span className="btn--burger"></span>
        </button>
      </Container>
    </ExternalContainer>
  );
};
export default Header;
