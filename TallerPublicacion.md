# Investigación teórica — Taller de Publicación

**Proyecto analizado:** PPI, Plataforma de Métodos Fiables para la Prevención de Virus  
**Fecha de consulta:** 15 de septiembre de 2026

## 1. Cómo llega un usuario a tu sitio

Cuando una persona escribe una dirección web, intervienen el navegador, el sistema DNS, la red y el servidor que aloja la aplicación.

1. **Resolución DNS.** El usuario escribe una URL, por ejemplo `https://ppi.example.com/inicio`. El navegador necesita convertir el nombre `ppi.example.com` en una dirección IP. Para ello consulta su caché y, si no encuentra la respuesta, pregunta a un resolver DNS. Este busca la respuesta en la jerarquía DNS.
2. **Conexión TCP.** Con la IP encontrada, el navegador abre una conexión TCP con el servidor, normalmente en el puerto 443 para HTTPS. TCP organiza los datos y comprueba que lleguen correctamente.
3. **Handshake TLS.** Antes de enviar información privada, el navegador y el servidor negocian TLS. El servidor presenta un certificado para demostrar que el dominio corresponde con él y ambos acuerdan claves para cifrar la comunicación.
4. **Petición HTTP/HTTPS.** El navegador envía una petición, por ejemplo `GET /inicio`, junto con información como el tipo de navegador y los formatos que acepta. HTTPS es HTTP protegido por TLS.
5. **Respuesta del servidor.** El hosting responde con un código de estado, cabeceras y contenido. En una aplicación React/Vite suele entregar `index.html`, archivos JavaScript, CSS, imágenes y otros recursos compilados.
6. **Procesamiento y renderizado.** El navegador interpreta HTML, aplica CSS y ejecuta JavaScript. React monta la aplicación dentro del elemento `root`, React Router decide qué vista corresponde a la ruta y se hacen peticiones adicionales, por ejemplo a Supabase. Finalmente se dibuja la interfaz visible.

En PPI, `index.html` carga `src/main.jsx`; ese archivo monta `App` de React. La aplicación usa rutas como `/acceso`, `/inicio`, `/metodos`, `/amenazas`, `/comunidad`, `/perfil` y `/admin`. Después de iniciar sesión, el frontend consulta Supabase para obtener el perfil, los catálogos, las publicaciones y las respuestas que el usuario tenga permiso de ver.

### Partes de una URL

Ejemplo:

`https://blog.example.com:8443/articulos/seguridad?tema=dns&pagina=2#resumen`

| Parte | Ejemplo | Función |
|---|---|---|
| Esquema | `https` | Indica el protocolo que se utilizará. |
| Subdominio | `blog` | Sección o servicio ubicado antes del dominio principal. |
| Dominio | `example` | Nombre registrado por el propietario. |
| TLD | `.com` | Extensión de nivel superior. |
| Puerto | `8443` | Punto de red utilizado por el servicio; si se omite, se usa el puerto habitual del esquema. |
| Ruta | `/articulos/seguridad` | Recurso o vista que se solicita. |
| Query string | `?tema=dns&pagina=2` | Parámetros enviados para filtrar o modificar la consulta. |
| Fragmento | `#resumen` | Ubicación dentro del documento; normalmente solo la usa el navegador y no se envía al servidor. |

Un ejemplo relacionado con PPI podría ser `https://ppi.example.com/metodos?buscar=phishing`. En él, `https` es el esquema, `ppi` podría ser el subdominio, `example.com` el dominio y TLD, `/metodos` una ruta de React Router y `buscar=phishing` un parámetro de búsqueda. La dirección es un ejemplo académico, no un dominio publicado actualmente por PPI.

### Dominio, subdominio y hosting

- **Dominio:** nombre legible que identifica un sitio en Internet, como `example.com`. Se registra mediante un registrador.
- **Subdominio:** nombre añadido delante del dominio, como `app.example.com` o `api.example.com`. Puede apuntar al mismo servicio o a otro distinto.
- **Hosting:** servicio y servidores donde se guardan y entregan los archivos de una web o se ejecutan sus procesos.

