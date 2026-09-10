# 🛡️ Métodos fiables para la prevención de virus

Aplicación web educativa para aprender a prevenir virus y otras amenazas informáticas. El proyecto está dirigido a personas que desean consultar buenas prácticas de seguridad digital, explorar amenazas, participar en una comunidad y, según su rol, administrar el contenido educativo.

Su propósito es reunir información práctica sobre protección de cuentas, datos y dispositivos en una interfaz con autenticación. No trata sobre virus médicos ni enfermedades.

## 📸 Capturas de pantalla

No se encontraron capturas de la interfaz funcional en el repositorio. Los archivos gráficos existentes corresponden al logotipo y a diagramas o material académico. Para completar esta sección se deberían agregar capturas reales de:

- Inicio de sesión y registro
- Inicio
- Catálogo de métodos de prevención
- Catálogo de amenazas
- Comunidad y detalle de una publicación
- Perfil
- Centro de control administrativo

## ✨ Funcionalidades

### 👤 Usuario

- Registro mediante Supabase Auth con nombre, correo y contraseña.
- Inicio y cierre de sesión.
- Recuperación de contraseña mediante correo electrónico.
- Persistencia de sesión en el cliente y carga del perfil asociado.
- Edición del nombre del perfil y visualización del correo.
- Cambio de foto de perfil mediante Supabase Storage.
- Redirección de rutas protegidas al acceso cuando no existe una sesión.

### 🛡️ Métodos de prevención

El catálogo se consulta desde la tabla `prevention_methods`. Cada registro puede mostrar nombre, nivel de riesgo, descripción, recomendaciones, ejemplos y acciones sugeridas. La vista incorpora búsqueda sobre los datos cargados.

### 🦠 Amenazas informáticas

El catálogo se consulta desde `threats` y muestra nombre, categoría, descripción, forma de propagación y prevención. También dispone de búsqueda sobre el contenido cargado.

### 💬 Comunidad

- Creación de publicaciones con título, contenido y una de cuatro categorías: `General`, `Prevención`, `Amenazas` o `Ayuda técnica`.
- Búsqueda de publicaciones por título o contenido.
- Vista de detalle y respuestas.
- Imágenes opcionales en publicaciones y respuestas.
- Conteo de respuestas y visualización del perfil del autor.
- Restricciones de longitud y validación de tipo y tamaño de imagen en el frontend.
- Publicación inmediata en el estado final definido por la migración `004-forum-social-immediate.sql`.
- Posibilidad de bloquear respuestas a una publicación desde la base de datos; la interfaz de usuario no ofrece un control para bloquearla.

La migración `002-forum.sql` define estados y políticas de moderación, pero la migración `004` cambia las nuevas publicaciones y respuestas a `approved` y permite su lectura inmediata. El centro administrativo conserva acciones para revisar y eliminar contenido. No hay una función de reporte visible para usuarios.

### 👨‍💻 Administrador

El panel `/admin` está disponible para perfiles con `role = 'admin'` y permite:

- Crear, editar y eliminar métodos de prevención.
- Crear, editar y eliminar amenazas.
- Consultar y eliminar registros de `comments`.
- Revisar publicaciones y respuestas del foro, aprobarlas o eliminarlas.

El repositorio no implementa un listado o panel de gestión de usuarios, estadísticas ni gráficos administrativos. Sí existe una función SQL para cambiar roles (`admin_set_role`), pero no un formulario de cambio de roles en la interfaz actual.

## 🧰 Tecnologías utilizadas

