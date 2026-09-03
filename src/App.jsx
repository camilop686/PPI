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
const Loading = () => (
  <div className="center">
    <span className="spinner" />
    Cargando plataforma segura…
  </div>
);
const Notice = ({ children }) => (
  <div className="notice">
    <AlertCircle size={18} />
    {children}
  </div>
);
function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined),
    [profile, setProfile] = useState(undefined);
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
    setProfile(undefined);
    supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single()
      .then(({ data }) => setProfile(data || null));
  }, [session]);
  return session === undefined || (session && profile === undefined) ? (
    <Loading />
  ) : (
    children({ session, profile })
  );
}
function Layout({ children, profile }) {
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
            PPI<small>Centro de defensa digital</small>
          </span>
        </div>
        <nav>
          {nav.map(([to, label, I]) => (
            <NavLink key={to} to={to}>
              <I size={18} />
              {label}
            </NavLink>
          ))}
          {profile?.role === "admin" && (
            <NavLink to="/admin">
              <BarChart3 size={18} />
              Administración
            </NavLink>
          )}
        </nav>
        <button className="ghost" onClick={logout}>
          <LogOut size={18} />
          Cerrar sesión
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
  const [register, setRegister] = useState(registerDefault),
    [recovery, setRecovery] = useState(false),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  const go = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    if (!isConfigured)
      return setMessage(
        "Configura las variables de Supabase para activar el acceso.",
      );
    const f = new FormData(e.currentTarget),
      email = String(f.get("email")).trim(),
      password = String(f.get("password"));
    setBusy(true);
    let error;
    if (recovery)
      ({ error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${location.origin}/perfil`,
      }));
    else if (register)
      ({ error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: clean(String(f.get("name"))) } },
      }));
    else
      ({ error } = await supabase.auth.signInWithPassword({ email, password }));
    setBusy(false);
    setMessage(
      error
        ? error.message
        : recovery
          ? "Revisa tu correo para continuar."
          : register
            ? "Cuenta creada. Confirma tu correo antes de iniciar sesión."
            : "",
    );
    if (!error && !register && !recovery) go("/inicio");
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
      </section>
      <form className="card" onSubmit={submit}>
        <h2>
          {recovery
            ? "Recuperar contraseña"
            : register
              ? "Crear cuenta"
              : "Acceso seguro"}
        </h2>
        {message && <Notice>{message}</Notice>}
        {register && (
          <label>
            Nombre completo
            <input name="name" required minLength="2" maxLength="60" />
          </label>
        )}
        <label>
          Correo electrónico
          <input name="email" type="email" required />
        </label>
        {!recovery && (
          <label>
            Contraseña
            <input name="password" type="password" minLength="8" required />
          </label>
        )}
        <button disabled={busy}>
          {busy
            ? "Procesando…"
            : recovery
              ? "Enviar enlace"
              : register
                ? "Crear cuenta"
                : "Iniciar sesión"}
        </button>
        <button
          type="button"
          className="link"
          onClick={() => {
            setRecovery(!recovery);
            setMessage("");
          }}
        >
          {recovery ? "Volver al acceso" : "¿Olvidaste tu contraseña?"}
        </button>
        {!recovery && (
          <button
            type="button"
            className="link"
            onClick={() => {
              setRegister(!register);
              setMessage("");
            }}
          >
            {register ? "Volver a iniciar sesión" : "Crear una cuenta"}
          </button>
        )}
      </form>
    </div>
  );
}
const Page = ({ title, children }) => (
  <>
    <header className="pagehead">
      <div>
        <p className="eyebrow">PPI · aprendizaje seguro</p>
        <h1>{title}</h1>
      </div>
    </header>
    {children}
  </>
);
function Home({ profile }) {
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
            <strong>{x[0]}</strong>
            <span>{x[1]}</span>
          </article>
        ))}
      </section>
    </Page>
  );
}
function Catalogue({ table, title, kind }) {
  const [items, setItems] = useState([]),
    [query, setQuery] = useState(""),
    [error, setError] = useState("");
  useEffect(() => {
    supabase
      .from(table)
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        setItems(data || []);
        setError(error?.message || "");
      });
  }, [table]);
  const filtered = useMemo(
    () =>
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
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
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
      )}
    </Page>
  );
}
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
    [selected, setSelected] = useState(null),
    [title, setTitle] = useState(""),
    [body, setBody] = useState(""),
    [category, setCategory] = useState("General"),
    [reply, setReply] = useState(""),
    [replies, setReplies] = useState([]),
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
    const { error } = await supabase
      .from("forum_posts")
      .insert({
        author_id: session.user.id,
        title: clean(title),
        body: clean(body),
        category,
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
    const { error } = await supabase
      .from("forum_replies")
      .insert({
        post_id: selected.id,
        author_id: session.user.id,
        body: clean(reply),
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
  if (selected)
    return (
      <Page title={selected.title}>
        <button className="link" onClick={() => setSelected(null)}>
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
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              minLength="6"
              maxLength="120"
              placeholder="¿Cuál es tu pregunta?"
            />
          </label>
          <label>
            Categoría
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
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
    </Page>
  );
}
function Profile({ session, profile }) {
  const [name, setName] = useState(profile?.full_name || ""),
    [msg, setMsg] = useState(""),
    [uploading, setUploading] = useState(false),
    [previewUrl, setPreviewUrl] = useState(profile?.avatar_url || "");
  const save = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: clean(name) })
      .eq("id", session.user.id);
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
      setMsg(`Error preparando foto: ${listError.message}`);
      setUploading(false);
      return;
    }
    if (files?.length) {
      const { error: removeError } = await supabase.storage
        .from("avatars")
        .remove(files.map((file) => `${folder}/${file.name}`));
      if (removeError) {
        setMsg(`Error reemplazando foto: ${removeError.message}`);
        setUploading(false);
        return;
      }
    }
    const { error: upError } = await supabase.storage
      .from("avatars")
      .upload(path, f, { upsert: true });
    if (upError) {
      setMsg("Error subiendo foto");
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    const { error: dbError } = await supabase
      .from("profiles")
      .update({ avatar_url: data.publicUrl })
      .eq("id", session.user.id);
    if (dbError) {
      setMsg("Error guardando foto");
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
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength="60"
          />
        </label>
        <label>
          Correo
          <input value={session.user.email} disabled />
        </label>
        <button>{uploading ? "Guardando…" : "Guardar cambios"}</button>
        {msg && <p>{msg}</p>}
      </form>
    </Page>
  );
}
function AdminCollection({ table, fields, title }) {
  const [rows, setRows] = useState([]),
    [draft, setDraft] = useState({}),
    [msg, setMsg] = useState("");
  const load = async () => {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order("created_at", { ascending: false });
    setRows(data || []);
    setMsg(error?.message || "");
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
    setMsg(error ? error.message : "Cambio guardado.");
    setDraft({});
    load();
  };
  const remove = async (id) => {
    if (!confirm("¿Eliminar este registro?")) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    setMsg(error ? error.message : "Registro eliminado.");
    load();
  };
  return (
    <section className="admin-split">
      <form className="card form" onSubmit={save}>
        <h2>
          {draft.id ? "Editar" : "Nuevo"} {title}
        </h2>
        {fields.map((f) => (
          <label key={f}>
            {f.replaceAll("_", " ")}
            <textarea
              required
              value={draft[f] || ""}
              onChange={(e) => setDraft({ ...draft, [f]: e.target.value })}
            />
          </label>
        ))}
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
      </div>
    </section>
  );
}
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
    </section>
  );
}
function Admin() {
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
        ].map(([id, label]) => (
          <button
            key={id}
            className={view === id ? "active" : ""}
            onClick={() => setView(id)}
          >
            {label}
          </button>
        ))}
      </div>
      {view === "methods" && (
        <AdminCollection
          table="prevention_methods"
          title="método"
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
          title="amenaza"
          fields={["name", "category", "what_is", "how_spreads", "prevention"]}
        />
      )}{" "}
      {view === "comments" && <Moderation />}
      {view === "posts" && (
        <Moderation table="forum_posts" label="temas del foro" />
      )}
      {view === "replies" && (
        <Moderation table="forum_replies" label="respuestas" />
      )}
    </Page>
  );
}
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {({ session, profile }) => (
          <Routes>
            <Route path="/acceso" element={<Access />} />
            <Route path="/registro" element={<Access registerDefault />} />
            <Route
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
                    title="Métodos de prevención"
                    kind="Método"
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
                    title="Amenazas informáticas"
                    kind="Amenaza"
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
      </AuthProvider>
    </BrowserRouter>
  );
}