Son conceptos diferentes. Una empresa puede comprar el dominio en un registrador, administrar el DNS con otro proveedor y publicar la aplicación en un hosting diferente. Esto es posible porque el DNS permite indicar a qué servidores deben dirigirse el dominio y sus subdominios. Para publicar PPI, por ejemplo, se podría registrar `ppi.edu.co`, crear `app.ppi.edu.co`, alojar el build de React en un hosting estático y conectar el frontend con el proyecto de Supabase.

## 2. DNS

### Qué es y cómo funciona

DNS (*Domain Name System*) es el sistema que relaciona nombres como `github.com` con direcciones IP. Se conoce como “la agenda de contactos de Internet” porque las personas recuerdan nombres y los equipos necesitan direcciones.

Su jerarquía puede resumirse así:

`Root Servers → TLD Servers → Servidores autoritativos → Resolver recursivo`

- **Servidores raíz:** indican qué servidores conocen cada extensión, como `.com` o `.org`.
- **Servidores TLD:** administran la información de una extensión y señalan los nameservers responsables de un dominio concreto.
- **Servidores autoritativos:** contienen la respuesta oficial de la zona del dominio, por ejemplo el registro `A` de `ppi.example.com`.
- **Resolver recursivo:** suele pertenecer al proveedor de Internet o a un servicio público. Recibe la pregunta del equipo, consulta los niveles anteriores, guarda la respuesta temporalmente y la devuelve al navegador.

### Registros DNS principales

| Registro | Para qué sirve | Ejemplo sencillo |
|---|---|---|
| `A` | Relaciona un nombre con una IPv4. | `app.example.com A 203.0.113.10` |
| `AAAA` | Relaciona un nombre con una IPv6. | `app.example.com AAAA 2001:db8::10` |
| `CNAME` | Hace que un nombre sea un alias de otro nombre. | `www.example.com CNAME example.com` |
| `ALIAS / ANAME` | Alias hacia otro nombre en el dominio raíz, donde un CNAME tradicional puede no estar permitido. Su disponibilidad depende del proveedor. | `example.com ANAME app.hosting.com` |
| `MX` | Indica qué servidores reciben el correo del dominio y su prioridad. | `example.com MX 10 mail.example.com` |
| `TXT` | Guarda texto que sirve para verificaciones y políticas. | `example.com TXT "site-verification=abc123"` |
| `SPF` | Política contra suplantación de correo, publicada actualmente como un registro `TXT`. | `example.com TXT "v=spf1 include:_spf.proveedor.com ~all"` |
| `DKIM` | Publica una clave pública para comprobar una firma de correo. También se publica como `TXT`, normalmente bajo `selector._domainkey`. | `s1._domainkey.example.com TXT "v=DKIM1; p=..."` |
| Verificación de propiedad | Permite demostrar que se controla el dominio para un servicio. | `example.com TXT "google-site-verification=..."` |
| `NS` | Indica los nameservers autoritativos de la zona. | `example.com NS ns1.dns-provider.com` |
| `SOA` | Contiene datos básicos de autoridad: servidor principal, contacto, serie y temporizadores. | `example.com SOA ns1.dns-provider.com hostmaster.example.com ...` |

El **TTL** (*Time To Live*) indica cuántos segundos puede conservarse una respuesta en caché. Si se cambia un registro y el TTL era de 86.400 segundos, algunos resolvers podrían conservar la respuesta anterior hasta 24 horas. La llamada “propagación DNS” no significa que se copie un archivo por Internet: significa que diferentes cachés van venciendo y vuelven a consultar la información. Puede tardar minutos, horas o más, según TTL, proveedor y cachés intermedias; no existe un tiempo único garantizado.

### Ejercicio práctico de consultas DNS

En el entorno utilizado para este trabajo no estaban instalados `dig` ni `nslookup`, por lo que no se inventan salidas. El estudiante puede ejecutar:

```bash
nslookup github.io
dig github.com A
dig github.com MX
dig +trace anthropic.com
```

Si `dig` no está disponible:

```bash
nslookup -type=MX github.com
```

