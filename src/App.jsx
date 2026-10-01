import { useEffect, useMemo, useState } from "react";
import {
  BrowserRouter,
  NavLink,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import {
  AlertCircle,
  BarChart3,
  BookOpen,
  LogOut,
  MessageSquare,
  ShieldCheck,
  Bug,
  Search,
  Settings,
<<<<<<< HEAD
} from "lucide-react";
import { supabase, isConfigured } from "./lib/supabase";
import logo from "../logo.png";
import "./App.css";

const nav = [
  ["/inicio", "Inicio", ShieldCheck],
  ["/metodos", "Métodos", BookOpen],
  ["/amenazas", "Amenazas", Bug],
  ["/comunidad", "Comunidad", MessageSquare],
  ["/perfil", "Perfil", Settings],
];
const clean = (value) => value.replace(/<[^>]*>/g, "").trim();
const appUrl = () => `${window.location.origin}${import.meta.env.BASE_URL}`;
const confirmationRedirect = () => `${appUrl()}confirmacion`;
const authErrorMessage = (error, register) => {
  if (!error) return "";
  const message = (error.message || "").toLowerCase();
  if (message.includes("password should be at least"))
    return "La contraseña debe tener al menos 8 caracteres.";
  if (message.includes("email rate limit exceeded"))
    return "Se alcanzó el límite de correos de registro. Inténtalo más tarde.";
  if (message.includes("invalid login credentials"))
    return "El correo o la contraseña no son correctos.";
  if (message.includes("redirect url"))
    return "La URL de confirmación no está autorizada en Supabase. Añádela en Authentication > URL Configuration.";
  if (message.includes("database error saving new user"))
    return "Supabase no pudo crear el perfil. Ejecuta el esquema y las migraciones de la carpeta supabase en orden.";
  if (message.includes("user already registered"))
    return "Este correo ya tiene una cuenta. Inicia sesión o recupera la contraseña.";
  return register
    ? `No se pudo crear la cuenta: ${error.message}`
    : `No se pudo iniciar sesión: ${error.message}`;
};
const isConfirmationError = (error) => {
  const code = error?.code || "";
  const message = (error?.message || "").toLowerCase();
  return (
    code === "email_not_confirmed" ||
    code === "user_already_exists" ||
    message.includes("email not confirmed") ||
    message.includes("already registered") ||
    message.includes("already exists")
  );
};
const Loading = () => (
  <div className="center">
    <span className="spinner" />
    Cargando plataforma segura…
  </div>
);
=======
  Download,
} from "lucide-react";
import { supabase, isConfigured } from "./lib/supabase";
import { LanguageProvider } from "./i18n/LanguageContext";
import { useLanguage } from "./i18n/useLanguage";
import logo from "../logo.png";
import "./App.css";
import "./i18n/language.css";
import "./forum.css";
import "./manuals.css";

const nav = [
  ["/inicio", "nav.home", ShieldCheck],
  ["/metodos", "nav.methods", BookOpen],
  ["/amenazas", "nav.threats", Bug],
  ["/comunidad", "nav.community", MessageSquare],
  ["/perfil", "nav.profile", Settings],
  ["/manuales", "nav.manuals", BookOpen],
];
const clean = (value) => value.replace(/<[^>]*>/g, "").trim();
function Loading() {
  const { t } = useLanguage();
  return (
    <div className="center" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      {t("common.loading")}
    </div>
  );
}
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
const Notice = ({ children }) => (
  <div className="notice">
    <AlertCircle size={18} />
    {children}
  </div>
);
<<<<<<< HEAD
function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined),
    [profile, setProfile] = useState(undefined);
