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
const Notice = ({ children }) => (
  <div className="notice">
    <AlertCircle size={18} />
    {children}
  </div>
);
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
    supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single()
      .then(({ data }) => setProfile(data));
  }, [session]);
  return session === undefined ? <Loading /> : children({ session, profile });
}
function Layout({ children, profile }) {
  const { t } = useLanguage();
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
            PPI<small>{t("nav.tagline")}</small>
          </span>
        </div>
        <nav>
          {nav.map(([to, label, I]) => (
            <NavLink key={to} to={to}>
              <I size={18} />
              {t(label)}
            </NavLink>
          ))}
          {profile?.role === "admin" && (
            <NavLink to="/admin">
              <BarChart3 size={18} />
              {t("nav.admin")}
            </NavLink>
          )}
        </nav>
        <LanguageSwitcher />
        <button className="ghost" onClick={logout}>
          <LogOut size={18} />
          {t("nav.logout")}
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
  const { t } = useLanguage();
  const [register, setRegister] = useState(registerDefault),
    [recovery, setRecovery] = useState(false),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  const go = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    if (!isConfigured)
      return setMessage("auth.setupSupabase");
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
        ? "auth.authError"
        : recovery
          ? "auth.recoverySent"
          : register
            ? "auth.registrationSent"
            : "",
    );
    if (!error && !register && !recovery) go("/inicio");
  };
  return (
    <div className="auth">
      <LanguageSwitcher className="auth-language-switcher" />
      <section>
        <img className="auth-logo" src={logo} alt="PPI" />
        <p className="eyebrow">{t("auth.eyebrow")}</p>
        <h1>{t("auth.headline")}</h1>
        <p>{t("auth.intro")}</p>
      </section>
      <form className="card" onSubmit={submit}>
        <h2>
          {recovery
            ? t("auth.recoveryTitle")
            : register
              ? t("auth.registerTitle")
              : t("auth.loginTitle")}
        </h2>
        {message && <Notice>{t(message)}</Notice>}
        {register && (
          <label>
            {t("auth.fullName")}
            <input name="name" required minLength="2" maxLength="60" />
          </label>
        )}
        <label>
          {t("auth.email")}
          <input name="email" type="email" required />
        </label>
        {!recovery && (
          <label>
            {t("auth.password")}
            <input name="password" type="password" minLength="8" required />
          </label>
        )}
        <button disabled={busy}>
          {busy
            ? t("auth.processing")
            : recovery
              ? t("auth.sendLink")
              : register
                ? t("auth.registerTitle")
                : t("auth.login")}
        </button>
        <button
          type="button"
          className="link"
          onClick={() => {
            setRecovery(!recovery);
            setMessage("");
          }}
        >
          {recovery ? t("auth.backToLogin") : t("auth.forgot")}
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
            {register ? t("auth.backToLoginAction") : t("auth.createAccountLink")}
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
        <p className="eyebrow">{useLanguage().t("page.eyebrow")}</p>
        <h1>{title}</h1>
      </div>
    </header>
    {children}
  </>
);
function Home({ profile }) {
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
            <strong>{x[0]}</strong>
            <span>{x[1]}</span>
          </article>
        ))}
      </section>
    </Page>
  );
}
function Catalogue({ table, titleKey, kindKey }) {
  const { t, translateCatalog } = useLanguage();
  const [items, setItems] = useState([]),
    [query, setQuery] = useState(""),
    [error, setError] = useState(false),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase
      .from(table)
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        setItems(data || []);
        setError(Boolean(error));
        setLoading(false);
      });
  }, [table]);
  const filtered = useMemo(
    () =>
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
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
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
      )}
    </Page>
  );
}
function Community({ session }) {
  const { language, t } = useLanguage();
  const [topics, setTopics] = useState([]),
    [selected, setSelected] = useState(null),
    [title, setTitle] = useState(""),
    [body, setBody] = useState(""),
    [category, setCategory] = useState("General"),
    [reply, setReply] = useState(""),
    [replies, setReplies] = useState([]),
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
    const { error } = await supabase
      .from("forum_posts")
      .insert({
        author_id: session.user.id,
        title: clean(title),
        body: clean(body),
        category,
      });
    setNotice(error ? "common.error" : "community.topicSent");
    setTitle("");
    setBody("");
  };
  const sendReply = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from("forum_replies")
      .insert({
        post_id: selected.id,
        author_id: session.user.id,
        body: clean(reply),
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
  if (selected)
    return (
      <Page title={selected.title}>
        <button className="link" onClick={() => setSelected(null)}>
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
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              minLength="6"
              maxLength="120"
            />
          </label>
          <label>
            {t("community.category")}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
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
    </Page>
  );
}
function Profile({ session, profile }) {
  const { t } = useLanguage();
  const [name, setName] = useState(profile?.full_name || ""),
    [msg, setMsg] = useState("");
  const save = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: clean(name) })
      .eq("id", session.user.id);
    setMsg(error ? "profile.updateError" : "profile.updated");
  };
  return (
    <Page title={t("profile.title")}>
      <form className="card form" onSubmit={save}>
        <label>
          {t("profile.name")}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength="60"
          />
        </label>
        <label>
          {t("profile.email")}
          <input value={session.user.email} disabled />
        </label>
        <button>{t("common.save")}</button>
        {msg && <p>{t(msg)}</p>}
      </form>
    </Page>
  );
}
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
  const load = async () => {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order("created_at", { ascending: false });
    setRows(data || []);
    if (error) setMsg("common.error");
    setLoading(false);
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
    setMsg(error ? "common.error" : "admin.edited");
    setDraft({});
    load();
  };
  const remove = async (id) => {
    if (!window.confirm(t("admin.confirmDelete"))) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    setMsg(error ? "common.error" : "admin.deleted");
    load();
  };
  return (
    <section className="admin-split">
      <form className="card form" onSubmit={save}>
        <h2>
          {draft.id ? t("common.edit") : t("admin.new")} {t(title)}
        </h2>
        {fields.map((f) => (
          <label key={f}>
            {t(`admin.fields.${f}`)}
            <textarea
              required
              value={draft[f] || ""}
              onChange={(e) => setDraft({ ...draft, [f]: e.target.value })}
            />
          </label>
        ))}
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
      </div>
    </section>
  );
}
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
    </section>
  );
}
function Admin() {
  const { t } = useLanguage();
  const [view, setView] = useState("methods");
  return (
    <Page title={t("admin.title")}>
      <div className="admin-tabs">
        {[
          ["methods", "admin.methods"],
          ["threats", "admin.threats"],
          ["comments", "admin.moderation"],
        ].map(([id, label]) => (
          <button
            key={id}
            className={view === id ? "active" : ""}
            onClick={() => setView(id)}
          >
            {t(label)}
          </button>
        ))}
      </div>
      {view === "methods" && (
        <AdminCollection
          table="prevention_methods"
          title="admin.method"
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
          title="admin.threat"
          fields={["name", "category", "what_is", "how_spreads", "prevention"]}
        />
      )}{" "}
      {view === "comments" && <Moderation />}
    </Page>
  );
}
export default function App() {
  return (
    <LanguageProvider>
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
                    titleKey="catalogue.methodTitle"
                    kindKey="catalogue.method"
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
                    titleKey="catalogue.threatTitle"
                    kindKey="catalogue.threat"
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
              path="/manuales"
              element={
                <Protected session={session} profile={profile}>
                  <Manuals profile={profile} />
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
    </LanguageProvider>
  );
}
