# PPI
[PPI-11 (1).docx](https://github.com/user-attachments/files/25779476/PPI-11.1.docx)
## PPI logo
<img width="453" height="447" alt="METODOS FIABLES PARA LA PREVENCIÓN DEL VIRUS (LOGO)" src="https://github.com/user-attachments/assets/3845c21c-cb5c-49f5-a737-86cc6300d5f9" />

## Presentacion PPI

[Ronald steven zapata gallego_ camilo pineda cortes  10-2-plantilla-presentacion-institucional-2025.pptx](https://github.com/user-attachments/files/25779526/Ronald.steven.zapata.gallego_.camilo.pineda.cortes.10-2-plantilla-presentacion-institucional-2025.pptx)



# 📐 Arquitectura de Información y UI

Esta documentación define el **Mapa de Sitio (Sitemap)**, el **Mapa de Usuario (User Flows)** y el **Mapa de Componentes (Component Map)** para el sistema de información y prevención de virus.

---

## 1. Mapa de Sitio (Sitemap)

```mermaid
graph TD
    A[Inicio / Home] --> B[Catálogo / Sección de Virus]
    A --> C[Guía General de Prevención]
    A --> D[Portal de Usuario]
    A --> E[Panel de Administración]

    B --> B1[Detalle de Virus]
    B1 --> B2[Métodos de Prevención]
    B1 --> B3[Sección de Comentarios]

    C --> C1[Detalle de Recomendaciones]

    D --> D1[Iniciar Sesión / Registro]
    D --> D2[Mi Perfil]
    D --> D3[Mis Comentarios y Aportes]

    E --> E1[Gestión de Contenido]
    E --> E2[Moderación de Comentarios]
    E --> E3[Gestión de Usuarios]

    flowchart TD
    Inicio([Inicio]) --> Cat[Navegar Catálogo de Virus]
    Cat --> Sel[Seleccionar Virus / Información]
    Sel --> Vis[Visualizar Métodos de Prevención]
    Vis --> Preg1{¿Desea agregar un comentario/método?}
    
    Preg1 -- No --> Fin([Fin de Navegación])
    Preg1 -- Sí --> Preg2{¿Inició Sesión?}
    
    Preg2 -- No --> Auth[Login / Registro]
    Auth --> Form[Formulario de Comentario]
    Preg2 -- Sí --> Form
    
    Form --> Env[Enviar Comentario / Aporte]
    Env --> Pub([Comentario Publicado / En Moderación])

    flowchart TD
    Admin([Login Admin]) --> Dash[Dashboard Admin]
    
    Dash --> Mod1[Gestión Info / Virus]
    Dash --> Mod2[Moderación Comentarios]
    Dash --> Mod3[Gestión de Cuentas]
    
    Mod1 --> Act1[Crear/Editar Info y Asociar Prevención]
    Mod2 --> Act2[Revisar, Editar o Eliminar Comentarios]
    Mod3 --> Act3[Suspender o Eliminar Usuario]
    
    Act1 --> Guardar([Guardar Cambios])
    Act2 --> Guardar
    Act3 --> Guardar

    3. Mapa de Componentes (Component Map)
3.1 Componentes Globales / Layout
Navbar / Barra de Navegación: Logo de la plataforma, enlaces principales (Inicio, Lista de Virus, Prevención) y control de sesión.

Footer / Pie de Página: Créditos, enlaces institucionales, contacto y avisos legales.

3.2 Componentes de Información de Virus y Prevención
VirusCard / Tarjeta de Virus: Muestra el nombre y tipo de virus con enlace a la vista detallada.

InfoDetailView / Vista Detallada de Información: Muestra el titulo, contenido explicativo y el badge de autoría (id_admin).

PreventionList / Lista de Métodos de Prevención: Tarjetas con las descripciones (descripcion) de prevención.

3.3 Componentes de Comentarios y Participación
CommentSection / Sección de Comentarios: Lista de aportes y el formulario de envío.

CommentItem / Elemento de Comentario: Muestra autor (nombre), fecha, contenido (texto) y acciones de moderación (Editar / Eliminar).

CommentForm / Formulario de Envío: Campo de texto multilínea (textarea) y botón "Publicar Comentario".

3.4 Componentes del Panel de Administración (Admin Dashboard)
AdminSidebar / Menú Lateral: Navegación entre contenidos, moderación de comentarios y gestión de usuarios.

DataTable / Tabla de Datos Genérica (CRUD): Tabla para consultar, editar o eliminar información.

UserManagementCard / Gestión de Usuarios: Muestra datos del usuario (nombre, correo) con acciones para suspender o eliminar cuentas.

ContentEditorModal / Modal Editor de Contenido: Formulario flotante para crear y editar datos.




