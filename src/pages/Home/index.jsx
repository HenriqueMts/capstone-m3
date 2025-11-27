import { useEffect, useState } from "react";
import { getFeaturedPets } from "../../services/petService";

import Footer from "../../components/Footer";
import ListCard from "../../components/ListCard";

import SectionHomePart1 from "../../components/section-Home-Part1";
import SectionHomePart2 from "../../components/section-Home-Part2";
import SectionHomePart3 from "../../components/section-Home-Part3";
import SectionHomePart5 from "../../components/section-Home-Part5";

import { ContainerListPets, Main } from "./styles";

const Home = () => {
  const [listPet, setlistPet] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getListPets();
  }, []);

  const getListPets = async () => {
    setLoading(true);
    try {
      const pets = await getFeaturedPets(9);
      setlistPet(pets || []);
    } catch (error) {
      console.error("Erro ao buscar animais em destaque:", error);
      setlistPet([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Main>
      <SectionHomePart1 />
      <SectionHomePart2 />
      <SectionHomePart3 />

      {!loading && listPet && listPet.length > 0 && (
        <ContainerListPets>
          <h2>Animais em Destaque</h2>
          <div>
            <ListCard listPets={listPet} />
          </div>
        </ContainerListPets>
      )}
      <SectionHomePart5 />
      <Footer />
    </Main>
  );
};

export default Home;
