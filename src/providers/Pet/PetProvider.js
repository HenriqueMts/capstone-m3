import { createContext, useContext, useState } from "react";
import { useAuth } from "../User/AuthProvider";
import { getPets as fetchPets } from "../../services/petService";

export const PetContext = createContext({});

export const PetProvider = ({ children }) => {
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);

  const getPets = async ({ name, sex, species, size } = {}) => {
    setLoading(true);
    try {
      const filters = {
        name,
        sex,
        species,
        size,
        userId: user?.id,
      };
      const data = await fetchPets(filters);
      setPets(data);
    } catch (err) {
      console.error("Error fetching pets:", err);
      setPets([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PetContext.Provider value={{ pets, loading, getPets }}>
      {children}
    </PetContext.Provider>
  );
};

export const usePet = () => useContext(PetContext);
