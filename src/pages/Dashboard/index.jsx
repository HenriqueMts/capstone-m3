import { useEffect, useState, useCallback } from "react";

import DivSelect from "../../components/DivSelect";
import ButtonComponent from "../../components/Button";

import { getPets } from "../../services/petService";

import { Container, ContentTotal, ContentFiltro, ContentList } from "./styles";
import iconFilter from "../../assets/filterIcon.svg";
import petSad from "../../assets/sadDog.jpeg";

import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  Button,
  ChakraProvider,
  Spinner,
} from "@chakra-ui/react";
import InputSeach from "../../components/inputSeach";
import ListCardDashboard from "../../components/ListCardDashboard";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [sex, setSex] = useState("");
  const [species, setSpecies] = useState("");
  const [size, setSizes] = useState("");
  const [name, setName] = useState("");
  const [listpets, setListpets] = useState([]);

  const history = useHistory();
  const { user: authUser } = useAuth();

  // Redirecionar se não estiver logado
  useEffect(() => {
    if (!authUser?.id) {
      history.push("/login");
    }
  }, [authUser?.id, history]);

  const filters = useCallback(async () => {
    setLoading(true);
    try {
      const filtersObj = {
        userId: authUser?.id,
        name: name || undefined,
        sex: sex || undefined,
        species: species || undefined,
        size: size || undefined,
      };

      // Remove undefined values
      Object.keys(filtersObj).forEach((key) => {
        if (filtersObj[key] === undefined) {
          delete filtersObj[key];
        }
      });

      const pets = await getPets(filtersObj);
      setListpets(pets);
    } catch (error) {
      console.error("Erro ao buscar pets:", error);
      setListpets([]);
    } finally {
      setLoading(false);
    }
  }, [authUser?.id, name, sex, species, size]);

  useEffect(() => {
    if (authUser?.id) {
      filters();
    }
  }, [authUser?.id, filters]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const resetFilter = () => {
    onOpen();
    setName("");
    setSex("");
    setSizes("");
    setSpecies("");
  };

  return (
    <Container>
      <ContentTotal>
        <ContentFiltro>
          <div>
            <h2>
              <img src={iconFilter} alt="icon filter" /> Pesquisar por filtro
            </h2>
            <InputSeach setName={setName} />
            <DivSelect
              label="PORTE"
              placeholder="qualquer"
              name="size="
              error={""}
              setSelect={setSizes}
            >
              <option value="Pequeno">Pequeno</option>
              <option value="Médio">Médio</option>
              <option value="Grande">Grande</option>
            </DivSelect>

            <DivSelect
              label="ESPECIE"
              placeholder="qualquer"
              name="species="
              error={""}
              setSelect={setSpecies}
            >
              <option value="Gato">Gato</option>
              <option value="Cachorro">Cachorro</option>
            </DivSelect>

            <DivSelect
              label="SEXO"
              type="text"
              placeholder="qualquer"
              name="sex="
              error={""}
              setSelect={setSex}
            >
              <option value="Fêmea">Fêmea</option>
              <option value="Macho">Macho</option>
            </DivSelect>
          </div>

          <button onClick={() => resetFilter()}>
            <img src={iconFilter} alt="icon filter" /> Pesquisar por filtro
          </button>
          <ChakraProvider>
            <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
              <DrawerOverlay />
              <DrawerContent bgColor="var(--color-second)">
                <DrawerHeader
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-around"
                  color="var(--color-first)"
                  fontWeight="600"
                  fontSize="1.4rem"
                  borderBottomWidth="1px"
                  pb="10px"
                  pt="10px"
                >
                  <img src={iconFilter} alt="icon filter" /> Pesquisar por
                  Filtro
                </DrawerHeader>

                <DrawerBody
                  display="flex"
                  flexDirection="column"
                  w="100%"
                  pl="15px"
                >
                  <div>
                    <InputSeach setName={setName} />
                    <DivSelect
                      label="PORTE"
                      placeholder="qualquer"
                      name="size="
                      error={""}
                      setSelect={setSizes}
                    >
                      <option value="Pequeno">Pequeno</option>
                      <option value="Médio">Médio</option>
                      <option value="Grande">Grande</option>
                    </DivSelect>

                    <DivSelect
                      label="ESPECIE"
                      placeholder="qualquer"
                      name="species="
                      error={""}
                      setSelect={setSpecies}
                    >
                      <option value="Gato">Gato</option>
                      <option value="Cachorro">Cachorro</option>
                    </DivSelect>

                    <DivSelect
                      label="SEXO"
                      type="text"
                      placeholder="qualquer"
                      name="sex="
                      error={""}
                      setSelect={setSex}
                    >
                      <option value="Fêmea">Fêmea</option>
                      <option value="Macho">Macho</option>
                    </DivSelect>
                  </div>
                </DrawerBody>

                <DrawerFooter>
                  <Button
                    variant="solid"
                    mr={3}
                    size="lg"
                    color="#ffffff"
                    bg="var(--color-first)"
                    onClick={onClose}
                  >
                    Voltar
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </ChakraProvider>
        </ContentFiltro>
        <ContentList>
          <div className="new-pet">
            <h1>Meus Pets</h1>
            <ButtonComponent
              orangeSchema
              onClick={() => history.push("/user/doe")}
            >
              Cadastrar Pet
            </ButtonComponent>
          </div>
          {loading ? (
            <div>
              <ChakraProvider>
                <Spinner w="200px" h="200px" color="var(--color-first)" />
              </ChakraProvider>
            </div>
          ) : listpets.length > 0 ? (
            <ListCardDashboard listPets={listpets} isAdote />
          ) : (
            <div className="pet-not-found">
              <img src={petSad} alt="pet triste" />
              <h2>Você ainda não cadastrou nenhum pet.</h2>
            </div>
          )}
        </ContentList>
      </ContentTotal>
    </Container>
  );
};

export default Dashboard;