Qué muestra cada consulta:

- `nslookup github.io`: pide al resolver una dirección del dominio.
- `dig github.com A`: muestra registros IPv4, TTL y datos de la respuesta.
- `dig github.com MX`: muestra los servidores de correo y su prioridad.
- `dig +trace anthropic.com`: sigue la delegación desde la raíz, el TLD y los servidores autoritativos.
- La alternativa con `-type=MX` consulta específicamente los servidores de correo.

En PPI, el proveedor de DNS tendría que dirigir el dominio o subdominio del frontend hacia el hosting elegido. Supabase también requiere configurar correctamente las URL de autenticación asociadas al dominio final.

## 3. Dominios

### Registrador, DNS y hosting

Un **registrador** (*registrar*) vende o administra el registro de un nombre de dominio ante el registro correspondiente. Un **proveedor DNS** aloja la zona DNS y responde qué IP o servicio corresponde a cada nombre. El **hosting** almacena los archivos o ejecuta la aplicación. Una misma empresa puede ofrecer los tres servicios, pero no es obligatorio que sea así.

Los **nameservers** son los servidores DNS autoritativos de un dominio. “Apuntar un dominio a otro proveedor” significa cambiar sus nameservers o sus registros para que las consultas terminen en la infraestructura del nuevo proveedor, sin cambiar necesariamente el registrador.

### TLD

- Los **gTLD** son extensiones genéricas, como `.com`, `.dev` y `.app`.
- Los **ccTLD** representan países o territorios, como `.co` para Colombia.
- `.com` es general y muy utilizado.
- `.dev` está orientado a desarrollo y requiere HTTPS en los navegadores modernos mediante la política HSTS del registro.
- `.app` está orientado a aplicaciones y también requiere HTTPS.
- `.co` es el ccTLD de Colombia, aunque se usa internacionalmente.
- `.com.co` es un dominio de segundo nivel bajo `.co`, pensado para actividades comerciales en Colombia; sus condiciones dependen del operador del registro.

Las reglas de registro, precios y requisitos pueden cambiar. Conviene revisar el registrador y la política del registro antes de comprar.

### WHOIS y privacidad

**WHOIS** es un servicio o protocolo para consultar datos de registro de dominios. Actualmente muchos datos personales se limitan por privacidad y por las políticas de protección de datos; la consulta pública puede variar según el TLD y el registrador. La **privacidad de dominio** sustituye u oculta parte de los datos de contacto públicos mediante un servicio del registrador, cuando las reglas lo permiten. No convierte al propietario en anónimo ante el registrador o las autoridades.

### Precios consultados

Los precios cambian por promociones, impuestos, moneda y renovación. La siguiente tabla resume una consulta pública realizada el 15 de septiembre de 2026; debe verificarse en el carrito antes de pagar. En Porkbun se observaron aproximadamente `$11.08` para `.com` y `$15.76` para `.co`; los precios de renovación mostrados por el registrador pueden ser diferentes según la extensión. Namecheap publica precios promocionales y de renovación en sus páginas de TLD, pero puede cargar los valores mediante la interfaz y variar por país. Por eso se indican como valores de referencia y no como una tarifa permanente.

| Registrador | Dominio | Precio inicial observado o de referencia | Renovación de referencia | Nota |
|---|---|---:|---:|---|
| Porkbun | `.com` | US$11.08 | Revisar carrito; suele acercarse al precio normal | Precio sin asumir impuestos o promociones futuras. |
| Porkbun | `.co` | US$15.76 | Revisar carrito; la renovación puede ser mayor | El precio mostrado puede cambiar por periodo. |
| Namecheap | `.com` | Aproximadamente US$6.79 en promoción | Aproximadamente US$18.48 | La promoción del primer año no representa la renovación. |
| Namecheap | `.co` | Aproximadamente US$9.48 en promoción | Aproximadamente US$28.98 | Confirmar precio vigente y posibles tasas. |

El primer año puede ser más barato porque el registrador aplica una promoción para captar clientes. La renovación vuelve a la tarifa normal del TLD y puede incluir costos del registro, privacidad, impuestos o tarifas especiales.

