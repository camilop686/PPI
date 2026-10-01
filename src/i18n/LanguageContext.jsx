import { useEffect, useMemo, useState } from 'react'
import { LanguageContext } from './context'
import { englishCatalog } from './englishCatalog'

const translations = {
  es: {
    app: { title: 'PPI · Métodos fiables para la prevención de virus' },
    language: {
      label: 'Idioma',
      select: 'Seleccionar idioma',
      spanish: 'Español',
      english: 'English',
    },
    common: {
      loading: 'Cargando plataforma segura…',
      search: 'Buscar',
      searchCatalog: 'Buscar en el catálogo…',
      noContent: 'Aún no hay contenido publicado.',
      cancel: 'Cancelar',
      save: 'Guardar cambios',
      saving: 'Guardando…',
      edit: 'Editar',
      delete: 'Eliminar',
      create: 'Crear',
      update: 'Actualizar',
      back: 'Volver',
      user: 'Usuario',
      member: 'Miembro PPI',
      error: 'Ocurrió un error. Inténtalo de nuevo.',
    },
    nav: {
      tagline: 'Centro de defensa digital',
      home: 'Inicio',
      methods: 'Métodos',
      threats: 'Amenazas',
      community: 'Comunidad',
      profile: 'Perfil',
      manuals: 'Manuales',
      admin: 'Administración',
      logout: 'Cerrar sesión',
    },
    page: { eyebrow: 'PPI · aprendizaje seguro' },
    manuals: {
      title: 'Manuales',
      subtitle: 'Guías para usar PPI según tu rol.',
      loadingRole: 'Cargando perfil y permisos…',
      userTitle: 'Manual de Usuario',
      userDescription: 'Aprende a navegar los métodos, amenazas, comunidad y perfil.',
      adminTitle: 'Manual de Administrador',
      adminDescription: 'Guía para gestionar catálogos y moderar comentarios.',
      download: 'Descargar manual',
      downloadNamed: 'Descargar {title}',
    },
    auth: {
      eyebrow: 'CENTRO DE DEFENSA DIGITAL',
      headline: 'Conoce el riesgo. Reduce la superficie de ataque.',
      intro: 'PPI es tu consola de aprendizaje para proteger cuentas, datos y dispositivos.',
      recoveryTitle: 'Recuperar contraseña',
      registerTitle: 'Crear cuenta',
      loginTitle: 'Acceso seguro',
      fullName: 'Nombre completo',
      email: 'Correo electrónico',
      password: 'Contraseña',
      processing: 'Procesando…',
      sendLink: 'Enviar enlace',
      login: 'Iniciar sesión',
      forgot: '¿Olvidaste tu contraseña?',
      backToLogin: 'Volver al acceso',
      createAccountLink: 'Crear una cuenta',
      backToLoginAction: 'Volver a iniciar sesión',
      setupSupabase: 'Configura las variables de Supabase para activar el acceso.',
      recoverySent: 'Revisa tu correo para continuar.',
      registrationSent: 'Cuenta creada. Confirma tu correo antes de iniciar sesión.',
      authError: 'No se pudo completar el acceso. Revisa tus datos e inténtalo de nuevo.',
    },
    home: {
      greeting: 'Hola, {name}',
      protectedPerson: 'Hola, persona protegida',
      headline: 'La prevención empieza con decisiones informadas.',
      intro: 'Explora guías verificables para proteger tus dispositivos, datos y cuentas.',
      methods: 'métodos prácticos',
      threats: 'amenazas explicadas',
      habits: 'hábitos de seguridad',
    },
    catalogue: {
      methodTitle: 'Métodos de prevención',
      threatTitle: 'Amenazas informáticas',
      method: 'Método',
      threat: 'Amenaza',
      recommendation: 'Recomendación',
      spread: 'Propagación:',
    },
    community: {
      title: 'Foro de la comunidad',
      backToForum: '← Volver al foro',
      startedBy: 'Iniciado por {name}',
      reply: 'Responder',
      sendReply: 'Enviar respuesta',
      openTopic: 'ABRIR UN TEMA',
      topicTitle: 'Título',
      category: 'Categoría',
      categories: ['General', 'Prevención', 'Amenazas', 'Ayuda técnica'],
      topicPlaceholder: 'Describe tu duda o recomendación…',
      submitTopic: 'Enviar tema a moderación',
      topicSent: 'Tema enviado a moderación.',
      replySent: 'Respuesta enviada a moderación.',
      migrationError: 'Ejecuta la migración 002-forum.sql para activar el foro.',
      noTopics: 'Todavía no hay temas aprobados.',
      loading: 'Cargando temas…',
    },
    profile: {
      title: 'Mi perfil',
      name: 'Nombre',
      email: 'Correo',
      updated: 'Perfil actualizado correctamente.',
      updateError: 'No se pudo actualizar el perfil.',
    },
    admin: {
      title: 'Centro de control',
      methods: 'Métodos',
      threats: 'Amenazas',
      moderation: 'Moderación',
      method: 'método',
      threat: 'amenaza',
      new: 'Nuevo',
      edited: 'Cambio guardado.',
      deleted: 'Registro eliminado.',
      confirmDelete: '¿Eliminar este registro?',
      cancelEdit: 'Cancelar edición',
      noPending: 'No hay comentarios pendientes.',
      approve: 'Aprobar',
      reject: 'Rechazar',
      approved: 'Aprobado',
      rejected: 'Rechazado',
      fields: {
        name: 'Nombre',
        description: 'Descripción',
        risk_level: 'Nivel de riesgo',
        recommendations: 'Recomendaciones',
        examples: 'Ejemplos',
        what_to_do: 'Qué hacer',
        category: 'Categoría',
        what_is: 'Qué es',
        how_spreads: 'Cómo se propaga',
        prevention: 'Prevención',
      },
    },
  },
  en: {
    app: { title: 'PPI · Reliable virus prevention methods' },
    language: {
      label: 'Language',
      select: 'Select language',
      spanish: 'Español',
      english: 'English',
    },
    common: {
      loading: 'Loading secure platform…',
      search: 'Search',
      searchCatalog: 'Search the catalog…',
      noContent: 'No content has been published yet.',
      cancel: 'Cancel',
      save: 'Save changes',
      saving: 'Saving…',
      edit: 'Edit',
      delete: 'Delete',
      create: 'Create',
      update: 'Update',
      back: 'Back',
      user: 'User',
      member: 'PPI member',
      error: 'Something went wrong. Please try again.',
    },
    nav: {
      tagline: 'Digital defense center',
      home: 'Home',
      methods: 'Methods',
      threats: 'Threats',
      community: 'Community',
      profile: 'Profile',
      manuals: 'Manual guides',
      admin: 'Administration',
      logout: 'Sign out',
    },
    page: { eyebrow: 'PPI · security learning' },
    manuals: {
      title: 'Manual guides',
      subtitle: 'Guides for using PPI according to your role.',
      loadingRole: 'Loading profile and permissions…',
      userTitle: 'User Manual',
      userDescription: 'Learn to navigate methods, threats, the community, and your profile.',
      adminTitle: 'Administrator Manual',
      adminDescription: 'Learn to manage catalogs and moderate comments.',
      download: 'Download manual',
      downloadNamed: 'Download {title}',
    },
    auth: {
      eyebrow: 'DIGITAL DEFENSE CENTER',
      headline: 'Know the risk. Reduce your attack surface.',
      intro: 'PPI is your learning console for protecting accounts, data, and devices.',
      recoveryTitle: 'Reset password',
      registerTitle: 'Create account',
      loginTitle: 'Secure sign in',
      fullName: 'Full name',
      email: 'Email address',
      password: 'Password',
      processing: 'Processing…',
      sendLink: 'Send recovery link',
      login: 'Sign in',
      forgot: 'Forgot your password?',
      backToLogin: 'Back to sign in',
      createAccountLink: 'Create an account',
      backToLoginAction: 'Back to sign in',
      setupSupabase: 'Configure the Supabase environment variables to enable sign in.',
      recoverySent: 'Check your email to continue.',
      registrationSent: 'Account created. Confirm your email before signing in.',
      authError: 'Unable to complete sign in. Check your details and try again.',
    },
    home: {
      greeting: 'Hello, {name}',
      protectedPerson: 'Hello, security-minded person',
      headline: 'Prevention starts with informed decisions.',
      intro: 'Explore trusted guides to protect your devices, data, and accounts.',
      methods: 'practical methods',
      threats: 'threats explained',
      habits: 'security habits',
    },
    catalogue: {
      methodTitle: 'Prevention methods',
      threatTitle: 'Cyber threats',
      method: 'Method',
      threat: 'Threat',
      recommendation: 'Recommendation',
      spread: 'Spread:',
    },
    community: {
      title: 'Community forum',
      backToForum: '← Back to forum',
      startedBy: 'Started by {name}',
      reply: 'Reply',
      sendReply: 'Send reply',
      openTopic: 'START A TOPIC',
      topicTitle: 'Title',
      category: 'Category',
      categories: ['General', 'Prevention', 'Threats', 'Technical help'],
      topicPlaceholder: 'Describe your question or recommendation…',
      submitTopic: 'Submit topic for moderation',
      topicSent: 'Topic submitted for moderation.',
      replySent: 'Reply submitted for moderation.',
      migrationError: 'Run migration 002-forum.sql to enable the forum.',
      noTopics: 'There are no approved topics yet.',
      loading: 'Loading topics…',
    },
    profile: {
      title: 'My profile',
      name: 'Name',
      email: 'Email',
      updated: 'Profile updated successfully.',
      updateError: 'Unable to update the profile.',
    },
    admin: {
      title: 'Control center',
      methods: 'Methods',
      threats: 'Threats',
      moderation: 'Moderation',
      method: 'method',
      threat: 'threat',
      new: 'New',
      edited: 'Changes saved.',
      deleted: 'Record deleted.',
      confirmDelete: 'Delete this record?',
      cancelEdit: 'Cancel editing',
      noPending: 'There are no pending comments.',
      approve: 'Approve',
      reject: 'Reject',
      approved: 'Approved',
      rejected: 'Rejected',
      fields: {
        name: 'Name',
        description: 'Description',
        risk_level: 'Risk level',
        recommendations: 'Recommendations',
        examples: 'Examples',
        what_to_do: 'What to do',
        category: 'Category',
        what_is: 'What it is',
        how_spreads: 'How it spreads',
        prevention: 'Prevention',
      },
    },
  },
}

