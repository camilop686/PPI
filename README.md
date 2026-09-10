# Métodos fiables para la prevención de virus

Aplicación web educativa para aprender y consultar métodos fiables para prevenir virus y otras amenazas informáticas. También permite participar en una comunidad y, según el rol, administrar el contenido de la plataforma.

## 🖼️ Capturas de pantalla

Aquí se pueden agregar capturas de las principales pantallas de la aplicación, como el inicio de sesión, catálogo de métodos, amenazas, comunidad y panel de administración.

## ⚙️ Tecnologías usadas

- React
- Vite
- React Router
- Supabase Auth
- Supabase Database (PostgreSQL)
- Supabase Storage
- `@supabase/supabase-js`
- `lucide-react`
- ESLint

## 🚀 Instalación y ejecución

Para ejecutar el proyecto desde cero:

```bash
git clone https://github.com/camilop686/PPI.git
cd PPI
npm install
npm run dev
```

Para revisar que el proyecto compile correctamente:

```bash
npm run lint
npm run build
```

Si quieres ver la versión de producción localmente:

```bash
npm run preview
```

## 🔑 Variables de entorno

El proyecto necesita las credenciales públicas de Supabase para conectarse a la base de datos.

Crea un archivo `.env` en la raíz del proyecto. Puedes tomar como referencia `.env.example`.

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-publica-anon
```

No coloques claves reales dentro del README ni las subas al repositorio. La clave `service_role` nunca debe utilizarse en el frontend.

## 📁 Estructura del proyecto

```text
PPI/
├── src/
│   ├── components/        # Componentes reutilizables de React
│   ├── lib/
│   │   └── supabase.js    # Conexión con Supabase
│   ├── App.jsx            # Rutas y funcionamiento principal
│   ├── App.css            # Estilos principales
│   ├── index.css          # Estilos generales
│   └── main.jsx           # Punto de entrada de React
├── supabase/
│   ├── schema.sql         # Tablas, políticas RLS y datos iniciales
│   └── migrations/        # Cambios y funciones de la base de datos
├── docs/                  # Documentación adicional del proyecto
├── .env.example           # Ejemplo de variables de entorno
├── package.json           # Dependencias y comandos del proyecto
├── STORAGE_SETUP.md       # Configuración de Supabase Storage
└── README.md              # Documentación principal
```

## ✨ Funcionalidades

### 👤 Usuario

- [x] Registro e inicio de sesión
- [x] Recuperación de contraseña
- [x] Persistencia de sesión
- [x] Edición del perfil
- [x] Cambio de foto de perfil
- [x] Cierre de sesión

### 🛡️ Prevención de virus

- [x] Catálogo de métodos de prevención
- [x] Información y recomendaciones para cada método
- [x] Búsqueda y filtrado de contenido
- [x] Catálogo de amenazas informáticas
- [x] Información sobre cómo se propagan y cómo prevenirlas

### 💬 Comunidad

- [x] Publicación de contenido
- [x] Respuestas en publicaciones
- [x] Categorías para organizar las publicaciones
- [x] Moderación de contenido
- [x] Imágenes en publicaciones y respuestas

### ⚙️ Administrador

- [x] Panel de administración protegido
- [x] Gestión de métodos de prevención
- [x] Gestión de amenazas
- [x] Moderación de publicaciones y respuestas
- [x] Gestión de permisos mediante roles

## 👥 Autores

- Juan Camilo Pineda Cortes
- Ronald Steven Zapata

## 📄 Licencia

Proyecto realizado con fines académicos.

---

**PPI — Métodos fiables para la prevención de virus**