## 4. HTTPS y certificados

**TLS** es el protocolo que cifra la comunicación entre el navegador y el servidor. SSL es el nombre antiguo que todavía se usa de forma informal. HTTPS significa HTTP transmitido mediante TLS. TLS protege principalmente la confidencialidad, la integridad de los datos y la autenticidad del servidor durante la conexión.

Una **Autoridad Certificadora (CA)** verifica el control o la identidad indicada en una solicitud y firma un certificado digital. **Let's Encrypt** es una CA gratuita y automatizada que emite certificados, principalmente de validación de dominio, y permite renovarlos con herramientas automáticas.

- **DV:** comprueba control del dominio. Es el tipo habitual para sitios personales y aplicaciones web.
- **OV:** comprueba también cierta información de la organización solicitante.
- **EV:** aplica verificaciones organizacionales más estrictas. El navegador ya no muestra necesariamente una diferencia visual grande frente a otros certificados.
- **Wildcard:** cubre un dominio y sus subdominios de un nivel, por ejemplo `*.example.com`; no cubre automáticamente `example.com` ni `a.b.example.com`.

El error **“certificado no válido para este nombre”** aparece cuando el certificado no incluye el hostname visitado en sus nombres permitidos, está vencido, no es confiable o la cadena está mal configurada. Es frecuente al conectar un dominio personalizado antes de emitir el certificado para ese nombre. En PPI, el hosting debe emitir un certificado para el dominio real y las redirecciones de Supabase Auth deben usar esa misma dirección HTTPS.

**HSTS** (*HTTP Strict Transport Security*) indica al navegador que solo debe acceder al sitio mediante HTTPS durante un periodo definido. Reduce ataques que intentan forzar una primera conexión HTTP sin cifrar, pero debe activarse con cuidado porque dificulta volver temporalmente a HTTP si hay errores de configuración.

## 5. Modelos de alojamiento

| Modelo | Qué es | Ventajas | Desventajas | Uso típico |
|---|---|---|---|---|
| Hosting compartido | Varios sitios usan un servidor administrado por un proveedor. Ejemplo: Hostinger/cPanel. | Económico y sencillo. | Menos control y recursos compartidos. | Web pequeña, blog o sitio tradicional. |
| VPS | Máquina virtual con recursos y sistema administrables. Ejemplos: DigitalOcean Droplet, Linode, AWS EC2. | Más control y aislamiento que el compartido. | El usuario debe actualizar y asegurar el servidor. | API o aplicación que necesita configuración propia. |
| Servidor dedicado | Un servidor físico para un cliente. Ejemplos: OVH, Hetzner. | Alto control y rendimiento estable. | Más costoso y requiere administración. | Cargas grandes o necesidades especiales. |
| PaaS | Plataforma que ejecuta el código y simplifica despliegue y operación. Ejemplos: Render, Railway, Heroku, Fly.io. | Despliegue fácil, logs y variables integrados. | Límites, costos y dependencia del proveedor. | APIs y aplicaciones con servidor. |
| Serverless / Functions | Funciones que se ejecutan bajo demanda. Ejemplos: Vercel Functions, AWS Lambda, Supabase Edge Functions. | Escala sin administrar un servidor permanente. | Límites de tiempo, arranque y proveedor. | Endpoints pequeños, webhooks y tareas puntuales. |
| Hosting estático + CDN | Sirve archivos ya construidos desde una red distribuida. Ejemplos: GitHub Pages, Netlify, Cloudflare Pages, Vercel. | Rápido, simple y económico. | No ejecuta por sí solo lógica de servidor tradicional. | React/Vite compilado, documentación y sitios estáticos. |
| BaaS | Servicio que ofrece backend listo, como base de datos, Auth y Storage. Ejemplos: Supabase, Firebase, Appwrite. | Reduce código de backend y acelera el desarrollo. | Dependencia de reglas, API y límites del proveedor. | Apps que necesitan usuarios y datos sin crear toda la API. |

