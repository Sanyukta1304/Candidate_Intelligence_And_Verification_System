import { useState, useEffect } from "react";
import { getProjects, deleteProject } from "../../../api/candidate.api";
import { triggerScore } from "../../../api/score.api";
import { useAuth } from "../../../hooks/useAuth";
import AddProjectModal from "../modals/AddProjectModal";
import ScoreBar from "../../../components/ScoreBar";

// ── Colour tokens ────────────────────────────────────────────────────
const C = {
  teal:      "#0D9488",
  navy:      "#0F172A",
  lightTeal: "#CCFBF1",
  slate:     "#475569",
  mild:      "#F1F5F9",
  white:     "#FFFFFF",
  green:     "#DCFCE7",
  greenTxt:  "#16a34a",
  yellow:    "#FEF9C3",
  yellowTxt: "#a16207",
  red:       "#FEE2E2",
  redTxt:    "#dc2626",
};

// ── Locked overlay ───────────────────────────────────────────────────
function LockedOverlay() {
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 10,
      background: "rgba(15,23,42,0.55)",
      backdropFilter: "blur(6px)",
      borderRadius: 8,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 12,
    }}>
      <div style={{ fontSize: 36 }}>🔒</div>
      <p style={{ color: "#fff", fontWeight: 700, fontSize: 16, margin: 0 }}>
        GitHub verification required
      </p>
      <p style={{ color: "#94a3b8", fontSize: 13, margin: 0, textAlign:"center", maxWidth: 260 }}>
        Verify your GitHub account to add and score your projects.
      </p>
      <a
        href="/api/auth/github"
        style={{
          marginTop: 8, background: C.teal, color: "#fff",
          padding: "9px 22px", borderRadius: 6,
          fontWeight: 600, fontSize: 14, textDecoration: "none",
          display: "inline-flex", alignItems: "center", gap: 8,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
        </svg>
        Connect GitHub
      </a>
    </div>
  );
}

// ── Mini metric cell ─────────────────────────────────────────────────
function MetricCell({ label, value, ok }) {
  return (
    <div style={{
      background: C.mild, borderRadius: 6,
      padding: "8px 10px", textAlign: "center",
    }}>
      <div style={{
        fontSize: 17, fontWeight: 700,
        color: ok === undefined
          ? C.navy
          : ok ? C.teal : "#ef4444",
      }}>
        {value}
      </div>
      <div style={{ fontSize: 10, color: C.slate, marginTop: 2 }}>{label}</div>
    </div>
  );
}

// ── Tech stack tag ───────────────────────────────────────────────────
function TechTag({ label }) {
  return (
    <span style={{
      background: C.lightTeal, color: C.teal,
      borderRadius: 999, padding: "3px 10px",
      fontSize: 11, fontWeight: 600,
    }}>
      {label}
    </span>
  );
}

// ── Verification badge ───────────────────────────────────────────────
function VerifBadge({ verified }) {
  return (
    <span style={{
      background: verified ? C.green : C.yellow,
      color: verified ? C.greenTxt : C.yellowTxt,
      borderRadius: 999, padding: "3px 10px",
      fontSize: 11, fontWeight: 700,
      display: "inline-flex", alignItems: "center", gap: 4,
    }}>
      {verified ? "✓ Verified" : "⏳ Pending"}
    </span>
  );
}

// ── Skeleton ─────────────────────────────────────────────────────────
function Skeleton({ h = 16, style = {} }) {
  return (
    <div style={{
      height: h, borderRadius: 6,
      background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.4s infinite",
      ...style,
    }} />
  );
}