| Tecnología | Uso comprobado |
| --- | --- |
| React 19 | Componentes y estado de la interfaz. |
| Vite 8 | Servidor de desarrollo y construcción de la aplicación. |
| React Router DOM 7 | Rutas, navegación y redirecciones protegidas. |
| `@supabase/supabase-js` | Cliente para autenticación, consultas, Storage y sesiones. |
| Supabase Auth | Registro, inicio, cierre y recuperación de contraseña. |
| Supabase/PostgreSQL | Persistencia de perfiles, catálogos, foro y políticas RLS. |
| Supabase Storage | Buckets públicos para imágenes del foro y avatares. |
| `lucide-react` | Iconos utilizados en la navegación y la interfaz. |
| ESLint | Análisis estático mediante la configuración del proyecto. |

## 🏗️ Arquitectura y estructura del proyecto

La aplicación ejecutable principal es la que está en la raíz del repositorio:

```text
PPI/
├── src/
│   ├── App.jsx                 # AuthProvider, rutas y vistas activas
│   ├── App.css                 # Estilos de la aplicación principal
│   ├── index.css               # Estilos globales
│   ├── main.jsx                # Punto de entrada de React
│   ├── lib/supabase.js         # Cliente y configuración de Supabase
│   ├── components/             # Componentes heredados no montados por App.jsx
│   └── assets/                 # Recursos de la aplicación
├── public/                     # Favicon e iconos públicos
├── supabase/
│   ├── schema.sql              # Esquema, políticas, funciones y datos iniciales
│   └── migrations/             # Cambios posteriores del esquema y RLS
├── docs/GUIA-FUNCIONALIDADES.md # Guía técnica de módulos
├── .env.example                # Plantilla de variables de entorno
├── package.json                # Dependencias y scripts
├── vite.config.js              # Configuración de Vite y React
├── eslint.config.js            # Configuración de ESLint
├── STORAGE_SETUP.md            # Requisitos de Supabase Storage
├── index.html                  # Documento HTML de entrada
├── README.md                   # Esta documentación
├── populationdb.sql            # Esquema SQL histórico, no usado por App.jsx
└── 16-06-2026/                 # Aplicación Vite anterior, separada de la raíz
```

Los componentes dentro de `src/components/` (`Login`, `MenuAdmin`, `MenuUsuario` y `MetodosPrevencion`) pertenecen a una maqueta anterior y no se importan desde el `App.jsx` activo. La carpeta `16-06-2026/` contiene otra aplicación React independiente con sus propios scripts y no forma parte del flujo principal documentado aquí.

## 🗄️ Base de datos

El proyecto utiliza Supabase como backend y PostgreSQL como base de datos. El esquema principal define:

| Tabla | Propósito |
| --- | --- |
| `profiles` | Perfil vinculado a `auth.users`, con nombre, avatar y rol. |
| `prevention_methods` | Catálogo administrable de métodos de prevención. |
| `threats` | Catálogo administrable de amenazas, categorías, propagación y prevención. |
| `comments` | Comentarios con estado `pending`, `approved` o `rejected`; la vista activa no crea nuevos registros aquí. |
| `forum_posts` | Publicaciones de la comunidad, con categoría, estado, bloqueo e imagen opcional. |
| `forum_replies` | Respuestas vinculadas a publicaciones, con estado e imagen opcional. |

El enum `user_role` contiene `user` y `admin`. El enum `comment_status` contiene `pending`, `approved` y `rejected`. `schema.sql` inserta 12 métodos y 8 amenazas iniciales. Las migraciones posteriores agregan el foro, el control seguro de roles, la protección del rol propio y el soporte social con imágenes.

## 🔐 Seguridad

- Supabase Auth gestiona las cuentas y la sesión persistente; las claves se leen desde variables `VITE_*`.
- `Protected` exige sesión para las vistas privadas y comprueba el rol antes de mostrar `/admin`.
- PostgreSQL tiene Row Level Security (RLS) habilitado en las tablas principales.
- `is_admin()` centraliza la comprobación del rol administrativo y `admin_set_role()` impide que un administrador se quite su propio rol.
- Las políticas permiten que los usuarios actualicen únicamente su propio perfil y que no cambien su rol de forma arbitraria.
- Las publicaciones, respuestas y comentarios tienen restricciones SQL de longitud y rechazan etiquetas HTML en los campos definidos por el esquema.
- El frontend elimina etiquetas HTML con `clean()` antes de insertar nombres y contenido. Esta limpieza no sustituye las políticas RLS ni debe considerarse una sanitización general para cualquier contexto.
- Storage limita las escrituras a rutas cuyo primer segmento coincide con el identificador del usuario; la lectura de los buckets configurados es pública para poder mostrar las imágenes.

