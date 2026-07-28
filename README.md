# PPI
[PPI-11 (1).docx](https://github.com/user-attachments/files/25779476/PPI-11.1.docx)
## PPI logo
<img width="453" height="447" alt="METODOS FIABLES PARA LA PREVENCIÓN DEL VIRUS (LOGO)" src="https://github.com/user-attachments/assets/3845c21c-cb5c-49f5-a737-86cc6300d5f9" />

## Presentacion PPI

[Ronald steven zapata gallego_ camilo pineda cortes  10-2-plantilla-presentacion-institucional-2025.pptx](https://github.com/user-attachments/files/25779526/Ronald.steven.zapata.gallego_.camilo.pineda.cortes.10-2-plantilla-presentacion-institucional-2025.pptx)







---

# 📐 Arquitectura de Información y UI

Esta sección define el **Mapa de Sitio (Sitemap)**, el **Mapa de Usuario (User Flows)** y el **Mapa de Componentes (Component Map)** para la plataforma de información y prevención de virus, basada en el modelo de base de datos del proyecto.

---

## 1. Mapa de Sitio (Sitemap)

Estructura jerárquica de la navegación del sitio para visitantes, usuarios registrados y administradores:

```text
[ Inicio / Home ]
 │
 ├── [ Catálogo / Sección de Virus ]
 │    └── [ Detalle de Virus ]
 │         ├── Métodos de Prevención
 │         └── Sección de Comentarios (Añadir / Ver / Responder)
 │
 ├── [ Guía General de Prevención ]
 │    └── Detalle de Recomendaciones y Buenas Prácticas
 │
 ├── [ Portal de Usuario ]
 │    ├── Iniciar Sesión / Registro
 │    ├── Mi Perfil (Editar datos: nombre, correo)
 │    └── Mis Comentarios y Aportes
 │
 └── [ Panel de Administración / Dashboard Admin ]
      ├── [ Gestión de Contenido e Información ]
      │    ├── Crear / Editar / Eliminar Información sobre Virus
      │    └── Crear / Editar / Eliminar Métodos de Prevención
      ├── [ Moderación de Comentarios ]
      │    ├── Aprobar / Eliminar Comentarios
      │    └── Editar Comentarios de Usuarios
      └── [ Gestión de Usuarios ]
           ├── Listado de Usuarios Registrados
           ├── Suspender Cuenta
           └── Eliminar Cuenta

           [ Inicio ] ──► [ Navegar Catálogo de Virus ] ──► [ Seleccionar Virus / Info ]
                                                        │
                                                        ▼
                                       [ Visualizar Métodos de Prevención ]
                                                        │
                                                        ▼
                                         ¿Desea agregar un comentario/método?
                                            ├── NO ──► [ Fin de Sesión/Navegación ]
                                            │
                                            └── SÍ ──► [ ¿Inició Sesión? ]
                                                            ├── NO  ──► [ Login / Registro ] ──┐
                                                            │                                   │
                                                            └── SÍ ◄───────────────────────────┘
                                                                │
                                                                ▼
                                                   [ Formulario de Comentario ]
                                                                │
                                                                ▼
                                                   [ Enviar Comentario / Aporte ]
                                                                │
                                                                ▼
                                                [ Comentario Publicado / En Moderación ]

                                                [ Login Admin ] ──► [ Dashboard Admin ]
                          │
     ┌────────────────────┼────────────────────┐
     ▼                    ▼                    ▼
[ Gestión Info/Virus ] [ Moderación Comentarios ] [ Gestión de Cuentas ]
     │                    │                    │
     ├── Crear/Editar     ├── Revisar reporte   ├── Suspender usuario
     │   Información      ├── Editar texto      └── Eliminar usuario
     ├── Asociar Método   └── Eliminar
     │   de Prevención        comentario
     ▼                    ▼                    ▼
[ Guardar Cambios ]   [ Actualizar Estado ] [ Confirmar Acción ]

---

## 3. Mapa de Componentes (Component Map)

Estructura de componentes reutilizables de la interfaz gráfica de usuario (UI):

### 3.1 Componentes Globales / Layout
* **`Navbar` / Barra de Navegación:** Logo de la plataforma, enlaces principales (Inicio, Lista de Virus, Prevención) y control de sesión (Login / Logout / Mi Perfil / Panel Admin).
* **`Footer` / Pie de Página:** Créditos, enlaces institucionales, contacto y avisos legales.

### 3.2 Componentes de Información de Virus y Prevención
* **`VirusCard` / Tarjeta de Virus:** Muestra el `nombre` y `tipo` de virus con enlace a la vista detallada.
* **`InfoDetailView` / Vista Detallada de Información:** Muestra el `titulo`, `contenido` explicativo y el badge de autoría (`id_admin`).
* **`PreventionList` / Lista de Métodos de Prevención:** Bloque o tarjetas con las descripciones (`descripcion`) de prevención asociadas a la información.

### 3.3 Componentes de Comentarios y Participación
* **`CommentSection` / Sección de Comentarios:** Envoltorio principal que contiene la lista de aportes y el formulario de envío.
* **`CommentItem` / Elemento de Comentario:** Muestra el nombre del autor (`nombre`), fecha, contenido (`texto`) y acciones de moderación (Editar / Eliminar) para el Administrador.
* **`CommentForm` / Formulario de Envío:** Campo de texto multilínea (`textarea`) y botón "Publicar Comentario".

### 3.4 Componentes del Panel de Administración (Admin Dashboard)
* **`AdminSidebar` / Menú Lateral de Administración:** Navegación entre las vistas de contenidos, moderación de comentarios y gestión de usuarios.
* **`DataTable` / Tabla de Datos Genérica (CRUD):** Tabla para consultar, editar o eliminar información de virus, métodos preventivos y comentarios.
* **`UserManagementCard` / Gestión de Usuarios:** Muestra datos del usuario (`nombre`, `correo`) con acciones para suspender o eliminar cuentas.
* **`ContentEditorModal` / Modal Editor de Contenido:** Formulario flotante para crear y editar datos de `INFORMACIÓN`, `VIRUS` y `PREVENCIÓN`.