Un **CDN** distribuye archivos en servidores cercanos a los visitantes. Disminuye la latencia, reduce solicitudes al servidor de origen y puede entregar archivos desde caché. Un sitio estático entrega HTML, CSS, JavaScript e imágenes ya preparados. Un sitio dinámico o renderizado en servidor genera parte de la respuesta cuando llega cada solicitud.

Después de `npm run build`, una aplicación React creada con Vite puede funcionar como sitio estático porque React y sus datos iniciales se convierten en archivos para el navegador. PPI sigue necesitando Supabase para autenticación, consultas y almacenamiento, pero el frontend puede publicarse como archivos estáticos.

Una **SPA** (*Single Page Application*) carga una página base y cambia la vista con JavaScript sin recargar todo el documento. Si el usuario recarga directamente `/dashboard`, un hosting estático puede buscar un archivo físico llamado `dashboard` y responder 404. La solución normal es configurar un *rewrite* para enviar las rutas desconocidas a `index.html`, o usar una estrategia de rutas compatible con el hosting.

Para PPI sería adecuado un hosting estático con CDN, como Netlify, Vercel o Cloudflare Pages, conectado a Supabase. Es una combinación sencilla para React/Vite: el hosting entrega el frontend y Supabase funciona como BaaS. Hay que configurar variables de entorno, HTTPS, dominio y el rewrite de SPA.

## 6. Comparativa de plataformas

Los límites de los planes cambian con frecuencia y pueden variar por región, uso y fecha. La tabla resume características documentadas o habituales de los planes gratuitos consultados en septiembre de 2026; los enlaces oficiales deben revisarse antes de publicar.

| Característica | GitHub Pages | Netlify | Vercel | Cloudflare Pages | Render |
|---|---|---|---|---|---|
| Plan gratuito | Sí, para repositorios y sitios estáticos según las condiciones de GitHub. | Sí, con créditos y límites mensuales. | Sí, con límites de uso y condiciones del plan Hobby. | Sí, para Pages y funciones dentro de sus límites. | Sí, para servicios seleccionados; algunos pueden dormir por inactividad. |
| Ancho de banda | Límite recomendado de 100 GB/mes para Pages. | Límite mensual de transferencia/créditos según plan. | Límite de transferencia y funciones según plan. | Transferencia y solicitudes sujetas a límites del producto. | Depende del servicio; el plan gratuito tiene recursos limitados. |
| Builds | Publicación desde rama o Actions; límites de Actions aplican si se usa workflow. | Minutos/créditos de build mensuales. | Créditos y límites de build/deployment del plan. | Builds mensuales y concurrencia limitados en el plan gratuito. | Minutos de build y recursos limitados. |
| Tamaño relevante | Sitio estático; repositorio y archivos tienen límites de GitHub. | Límites por archivo y plan, consultar documentación. | Límites de tamaño de despliegue y funciones. | Límites por archivo, build y funciones. | Límites de disco, memoria y tiempo según servicio. |
| Variables de entorno | Secrets en Actions; Pages no es un backend secreto. | Variables configurables por contexto de despliegue. | Variables para desarrollo, preview y producción. | Variables y secretos por proyecto/entorno. | Variables y secretos por servicio. |
| Rutas SPA | Requiere normalmente `404.html` o una solución de fallback. | Rewrite a `index.html`. | Fallback mediante configuración de rutas. | `_redirects` o configuración equivalente. | Configuración del servicio estático. |
| Backend/functions | No es backend general; puede combinarse con Actions. | Functions y otros servicios con límites. | Functions y Edge Functions con límites. | Pages Functions/Workers con límites. | Web services, jobs y APIs. |
| Dominio personalizado | Sí, con HTTPS. | Sí, HTTPS automático. | Sí, HTTPS automático. | Sí, HTTPS automático. | Sí, HTTPS automático según servicio. |
| Preview por Pull Request | No es la experiencia principal de Pages; puede automatizarse con Actions. | Deploy previews. | Preview deployments. | Preview deployments. | Previews/entornos según servicio y configuración. |