=======
function LanguageSwitcher({ className = "" }) {
  const { language, changeLanguage, t } = useLanguage();
  return (
    <label className={`language-switcher ${className}`}>
      <span aria-hidden="true">🌐</span>
      <span>{t("language.label")}</span>
      <select
        aria-label={t("language.select")}
        value={language}
        onChange={(event) => changeLanguage(event.target.value)}
      >
        <option value="es">🇪🇸 Español</option>
        <option value="en">🇺🇸 English</option>
      </select>
    </label>
  );
}
function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined),
    [profile, setProfile] = useState(null);
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
  useEffect(() => {
    if (!isConfigured) return setSession(null);
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);
  useEffect(() => {
    if (!session) return setProfile(null);
<<<<<<< HEAD
    setProfile(undefined);
=======
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
    supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single()
<<<<<<< HEAD
      .then(({ data }) => setProfile(data || null));
  }, [session]);
  return session === undefined || (session && profile === undefined) ? (
    <Loading />
  ) : (
    children({ session, profile })
  );
}
function Layout({ children, profile }) {
=======
      .then(({ data }) => setProfile(data));
  }, [session]);
  return session === undefined ? <Loading /> : children({ session, profile });
}
function Layout({ children, profile }) {
  const { t } = useLanguage();
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
  const go = useNavigate();
  const logout = async () => {
    await supabase.auth.signOut();
    go("/acceso");
  };
  return (
    <div className="shell">
      <aside>
        <div className="brand">
          <img src={logo} alt="PPI" />{" "}
          <span>
<<<<<<< HEAD
            PPI<small>Centro de defensa digital</small>
=======
            PPI<small>{t("nav.tagline")}</small>
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
          </span>
        </div>
        <nav>
          {nav.map(([to, label, I]) => (
            <NavLink key={to} to={to}>
              <I size={18} />
<<<<<<< HEAD
              {label}
=======
              {t(label)}
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
            </NavLink>
          ))}
          {profile?.role === "admin" && (
            <NavLink to="/admin">
              <BarChart3 size={18} />
<<<<<<< HEAD
              Administración
            </NavLink>
          )}
        </nav>
        <button className="ghost" onClick={logout}>
          <LogOut size={18} />
          Cerrar sesión
=======
              {t("nav.admin")}
            </NavLink>
          )}
        </nav>
        <LanguageSwitcher />
        <button className="ghost" onClick={logout}>
          <LogOut size={18} />
          {t("nav.logout")}
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
        </button>
      </aside>
      <main>{children}</main>
    </div>
  );
}
function Protected({ session, profile, admin, children }) {
  if (!session) return <Navigate to="/acceso" replace />;
  if (admin && profile?.role !== "admin")
    return <Navigate to="/inicio" replace />;
  return <Layout profile={profile}>{children}</Layout>;
}
function Access({ registerDefault = false }) {
<<<<<<< HEAD
  const [register, setRegister] = useState(registerDefault),
    [recovery, setRecovery] = useState(false),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [resendEmail, setResendEmail] = useState(""),
    [canResend, setCanResend] = useState(false);
=======
  const { t } = useLanguage();
  const [register, setRegister] = useState(registerDefault),
    [recovery, setRecovery] = useState(false),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
  const go = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    if (!isConfigured)
<<<<<<< HEAD
      return setMessage(
        "Configura las variables de Supabase para activar el acceso.",
      );
    const f = new FormData(e.currentTarget),
      name = register ? clean(String(f.get("name"))) : "",
      email = String(f.get("email")).trim(),
      password = String(f.get("password"));
    if (register && name.length < 2)
      return setMessage("Escribe un nombre válido de al menos 2 caracteres.");
    setResendEmail(email);
=======
      return setMessage("auth.setupSupabase");
    const f = new FormData(e.currentTarget),
      email = String(f.get("email")).trim(),
      password = String(f.get("password"));
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
    setBusy(true);
    let error;
    if (recovery)
      ({ error } = await supabase.auth.resetPasswordForEmail(email, {
<<<<<<< HEAD
        redirectTo: `${appUrl()}perfil`,
=======
        redirectTo: `${location.origin}/perfil`,
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
      }));
    else if (register)
      ({ error } = await supabase.auth.signUp({
        email,
        password,
<<<<<<< HEAD
        options: {
          data: { full_name: name },
          emailRedirectTo: confirmationRedirect(),
        },
=======
        options: { data: { full_name: clean(String(f.get("name"))) } },
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
      }));
    else
      ({ error } = await supabase.auth.signInWithPassword({ email, password }));
    setBusy(false);
<<<<<<< HEAD
    const confirmationError = isConfirmationError(error);
    setCanResend(!recovery && (confirmationError || (!error && register)));
    setMessage(
      error
        ? confirmationError
          ? "Este correo todavía no ha sido confirmado."
          : authErrorMessage(error, register)
        : recovery
          ? "Revisa tu correo para cambiar tu contraseña."
          : register
            ? "Revisa tu correo para confirmar tu cuenta."
=======
    setMessage(
      error
        ? "auth.authError"
        : recovery
          ? "auth.recoverySent"
          : register
            ? "auth.registrationSent"
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
            : "",
    );
    if (!error && !register && !recovery) go("/inicio");
  };
<<<<<<< HEAD
  const resendConfirmation = async () => {
    if (!resendEmail) return;
    setBusy(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: resendEmail,
      options: { emailRedirectTo: confirmationRedirect() },
    });
    setBusy(false);
    setMessage(
      error
        ? "No se pudo enviar el correo. Inténtalo nuevamente."
        : "Te enviamos nuevamente el correo de confirmación.",
    );
  };
  return (
    <div className="auth">
      <section>
        <img className="auth-logo" src={logo} alt="Logotipo PPI" />
        <p className="eyebrow">CENTRO DE DEFENSA DIGITAL</p>
        <h1>Conoce el riesgo. Reduce la superficie de ataque.</h1>
        <p>
          PPI es tu consola de aprendizaje para proteger cuentas, datos y
          dispositivos.
        </p>
=======
  return (
    <div className="auth">
      <LanguageSwitcher className="auth-language-switcher" />
      <section>
        <img className="auth-logo" src={logo} alt="PPI" />
        <p className="eyebrow">{t("auth.eyebrow")}</p>
        <h1>{t("auth.headline")}</h1>
        <p>{t("auth.intro")}</p>
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
      </section>
      <form className="card" onSubmit={submit}>
        <h2>
          {recovery
<<<<<<< HEAD
            ? "Recuperar contraseña"
            : register
              ? "Crear cuenta"
              : "Acceso seguro"}
        </h2>
        {message && <Notice>{message}</Notice>}
        {canResend && (
          <button
            type="button"
            className="link"
            onClick={resendConfirmation}
            disabled={busy}
          >
            Reenviar correo de confirmación
          </button>
        )}
        {register && (
          <label>
            Nombre completo
=======
            ? t("auth.recoveryTitle")
            : register
              ? t("auth.registerTitle")
              : t("auth.loginTitle")}
        </h2>
        {message && <Notice>{t(message)}</Notice>}
        {register && (
          <label>
            {t("auth.fullName")}
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
            <input name="name" required minLength="2" maxLength="60" />
          </label>
        )}
        <label>
<<<<<<< HEAD
          Correo electrónico
=======
          {t("auth.email")}
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
          <input name="email" type="email" required />
        </label>
        {!recovery && (
          <label>
<<<<<<< HEAD
            Contraseña
=======
            {t("auth.password")}
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
            <input name="password" type="password" minLength="8" required />
          </label>
        )}
        <button disabled={busy}>
          {busy
<<<<<<< HEAD
            ? "Procesando…"
            : recovery
              ? "Enviar enlace"
              : register
                ? "Crear cuenta"
                : "Iniciar sesión"}
=======
            ? t("auth.processing")
            : recovery
              ? t("auth.sendLink")
              : register
                ? t("auth.registerTitle")
                : t("auth.login")}
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
        </button>
        <button
          type="button"
          className="link"
          onClick={() => {
            setRecovery(!recovery);
            setMessage("");
          }}
        >
<<<<<<< HEAD
          {recovery ? "Volver al acceso" : "¿Olvidaste tu contraseña?"}
=======
          {recovery ? t("auth.backToLogin") : t("auth.forgot")}
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
        </button>
        {!recovery && (
          <button
            type="button"
            className="link"
            onClick={() => {
              setRegister(!register);
              setMessage("");
<<<<<<< HEAD
              setCanResend(false);
            }}
          >
            {register ? "Volver a iniciar sesión" : "Crear una cuenta"}
=======
            }}
          >
            {register ? t("auth.backToLoginAction") : t("auth.createAccountLink")}
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
          </button>
        )}
      </form>
    </div>
  );
}
<<<<<<< HEAD
function EmailConfirmation({ session }) {
  const go = useNavigate();
  return (
    <div className="auth">
      <section>
        <img className="auth-logo" src={logo} alt="Logotipo PPI" />
        <p className="eyebrow">CENTRO DE DEFENSA DIGITAL</p>
        <h1>{session ? "Correo confirmado" : "Confirmación de correo"}</h1>
        <p>
          {session
            ? "Tu cuenta ya está activa. Puedes continuar en PPI."
            : "No pudimos completar la confirmación. Solicita un nuevo correo desde Crear cuenta."}
        </p>
      </section>
      <div className="card">
        <Notice>
          {session
            ? "Tu correo fue confirmado correctamente."
            : "El enlace puede haber expirado o ya fue utilizado."}
        </Notice>
        <button type="button" onClick={() => go(session ? "/inicio" : "/registro")}>
          {session ? "Continuar" : "Volver a crear cuenta"}
        </button>
      </div>
    </div>
  );
}
=======
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
const Page = ({ title, children }) => (
  <>
    <header className="pagehead">
      <div>
<<<<<<< HEAD
        <p className="eyebrow">PPI · aprendizaje seguro</p>
=======
        <p className="eyebrow">{useLanguage().t("page.eyebrow")}</p>
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
        <h1>{title}</h1>
      </div>
    </header>
    {children}
  </>
);
function Home({ profile }) {
<<<<<<< HEAD
  return (
    <Page title={`Hola, ${profile?.full_name || "persona protegida"}`}>
      <div className="hero">
        <div>
          <h2>La prevención empieza con decisiones informadas.</h2>
          <p>
            Explora guías verificables para proteger tus dispositivos, datos y
            cuentas.
          </p>
        </div>
        <ShieldCheck size={76} />
      </div>
      <section className="grid">
        {[
          ["12+", "métodos prácticos"],
          ["8+", "amenazas explicadas"],
          ["24/7", "hábitos de seguridad"],
        ].map((x) => (
          <article className="stat" key={x[1]}>
=======
  const { t } = useLanguage();
  return (
    <Page
      title={
        profile?.full_name
          ? t("home.greeting", { name: profile.full_name })
          : t("home.protectedPerson")
      }
    >
      <div className="hero">
        <div>
          <h2>{t("home.headline")}</h2>
          <p>{t("home.intro")}</p>
        </div>
        <ShieldCheck size={76} aria-hidden="true" />
      </div>
      <section className="grid">
        {[
          ["12+", t("home.methods")],
          ["8+", t("home.threats")],
          ["24/7", t("home.habits")],
        ].map((x) => (
          <article className="stat" key={x[0]}>
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
            <strong>{x[0]}</strong>
            <span>{x[1]}</span>
          </article>
        ))}
      </section>
    </Page>
  );
}
<<<<<<< HEAD
function Catalogue({ table, title, kind }) {
  const [items, setItems] = useState([]),
    [query, setQuery] = useState(""),
    [error, setError] = useState("");
=======
function Catalogue({ table, titleKey, kindKey }) {
  const { t, translateCatalog } = useLanguage();
  const [items, setItems] = useState([]),
    [query, setQuery] = useState(""),
    [error, setError] = useState(false),
    [loading, setLoading] = useState(true);
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
  useEffect(() => {
    supabase
      .from(table)
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        setItems(data || []);
<<<<<<< HEAD
        setError(error?.message || "");
=======
        setError(Boolean(error));
        setLoading(false);
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
      });
  }, [table]);
  const filtered = useMemo(
    () =>
<<<<<<< HEAD
      items.filter((x) =>
        JSON.stringify(x).toLowerCase().includes(query.toLowerCase()),
      ),
    [items, query],
  );
  return (
    <Page title={title}>
      <div className="toolbar">
        <Search size={18} />
        <input
          aria-label="Buscar"
          placeholder="Buscar en el catálogo…"
=======
      items.filter((item) =>
        JSON.stringify(translateCatalog(table, item))
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [items, query, table, translateCatalog],
  );
  return (
    <Page title={t(titleKey)}>
      <div className="toolbar">
        <Search size={18} aria-hidden="true" />
        <input
          aria-label={t("common.search")}
          placeholder={t("common.searchCatalog")}
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
<<<<<<< HEAD
      {error && <Notice>{error}</Notice>}
      <div className="grid cards">
        {filtered.map((x) => (
          <article className="card" key={x.id}>
            <span className="tag">{x.risk_level || x.category || kind}</span>
            <h2>{x.name}</h2>
            <p>{x.description || x.what_is}</p>
            {x.recommendations && (
              <>
                <h3>Recomendación</h3>
                <p>{x.recommendations}</p>
              </>
            )}
            {x.how_spreads && (
              <p>
                <b>Propagación:</b> {x.how_spreads}
              </p>
            )}
          </article>
        ))}
      </div>
      {!error && !filtered.length && (
        <div className="empty">
          {items.length
            ? "No hay resultados para esa búsqueda."
            : "Aún no hay contenido publicado."}
        </div>
=======
      {error && <Notice>{t("common.error")}</Notice>}
      <div className="grid cards">
        {filtered.map((item) => {
          const record = translateCatalog(table, item);
          return (
          <article className="card" key={item.id}>
            <span className="tag">{record.risk_level || record.category || t(kindKey)}</span>
            <h2>{record.name}</h2>
            <p>{record.description || record.what_is}</p>
            {record.recommendations && (
              <>
                <h3>{t("catalogue.recommendation")}</h3>
                <p>{record.recommendations}</p>
              </>
            )}
            {record.how_spreads && (
              <p>
                <b>{t("catalogue.spread")}</b> {record.how_spreads}
              </p>
            )}
          </article>
          );
        })}
      </div>
      {loading && <div className="empty" role="status">{t("common.loading")}</div>}
      {!loading && !error && !items.length && (
        <div className="empty">{t("common.noContent")}</div>
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
      )}
    </Page>
  );
}
<<<<<<< HEAD
const Avatar = ({ url, name = "U" }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return url ? (
    <img src={url} alt={name} className="avatar" />
  ) : (
    <div className="avatar-init">{initials}</div>
  );
};
function Community({ session }) {
  const [posts, setPosts] = useState([]),
    [replyCount, setReplyCount] = useState({}),
=======
function Community({ session }) {
  const { language, t } = useLanguage();
  const [topics, setTopics] = useState([]),
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
    [selected, setSelected] = useState(null),
    [title, setTitle] = useState(""),
    [body, setBody] = useState(""),
    [category, setCategory] = useState("General"),
    [reply, setReply] = useState(""),
    [replies, setReplies] = useState([]),
<<<<<<< HEAD
    [notice, setNotice] = useState(""),
    [search, setSearch] = useState(""),
    [loading, setLoading] = useState(false),
    [replying, setReplying] = useState(false),
    [uploading, setUploading] = useState(false),
    [image, setImage] = useState(null),
    [previewUrl, setPreviewUrl] = useState("");
  const loadPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("forum_posts")
      .select("*,profiles(id,full_name,avatar_url)")
      .order("created_at", { ascending: false });
    if (error) {
      setNotice(`Error cargando Comunidad: ${error.message}`);
      setPosts([]);
    } else {
      setPosts(data || []);
      const counts = {};
      for (const post of data || []) {
        const { count } = await supabase
          .from("forum_replies")
          .select("*", { count: "exact", head: true })
          .eq("post_id", post.id);
        counts[post.id] = count || 0;
      }
      setReplyCount(counts);
    }
    setLoading(false);
  };
  useEffect(() => {
    loadPosts();
  }, [session.user.id]);
  useEffect(() => {
    if (!selected) return setReplies([]);
    supabase
      .from("forum_replies")
      .select("*,profiles(full_name,avatar_url)")
      .eq("post_id", selected.id)
      .order("created_at")
      .then(({ data }) => setReplies(data || []));
  }, [selected]);
  const handleImageSelect = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(f.type)) {
      setNotice("Solo JPG, PNG o WebP");
      return;
    }
    if (f.size > 5242880) {
      setNotice("Imagen debe ser menor a 5MB");
      return;
    }
    setImage(f);
    setPreviewUrl(URL.createObjectURL(f));
  };
  const uploadImage = async () => {
    if (!image) return null;
    setUploading(true);
    const ext = image.name.split(".").pop();
    const path = `${session.user.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("forum-images")
      .upload(path, image);
    if (error) {
      setNotice("Error subiendo imagen");
      setUploading(false);
      return null;
    }
    const { data } = supabase.storage.from("forum-images").getPublicUrl(path);
    setUploading(false);
    return data.publicUrl;
  };
  const create = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim())
      return setNotice("Completa título y contenido");
    setLoading(true);
    let imageUrl = null;
    if (image) {
      imageUrl = await uploadImage();
      if (!imageUrl) {
        setLoading(false);
        return;
      }
    }
=======
    [repliesLoading, setRepliesLoading] = useState(false),
    [loading, setLoading] = useState(true),
    [notice, setNotice] = useState("");
  const load = () =>
    supabase
      .from("forum_posts")
      .select("*,profiles(full_name)")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        setTopics(data || []);
        setLoading(false);
        if (error) setNotice("community.migrationError");
      });
  useEffect(() => {
    load();
  }, []);
  useEffect(() => {
    if (!selected) {
      setReplies([]);
      return;
    }
    setRepliesLoading(true);
    supabase
      .from("forum_replies")
      .select("*,profiles(full_name)")
      .eq("post_id", selected.id)
      .eq("status", "approved")
      .order("created_at")
      .then(({ data }) => {
        setReplies(data || []);
        setRepliesLoading(false);
      });
  }, [selected]);
  const create = async (e) => {
    e.preventDefault();
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
    const { error } = await supabase
      .from("forum_posts")
      .insert({
        author_id: session.user.id,
        title: clean(title),
        body: clean(body),
        category,
<<<<<<< HEAD
        status: "approved",
        image_url: imageUrl,
      });
    setNotice(error ? error.message : "✓ Publicación creada");
    if (!error) {
      setTitle("");
      setBody("");
      setImage(null);
      setPreviewUrl("");
      loadPosts();
    }
    setLoading(false);
  };
  const sendReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return setNotice("El comentario no puede estar vacío");
    setReplying(true);
    let imageUrl = null;
    if (image) {
      imageUrl = await uploadImage();
      if (!imageUrl) {
        setReplying(false);
        return;
      }
    }
=======
      });
    setNotice(error ? "common.error" : "community.topicSent");
    setTitle("");
    setBody("");
  };
  const sendReply = async (e) => {
    e.preventDefault();
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
    const { error } = await supabase
      .from("forum_replies")
      .insert({
        post_id: selected.id,
        author_id: session.user.id,
        body: clean(reply),
<<<<<<< HEAD
        status: "approved",
        image_url: imageUrl,
      });
    setNotice(error ? error.message : "✓ Comentario publicado");
    if (!error) {
      setReply("");
      setImage(null);
      setPreviewUrl("");
      const { count } = await supabase
        .from("forum_replies")
        .select("*", { count: "exact", head: true })
        .eq("post_id", selected.id);
      setReplyCount({ ...replyCount, [selected.id]: (count || 0) + 1 });
      const { data } = await supabase
        .from("forum_replies")
        .select("*,profiles(full_name,avatar_url)")
        .eq("post_id", selected.id)
        .order("created_at");
      setReplies(data || []);
    }
    setReplying(false);
  };
  const filtered = useMemo(
    () =>
      posts.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.body.toLowerCase().includes(search.toLowerCase()),
      ),
    [posts, search],
  );
=======
      });
    setNotice(error ? "common.error" : "community.replySent");
    setReply("");
  };
  const categoryValues = ["General", "Prevención", "Amenazas", "Ayuda técnica"];
  const displayCategory = (value) => {
    const categoryIndex = categoryValues.indexOf(value);
    return categoryIndex === -1
      ? value
      : t(`community.categories.${categoryIndex}`);
  };
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
  if (selected)
    return (
      <Page title={selected.title}>
        <button className="link" onClick={() => setSelected(null)}>
<<<<<<< HEAD
          ← Volver
        </button>
        <article className="post-detail">
          <div className="post-header">
            <Avatar
              url={selected.profiles?.avatar_url}
              name={selected.profiles?.full_name}
            />
            <div>
              <b>{selected.profiles?.full_name || "Anónimo"}</b>
              <small>
                {new Date(selected.created_at).toLocaleDateString("es-CO", {
                  weekday: "short",
                })}
              </small>
            </div>
          </div>
          <h2>{selected.title}</h2>
          <span className="tag">{selected.category}</span>
          <p>{selected.body}</p>
          {selected.image_url && (
            <img src={selected.image_url} alt="post" className="post-image" />
          )}
        </article>
        <div className="replies-section">
          <b>
            {replies.length}{" "}
            {replies.length === 1 ? "comentario" : "comentarios"}
          </b>
          <div className="feed">
            {replies.map((r) => (
              <article className="reply" key={r.id}>
                <Avatar
                  url={r.profiles?.avatar_url}
                  name={r.profiles?.full_name}
                />
                <div className="reply-content">
                  <div>
                    <b>{r.profiles?.full_name || "Anónimo"}</b>
                    <small>
                      {new Date(r.created_at).toLocaleDateString("es-CO")}
                    </small>
                  </div>
                  <p>{r.body}</p>
                  {r.image_url && (
                    <img
                      src={r.image_url}
                      alt="reply"
                      className="reply-image"
                    />
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
        {!selected.locked && (
          <form className="card composer" onSubmit={sendReply}>
            <textarea
              required
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Escribe un comentario…"
              maxLength="2000"
            />
            {previewUrl && (
              <div className="preview">
                <img src={previewUrl} alt="preview" />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setPreviewUrl("");
                  }}
                >
                  ✕
                </button>
              </div>
            )}
            <label className="file-input">
              + Imagen
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
              />
            </label>
            <button disabled={replying || uploading}>
              {uploading ? "Subiendo…" : replying ? "Enviando…" : "Comentar"}
            </button>
          </form>
        )}
        {notice && <Notice>{notice}</Notice>}
      </Page>
    );
  return (
    <Page title="Comunidad">
      <div className="community-header">
        <p>Comparte dudas, ideas y conocimientos sobre prevención de virus.</p>
      </div>
      <div className="forum-layout">
        <form className="card composer" onSubmit={create}>
          <p className="eyebrow">CREAR PUBLICACIÓN</p>
          <label>
            Título
=======
          {t("community.backToForum")}
        </button>
        <article className="forum-topic">
          <span className="tag">{displayCategory(selected.category)}</span>
          <p>{selected.body}</p>
          <small>
            {t("community.startedBy", {
              name: selected.profiles?.full_name || t("common.member"),
            })}
          </small>
        </article>
        {repliesLoading ? (
          <div className="empty" role="status">{t("common.loading")}</div>
        ) : (
          <div className="feed">
            {replies.map((r) => (
              <article className="comment" key={r.id}>
                <b>{r.profiles?.full_name || t("common.member")}</b>
                <p>{r.body}</p>
              </article>
            ))}
          </div>
        )}
        {!selected.locked && (
          <form className="card composer" onSubmit={sendReply}>
            <h2>{t("community.reply")}</h2>
            <textarea
              aria-label={t("community.reply")}
              required
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              maxLength="2000"
            />
            <button>{t("community.sendReply")}</button>
          </form>
        )}
        {notice && <Notice>{t(notice)}</Notice>}
      </Page>
    );
  return (
    <Page title={t("community.title")}>
      <div className="forum-layout">
        <form className="card composer" onSubmit={create}>
          <p className="eyebrow">{t("community.openTopic")}</p>
          <label>
            {t("community.topicTitle")}
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              minLength="6"
              maxLength="120"
<<<<<<< HEAD
              placeholder="¿Cuál es tu pregunta?"
            />
          </label>
          <label>
            Categoría
=======
            />
          </label>
          <label>
            {t("community.category")}
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
<<<<<<< HEAD
              {["General", "Prevención", "Amenazas", "Ayuda técnica"].map(
                (x) => (
                  <option key={x}>{x}</option>
                ),
              )}
            </select>
          </label>
          <textarea
            required
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Comparte tu duda o conocimiento…"
            maxLength="4000"
          />
          {previewUrl && (
            <div className="preview">
              <img src={previewUrl} alt="preview" />
              <button
                type="button"
                onClick={() => {
                  setImage(null);
                  setPreviewUrl("");
                }}
              >
                ✕
              </button>
            </div>
          )}
          <label className="file-input">
            + Imagen
            <input type="file" accept="image/*" onChange={handleImageSelect} />
          </label>
          <button disabled={loading || uploading}>
            {uploading ? "Subiendo…" : loading ? "Publicando…" : "Publicar"}
          </button>
          {notice && <p className="info">{notice}</p>}
        </form>
        <div className="forum-tools">
          <div className="toolbar">
            <Search size={18} />
            <input
              aria-label="Buscar"
              placeholder="Buscar publicaciones…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="posts-feed">
          {loading && !posts.length ? (
            <div className="center">
              <span className="spinner" />
            </div>
          ) : filtered.length > 0 ? (
            filtered.map((p) => (
              <button
                className="post-card"
                key={p.id}
                onClick={() => setSelected(p)}
              >
                <div className="post-header">
                  <Avatar
                    url={p.profiles?.avatar_url}
                    name={p.profiles?.full_name}
                  />
                  <div>
                    <b>{p.profiles?.full_name || "Anónimo"}</b>
                    <small>
                      {new Date(p.created_at).toLocaleDateString("es-CO")}
                    </small>
                  </div>
                </div>
                <div className="post-content">
                  <h3>{p.title}</h3>
                  <span className="tag">{p.category}</span>
                  <p>{p.body.substring(0, 150)}…</p>
                  {p.image_url && (
                    <div className="post-thumb">
                      <img src={p.image_url} alt="thumb" />
                    </div>
                  )}
                </div>
                <div className="post-footer">💬 {replyCount[p.id] || 0}</div>
              </button>
            ))
          ) : (
            <div className="empty">
              <h2>Aún no hay publicaciones</h2>
              <p>Escribe tu primera duda o recomendación en el formulario.</p>
              {notice ? (
                <Notice>{notice}</Notice>
              ) : (
                <p className="info">
                  Si al publicar aparece un error, ejecuta la migración 004 en
                  Supabase.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
=======
              {categoryValues.map((value, index) => (
                <option key={value} value={value}>
                  {t(`community.categories.${index}`)}
                </option>
              ))}
            </select>
          </label>
          <textarea
            aria-label={t("community.topicPlaceholder")}
            required
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={t("community.topicPlaceholder")}
            maxLength="4000"
          />
          <button>{t("community.submitTopic")}</button>
        </form>
        <div className="forum-stream">
          {topics.map((topic) => (
            <button
              className="forum-row"
              key={topic.id}
              onClick={() => setSelected(topic)}
            >
              <span className="tag">{displayCategory(topic.category)}</span>
              <b>{topic.title}</b>
              <small>
                {topic.profiles?.full_name || t("common.member")} ·{" "}
                {new Date(topic.created_at).toLocaleDateString(
                  language === "es" ? "es-CO" : "en-US",
                )}
              </small>
            </button>
          ))}
          {loading && <div className="empty" role="status">{t("community.loading")}</div>}
          {!loading && !topics.length && (
            <div className="empty">{t("community.noTopics")}</div>
          )}
        </div>
      </div>
      {notice && <Notice>{t(notice)}</Notice>}
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
    </Page>
  );
}
function Profile({ session, profile }) {
<<<<<<< HEAD
  const [name, setName] = useState(profile?.full_name || ""),
    [msg, setMsg] = useState(""),
    [uploading, setUploading] = useState(false),
    [previewUrl, setPreviewUrl] = useState(profile?.avatar_url || "");
=======
  const { t } = useLanguage();
  const [name, setName] = useState(profile?.full_name || ""),
    [msg, setMsg] = useState("");
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
  const save = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: clean(name) })
      .eq("id", session.user.id);
<<<<<<< HEAD
    setMsg(error ? error.message : "✓ Perfil actualizado");
  };
  const handleAvatarSelect = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(f.type)) {
      setMsg("Solo JPG, PNG o WebP");
      return;
    }
    if (f.size > 2097152) {
      setMsg("Foto debe ser menor a 2MB");
      return;
    }
    setUploading(true);
    const ext = f.name.split(".").pop();
    const folder = session.user.id;
    const path = `${folder}/avatar-${Date.now()}.${ext}`;
    const { data: files, error: listError } = await supabase.storage
      .from("avatars")
      .list(folder);
    if (listError) {
      setMsg(`No se pudo preparar la foto: ${listError.message}`);
      setUploading(false);
      return;
    }
    if (files?.length) {
      const { error: removeError } = await supabase.storage
        .from("avatars")
        .remove(files.map((file) => `${folder}/${file.name}`));
      if (removeError) {
        setMsg(`No se pudo reemplazar la foto: ${removeError.message}`);
        setUploading(false);
        return;
      }
    }
    const { error: upError } = await supabase.storage
      .from("avatars")
      .upload(path, f, { upsert: true });
    if (upError) {
      setMsg(`No se pudo subir la foto: ${upError.message}`);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    const { error: dbError } = await supabase
      .from("profiles")
      .update({ avatar_url: data.publicUrl })
      .eq("id", session.user.id);
    if (dbError) {
      setMsg(`La foto se subió, pero no se guardó el perfil: ${dbError.message}`);
      setUploading(false);
      return;
    }
    setPreviewUrl(data.publicUrl);
    setMsg("✓ Foto actualizada");
    setUploading(false);
  };
  return (
    <Page title="Mi perfil">
      <form className="card form" onSubmit={save}>
        <div className="profile-avatar">
          <img
            src={
              previewUrl ||
              "data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22%23ccc%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%22 y=%2250%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23666%22 font-size=%2240%22%3EU%3C/text%3E%3C/svg%3E"
            }
            alt="avatar"
          />
          <label className="file-input-avatar">
            Cambiar
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarSelect}
              disabled={uploading}
            />
          </label>
        </div>
        <label>
          Nombre
=======
    setMsg(error ? "profile.updateError" : "profile.updated");
  };
  return (
    <Page title={t("profile.title")}>
      <form className="card form" onSubmit={save}>
        <label>
          {t("profile.name")}
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength="60"
          />
        </label>
        <label>
<<<<<<< HEAD
          Correo
          <input value={session.user.email} disabled />
        </label>
        <button>{uploading ? "Guardando…" : "Guardar cambios"}</button>
        {msg && <p>{msg}</p>}
=======
          {t("profile.email")}
          <input value={session.user.email} disabled />
        </label>
        <button>{t("common.save")}</button>
        {msg && <p>{t(msg)}</p>}
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
      </form>
    </Page>
  );
}
<<<<<<< HEAD
function AdminCollection({ table, fields, title }) {
  const [rows, setRows] = useState([]),
    [draft, setDraft] = useState({}),
    [msg, setMsg] = useState("");
=======
function Manuals({ profile }) {
  const { t } = useLanguage();
  const availableManuals = profile?.role === "admin"
    ? [
        {
          file: "/manuales/manual_usuario.pdf",
          titleKey: "manuals.userTitle",
          descriptionKey: "manuals.userDescription",
        },
        {
          file: "/manuales/manual_administrador.pdf",
          titleKey: "manuals.adminTitle",
          descriptionKey: "manuals.adminDescription",
        },
      ]
    : profile?.role === "user"
      ? [
          {
            file: "/manuales/manual_usuario.pdf",
            titleKey: "manuals.userTitle",
            descriptionKey: "manuals.userDescription",
          },
        ]
      : [];

  return (
    <Page title={t("manuals.title")}>
      <p className="manuals-intro">{t("manuals.subtitle")}</p>
      {profile?.role !== "user" && profile?.role !== "admin" ? (
        <div className="empty" role="status" aria-live="polite">
          {t("manuals.loadingRole")}
        </div>
      ) : (
        <section className="manuals-grid">
          {availableManuals.map((manual) => {
            const title = t(manual.titleKey);
            return (
              <article className="card manual-card" key={manual.file}>
                <BookOpen size={24} aria-hidden="true" />
                <h2>{title}</h2>
                <p>{t(manual.descriptionKey)}</p>
                <a
                  className="manual-download"
                  href={manual.file}
                  download
                  aria-label={t("manuals.downloadNamed", { title })}
                >
                  <Download size={18} aria-hidden="true" />
                  {t("manuals.download")}
                </a>
              </article>
            );
          })}
        </section>
      )}
    </Page>
  );
}
function AdminCollection({ table, fields, title }) {
  const { t, translateCatalog } = useLanguage();
  const [rows, setRows] = useState([]),
    [draft, setDraft] = useState({}),
    [msg, setMsg] = useState(""),
    [loading, setLoading] = useState(true);
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
  const load = async () => {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order("created_at", { ascending: false });
    setRows(data || []);
<<<<<<< HEAD
    setMsg(error?.message || "");
=======
    if (error) setMsg("common.error");
    setLoading(false);
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
  };
  useEffect(() => {
    load();
  }, [table]);
  const save = async (e) => {
    e.preventDefault();
    const payload = Object.fromEntries(fields.map((f) => [f, draft[f] || ""]));
    const { error } = draft.id
      ? await supabase.from(table).update(payload).eq("id", draft.id)
      : await supabase.from(table).insert(payload);
<<<<<<< HEAD
    setMsg(error ? error.message : "Cambio guardado.");
=======
    setMsg(error ? "common.error" : "admin.edited");
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
    setDraft({});
    load();
  };
  const remove = async (id) => {
<<<<<<< HEAD
    if (!confirm("¿Eliminar este registro?")) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    setMsg(error ? error.message : "Registro eliminado.");
=======
    if (!window.confirm(t("admin.confirmDelete"))) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    setMsg(error ? "common.error" : "admin.deleted");
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
    load();
  };
  return (
    <section className="admin-split">
      <form className="card form" onSubmit={save}>
        <h2>
<<<<<<< HEAD
          {draft.id ? "Editar" : "Nuevo"} {title}
        </h2>
        {fields.map((f) => (
          <label key={f}>
            {f.replaceAll("_", " ")}
=======
          {draft.id ? t("common.edit") : t("admin.new")} {t(title)}
        </h2>
        {fields.map((f) => (
          <label key={f}>
            {t(`admin.fields.${f}`)}
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
            <textarea
              required
              value={draft[f] || ""}
              onChange={(e) => setDraft({ ...draft, [f]: e.target.value })}
            />
          </label>
        ))}
<<<<<<< HEAD
        <button>{draft.id ? "Actualizar" : "Crear"}</button>
        {draft.id && (
          <button type="button" className="link" onClick={() => setDraft({})}>
            Cancelar edición
          </button>
        )}
        {msg && <p>{msg}</p>}
      </form>
      <div className="admin-list">
        {rows.map((row) => (
          <article className="comment" key={row.id}>
            <b>{row.name}</b>
            <p>{row.description || row.what_is}</p>
            <button onClick={() => setDraft(row)}>Editar</button>
            <button className="danger" onClick={() => remove(row.id)}>
              Eliminar
            </button>
          </article>
        ))}
=======
        <button>{draft.id ? t("common.update") : t("common.create")}</button>
        {draft.id && (
          <button type="button" className="link" onClick={() => setDraft({})}>
            {t("admin.cancelEdit")}
          </button>
        )}
        {msg && <p>{t(msg)}</p>}
      </form>
      <div className="admin-list">
        {loading && <div className="empty" role="status">{t("common.loading")}</div>}
        {rows.map((sourceRow) => {
          const row = translateCatalog(table, sourceRow);
          return (
            <article className="comment" key={row.id}>
              <b>{row.name}</b>
              <p>{row.description || row.what_is}</p>
              <button onClick={() => setDraft(sourceRow)}>{t("common.edit")}</button>
              <button className="danger" onClick={() => remove(row.id)}>
                {t("common.delete")}
              </button>
            </article>
          );
        })}
        {!loading && !rows.length && (
          <div className="empty">{t("common.noContent")}</div>
        )}
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
      </div>
    </section>
  );
}
<<<<<<< HEAD
function Moderation({ table = "comments", label = "comentarios" }) {
  const [rows, setRows] = useState([]),
    [error, setError] = useState("");
  const load = () => {
    let query = supabase
      .from(table)
      .select(
        table === "comments"
          ? "*,profiles(full_name)"
          : table === "forum_posts"
            ? "*,profiles(full_name,avatar_url)"
            : "*,profiles(full_name,avatar_url),forum_posts(title)",
      );
    query.order("created_at", { ascending: false }).then(({ data, error }) => {
      setRows(data || []);
      setError(error?.message || "");
    });
  };
  useEffect(() => {
    load();
  }, [table]);
  const act = async (id, status) => {
    const { error: actError } = await supabase
      .from(table)
      .update({ status })
      .eq("id", id);
    if (actError) setError(actError.message);
    else load();
  };
  const deleteItem = async (id) => {
    if (!confirm("¿Eliminar?")) return;
    const { error: delError } = await supabase
      .from(table)
      .delete()
      .eq("id", id);
    if (delError) setError(delError.message);
    else load();
  };
  return (
    <section className="feed">
      {error && <Notice>{error}</Notice>}
      {rows.map((r) => (
        <article className="comment" key={r.id}>
          <b>{r.profiles?.full_name || "Usuario"}</b>
          {table === "forum_posts" && <h3>{r.title}</h3>}
          {table === "forum_replies" && r.forum_posts && (
            <small>Respuesta en: {r.forum_posts.title}</small>
          )}
          <p>{r.body}</p>
          {r.image_url && (
            <img
              src={r.image_url}
              alt="mod"
              style={{ maxHeight: "100px", borderRadius: "4px" }}
            />
          )}
          <div>
            <button onClick={() => act(r.id, "approved")}>Aprobar</button>
            <button className="danger" onClick={() => deleteItem(r.id)}>
              Eliminar
            </button>
          </div>
        </article>
      ))}
      {!error && !rows.length && (
        <div className="empty">Sin {label} pendientes.</div>
      )}
=======
function Moderation() {
  const { t } = useLanguage();
  const [rows, setRows] = useState([]),
    [loading, setLoading] = useState(true),
    [message, setMessage] = useState("");
  const load = () =>
    supabase
      .from("comments")
      .select("*,profiles(full_name)")
      .eq("status", "pending")
      .order("created_at")
      .then(({ data, error }) => {
        setRows(data || []);
        setLoading(false);
        if (error) setMessage("common.error");
      });
  useEffect(() => {
    load();
  }, []);
  const act = async (id, status) => {
    const { error } = await supabase
      .from("comments")
      .update({ status })
      .eq("id", id);
    setMessage(error ? "common.error" : `admin.${status}`);
    load();
  };
  return (
    <section className="feed">
      {rows.map((r) => (
        <article className="comment" key={r.id}>
          <b>{r.profiles?.full_name || t("common.user")}</b>
          <p>{r.body}</p>
          <button onClick={() => act(r.id, "approved")}>{t("admin.approve")}</button>
          <button className="danger" onClick={() => act(r.id, "rejected")}>
            {t("admin.reject")}
          </button>
        </article>
      ))}
      {loading && <div className="empty" role="status">{t("common.loading")}</div>}
      {!loading && !rows.length && (
        <div className="empty">{t("admin.noPending")}</div>
      )}
      {message && <Notice>{t(message)}</Notice>}
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
    </section>
  );
}
function Admin() {
<<<<<<< HEAD
  const [view, setView] = useState("methods");
  return (
    <Page title="Centro de control">
      <div className="admin-tabs">
        {[
          ["methods", "Métodos"],
          ["threats", "Amenazas"],
          ["comments", "Comentarios"],
          ["posts", "Temas del foro"],
          ["replies", "Respuestas"],
=======
  const { t } = useLanguage();
  const [view, setView] = useState("methods");
  return (
    <Page title={t("admin.title")}>
      <div className="admin-tabs">
        {[
          ["methods", "admin.methods"],
          ["threats", "admin.threats"],
          ["comments", "admin.moderation"],
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
        ].map(([id, label]) => (
          <button
            key={id}
            className={view === id ? "active" : ""}
            onClick={() => setView(id)}
          >
<<<<<<< HEAD
            {label}
=======
            {t(label)}
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
          </button>
        ))}
      </div>
      {view === "methods" && (
        <AdminCollection
          table="prevention_methods"
<<<<<<< HEAD
          title="método"
=======
          title="admin.method"
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
          fields={[
            "name",
            "description",
            "risk_level",
            "recommendations",
            "examples",
            "what_to_do",
          ]}
        />
      )}{" "}
      {view === "threats" && (
        <AdminCollection
          table="threats"
<<<<<<< HEAD
          title="amenaza"
=======
          title="admin.threat"
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
          fields={["name", "category", "what_is", "how_spreads", "prevention"]}
        />
      )}{" "}
      {view === "comments" && <Moderation />}
<<<<<<< HEAD
      {view === "posts" && (
        <Moderation table="forum_posts" label="temas del foro" />
      )}
      {view === "replies" && (
        <Moderation table="forum_replies" label="respuestas" />
      )}
=======
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
    </Page>
  );
}
export default function App() {
  return (
<<<<<<< HEAD
    <BrowserRouter basename="/PPI">
      <AuthProvider>
=======
    <LanguageProvider>
      <BrowserRouter>
        <AuthProvider>
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
        {({ session, profile }) => (
          <Routes>
            <Route path="/acceso" element={<Access />} />
            <Route path="/registro" element={<Access registerDefault />} />
            <Route
<<<<<<< HEAD
              path="/confirmacion"
              element={<EmailConfirmation session={session} />}
            />
            <Route
=======
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
              path="/inicio"
              element={
                <Protected session={session} profile={profile}>
                  <Home profile={profile} />
                </Protected>
              }
            />
            <Route
              path="/metodos"
              element={
                <Protected session={session} profile={profile}>
                  <Catalogue
                    table="prevention_methods"
<<<<<<< HEAD
                    title="Métodos de prevención"
                    kind="Método"
=======
                    titleKey="catalogue.methodTitle"
                    kindKey="catalogue.method"
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
                  />
                </Protected>
              }
            />
            <Route
              path="/amenazas"
              element={
                <Protected session={session} profile={profile}>
                  <Catalogue
                    table="threats"
<<<<<<< HEAD
                    title="Amenazas informáticas"
                    kind="Amenaza"
=======
                    titleKey="catalogue.threatTitle"
                    kindKey="catalogue.threat"
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
                  />
                </Protected>
              }
            />
            <Route
              path="/comunidad"
              element={
                <Protected session={session} profile={profile}>
                  <Community session={session} />
                </Protected>
              }
            />
            <Route
              path="/perfil"
              element={
                <Protected session={session} profile={profile}>
                  <Profile session={session} profile={profile} />
                </Protected>
              }
            />
            <Route
<<<<<<< HEAD
=======
              path="/manuales"
              element={
                <Protected session={session} profile={profile}>
                  <Manuals profile={profile} />
                </Protected>
              }
            />
            <Route
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
              path="/admin"
              element={
                <Protected session={session} profile={profile} admin>
                  <Admin />
                </Protected>
              }
            />
            <Route
              path="*"
              element={<Navigate to={session ? "/inicio" : "/acceso"} />}
            />
          </Routes>
        )}
<<<<<<< HEAD
      </AuthProvider>
    </BrowserRouter>
=======
        </AuthProvider>
      </BrowserRouter>
    </LanguageProvider>
>>>>>>> ceebf19 (feat: add bilingual UI and role-based manuals)
  );
}
