import { supabase } from "./supabase";

const mapDbToFrontend = (row) => {
  if (!row) return row;
  return {
    id: row.id,
    name: row.name,
    moreInfo: row.description || "",
    age: row.age || "",
    species: row.species,
    sex: row.sex,
    size: row.size,
    img: row.image_url || "",
    is_adopted: row.is_adopted,
    userId: row.created_by || null,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
};

const mapFrontendToDb = (data) => {
  if (!data) return data;
  return {
    name: data.name,
    description: data.moreInfo || data.description || "",
    age: data.age || null,
    species: data.species,
    sex: data.sex,
    size: data.size,
    image_url: data.img || data.image_url || null,
    is_adopted: data.is_adopted || false,
    created_by: data.userId || data.created_by || null,
  };
};

/**
 * Busca todos os pets com filtros opcionais
 * @param {Object} filters - { name, sex, species, size, userId }
 * @returns {Promise<Array>} Lista de pets
 */
export const getPets = async (filters = {}) => {
  try {
    let query = supabase.from("animals").select("*");

    // Aplicar filtros se fornecidos
    // Valores já vêm em português do frontend (Pequeno, Médio, Grande, Gato, Cachorro, Fêmea, Macho)
    if (filters.name) {
      query = query.ilike("name", `%${filters.name}%`);
    }
    if (filters.sex) {
      query = query.eq("sex", filters.sex);
    }
    if (filters.species) {
      query = query.eq("species", filters.species);
    }
    if (filters.size) {
      query = query.eq("size", filters.size);
    }
    if (filters.userId) {
      query = query.eq("created_by", filters.userId);
    }
    if (filters.is_adopted !== undefined) {
      query = query.eq("is_adopted", filters.is_adopted);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return (data || []).map(mapDbToFrontend);
  } catch (error) {
    console.error("Erro ao buscar pets:", error);
    throw error;
  }
};

/**
 * Busca um pet específico por ID
 * @param {string|number} petId - ID do pet
 * @returns {Promise<Object>} Dados do pet
 */
export const getPetById = async (petId) => {
  try {
    const { data, error } = await supabase
      .from("animals")
      .select("*")
      .eq("id", petId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return mapDbToFrontend(data);
  } catch (error) {
    console.error("Erro ao buscar pet por ID:", error);
    throw error;
  }
};

/**
 * Cria um novo pet
 * @param {Object} petData - Dados do pet { name, img, moreInfo, species, sex, size, userId }
 * @returns {Promise<Object>} Pet criado
 */
export const createPet = async (petData) => {
  try {
    const dbObj = mapFrontendToDb(petData);
    const { data, error } = await supabase
      .from("animals")
      .insert([dbObj])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return mapDbToFrontend(data);
  } catch (error) {
    console.error("Erro ao criar pet:", error);
    throw error;
  }
};

/**
 * Atualiza um pet existente
 * @param {string|number} petId - ID do pet
 * @param {Object} updateData - Dados a atualizar
 * @returns {Promise<Object>} Pet atualizado
 */
export const updatePet = async (petId, updateData) => {
  try {
    const dbObj = mapFrontendToDb(updateData);
    const { data, error } = await supabase
      .from("animals")
      .update(dbObj)
      .eq("id", petId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return mapDbToFrontend(data);
  } catch (error) {
    console.error("Erro ao atualizar pet:", error);
    throw error;
  }
};

/**
 * Deleta um pet
 * @param {string|number} petId - ID do pet
 * @returns {Promise<void>}
 */
export const deletePet = async (petId) => {
  try {
    const { error } = await supabase.from("animals").delete().eq("id", petId);

    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("Erro ao deletar pet:", error);
    throw error;
  }
};

/**
 * Busca um usuário por ID
 * @param {string|number} userId - ID do usuário
 * @returns {Promise<Object>} Dados do usuário
 */
export const getUserById = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Map profile columns to expected frontend shape
    return {
      id: data.id,
      name: data.full_name || "",
      email: data.email || "",
      phone: data.phone || "",
      avatar: data.avatar_url || "",
      role: data.role || "adotante",
      created_at: data.created_at,
    };
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    throw error;
  }
};

/**
 * Busca pets em destaque (não adotados, limitado)
 * @param {number} limit - Quantidade de resultados
 * @returns {Promise<Array>} Lista de pets em destaque
 */
export const getFeaturedPets = async (limit = 9) => {
  try {
    const { data, error } = await supabase
      .from("animals")
      .select("*")
      .eq("is_adopted", false)
      .limit(limit);

    if (error) {
      throw new Error(error.message);
    }

    return (data || []).map(mapDbToFrontend);
  } catch (error) {
    console.error("Erro ao buscar pets em destaque:", error);
    throw error;
  }
};
