import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const manuals = [
  {
    file: "manual_usuario.pdf",
    title: "Manual de Usuario",
    subtitle: "Guía práctica para usar la plataforma PPI",
    sections: [
      [
        "1. Acceso y cuenta",
        [
          "En la pantalla de acceso, inicia sesión con tu correo y contraseña. Para registrarte, elige Crear una cuenta, completa tu nombre y correo, y usa una contraseña de al menos ocho caracteres.",
          "Si el registro requiere confirmación, abre el mensaje enviado a tu correo antes de iniciar sesión. La opción Olvidaste tu contraseña permite solicitar un enlace de recuperación.",
        ],
      ],
      [
        "2. Navegación e idioma",
        [
          "Usa el menú lateral para ir a Inicio, Métodos, Amenazas, Comunidad, Perfil y Manuales. El selector de idioma cambia la interfaz entre Español e Inglés y conserva la selección al volver a la plataforma.",
          "En Inicio encontrarás una introducción a las guías de seguridad disponibles.",
        ],
      ],
      [
        "3. Métodos y amenazas",
        [
          "Métodos presenta prácticas preventivas, recomendaciones y ejemplos. Amenazas describe riesgos informáticos, su propagación y medidas de prevención.",
          "Usa el campo de búsqueda para filtrar el catálogo. El contenido publicado es informativo y no reemplaza las políticas de seguridad de tu organización.",
        ],
      ],
      [
        "4. Comunidad",
        [
          "Para abrir un tema, escribe un título de 6 a 120 caracteres, elige una categoría y describe tu pregunta o recomendación. Los temas nuevos se envían a moderación y solo aparecen en el foro cuando son aprobados.",
          "Abre un tema aprobado para leerlo y responder. Las respuestas también pasan por moderación antes de publicarse. No incluyas contraseñas, datos financieros ni información personal sensible.",
        ],
      ],
      [
        "5. Perfil y cierre de sesión",
        [
          "En Perfil puedes actualizar el nombre asociado a tu cuenta. El correo se muestra como dato de la cuenta y no se edita desde esta pantalla.",
          "Selecciona Cerrar sesión al terminar, especialmente en dispositivos compartidos.",
        ],
      ],
      [
        "6. Ayuda y seguridad",
        [
          "Si no puedes acceder, revisa el correo y la confirmación de cuenta, o solicita recuperación de contraseña. Si el catálogo o el foro no carga, vuelve a intentarlo y contacta al administrador de la plataforma.",
          "PPI nunca necesita que compartas tu contraseña en el foro. Reporta mensajes sospechosos y evita publicar enlaces o archivos que no hayas verificado.",
        ],
      ],
    ],
  },
  {
    file: "manual_administrador.pdf",
    title: "Manual de Administrador",
    subtitle: "Gestión de contenidos y moderación en PPI",
    sections: [
      [
        "1. Acceso administrativo",
        [
          "La opción Administración aparece cuando el perfil autenticado tiene role = admin. El rol se consulta en profiles.role; no se puede obtener desde el formulario de registro ni cambiar desde la interfaz.",
          "Si necesitas acceso administrativo, solicita el cambio a una persona autorizada que gestione Supabase. No compartas credenciales ni claves de servicio.",
        ],
      ],
      [
        "2. Métodos de prevención",
        [
          "En Administración > Métodos puedes crear, editar y eliminar registros del catálogo. Completa los campos de nombre, descripción, nivel de riesgo, recomendaciones, ejemplos y qué hacer.",
          "Antes de guardar, revisa ortografía, exactitud y que las recomendaciones sean seguras y accionables. La eliminación solicita confirmación y no se puede deshacer desde la interfaz.",
        ],
      ],
      [
        "3. Amenazas informáticas",
        [
          "En Administración > Amenazas puedes crear, editar y eliminar amenazas. Completa nombre, categoría, qué es, cómo se propaga y prevención.",
          "Mantiene las explicaciones claras y educativas. Comprueba que los consejos no incluyan enlaces o archivos no verificados.",
        ],
      ],
      [
        "4. Moderación de comentarios",
        [
          "En Administración > Moderación revisa los comentarios pendientes. Usa Aprobar para permitir su publicación o Rechazar para descartarlos. El texto y el nombre del autor son contenido de usuario; evalúa el mensaje, no la identidad.",
          "La moderación disponible en este panel corresponde a comentarios. Los temas y respuestas del foro tienen estados de moderación en la base de datos, pero no cuentan con controles de gestión en esta pantalla.",
        ],
      ],
      [
        "5. Protección de datos y roles",
        [
          "El panel requiere una sesión autenticada y el rol admin. Las políticas RLS de Supabase siguen siendo la autoridad de acceso; no las debilites para resolver errores de interfaz.",
          "Los manuales están alojados como archivos estáticos para descarga. La interfaz oculta el manual administrativo a perfiles user, pero el archivo público no es un mecanismo de confidencialidad para información sensible.",
          "No introduzcas claves service_role en el navegador ni en archivos VITE_. Para cambios de roles o tareas privilegiadas, usa el proceso administrativo seguro definido para el proyecto.",
        ],
      ],
      [
        "6. Operación responsable",
        [
          "Verifica que los cambios se reflejen en el catálogo y que el contenido siga siendo comprensible en los dos idiomas de la interfaz. El texto personalizado guardado en Supabase no se traduce automáticamente.",
          "Conserva copias de la información antes de cambios masivos y elimina un registro solo cuando hayas confirmado que ya no es necesario.",
        ],
      ],
    ],
  },
];