const storageKey = 'ppi-language'

function getInitialLanguage() {
  try {
    const storedLanguage = window.localStorage.getItem(storageKey)
    return storedLanguage === 'en' || storedLanguage === 'es' ? storedLanguage : 'es'
  } catch {
    return 'es'
  }
}

function getValue(dictionary, key) {
  return key.split('.').reduce((value, part) => value?.[part], dictionary)
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage)
  const dictionary = translations[language]

  const changeLanguage = nextLanguage => {
    if (nextLanguage === 'es' || nextLanguage === 'en') setLanguage(nextLanguage)
  }

  const value = useMemo(() => ({
    language,
    changeLanguage,
    translateCatalog: (table, record) => {
      if (language !== 'en') return record
      return { ...record, ...englishCatalog[table]?.[record.name] }
    },
    t: (key, variables = {}) => {
      const translation = getValue(dictionary, key)
      if (typeof translation !== 'string') return key
      return translation.replace(/\{(\w+)\}/g, (_, name) => variables[name] ?? '')
    },
  }), [dictionary, language])

  useEffect(() => {
    document.documentElement.lang = language
    document.title = dictionary.app.title
    try {
      window.localStorage.setItem(storageKey, language)
    } catch {
      // The selected language remains active for the current session if storage is unavailable.
    }
  }, [dictionary.app.title, language])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}