GitHub Pages es excelente para documentación y sitios muy simples. Netlify, Vercel y Cloudflare Pages ofrecen un flujo más directo para previews, rewrites y variables de frontend. Render es más apropiado cuando PPI necesitara ejecutar un servidor o una API propia.

### ¿Cuál elegiría para PPI?

Elegiría **Netlify, Vercel o Cloudflare Pages**; para un taller académico escogería Netlify por su configuración clara de SPA y deploy previews, aunque Vercel y Cloudflare Pages también son opciones válidas. PPI usa React/Vite en el frontend y Supabase como backend, así que no necesita mantener un servidor propio para las funciones actuales. La decisión final debe considerar el plan vigente, la facilidad de configurar el rewrite y la integración con el repositorio.

## 7. Supabase en producción

Un **BaaS** (*Backend as a Service*) proporciona piezas comunes del backend sin que el equipo deba crear y mantener todos los servidores. Supabase ofrece:

- **PostgreSQL:** base de datos relacional para guardar perfiles, métodos, amenazas, comentarios y contenido del foro.
- **Auth:** registro, inicio de sesión, recuperación de contraseña y sesiones.
- **Storage:** archivos como imágenes de publicaciones, respuestas y avatares.
- **Realtime:** cambios en tiempo real mediante suscripciones, si la aplicación los configura.
- **Edge Functions:** funciones cercanas al usuario para lógica de servidor y tareas que no deben ejecutarse en el navegador.

### Claves y RLS

La **anon key** o clave pública identifica al proyecto desde el cliente. Puede estar en un frontend si las tablas y políticas están correctamente protegidas. No concede por sí sola permiso para ignorar RLS.

La **service_role key** tiene privilegios administrativos y puede saltarse RLS. **Nunca debe enviarse al navegador, subirse a Git ni ponerse en una variable `VITE_`.** Debe permanecer en un servidor, una función segura o un gestor de secretos.

**RLS** (*Row Level Security*) aplica reglas por fila directamente en PostgreSQL. Es importante cuando la `anon key` se usa desde el navegador porque el usuario puede inspeccionar y repetir las peticiones; la seguridad no puede depender solo de ocultar botones en React.

Ejemplo conceptual para una tabla `notes`:

```sql
alter table public.notes enable row level security;

create policy "leer notas propias"
on public.notes for select to authenticated
using (user_id = auth.uid());

create policy "modificar notas propias"
on public.notes for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());
```

En PPI, el esquema activa RLS para perfiles, métodos, amenazas y comentarios; además, las migraciones agregan el foro. El frontend usa `createClient` y configura la sesión persistente y la renovación automática. La aplicación consulta `profiles`, `prevention_methods`, `threats`, `forum_posts` y `forum_replies`, y Storage usa los buckets `forum-images` y `avatars`.

### URL, CORS y límites

La **Site URL** de Supabase es la URL principal a la que Auth puede regresar al usuario. Las **Redirect URLs** son direcciones permitidas después de confirmar correo, recuperar contraseña o iniciar un flujo de autenticación. Si se deja la URL local y se publica PPI con otra dirección, pueden fallar los enlaces de recuperación, la confirmación de correo o el inicio de sesión.

**CORS** controla qué orígenes de navegador pueden hacer solicitudes. Supabase y el hosting deben permitir el origen correcto; un dominio mal configurado puede producir errores aunque la base de datos funcione.

