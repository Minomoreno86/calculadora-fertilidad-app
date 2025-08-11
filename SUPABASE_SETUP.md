# 🚀 CONFIGURACIÓN SUPABASE - GUÍA COMPLETA

## 📋 PASOS PARA CONFIGURAR SUPABASE

### **PASO 1: Crear Proyecto Supabase**

1. Ve a [https://supabase.com](https://supabase.com)
2. Haz clic en "Start your project"
3. Crea una cuenta (gratis)
4. Clic en "New Project"
5. Completa:
   - **Name:** calculadora-fertilidad
   - **Database Password:** (guarda esta contraseña)
   - **Region:** South America (para mejor latencia)
6. Espera 2-3 minutos mientras se crea

### **PASO 2: Obtener Credenciales**

1. En tu proyecto, ve a **Settings** > **API**
2. Copia estos valores:
   - **Project URL:** `https://tu-proyecto-id.supabase.co`
   - **anon public key:** `eyJhbGciOiJIUzI1NiIsInR5cCI...`

### **PASO 3: Configurar Variables de Entorno**

1. Crea un archivo `.env` en la raíz del proyecto:

```bash
# .env
EXPO_PUBLIC_SUPABASE_URL=https://tu-proyecto-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu-clave-publica-aqui
```

2. Actualiza `src/config/supabase.ts` con tus credenciales reales

### **PASO 4: Configurar Base de Datos**

1. Ve a **SQL Editor** en Supabase
2. Ejecuta este SQL para crear la tabla de perfiles:

```sql
-- Crear tabla de perfiles de usuario
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  full_name text,
  avatar_url text,
  phone text,
  
  constraint profiles_full_name_length check (char_length(full_name) >= 3)
);

-- Habilitar Row Level Security
alter table profiles enable row level security;

-- Política: Los usuarios solo pueden ver y editar su propio perfil
create policy "Users can view own profile" 
  on profiles for select 
  using (auth.uid() = id);

create policy "Users can update own profile" 
  on profiles for update 
  using (auth.uid() = id);

-- Función para crear perfil automáticamente al registrarse
create function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger para ejecutar la función
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### **PASO 5: Configurar Autenticación**

1. Ve a **Authentication** > **Settings**
2. Configura:
   - **Site URL:** `https://tu-dominio.com` (o `exp://localhost:19000` para desarrollo)
   - **Redirect URLs:** Agrega tu URL de desarrollo
3. En **Email Templates**, personaliza los mensajes (opcional)

### **PASO 6: Configurar Políticas de Seguridad**

1. Ve a **Authentication** > **Policies**
2. Las políticas ya están configuradas con el SQL anterior
3. Verifica que RLS esté habilitado

### **PASO 7: Configurar "Sign in with Apple" (iOS)**

> Si ya implementaste el botón en la app pero aparece el error `Provider (issuer https://appleid.apple.com) is not enabled`, completa estos pasos.

#### 7.1. Preparar Identificadores en Apple Developer
1. Entra a https://developer.apple.com/account
2. Menú **Certificates, IDs & Profiles** > **Identifiers**
3. Crea (o verifica) un **App ID** (Type: App) con tu `Bundle ID` exacto (ej: `com.tuempresa.calculadora`)
   - Marca la capability **Sign in with Apple**
4. Crea un **Service ID** (Type: Services) para OAuth web (ej: `com.tuempresa.calculadora.web`)
   - Tras crearlo, ábrelo y en "Sign in with Apple" pulsa **Configure**
   - Agrega tu dominio (puede ser temporal) y en Return URLs escribe la URL de redirect de Supabase (copiarás en el paso 7.2); puedes añadir una provisional y editar luego
5. Crea una **Key**: **Keys** > "+" > Nombre (ej: `AuthKeyCalculadora`), marca **Sign in with Apple**, selecciona tu **App ID principal** y confirma.
   - Descarga el archivo `.p8` inmediatamente (solo una vez)

#### 7.2. Obtener Datos Necesarios
Desde Apple Developer reúne:
- Team ID: Lo ves en la parte superior (ej: `9A1B2C3D4E`)
- Key ID: El identificador de la key creada (ej: `AB12CD34`)
- Private Key: Contenido del `.p8` (sin espacios extra). Conservar seguro.
- Client ID: Usa el **Service ID** (ej: `com.tuempresa.calculadora.web`)
- Bundle ID: El del App ID (ej: `com.tuempresa.calculadora`)

#### 7.3. Configurar Provider Apple en Supabase
1. En tu proyecto Supabase ve a **Authentication** > **Providers**
2. Activa **Apple**
3. Completa campos:
   - Client ID: (Service ID)
   - Key ID
   - Private Key: Pega el contenido completo (incluyendo `-----BEGIN PRIVATE KEY-----` ... `-----END PRIVATE KEY-----`)
   - Team ID
4. Guarda. Debe mostrar el provider como **Enabled**.
5. Copia la **Redirect URL** que muestra Supabase para Apple y regresa a Apple Developer > Service ID > Configure y agregala en Return URLs si no lo hiciste.

#### 7.4. Configurar el Proyecto Expo / React Native
1. En `app.json` (o `app.config.js`) verifica:
```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.tuempresa.calculadora",
      "usesAppleSignIn": true
    }
  }
}
```
2. Si no habías hecho prebuild: `npx expo prebuild ios` (solo si usas config nativa / EAS Build)
3. Abre Xcode: `open ios/*.xcworkspace`
4. En el target principal > Signing & Capabilities confirma **Sign in with Apple** activo.

#### 7.5. Implementación en Código (Resumen ya hecho)
- Botón nativo con `expo-apple-authentication`
- Lógica `loginWithApple` en `AuthService` llamando `supabase.auth.signInWithIdToken({ provider: 'apple', id_token, nonce })`

#### 7.6. Pruebas
1. Usa un dispositivo físico (el simulador a veces devuelve `identityToken` null)
2. Inicia sesión con un Apple ID real
3. Verifica que el usuario aparezca en **Authentication > Users**
4. Confirma que se crea/actualiza el perfil

#### 7.7. (Opcional) Nonce Hashing
Para mayor seguridad puedes enviar `nonce` y `hashedNonce` (SHA256) al flujo; actualmente se usa nonce simple.

#### 7.8. Rotación / Seguridad
- Si comprometes la key, revoca la key en Apple Developer y crea otra
- Actualiza Supabase con la nueva Key ID y Private Key

## 🔒 SEGURIDAD CONFIGURADA

✅ **Row Level Security (RLS)** habilitado
✅ **Políticas de acceso** configuradas
✅ **Encriptación** automática de contraseñas
✅ **Rate limiting** en servidor
✅ **Tokens JWT** seguros
✅ **Almacenamiento seguro** en dispositivo

## 🧪 PROBAR LA CONFIGURACIÓN

1. Ejecuta la app: `npm start`
2. Ve a la pantalla de registro
3. Crea una cuenta de prueba
4. Verifica que aparezca en **Authentication** > **Users**
5. Verifica que se cree el perfil en **Table Editor** > **profiles**

## ❗ IMPORTANTE

- **NUNCA** compartas tu `service_role` key
- La `anon` key es segura para el frontend
- Configura correctamente las URLs de redirect
- Habilita 2FA en tu cuenta de Supabase para producción

## 🆘 SOLUCIÓN DE PROBLEMAS

**Error: "Invalid API key"**
- Verifica que copiaste correctamente la anon key
- Asegúrate de que el proyecto esté activo

**Error: "Cross-origin request blocked"**
- Configura correctamente la Site URL en Supabase
- Verifica las Redirect URLs

**Error: "Row Level Security policy violation"**
- Verifica que ejecutaste el SQL de políticas
- Revisa que RLS esté habilitado

**Error: "Provider (issuer https://appleid.apple.com) is not enabled"**
- Asegúrate de haber activado Apple en Supabase (Providers > Apple > Enabled)
- Verifica que los campos Team ID / Key ID / Client ID / Private Key estén correctos
- Confirma que el Service ID tiene configurada la Return URL de Supabase
- Espera unos minutos y vuelve a probar (propagación)

**identityToken null en iOS Simulator**
- Prueba en dispositivo físico
- Cierra sesión de iCloud en el simulador y vuelve a iniciar

**invalid_client / invalid_grant**
- Client ID (Service ID) no coincide con el configurado en Apple Developer
- Private Key sin headers o con espacios extra

**Error: "Provider not enabled" tras haberlo habilitado**
- Limpia caché de la app: reinstala
- Verifica que estás apuntando al proyecto correcto (URL y anon key)

## 📞 SOPORTE

Si tienes problemas:
1. Revisa la documentación: [https://supabase.com/docs](https://supabase.com/docs)
2. Discord de Supabase: [https://discord.supabase.com](https://discord.supabase.com)
3. GitHub Issues: [https://github.com/supabase/supabase/issues](https://github.com/supabase/supabase/issues)

¡Tu sistema de autenticación estará listo en menos de 30 minutos! 🚀