// ── Single project card ──────────────────────────────────────────────
function ProjectCard({ project, onDelete, onEdit }) {
  const [confirmDel, setConfirmDel] = useState(false);
  const [deleting, setDeleting]     = useState(false);

  const b = project.score_breakdown || {};
  const lastPush = project.last_pushed_at
    ? new Date(project.last_pushed_at).toLocaleDateString()
    : "—";

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteProject(project._id);
      onDelete(project._id);
    } catch {
      setDeleting(false);
    }
  };

  return (
    <div style={{
      background: C.white,
      border: `1px solid #e2e8f0`,
      borderRadius: 8,
      padding: 20,
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    }}>
      {/* ── Card header ─────────────────── */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:6 }}>
            <h3 style={{ margin:0, fontSize:15, fontWeight:700, color:C.navy }}>
              {project.title}
            </h3>
            <VerifBadge verified={project.verified} />
          </div>
          <p style={{ margin:0, fontSize:13, color:C.slate, lineHeight:1.5 }}>
            {project.description}
          </p>
        </div>

        {/* Score circle */}
        <div style={{
          width: 56, height: 56, borderRadius: "50%", flexShrink: 0,
          background: `conic-gradient(${C.teal} ${project.project_score * 3.6}deg, ${C.mild} 0deg)`,
          display:"flex", alignItems:"center", justifyContent:"center",
          position:"relative",
        }}>
          <div style={{
            width: 42, height: 42, borderRadius:"50%",
            background: C.white, position:"absolute",
          }} />
          <span style={{ position:"relative", fontSize:13, fontWeight:800, color:C.navy }}>
            {project.project_score}
          </span>
        </div>
      </div>

      {/* ── Tech stack ─────────────────── */}
      {project.tech_stack?.length > 0 && (
        <div style={{ display:"flex", flexWrap:"wrap", gap:6, margin:"12px 0" }}>
          {project.tech_stack.map((t) => <TechTag key={t} label={t} />)}
        </div>
      )}

      {/* ── GitHub link ────────────────── */}
      <a
        href={project.github_link}
        target="_blank" rel="noopener noreferrer"
        style={{ fontSize:12, color:C.teal, textDecoration:"none", fontWeight:500 }}
      >
        ⎔ {project.github_link}
      </a>

      {/* ── 5-metric grid ──────────────── */}
      <div style={{
        display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:6, margin:"14px 0 0",
      }}>
        <MetricCell label="Total commits"  value={project.total_commits ?? "—"} />
        <MetricCell label="Your commits"   value={project.user_commits ?? "—"} />
        <MetricCell label="Public"         value={project.is_public ? "Yes" : "No"} ok={project.is_public} />
        <MetricCell label="README"         value={project.has_readme ? "Yes" : "No"} ok={project.has_readme} />
        <MetricCell label="Last push"      value={lastPush} />
      </div>

      {/* ── Score bar ──────────────────── */}
      <div style={{ marginTop: 14 }}>
        <ScoreBar
          label="Project Score"
          value={project.project_score}
          max={100}
          color={C.teal}
        />
      </div>

      {/* ── Actions ────────────────────── */}
      <div style={{ display:"flex", gap:8, marginTop:14 }}>
        <button
          onClick={() => onEdit(project)}
          style={{
            flex:1, background:"transparent",
            border:`1.5px solid ${C.teal}`, color:C.teal,
            borderRadius:6, padding:"7px 0",
            fontSize:12, fontWeight:600, cursor:"pointer",
          }}
        >
          Edit
        </button>
        {!confirmDel ? (
          <button
            onClick={() => setConfirmDel(true)}
            style={{
              flex:1, background:"transparent",
              border:"1.5px solid #fca5a5", color:"#ef4444",
              borderRadius:6, padding:"7px 0",
              fontSize:12, fontWeight:600, cursor:"pointer",
            }}
          >
            Delete
          </button>
        ) : (
          <button
            onClick={handleDelete}
            disabled={deleting}
            style={{
              flex:1, background:C.red, color:C.redTxt,
              border:"none", borderRadius:6, padding:"7px 0",
              fontSize:12, fontWeight:700, cursor:"pointer",
            }}
          >
            {deleting ? "Deleting…" : "Confirm delete?"}
          </button>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
export default function ProjectsTab({ candidate }) {
  const { user } = useAuth();
  const isVerified = user?.github_verified;

  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [modalOpen, setModalOpen]   = useState(false);
  const [editProject, setEditProject] = useState(null);

  useEffect(() => {
    if (!isVerified) return;
    setLoading(true);
    getProjects()
      .then((res) => setProjects(res.data.data || []))
      .catch(() => setError("Could not load projects."))
      .finally(() => setLoading(false));
  }, [isVerified]);

  const handleDelete = (id) => {
    setProjects((prev) => prev.filter((p) => p._id !== id));
    // Re-trigger scoring after deletion
    if (candidate?._id) triggerScore(candidate._id).catch(() => {});
  };

  const handleProjectSaved = (savedProject) => {
    setProjects((prev) => {
      const idx = prev.findIndex((p) => p._id === savedProject._id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = savedProject;
        return updated;
      }
      return [savedProject, ...prev];
    });
    setModalOpen(false);
    setEditProject(null);
  };

  return (
    <div style={{ padding: "0 0 24px", position:"relative" }}>
      <style>{`@keyframes shimmer { to { background-position: -200% 0; } }`}</style>

      {/* ── Header ──────────────────────────────────────────── */}
      <div style={{
        display:"flex", alignItems:"center",
        justifyContent:"space-between", marginBottom:20,
        flexWrap:"wrap", gap:10,
      }}>
        <div>
          <h2 style={{ margin:0, color:C.navy, fontSize:18, fontWeight:700 }}>
            Project Portfolio
          </h2>
          <p style={{ margin:"4px 0 0", color:C.slate, fontSize:13 }}>
            {isVerified
              ? `${projects.length} project${projects.length !== 1 ? "s" : ""} — verified via GitHub`
              : "Connect GitHub to add and verify projects"}
          </p>
        </div>

        {isVerified && (
          <button
            onClick={() => { setEditProject(null); setModalOpen(true); }}
            style={{
              background: C.teal, color: "#fff",
              border: "none", borderRadius: 6,
              padding: "9px 18px", fontSize: 13, fontWeight: 600,
              cursor: "pointer",
              display:"flex", alignItems:"center", gap:6,
            }}
          >
            + Add Project
          </button>
        )}
      </div>

      {/* ── Error banner ──────────────────────────────────── */}
      {error && (
        <div style={{
          background:C.red, color:C.redTxt, borderRadius:6,
          padding:"10px 14px", marginBottom:16, fontSize:13,
        }}>
          {error}
        </div>
      )}

      {/* ── Content ───────────────────────────────────────── */}
      <div style={{ position:"relative", minHeight:200 }}>
        {!isVerified && <LockedOverlay />}

        {loading ? (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))", gap:16 }}>
            {[1,2].map((i) => (
              <div key={i} style={{
                background:C.white, borderRadius:8, padding:20,
                border:`1px solid #e2e8f0`,
              }}>
                <Skeleton h={20} style={{ marginBottom:10, width:"60%" }} />
                <Skeleton h={14} style={{ marginBottom:6 }} />
                <Skeleton h={14} style={{ marginBottom:14, width:"80%" }} />
                <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:6 }}>
                  {[1,2,3,4,5].map((j) => <Skeleton key={j} h={52} />)}
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 && isVerified ? (
          // Empty state
          <div style={{
            textAlign:"center", padding:"60px 20px",
            background:C.mild, borderRadius:8,
          }}>
            <div style={{ fontSize:48, marginBottom:12 }}>📂</div>
            <h3 style={{ color:C.navy, margin:"0 0 8px" }}>No projects yet</h3>
            <p style={{ color:C.slate, fontSize:14, margin:"0 0 20px" }}>
              Add your GitHub projects to get a project credibility score.
            </p>
            <button
              onClick={() => { setEditProject(null); setModalOpen(true); }}
              style={{
                background:C.teal, color:"#fff", border:"none",
                borderRadius:6, padding:"10px 22px",
                fontSize:14, fontWeight:600, cursor:"pointer",
              }}
            >
              + Add Your First Project
            </button>
          </div>
        ) : (
          <div style={{
            display:"grid",
            gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))",
            gap:16,
          }}>
            {projects.map((p) => (
              <ProjectCard
                key={p._id}
                project={p}
                onDelete={handleDelete}
                onEdit={(proj) => { setEditProject(proj); setModalOpen(true); }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Add/Edit modal ──────────────────────────────────── */}
      {modalOpen && (
        <AddProjectModal
          project={editProject}
          candidateId={candidate?._id}
          onClose={() => { setModalOpen(false); setEditProject(null); }}
          onSaved={handleProjectSaved}
        />
      )}
    </div>
  );
}
