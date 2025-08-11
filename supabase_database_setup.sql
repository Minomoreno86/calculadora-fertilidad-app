-- 🔐 CONFIGURACIÓN DE BASE DE DATOS SUPABASE
-- Script para configurar la autenticación de la Calculadora de Fertilidad

-- 1. CREAR TABLA DE PERFILES DE USUARIO
create table if not exists profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  full_name text,
  avatar_url text,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  constraint profiles_full_name_length check (char_length(full_name) >= 1)
);

-- 2. HABILITAR ROW LEVEL SECURITY
alter table profiles enable row level security;

-- 3. CREAR POLÍTICAS DE SEGURIDAD

-- Política: Los usuarios solo pueden ver su propio perfil
create policy "Users can view own profile" 
  on profiles for select 
  using (auth.uid() = id);

-- Política: Los usuarios solo pueden actualizar su propio perfil
create policy "Users can update own profile" 
  on profiles for update 
  using (auth.uid() = id);

-- Política: Los usuarios pueden insertar su propio perfil
create policy "Users can insert own profile" 
  on profiles for insert 
  with check (auth.uid() = id);

-- 4. FUNCIÓN PARA CREAR PERFIL AUTOMÁTICAMENTE
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id, 
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- 5. TRIGGER PARA EJECUTAR LA FUNCIÓN
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 6. CREAR FUNCIÓN PARA ACTUALIZAR TIMESTAMP
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- 7. TRIGGER PARA ACTUALIZAR TIMESTAMP AUTOMÁTICAMENTE
create trigger handle_profiles_updated_at before update on profiles
  for each row execute procedure public.handle_updated_at();

-- 8. CREAR ÍNDICES PARA PERFORMANCE
create index if not exists profiles_id_idx on profiles(id);
create index if not exists profiles_updated_at_idx on profiles(updated_at);

-- 9. CONFIGURAR AUTENTICACIÓN
-- (Esto se hace en el dashboard de Supabase)
-- - Site URL: exp://localhost:19000 (para desarrollo)
-- - Redirect URLs: exp://localhost:19000, https://tu-dominio.com

-- ✅ CONFIGURACIÓN COMPLETADA
-- Tu base de datos está lista para la aplicación de fertilidad