La seguridad efectiva depende también de ejecutar el esquema y las migraciones correctos en Supabase. El cliente nunca debe usar una clave `service_role` y el proyecto no debe considerarse 100% seguro por depender de estas medidas.

## 🚀 Instalación

Requisitos: Node.js y un proyecto de Supabase configurado según las secciones siguientes.

```bash
git clone https://github.com/camilop686/PPI.git
cd PPI
npm install
npm run dev
```

Scripts definidos en el `package.json` raíz:

```bash
npm run dev      # Servidor de desarrollo de Vite
npm run build    # Compilación de producción
npm run lint     # Comprobación con ESLint
npm run preview  # Vista local de la compilación
```

## 🔑 Variables de entorno

Crea un archivo `.env` en la raíz, tomando `.env.example` como referencia:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anon-publica
```

Son las únicas variables requeridas por el código del cliente. Deben configurarse localmente y no deben incluir claves reales, contraseñas ni la clave privada `service_role` en el README o en el repositorio.

## ☁️ Configuración de Supabase

1. Crea un proyecto en Supabase.
2. Configura `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en `.env`.
3. Ejecuta `supabase/schema.sql` en el SQL Editor. Este archivo crea las tablas, enums, funciones, trigger, políticas RLS y datos iniciales.
4. Ejecuta las migraciones en orden: `001-admin-users.sql`, `002-forum.sql`, `003-profile-role-policy.sql` y `004-forum-social-immediate.sql`.
5. Verifica que existan los buckets públicos `forum-images` y `avatars`, además de sus políticas de Storage. La migración `004` contiene la creación y las políticas; `STORAGE_SETUP.md` describe la comprobación manual.
6. Registra una cuenta y promueve de forma controlada su perfil a administrador usando el procedimiento documentado en el SQL. No expongas la `service_role` en el navegador.

## 👥 Roles del sistema

### Usuario

Puede consultar métodos y amenazas, buscar en los catálogos, administrar su nombre y avatar, crear publicaciones y responder en la comunidad, además de cerrar su sesión y solicitar recuperación de contraseña.

### Administrador

Tiene las capacidades del usuario y acceso adicional a `/admin` para administrar métodos y amenazas y moderar o eliminar publicaciones, respuestas y comentarios. El acceso se controla en el frontend con `profile.role` y en la base de datos mediante RLS; la base de datos es la autoridad final.

## 🔄 Flujo general de la aplicación

```text
Usuario
   ↓
Inicio de sesión, registro o recuperación
   ↓
/inicio
   ├── /metodos       → catálogo y búsqueda
   ├── /amenazas      → catálogo y búsqueda
   ├── /comunidad     → publicaciones y respuestas
   └── /perfil        → datos personales y avatar

Perfil con role = admin
   ↓
/admin               → catálogos y moderación
```

Las rutas desconocidas redirigen al inicio si existe sesión o a `/acceso` si no existe.

## 📚 Métodos de prevención disponibles

Los 12 registros iniciales de `schema.sql` son:

| # | Método | Objetivo o recomendación registrada |
| ---: | --- | --- |
| 1 | Antivirus actualizado | Detectar software malicioso conocido; mantener actualizaciones y análisis periódicos. |
| 2 | Actualizaciones | Corregir vulnerabilidades con parches del sistema y aplicaciones. |
| 3 | Contraseñas únicas | Evitar que una filtración comprometa varias cuentas; usar gestor y frases largas. |
| 4 | Phishing | Reducir engaños verificando remitentes y enlaces. |
| 5 | Descargas seguras | Evitar instaladores modificados mediante fuentes oficiales. |
| 6 | Copias de seguridad | Recuperar datos ante ransomware usando la regla 3-2-1 y restauraciones probadas. |
| 7 | Firewall | Controlar conexiones de red no autorizadas y mantenerlo activo. |
| 8 | Doble factor | Añadir una barrera ante el robo de contraseñas, preferiblemente con autenticador. |
| 9 | Navegación segura | Reducir la exposición a sitios maliciosos verificando dominio y HTTPS. |
| 10 | USB externos | Reducir infecciones desde medios removibles escaneándolos antes de abrir archivos. |
| 11 | Wi-Fi pública | Proteger datos en redes compartidas evitando operaciones sensibles o usando VPN. |
| 12 | Permisos de apps | Limitar accesos innecesarios revisando y revocando permisos. |

La tabla resume los campos `description`, `recommendations` y `what_to_do`; cada registro también contiene `risk_level` y `examples`.

## 🦠 Amenazas informáticas

Las 8 amenazas iniciales de `schema.sql` son:

| Amenaza | Categoría | Información disponible |
| --- | --- | --- |
| Ransomware | Malware | Cifra archivos para exigir un pago; se propaga por phishing, vulnerabilidades y descargas. Prevención: copias 3-2-1, parches y filtros. |
| Troyano | Malware | Se presenta como software legítimo; usa instaladores y adjuntos falsos. Prevención: fuentes oficiales y antivirus. |
| Gusano | Malware | Se replica automáticamente en redes; se relaciona con redes sin parchear y USB. Prevención: actualizaciones y segmentación. |
| Spyware | Malware | Espía actividad y datos; puede llegar mediante aplicaciones y extensiones maliciosas. Prevención: revisar permisos y analizar el equipo. |
| Keylogger | Malware | Registra pulsaciones; puede asociarse con troyanos y dispositivos físicos. Prevención: MFA y protección antimalware. |
| Botnet | Red | Red de dispositivos infectados; se relaciona con credenciales débiles y fallos expuestos. Prevención: claves únicas y actualizaciones. |
| Adware | Malware | Muestra publicidad invasiva; puede llegar con software empaquetado y extensiones. Prevención: instalación personalizada y revisión. |
| Phishing | Ingeniería social | Suplanta entidades para robar datos mediante correo, SMS o redes sociales. Prevención: verificar remitente y evitar enlaces dudosos. |

## 🧪 Scripts disponibles

Los scripts del proyecto raíz son `dev`, `build`, `lint` y `preview`, descritos en la sección de instalación. La subcarpeta `16-06-2026/` contiene otro `package.json` independiente y no es necesaria para ejecutar la aplicación principal.

## 📁 Documentación adicional

- [Guía de funcionalidades](docs/GUIA-FUNCIONALIDADES.md): responsabilidades de módulos y notas de mantenimiento.
- [Configuración de Storage](STORAGE_SETUP.md): buckets, rutas, políticas y validaciones de imágenes.
- `BD_PPI.jpg`, `Diagrama modelo relacional.jpg`, `Diagrama sin título (1).jpg` y `METODOS DE PREVENCION DE VIRUS,METODO DE FORMA HECHO EN ORDEN DE SUCEDER.drawio.png`: material gráfico existente para consultar o complementar la documentación.

## 👨‍💻 Autores

Los autores consignados en la documentación actual del proyecto son:

- Juan Camilo Pineda Cortes
- Ronald Steven Zapata

## 🎓 Propósito académico

Proyecto desarrollado con fines académicos como aplicación educativa para la prevención de virus y amenazas informáticas.

## 📄 Licencia

No se encontró una licencia formal en el repositorio. Proyecto desarrollado con fines académicos.