El plan gratuito de Supabase tiene límites que la documentación puede modificar. Entre los aspectos relevantes están una cuota de almacenamiento y de base de datos, límites de transferencia y de uso de Auth/Storage, y la posibilidad de que proyectos gratuitos con inactividad prolongada sean pausados. La cifra exacta depende del plan y la página de precios vigente; antes del despliegue se debe revisar [Supabase Pricing](https://supabase.com/pricing) y [Billing FAQ](https://supabase.com/docs/guides/platform/billing-faq). Para PPI esto importa porque imágenes del foro y avatares consumen Storage, y los registros de publicaciones consumen la base de datos.

## 8. Variables de entorno y seguridad

Una **variable de entorno** es un valor que se entrega a una aplicación desde la configuración del entorno, por ejemplo una URL de servicio o una clave. `.env` suele agregarse a `.gitignore` para no subir valores locales, aunque ignorar el archivo no protege una clave que ya fue publicada.

En Vite, las variables con prefijo `VITE_` se reemplazan y quedan disponibles en el código que se envía al navegador. Por eso `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` de PPI deben considerarse públicas. La anon key puede utilizarse en frontend cuando RLS está bien configurado, pero no es un secreto administrativo.

- Un secreto de **build**, como un GitHub Secret, se utiliza durante un workflow y no debe aparecer en los archivos generados.
- Un secreto de **runtime** se guarda únicamente en el servidor o función que lo necesita. La service role key de Supabase pertenece a esta categoría.

Si una clave se sube accidentalmente a Git:

1. Revocar o rotar la clave en el proveedor.
2. Generar una nueva.
3. Actualizar la configuración de la aplicación y los secretos del despliegue.
4. Eliminar la clave del código y evitar que vuelva a aparecer.
5. Revisar el historial y los logs, porque borrar el commit actual no elimina necesariamente las copias antiguas ni invalida la clave.

PPI lee `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` mediante `import.meta.env` en `src/lib/supabase.js`. En producción esas variables se configuran en el hosting. No se debe colocar allí una service role key.

## 9. Build y despliegue

El comando `npm run build` ejecuta el script `vite build` definido en el `package.json` raíz. Vite transforma JSX, agrupa dependencias y crea una versión optimizada para producción, normalmente dentro de `dist/`.

`dist/` suele contener:

- `index.html` como documento de entrada.
- Archivos JavaScript con la aplicación y sus dependencias.
- Archivos CSS procesados.
- Imágenes, favicon y otros recursos públicos.

Durante el build pueden ocurrir estas optimizaciones:

- **Minificación:** elimina espacios y reduce nombres o expresiones para disminuir el tamaño.
- **Tree shaking:** elimina código importado que nunca se utiliza.
- **Code splitting:** separa el código en varios archivos que pueden cargarse cuando hacen falta.
- **Hashing:** añade una huella al nombre de los archivos para que el navegador sepa cuándo debe descargar una versión nueva.

**CI/CD** significa integración y entrega o despliegue continuos. Un sistema CI/CD compila y comprueba el proyecto automáticamente cuando cambia el repositorio. **GitHub Actions** permite definir workflows en `.github/workflows/`; uno de ellos puede instalar Node, ejecutar `npm ci`, ejecutar `npm run lint`, ejecutar `npm run build` y publicar `dist/` en un hosting.

Desplegar desde una rama como `gh-pages` significa que una rama contiene el resultado publicado y una configuración de Pages lo sirve. Es sencillo, pero puede mezclar artefactos generados con el código fuente y necesita cuidar el fallback de rutas. Un workflow de GitHub Actions mantiene el código fuente separado, repite los pasos de forma automática y puede usar secretos del repositorio. También permite bloquear el despliegue si fallan las comprobaciones.

Para PPI conviene un workflow de GitHub Actions conectado a un hosting de React/Vite. El flujo recomendado sería: instalar dependencias, ejecutar `npm run lint`, ejecutar `npm run build`, publicar `dist/`, configurar el rewrite de SPA y definir `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en el entorno del hosting. La service role key no debe formar parte de ese build.

## 10. Conclusión

PPI es una SPA construida con React y Vite. El hosting puede entregar sus archivos estáticos por HTTPS y un CDN, mientras Supabase proporciona autenticación, PostgreSQL y Storage. Para publicarla correctamente se deben configurar el dominio, DNS, certificado HTTPS, fallback de las rutas, variables públicas de Vite y las URL de Auth de Supabase.

La seguridad principal no debe confiar solo en el frontend: las políticas RLS y la configuración de Supabase deben impedir que un usuario consulte o modifique filas ajenas. Un despliegue automático que ejecute lint y build ayuda a mantener una versión estable. Finalmente, los límites de los planes gratuitos, los precios de dominios y las características de cada plataforma pueden cambiar, así que deben verificarse en la documentación oficial antes de publicar el proyecto.