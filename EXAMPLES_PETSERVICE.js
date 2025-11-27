// ═══════════════════════════════════════════════════════════════════════════════
// EXEMPLOS DE USO - PetService
// ═══════════════════════════════════════════════════════════════════════════════

import {
  getPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
  getUserById,
  getFeaturedPets,
} from "../services/petService";

// ═══════════════════════════════════════════════════════════════════════════════
// 1. BUSCAR PETS COM FILTROS
// ═══════════════════════════════════════════════════════════════════════════════

// Exemplo 1.1: Buscar todos os pets
const allPets = await getPets();

// Exemplo 1.2: Buscar pets por nome
const searchResults = await getPets({ name: "Max" });

// Exemplo 1.3: Buscar pets com múltiplos filtros
const filteredPets = await getPets({
  name: "Rex",
  species: "dog", // 'dog' ou 'cat'
  sex: "m", // 'm' ou 'f'
  size: "large", // 'small', 'medium' ou 'large'
});

// Exemplo 1.4: Buscar pets de um usuário específico
const userPets = await getPets({ userId: "user-id-123" });

// Exemplo 1.5: Buscar pets disponíveis para adoção
const availablePets = await getPets({ is_adopted: false });

// Exemplo 1.6: Combinação de filtros
const userDogs = await getPets({
  userId: "user-id-123",
  species: "dog",
  is_adopted: false,
});

// ═══════════════════════════════════════════════════════════════════════════════
// 2. BUSCAR PET ÚNICO
// ═══════════════════════════════════════════════════════════════════════════════

const pet = await getPetById("pet-id-456");
// Retorna: { id, name, img, moreInfo, species, sex, size, userId, is_adopted, ... }

// ═══════════════════════════════════════════════════════════════════════════════
// 3. CRIAR NOVO PET
// ═══════════════════════════════════════════════════════════════════════════════

const newPet = await createPet({
  name: "Bilu",
  img: "https://example.com/bilu.jpg",
  moreInfo: "Gato muito carinhoso",
  species: "cat", // 'dog' ou 'cat'
  sex: "f", // 'm' ou 'f'
  size: "small", // 'small', 'medium' ou 'large'
  userId: "current-user-id",
});
// Retorna o pet criado com ID

// ═══════════════════════════════════════════════════════════════════════════════
// 4. ATUALIZAR PET
// ═══════════════════════════════════════════════════════════════════════════════

// Exemplo 4.1: Atualizar informações do pet
const updated = await updatePet("pet-id-456", {
  moreInfo: "Novo texto sobre o pet",
  img: "https://example.com/new-image.jpg",
});

// Exemplo 4.2: Marcar como adotado
const adopted = await updatePet("pet-id-456", {
  is_adopted: true,
});

// Exemplo 4.3: Atualizar múltiplos campos
const updated2 = await updatePet("pet-id-456", {
  name: "Novo Nome",
  moreInfo: "Nova descrição",
  img: "https://example.com/image.jpg",
  size: "large",
});

// ═══════════════════════════════════════════════════════════════════════════════
// 5. DELETAR PET
// ═══════════════════════════════════════════════════════════════════════════════

await deletePet("pet-id-456");
// Sem retorno, apenas executa a deleção

// ═══════════════════════════════════════════════════════════════════════════════
// 6. BUSCAR DADOS DO USUÁRIO
// ═══════════════════════════════════════════════════════════════════════════════

const user = await getUserById("user-id-123");
// Retorna: { id, name, email, phone, avatar, type, ... }

// ═══════════════════════════════════════════════════════════════════════════════
// 7. BUSCAR PETS EM DESTAQUE
// ═══════════════════════════════════════════════════════════════════════════════

// Exemplo 7.1: Padrão (9 pets)
const featured = await getFeaturedPets();

// Exemplo 7.2: Com limite customizado
const topPets = await getFeaturedPets(20);

// ═══════════════════════════════════════════════════════════════════════════════
// EXEMPLO COMPLETO: USAR NO COMPONENTE
// ═══════════════════════════════════════════════════════════════════════════════

import { useEffect, useState } from "react";

const MyComponent = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true);
      try {
        // Buscar pets com filtro
        const data = await getPets({
          species: "dog",
          is_adopted: false,
        });
        setPets(data);
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar pets:", err);
        setError(err.message);
        setPets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      {pets.map((pet) => (
        <div key={pet.id}>
          <h3>{pet.name}</h3>
          <img src={pet.img} alt={pet.name} />
          <p>{pet.moreInfo}</p>
        </div>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// TRATAMENTO DE ERROS RECOMENDADO
// ═══════════════════════════════════════════════════════════════════════════════

import { toast } from "react-toastify";

const handleCreatePet = async (petData) => {
  try {
    const newPet = await createPet(petData);
    toast.success("Pet cadastrado com sucesso!");
    return newPet;
  } catch (error) {
    console.error("Erro ao criar pet:", error);
    toast.error("Falha ao cadastrar o pet. Tente novamente.");
    throw error; // Re-throw para tratamento em nível superior
  }
};

const handleDeletePet = async (petId) => {
  try {
    await deletePet(petId);
    toast.success("Pet deletado com sucesso!");
  } catch (error) {
    console.error("Erro ao deletar pet:", error);
    toast.error("Falha ao deletar o pet. Tente novamente.");
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// TIPOS DE DADOS ESPERADOS
// ═══════════════════════════════════════════════════════════════════════════════

/*
PET OBJECT:
{
  id: string,                    // UUID gerado pelo Supabase
  name: string,                  // Nome do pet (obrigatório)
  img: string,                   // URL da imagem (obrigatório)
  moreInfo: string,              // Descrição adicional (obrigatório)
  species: 'dog' | 'cat',        // Espécie (obrigatório)
  sex: 'm' | 'f',                // Sexo (obrigatório)
  size: 'small' | 'medium' | 'large',  // Tamanho (obrigatório)
  userId: string,                // ID do usuário proprietário (obrigatório)
  is_adopted: boolean,           // Status de adoção (default: false)
  created_at: timestamp,         // Data de criação (auto)
  updated_at: timestamp,         // Data de atualização (auto)
}

USER OBJECT:
{
  id: string,                    // UUID gerado pelo Supabase
  name: string,                  // Nome do usuário
  email: string,                 // E-mail único
  phone: string,                 // Telefone
  avatar: string,                // URL do avatar
  type: string,                  // Tipo de usuário (admin, user, etc)
  created_at: timestamp,         // Data de criação
  updated_at: timestamp,         // Data de atualização
}

FILTROS ACEITOS:
{
  name?: string,                 // Busca parcial (case-insensitive)
  sex?: 'm' | 'f',
  species?: 'dog' | 'cat',
  size?: 'small' | 'medium' | 'large',
  userId?: string,
  is_adopted?: boolean,
}
*/

export default MyComponent;
