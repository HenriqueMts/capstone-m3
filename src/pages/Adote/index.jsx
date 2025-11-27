import { useEffect, useState } from "react";

import DivSelect from "../../components/DivSelect";
import ListCard from "../../components/ListCard";
import FooterChat from "../../components/footer-Chat";

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

const Adote = () => {
  const [loading, setLoading] = useState(true);
  const [sex, setSex] = useState("");
  const [species, setSpecies] = useState("");
  const [size, setSizes] = useState("");
  const [name, setName] = useState("");
  const [listpets, setListpets] = useState([]);

  const filters = async () => {
    setLoading(true);
    try {
      const filtersObj = {
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

      console.log("Adote - Filtros enviados:", filtersObj);
      const pets = await getPets(filtersObj);
      console.log("Adote - Pets recebidos:", pets);
      setListpets(pets);
    } catch (error) {
      console.error("Erro ao buscar pets:", error);
      setListpets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    filters();
  }, [sex, name, size, species]);
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
          {loading ? (
            <div>
              <ChakraProvider>
                <Spinner w="200px" h="200px" color="var(--color-first)" />
              </ChakraProvider>
            </div>
          ) : listpets.length > 0 ? (
            <ListCard listPets={listpets} isAdote />
          ) : (
            <div>
              <img src={petSad} alt="pet triste" />
              <h2>
                Não encontramos nenhum pet para adoção que atenda aos filtros
                selecionados.
              </h2>
            </div>
          )}
        </ContentList>
      </ContentTotal>
      <FooterChat />
    </Container>
  );
};

export default Adote;