function wrap(text, width = 88) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length > width && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function toHex(text) {
  return Buffer.from(text, "latin1").toString("hex").toUpperCase();
}

function textCommand(text, x, y, size, font, color) {
  const [red, green, blue] = color;
  return `${red} ${green} ${blue} rg BT /${font} ${size} Tf 1 0 0 1 ${x} ${y} Tm <${toHex(text)}> Tj ET`;
}

function makePage(manual, pageNumber, blocks) {
  const commands = [
    "0.05 0.14 0.09 rg 0 730 595 112 re f",
    "0.64 0.90 0.21 rg 0 722 595 8 re f",
    textCommand("PPI | Centro de defensa digital", 48, 813, 10, "F1", [1, 1, 1]),
    textCommand(manual.title, 48, 777, 23, "F2", [1, 1, 1]),
    textCommand(manual.subtitle, 48, 755, 10, "F1", [0.88, 0.95, 0.89]),
    "0.78 0.85 0.79 RG 48 52 m 547 52 l S",
    textCommand("PPI - Guia de referencia de la plataforma", 48, 35, 8, "F1", [0.40, 0.47, 0.42]),
    textCommand(`Pagina ${pageNumber}`, 490, 35, 8, "F1", [0.40, 0.47, 0.42]),
  ];
  let y = 694;
  for (const block of blocks) {
    if (block.type === "heading") {
      commands.push(textCommand(block.text, 48, y, 12, "F2", [0.16, 0.35, 0.18]));
      y -= 21;
      continue;
    }
    for (const line of block.lines) {
      commands.push(textCommand(line, 48, y, 9.5, "F1", [0.10, 0.15, 0.12]));
      y -= 13;
    }
    y -= 5;
  }
  return commands.join("\n");
}

function makePdf(manual) {
  const blocks = [];
  for (const [heading, paragraphs] of manual.sections) {
    blocks.push({ type: "heading", text: heading });
    for (const paragraph of paragraphs) {
      blocks.push({ type: "body", lines: wrap(paragraph) });
    }
  }

  const pages = [[]];
  let usedLines = 0;
  for (const block of blocks) {
    const blockLines = block.type === "heading" ? 2 : block.lines.length + 1;
    if (usedLines + blockLines > 47 && pages.at(-1).length) {
      pages.push([]);
      usedLines = 0;
    }
    pages.at(-1).push(block);
    usedLines += blockLines;
  }

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    `<< /Type /Pages /Kids [${pages.map((_, index) => `${5 + index * 2} 0 R`).join(" ")}] /Count ${pages.length} >>`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>",
  ];

  pages.forEach((blocksForPage, index) => {
    const pageObject = 5 + index * 2;
    const contentObject = pageObject + 1;
    const stream = Buffer.from(makePage(manual, index + 1, blocksForPage), "ascii");
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentObject} 0 R >>`,
      `<< /Length ${stream.length} >>\nstream\n${stream.toString("ascii")}\nendstream`,
    );
  });

  const chunks = [Buffer.from("%PDF-1.4\n", "ascii")];
  const offsets = [0];
  let offset = chunks[0].length;
  objects.forEach((object, index) => {
    const body = Buffer.from(`${index + 1} 0 obj\n${object}\nendobj\n`, "ascii");
    offsets.push(offset);
    chunks.push(body);
    offset += body.length;
  });
  const xrefOffset = offset;
  const xref = [
    `xref\n0 ${objects.length + 1}\n`,
    "0000000000 65535 f \n",
    ...offsets.slice(1).map((value) => `${String(value).padStart(10, "0")} 00000 n \n`),
    `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`,
  ].join("");
  chunks.push(Buffer.from(xref, "ascii"));
  return Buffer.concat(chunks);
}

const outputDirectory = resolve("public/manuales");
await mkdir(outputDirectory, { recursive: true });
for (const manual of manuals) {
  const output = resolve(outputDirectory, manual.file);
  await writeFile(output, makePdf(manual));
  console.log(`Generated ${output}`);
}
