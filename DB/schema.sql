
-- ⚠️ SEÇÃO DE LIMPEZA (Descomente apenas se quiser resetar TUDO do zero)
-- drop trigger if exists on_auth_user_created on auth.users;
-- drop function if exists public.handle_new_user();
-- drop table if exists public.animals;
-- drop table if exists public.profiles;

-- =============================================
-- 1. TABELA DE PERFIS (PROFILES)
-- =============================================
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  email text, -- Cópia para facilitar leitura
  phone text,
  avatar_url text,
  role text check (role in ('adotante', 'ong', 'admin')) default 'adotante',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Segurança (RLS)
alter table public.profiles enable row level security;

create policy "Perfis são visíveis publicamente" 
  on public.profiles for select using (true);

create policy "Usuários podem editar seus próprios perfis" 
  on public.profiles for update using (auth.uid() = id);

-- =============================================
-- 2. TABELA DE ANIMAIS (ANIMALS)
-- =============================================
create table if not exists public.animals (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  age text,
  
  -- Constraints (Regras de Integridade)
  species text check (species in ('Cachorro', 'Gato', 'Outros')) not null,
  size text check (size in ('Pequeno', 'Médio', 'Grande')),
  sex text check (sex in ('Macho', 'Fêmea')) not null, -- Nova coluna obrigatória
  
  image_url text,
  is_adopted boolean default false not null,
  
  -- Relacionamentos (Com ON DELETE CASCADE)
  -- Se o dono for deletado, os animais também são (evita orfãos)
  created_by uuid references public.profiles(id) on delete cascade,
  adopted_by uuid references public.profiles(id),
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexação (Performance para filtros)
create index if not exists animals_species_idx on public.animals (species);
create index if not exists animals_sex_idx on public.animals (sex);
create index if not exists animals_is_adopted_idx on public.animals (is_adopted);

-- Segurança (RLS)
alter table public.animals enable row level security;

create policy "Qualquer um pode ver animais"
  on public.animals for select
  to public
  using (true);

create policy "Apenas logados podem criar animais"
  on public.animals for insert
  to authenticated
  with check (true);

create policy "Dono pode editar seu animal"
  on public.animals for update
  using (auth.uid() = created_by);

create policy "Dono pode deletar seu animal"
  on public.animals for delete
  using (auth.uid() = created_by);

-- =============================================
-- 3. AUTOMAÇÃO (TRIGGER DE CADASTRO)
-- Copia dados do Auth para tabela Profiles automaticamente
-- =============================================
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role, phone, email, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    coalesce(new.raw_user_meta_data->>'role', 'adotante'),
    new.raw_user_meta_data->>'phone',
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Cria o gatilho na tabela de sistema do Supabase
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =============================================
-- 4. SEED INTELIGENTE (POVOAMENTO)
-- Verifica se existe usuário e popula a tabela com dados atualizados
-- =============================================
DO $$
DECLARE
    v_owner_id uuid;
BEGIN
    SELECT id INTO v_owner_id FROM public.profiles LIMIT 1;

    IF v_owner_id IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM public.animals) THEN
            INSERT INTO public.animals (name, description, age, species, size, sex, image_url, created_by)
            VALUES
            ('Thor', 'Um gigante gentil. Adora correr e precisa de quintal grande.', '3 anos', 'Cachorro', 'Grande', 'Macho', 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=500&q=80', v_owner_id),
            ('Luna', 'Gatinha misteriosa e elegante. Gosta de janela.', '2 anos', 'Gato', 'Pequeno', 'Fêmea', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=500&q=80', v_owner_id),
            ('Paçoca', 'O famoso Paçoca! Brincalhão, adora crianças.', '1 ano', 'Cachorro', 'Médio', 'Macho', 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=500&q=80', v_owner_id),
            ('Belinha', 'Ideal para companhia de idosos.', '8 anos', 'Cachorro', 'Pequeno', 'Fêmea', 'https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?auto=format&fit=crop&w=500&q=80', v_owner_id),
            ('Simba', 'Rei da casa. Gosta de lugares altos.', '4 anos', 'Gato', 'Grande', 'Macho', 'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&w=500&q=80', v_owner_id),
            ('Maya', 'Um pouco tímida, mas muito carinhosa.', '6 meses', 'Gato', 'Pequeno', 'Fêmea', 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=500&q=80', v_owner_id),
            ('Bob', 'Cão de guarda e melhor amigo.', '5 anos', 'Cachorro', 'Grande', 'Macho', 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=500&q=80', v_owner_id),
            ('Amora', 'Filhote cheia de energia.', '3 meses', 'Cachorro', 'Pequeno', 'Fêmea', 'https://images.unsplash.com/photo-1591160690555-5debfba289f0?auto=format&fit=crop&w=500&q=80', v_owner_id);
        END IF;
    END IF;
END $$;