import { useCallback, useEffect, useMemo, useState } from "react";
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
const POST_CATEGORIES = ["General", "Prevención", "Amenazas", "Ayuda técnica"];
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
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
const formatDate = (value) =>
  new Date(value).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
const getPreviewUrl = (file) => URL.createObjectURL(file);

function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined);
  const [profile, setProfile] = useState(undefined);

  const refreshProfile = useCallback(async (userId) => {
    if (!userId) {
      setProfile(null);
      return;
    }

    setProfile(undefined);
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    setProfile(data || null);
  }, []);

  useEffect(() => {
    if (!isConfigured) {
      setSession(null);
      return;
    }

    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (active) {
        setSession(data.session);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (active) {
        setSession(nextSession);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session?.user?.id) {
      setProfile(null);
      return;
    }

    refreshProfile(session.user.id);
  }, [refreshProfile, session?.user?.id]);

  return session === undefined || (session && profile === undefined) ? (
    <Loading />
  ) : (
    children({ session, profile, refreshProfile })
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
          {nav.map(([to, label, Icon]) => (
            <NavLink key={to} to={to}>
              <Icon size={18} />
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
  if (admin && profile?.role !== "admin") {
    return <Navigate to="/inicio" replace />;
  }

  return <Layout profile={profile}>{children}</Layout>;
}

function Access({ registerDefault = false }) {
  const [register, setRegister] = useState(registerDefault);
  const [recovery, setRecovery] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const go = useNavigate();

  useEffect(() => {
    setRegister(registerDefault);
    setRecovery(false);
    setMessage("");
  }, [registerDefault]);

  const submit = async (e) => {
    e.preventDefault();

    if (!isConfigured) {
      setMessage("Configura las variables de Supabase para activar el acceso.");
      return;
    }

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    const fullName = clean(String(form.get("name") || ""));

    if (register && (fullName.length < 2 || fullName.length > 60)) {
      setMessage("Ingresa un nombre válido entre 2 y 60 caracteres.");
      return;
    }

    setBusy(true);
    setMessage("");

    let error;
    if (recovery) {
      ({ error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/perfil`,
      }));
    } else if (register) {
      ({ error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      }));
    } else {
      ({ error } = await supabase.auth.signInWithPassword({ email, password }));
    }

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

    if (!error && !register && !recovery) {
      go("/inicio");
    }
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
        ].map((item) => (
          <article className="stat" key={item[1]}>
            <strong>{item[0]}</strong>
            <span>{item[1]}</span>
          </article>
        ))}
      </section>
    </Page>
  );
}

function Catalogue({ table, title, kind }) {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    supabase
      .from(table)
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error: loadError }) => {
        setItems(data || []);
        setError(loadError?.message || "");
      });
  }, [table]);

  const filtered = useMemo(
    () =>
      items.filter((item) =>
        JSON.stringify(item).toLowerCase().includes(query.toLowerCase()),
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
        {filtered.map((item) => (
          <article className="card" key={item.id}>
            <span className="tag">{item.risk_level || item.category || kind}</span>
            <h2>{item.name}</h2>
            <p>{item.description || item.what_is}</p>
            {item.recommendations && (
              <>
                <h3>Recomendación</h3>
                <p>{item.recommendations}</p>
              </>
            )}
            {item.how_spreads && (
              <p>
                <b>Propagación:</b> {item.how_spreads}
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

const Avatar = ({ url, name = "U", className = "avatar" }) => {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((chunk) => chunk[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return url ? (
    <img src={url} alt={name} className={className} />
  ) : (
    <div className={`${className} avatar-init`}>{initials || "U"}</div>
  );
};

function Community({ session }) {
  const [posts, setPosts] = useState([]);
  const [replyCount, setReplyCount] = useState({});
  const [selected, setSelected] = useState(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("General");
  const [reply, setReply] = useState("");
  const [replies, setReplies] = useState([]);
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [posting, setPosting] = useState(false);
  const [replying, setReplying] = useState(false);
  const [uploadingPostImage, setUploadingPostImage] = useState(false);
  const [uploadingReplyImage, setUploadingReplyImage] = useState(false);
  const [postImage, setPostImage] = useState(null);
  const [postPreviewUrl, setPostPreviewUrl] = useState("");
  const [replyImage, setReplyImage] = useState(null);
  const [replyPreviewUrl, setReplyPreviewUrl] = useState("");

  const resetPostComposer = () => {
    setTitle("");
    setBody("");
    setCategory("General");
    setPostImage(null);
    setPostPreviewUrl("");
  };

  const resetReplyComposer = () => {
    setReply("");
    setReplyImage(null);
    setReplyPreviewUrl("");
  };

  useEffect(
    () => () => {
      if (postPreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(postPreviewUrl);
      }
    },
    [postPreviewUrl],
  );

  useEffect(
    () => () => {
      if (replyPreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(replyPreviewUrl);
      }
    },
    [replyPreviewUrl],
  );

  const handleImageSelect = (event, mode) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!IMAGE_TYPES.includes(file.type)) {
      setNotice("Solo JPG, PNG o WebP");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setNotice("La imagen debe ser menor o igual a 5 MB");
      return;
    }

    const preview = getPreviewUrl(file);
    setNotice("");

    if (mode === "reply") {
      setReplyImage(file);
      setReplyPreviewUrl(preview);
      return;
    }

    setPostImage(file);
    setPostPreviewUrl(preview);
  };

  const uploadImage = async (file, onUploadingChange) => {
    if (!file) return null;

    onUploadingChange(true);
    const ext = file.name.split(".").pop();
    const path = `${session.user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("forum-images").upload(path, file, {
      upsert: false,
    });

    if (error) {
      setNotice(`Error subiendo imagen: ${error.message}`);
      onUploadingChange(false);
      return null;
    }

    const { data } = supabase.storage.from("forum-images").getPublicUrl(path);
    onUploadingChange(false);
    return data.publicUrl;
  };

  const loadPosts = useCallback(async () => {
    setLoadingPosts(true);

    const { data, error } = await supabase
      .from("forum_posts")
      .select("*,profiles(id,full_name,avatar_url)")
      .order("created_at", { ascending: false });

    if (error) {
      setNotice(`Error cargando publicaciones: ${error.message}`);
      setPosts([]);
      setReplyCount({});
      setLoadingPosts(false);
      return;
    }

    const nextPosts = data || [];
    setPosts(nextPosts);

    if (!nextPosts.length) {
      setReplyCount({});
      setLoadingPosts(false);
      return;
    }

    const { data: repliesData, error: repliesError } = await supabase
      .from("forum_replies")
      .select("post_id")
      .in(
        "post_id",
        nextPosts.map((post) => post.id),
      );

    if (repliesError) {
      setNotice(`Error cargando publicaciones: ${repliesError.message}`);
      setReplyCount({});
      setLoadingPosts(false);
      return;
    }

    const counts = (repliesData || []).reduce((acc, item) => {
      acc[item.post_id] = (acc[item.post_id] || 0) + 1;
      return acc;
    }, {});

    setReplyCount(counts);
    setLoadingPosts(false);
  }, [session.user.id]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  useEffect(() => {
    let cancelled = false;

    if (!selected) {
      setReplies([]);
      setLoadingReplies(false);
      resetReplyComposer();
      return;
    }

    setLoadingReplies(true);

    supabase
      .from("forum_replies")
      .select("*,profiles(id,full_name,avatar_url)")
      .eq("post_id", selected.id)
      .order("created_at")
      .then(({ data, error }) => {
        if (cancelled) return;

        if (error) {
          setNotice(`Error cargando comentarios: ${error.message}`);
          setReplies([]);
        } else {
          setReplies(data || []);
        }

        setLoadingReplies(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selected]);

  const create = async (e) => {
    e.preventDefault();

    const safeTitle = clean(title);
    const safeBody = clean(body);
    if (safeTitle.length < 6 || safeTitle.length > 120) {
      setNotice("El título debe tener entre 6 y 120 caracteres");
      return;
    }

    if (!safeBody) {
      setNotice("El contenido no puede estar vacío");
      return;
    }

    setPosting(true);
    setNotice("");

    const imageUrl = postImage
      ? await uploadImage(postImage, setUploadingPostImage)
      : null;

    if (postImage && !imageUrl) {
      setPosting(false);
      return;
    }

    const { data, error } = await supabase
      .from("forum_posts")
      .insert({
        author_id: session.user.id,
        title: safeTitle,
        body: safeBody,
        category,
        status: "approved",
        image_url: imageUrl,
      })
      .select("*,profiles(id,full_name,avatar_url)")
      .single();

    if (error) {
      setNotice(`Error creando publicación: ${error.message}`);
    } else {
      setPosts((current) => [data, ...current]);
      setReplyCount((current) => ({ ...current, [data.id]: 0 }));
      resetPostComposer();
      setNotice("Publicación creada correctamente");
    }

    setPosting(false);
  };

  const sendReply = async (e) => {
    e.preventDefault();

    if (!selected) return;

    const safeReply = clean(reply);
    if (!safeReply) {
      setNotice("El comentario no puede estar vacío");
      return;
    }

    setReplying(true);
    setNotice("");

    const imageUrl = replyImage
      ? await uploadImage(replyImage, setUploadingReplyImage)
      : null;

    if (replyImage && !imageUrl) {
      setReplying(false);
      return;
    }

    const { data, error } = await supabase
      .from("forum_replies")
      .insert({
        post_id: selected.id,
        author_id: session.user.id,
        body: safeReply,
        status: "approved",
        image_url: imageUrl,
      })
      .select("*,profiles(id,full_name,avatar_url)")
      .single();

    if (error) {
      setNotice(`Error creando comentario: ${error.message}`);
    } else {
      setReplies((current) => [...current, data]);
      setReplyCount((current) => ({
        ...current,
        [selected.id]: (current[selected.id] || 0) + 1,
      }));
      resetReplyComposer();
      setNotice("Comentario creado correctamente");
    }

    setReplying(false);
  };

  const filtered = useMemo(() => {
    const normalizedQuery = search.trim().toLowerCase();
    if (!normalizedQuery) return posts;

    return posts.filter((post) =>
      [
        post.title,
        post.body,
        post.category,
        post.profiles?.full_name,
      ].some((value) => value?.toLowerCase().includes(normalizedQuery)),
    );
  }, [posts, search]);

  if (selected) {
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
              <small>{formatDate(selected.created_at)}</small>
            </div>
          </div>
          <h2>{selected.title}</h2>
          <span className="tag">{selected.category}</span>
          <p>{selected.body}</p>
          {selected.image_url && (
            <img src={selected.image_url} alt={selected.title} className="post-image" />
          )}
        </article>
        <div className="replies-section">
          <b>
            {replyCount[selected.id] || replies.length} {""}
            {(replyCount[selected.id] || replies.length) === 1
              ? "comentario"
              : "comentarios"}
          </b>
          {loadingReplies ? (
            <div className="center">
              <span className="spinner" />
            </div>
          ) : replies.length ? (
            <div className="feed">
              {replies.map((item) => (
                <article className="reply" key={item.id}>
                  <Avatar
                    url={item.profiles?.avatar_url}
                    name={item.profiles?.full_name}
                  />
                  <div className="reply-content">
                    <div>
                      <b>{item.profiles?.full_name || "Anónimo"}</b>
                      <small>{formatDate(item.created_at)}</small>
                    </div>
                    <p>{item.body}</p>
                    {item.image_url && (
                      <img src={item.image_url} alt="comentario" className="reply-image" />
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty">Aún no hay comentarios. Sé el primero en comentar.</div>
          )}
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
            {replyPreviewUrl && (
              <div className="preview">
                <p>Imagen seleccionada: {replyImage?.name || "archivo"}</p>
                <button type="button" onClick={resetReplyComposer}>
                  ✕
                </button>
              </div>
            )}
            <label className="file-input">
              + Imagen
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => handleImageSelect(e, "reply")}
              />
            </label>
            <button disabled={replying || uploadingReplyImage}>
              {uploadingReplyImage
                ? "Subiendo…"
                : replying
                  ? "Enviando…"
                  : "Comentar"}
            </button>
          </form>
        )}
        {notice && <Notice>{notice}</Notice>}
      </Page>
    );
  }

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
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {POST_CATEGORIES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <textarea
            required
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Comparte tu duda o conocimiento…"
            maxLength="4000"
          />
          {postPreviewUrl && (
            <div className="preview">
              <p>Imagen seleccionada: {postImage?.name || "archivo"}</p>
              <button type="button" onClick={resetPostComposer}>
                ✕
              </button>
            </div>
          )}
          <label className="file-input">
            + Imagen
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => handleImageSelect(e, "post")}
            />
          </label>
          <button disabled={posting || uploadingPostImage}>
            {uploadingPostImage ? "Subiendo…" : posting ? "Publicando…" : "Publicar"}
          </button>
          {notice && <p className="info">{notice}</p>}
        </form>
        <div className="forum-tools">
          <div className="toolbar">
            <Search size={18} />
            <input
              aria-label="Buscar"
              placeholder="Buscar por título, contenido, categoría o autor…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="posts-feed">
          {loadingPosts && !posts.length ? (
            <div className="center">
              <span className="spinner" />
            </div>
          ) : filtered.length > 0 ? (
            filtered.map((post) => (
              <button className="post-card" key={post.id} onClick={() => setSelected(post)}>
                <div className="post-header">
                  <Avatar
                    url={post.profiles?.avatar_url}
                    name={post.profiles?.full_name}
                  />
                  <div>
                    <b>{post.profiles?.full_name || "Anónimo"}</b>
                    <small>{formatDate(post.created_at)}</small>
                  </div>
                </div>
                <div className="post-content">
                  <h3>{post.title}</h3>
                  <span className="tag">{post.category}</span>
                  <p>
                    {post.body.length > 150
                      ? `${post.body.slice(0, 150)}…`
                      : post.body}
                  </p>
                  {post.image_url && (
                    <div className="post-thumb">
                      <img src={post.image_url} alt={post.title} />
                    </div>
                  )}
                </div>
                <div className="post-footer">💬 {replyCount[post.id] || 0}</div>
              </button>
            ))
          ) : (
            <div className="empty">
              {search.trim()
                ? "No hay publicaciones que coincidan con tu búsqueda."
                : "Aún no hay publicaciones. Sé el primero en publicar."}
            </div>
          )}
        </div>
      </div>
    </Page>
  );
}

function Profile({ session, profile, refreshProfile }) {
  const [name, setName] = useState(profile?.full_name || "");
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(profile?.avatar_url || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    setName(profile?.full_name || "");
    setPreviewUrl(profile?.avatar_url || "");
  }, [profile?.avatar_url, profile?.full_name]);

  const save = async (e) => {
    e.preventDefault();

    const safeName = clean(name);
    if (safeName.length < 2 || safeName.length > 60) {
      setMsg("El nombre debe tener entre 2 y 60 caracteres");
      return;
    }

    if (password && password.length < 8) {
      setMsg("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    if (password && password !== confirmPassword) {
      setMsg("Las contraseñas no coinciden");
      return;
    }

    setSaving(true);
    setMsg("");

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ full_name: safeName })
      .eq("id", session.user.id);

    if (profileError) {
      setMsg(`Error actualizando perfil: ${profileError.message}`);
      setSaving(false);
      return;
    }

    if (password) {
      const { error: passwordError } = await supabase.auth.updateUser({ password });
      if (passwordError) {
        setMsg(`Error actualizando perfil: ${passwordError.message}`);
        setSaving(false);
        return;
      }
    }

    await refreshProfile(session.user.id);
    setPassword("");
    setConfirmPassword("");
    setMsg("Perfil actualizado correctamente");
    setSaving(false);
  };

  const handleAvatarSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!IMAGE_TYPES.includes(file.type)) {
      setMsg("Solo JPG, PNG o WebP");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setMsg("La imagen debe ser menor o igual a 5 MB");
      return;
    }

    setUploading(true);
    setMsg("");

    const folder = session.user.id;
    const ext = file.name.split(".").pop();
    const path = `${folder}/avatar-${Date.now()}.${ext}`;

    const { data: files, error: listError } = await supabase.storage
      .from("avatars")
      .list(folder);

    if (listError) {
      setMsg(`Error actualizando perfil: ${listError.message}`);
      setUploading(false);
      return;
    }

    if (files?.length) {
      const { error: removeError } = await supabase.storage
        .from("avatars")
        .remove(files.map((item) => `${folder}/${item.name}`));

      if (removeError) {
        setMsg(`Error actualizando perfil: ${removeError.message}`);
        setUploading(false);
        return;
      }
    }

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      setMsg(`Error actualizando perfil: ${uploadError.message}`);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    const { error: dbError } = await supabase
      .from("profiles")
      .update({ avatar_url: data.publicUrl })
      .eq("id", session.user.id);

    if (dbError) {
      setMsg(`Error actualizando perfil: ${dbError.message}`);
      setUploading(false);
      return;
    }

    setPreviewUrl(data.publicUrl);
    await refreshProfile(session.user.id);
    setMsg("Avatar actualizado correctamente");
    setUploading(false);
  };

  return (
    <Page title="Mi perfil">
      <form className="card form" onSubmit={save}>
        <div className="profile-avatar">
          <Avatar
            url={previewUrl}
            name={name || profile?.full_name || session.user.email || "Usuario"}
            className="profile-avatar-media"
          />
          <label className="file-input-avatar">
            {uploading ? "Subiendo…" : "Cambiar"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
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
            minLength="2"
            maxLength="60"
          />
        </label>
        <label>
          Correo
          <input value={session.user.email} disabled />
        </label>
        <label>
          Nueva contraseña
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength="8"
            placeholder="Déjala vacía si no deseas cambiarla"
          />
        </label>
        <label>
          Confirmar contraseña
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength="8"
            placeholder="Repite la nueva contraseña"
          />
        </label>
        <button disabled={saving || uploading}>
          {saving ? "Guardando…" : "Guardar cambios"}
        </button>
        {msg && <p>{msg}</p>}
      </form>
    </Page>
  );
}

function AdminCollection({ table, fields, title }) {
  const [rows, setRows] = useState([]);
  const [draft, setDraft] = useState({});
  const [msg, setMsg] = useState("");

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
    const payload = Object.fromEntries(fields.map((field) => [field, draft[field] || ""]));
    const { error } = draft.id
      ? await supabase.from(table).update(payload).eq("id", draft.id)
      : await supabase.from(table).insert(payload);

    setMsg(error ? error.message : "Cambio guardado.");
    setDraft({});
    load();
  };

  const remove = async (id) => {
    if (!window.confirm("¿Eliminar este registro?")) return;

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
        {fields.map((field) => (
          <label key={field}>
            {field.replaceAll("_", " ")}
            <textarea
              required
              value={draft[field] || ""}
              onChange={(e) => setDraft({ ...draft, [field]: e.target.value })}
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
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  const load = () => {
    let query = supabase.from(table).select(
      table === "comments"
        ? "*,profiles(full_name)"
        : table === "forum_posts"
          ? "*,profiles(full_name,avatar_url)"
          : "*,profiles(full_name,avatar_url),forum_posts(title)",
    );

    query.order("created_at", { ascending: false }).then(({ data, error: loadError }) => {
      setRows(data || []);
      setError(loadError?.message || "");
    });
  };

  useEffect(() => {
    load();
  }, [table]);

  const act = async (id, status) => {
    const { error: actError } = await supabase.from(table).update({ status }).eq("id", id);
    if (actError) setError(actError.message);
    else load();
  };

  const deleteItem = async (id) => {
    if (!window.confirm("¿Eliminar?")) return;

    const { error: deleteError } = await supabase.from(table).delete().eq("id", id);
    if (deleteError) setError(deleteError.message);
    else load();
  };

  return (
    <section className="feed">
      {error && <Notice>{error}</Notice>}
      {rows.map((row) => (
        <article className="comment" key={row.id}>
          <b>{row.profiles?.full_name || "Usuario"}</b>
          {table === "forum_posts" && <h3>{row.title}</h3>}
          {table === "forum_replies" && row.forum_posts && (
            <small>Respuesta en: {row.forum_posts.title}</small>
          )}
          <p>{row.body}</p>
          {row.image_url && (
            <img
              src={row.image_url}
              alt="mod"
              style={{ maxHeight: "100px", borderRadius: "4px" }}
            />
          )}
          <div>
            <button onClick={() => act(row.id, "approved")}>Aprobar</button>
            <button className="danger" onClick={() => deleteItem(row.id)}>
              Eliminar
            </button>
          </div>
        </article>
      ))}
      {!error && !rows.length && <div className="empty">Sin {label} registrados.</div>}
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
      {view === "posts" && <Moderation table="forum_posts" label="temas del foro" />}
      {view === "replies" && <Moderation table="forum_replies" label="respuestas" />}
    </Page>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {({ session, profile, refreshProfile }) => (
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
                  <Profile
                    session={session}
                    profile={profile}
                    refreshProfile={refreshProfile}
                  />
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
            <Route path="*" element={<Navigate to={session ? "/inicio" : "/acceso"} />} />
          </Routes>
        )}
      </AuthProvider>
    </BrowserRouter>
  );
}
