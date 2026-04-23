import { useState, useRef, useCallback } from "react";
import { updateCandidateProfile } from "../../api/candidate.api";
import { triggerScore } from "../../api/score.api";
import { useAuth } from "../../hooks/useAuth";

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
  red:       "#FEE2E2",
  redTxt:    "#dc2626",
};

// ── Input field wrapper ──────────────────────────────────────────────
function Field({ label, children, hint }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{
        display:"block", fontSize:12, fontWeight:700,
        color:C.teal, marginBottom:6,
        textTransform:"uppercase", letterSpacing:"0.05em",
      }}>
        {label}
      </label>
      {children}
      {hint && (
        <p style={{ margin:"4px 0 0", fontSize:11, color:C.slate }}>{hint}</p>
      )}
    </div>
  );
}

const inputStyle = {
  width:"100%", boxSizing:"border-box",
  border:"1px solid #cbd5e1", borderRadius:6,
  padding:"9px 12px", fontSize:14, color:C.navy,
  outline:"none", background:C.white,
  fontFamily:"inherit",
};

// ── Tag input ────────────────────────────────────────────────────────
function TagInput({ tags, onChange }) {
  const [input, setInput] = useState("");

  const addTag = () => {
    const t = input.trim();
    if (t && !tags.includes(t)) onChange([...tags, t]);
    setInput("");
  };

  return (
    <div style={{
      ...inputStyle, padding:"6px 10px",
      display:"flex", flexWrap:"wrap", gap:6, alignItems:"center",
      minHeight:44, cursor:"text",
    }}
      onClick={(e) => e.currentTarget.querySelector("input")?.focus()}
    >
      {tags.map((t, i) => (
        <span key={i} style={{
          background:C.lightTeal, color:C.teal,
          borderRadius:999, padding:"3px 10px",
          fontSize:12, fontWeight:600,
          display:"inline-flex", alignItems:"center", gap:4,
        }}>
          {t}
          <button
            onClick={() => onChange(tags.filter((_,j) => j !== i))}
            style={{ background:"none", border:"none", cursor:"pointer",
              color:C.teal, padding:0, fontSize:14 }}
          >×</button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (["Enter","Tab",","].includes(e.key)) { e.preventDefault(); addTag(); }
          if (e.key === "Backspace" && !input) onChange(tags.slice(0,-1));
        }}
        onBlur={addTag}
        placeholder={tags.length === 0 ? "Add a skill, press Enter" : ""}
        style={{
          border:"none", outline:"none", flex:1, minWidth:100,
          fontSize:13, color:C.navy, background:"transparent",
        }}
      />
    </div>
  );
}

// ── Drag-drop resume zone ────────────────────────────────────────────
function DropZone({ onFile, currentUrl, uploading, uploadMsg }) {
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef(null);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file?.type === "application/pdf") onFile(file);
  }, [onFile]);

  const handleSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
  };

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        style={{
          border: `2px dashed ${dragging ? C.teal : "#cbd5e1"}`,
          borderRadius: 8,
          padding: "40px 24px",
          textAlign: "center",
          cursor: "pointer",
          background: dragging ? `${C.lightTeal}88` : C.mild,
          transition: "all 0.2s",
        }}
      >
        <div style={{ fontSize: 36, marginBottom: 10 }}>
          {uploading ? "⏳" : "📄"}
        </div>
        <p style={{ margin:"0 0 6px", fontWeight:700, color:C.navy, fontSize:14 }}>
          {uploading ? "Uploading & scoring resume…" : "Drag & drop your resume here"}
        </p>
        <p style={{ margin:0, fontSize:12, color:C.slate }}>
          {uploading ? "Please wait" : "or click to browse · PDF only · max 5 MB"}
        </p>
        <input
          type="file" accept=".pdf"
          ref={fileRef}
          onChange={handleSelect}
          style={{ display:"none" }}
        />
      </div>

      {uploadMsg && (
        <div style={{
          marginTop:10, padding:"9px 14px", borderRadius:6, fontSize:13,
          background: uploadMsg.startsWith("✓") ? C.green : C.red,
          color:       uploadMsg.startsWith("✓") ? C.greenTxt : C.redTxt,
          fontWeight: 500,
        }}>
          {uploadMsg}
        </div>
      )}

      {currentUrl && !uploading && (
        <div style={{
          marginTop:10, display:"flex", alignItems:"center",
          gap:10, padding:"10px 14px",
          background:C.white, border:"1px solid #e2e8f0", borderRadius:6,
        }}>
          <span style={{ color:C.slate, fontSize:13, flex:1 }}>
            📎 Resume on file
          </span>
          <a
            href={currentUrl} target="_blank" rel="noopener noreferrer"
            style={{
              color:C.teal, fontSize:12, fontWeight:600, textDecoration:"none",
              border:`1px solid ${C.teal}`, borderRadius:4, padding:"4px 10px",
            }}
          >
            View PDF
          </a>
        </div>
      )}
    </div>
  );
}

// ── Tab selector ─────────────────────────────────────────────────────
function TabBar({ tabs, active, onChange }) {
  return (
    <div style={{
      display:"flex", gap:0,
      borderBottom:`1px solid #e2e8f0`,
      marginBottom:28,
    }}>
      {tabs.map((t) => (
        <button key={t.id} onClick={() => onChange(t.id)} style={{
          background:"none", border:"none",
          borderBottom: active === t.id ? `2.5px solid ${C.teal}` : "2.5px solid transparent",
          color: active === t.id ? C.teal : C.slate,
          fontWeight: active === t.id ? 700 : 500,
          fontSize:14, padding:"10px 20px",
          cursor:"pointer", transition:"all 0.15s",
          marginBottom:-1,
        }}>
          {t.icon} {t.label}
        </button>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
export default function ProfileEditPage({ candidate, onSaved }) {
  const { user } = useAuth();
  const isVerified = user?.github_verified;

  const [tab, setTab]     = useState("info");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  // Basic info state
  const [info, setInfo] = useState({
    name:        candidate?.name        || user?.name || "",
    about:       candidate?.about       || "",
    degree:      candidate?.education?.degree      || "",
    institution: candidate?.education?.institution || "",
    year:        candidate?.education?.year        || "",
  });

  // Skills state
  const [skills, setSkills] = useState(
    candidate?.skills?.map((s) => s.name || s) || []
  );

  // Resume upload state
  const [uploading, setUploading]   = useState(false);
  const [uploadMsg, setUploadMsg]   = useState("");

  const setInfoField = (f) => (e) =>
    setInfo((p) => ({ ...p, [f]: e.target.value }));

  // ── Save basic info ──────────────────────────────────────────────
  const saveInfo = async () => {
    setSaving(true);
    setSaveMsg("");
    try {
      await updateCandidateProfile({
        name:  info.name,
        about: info.about,
        education: {
          degree:      info.degree,
          institution: info.institution,
          year:        parseInt(info.year) || undefined,
        },
      });
      setSaveMsg("✓ Profile info saved.");
      if (candidate?._id) triggerScore(candidate._id).catch(() => {});
      onSaved?.();
    } catch {
      setSaveMsg("Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ── Save skills ──────────────────────────────────────────────────
  const saveSkills = async () => {
    setSaving(true);
    setSaveMsg("");
    try {
      await updateCandidateProfile({
        skills: skills.map((s) => ({ name: s })),
      });
      setSaveMsg("✓ Skills saved.");
      if (candidate?._id) triggerScore(candidate._id).catch(() => {});
      onSaved?.();
    } catch {
      setSaveMsg("Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ── Resume upload ────────────────────────────────────────────────
  const handleResumeFile = async (file) => {
    if (file.size > 5 * 1024 * 1024) {
      setUploadMsg("File too large. Maximum 5 MB.");
      return;
    }
    const formData = new FormData();
    formData.append("resume", file);
    setUploading(true);
    setUploadMsg("Uploading & scoring…");
    try {
      const { default: axios } = await import("../../api/axiosInstance");
      await axios.post("/api/candidate/resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (candidate?._id) await triggerScore(candidate._id).catch(() => {});
      setUploadMsg("✓ Resume uploaded and scored!");
      onSaved?.();
    } catch {
      setUploadMsg("Upload failed. Please check file format.");
    } finally {
      setUploading(false);
    }
  };

  const TABS = [
    { id:"info",   label:"Basic Info",   icon:"👤" },
    { id:"skills", label:"Skills",        icon:"🏷️" },
    { id:"resume", label:"Resume",        icon:"📄" },
  ];

  return (
    <div style={{ padding:"0 0 40px" }}>
      {/* ── Page header ─────────────────────────────────── */}
      <div style={{ marginBottom:28 }}>
        <h1 style={{ margin:0, color:C.navy, fontSize:22, fontWeight:800 }}>
          Edit Profile
        </h1>
        <p style={{ margin:"4px 0 0", color:C.slate, fontSize:14 }}>
          Keep your profile up to date to improve your credibility score.
        </p>
      </div>

      {/* ── Tab bar ─────────────────────────────────────── */}
      <TabBar tabs={TABS} active={tab} onChange={(t) => { setTab(t); setSaveMsg(""); }} />

      {/* ── Save message ────────────────────────────────── */}
      {saveMsg && (
        <div style={{
          marginBottom:16, padding:"10px 14px", borderRadius:6,
          background: saveMsg.startsWith("✓") ? C.green : C.red,
          color:       saveMsg.startsWith("✓") ? C.greenTxt : C.redTxt,
          fontSize:13, fontWeight:500,
        }}>
          {saveMsg}
        </div>
      )}

      {/* ── Tab: Basic info ─────────────────────────────── */}
      {tab === "info" && (
        <div style={{
          background:C.white, borderRadius:8, padding:28,
          border:"1px solid #e2e8f0",
          boxShadow:"0 2px 8px rgba(0,0,0,0.06)",
        }}>
          <Field label="Full Name">
            <input
              value={info.name}
              onChange={setInfoField("name")}
              style={inputStyle}
              onFocus={(e) => e.target.style.boxShadow = `0 0 0 2px ${C.teal}44`}
              onBlur={(e)  => e.target.style.boxShadow = "none"}
            />
          </Field>

          <Field label="About" hint="Max 500 characters. Appears on your public score card.">
            <textarea
              value={info.about}
              onChange={setInfoField("about")}
              rows={4}
              maxLength={500}
              placeholder="A short description of who you are and what you build…"
              style={{ ...inputStyle, resize:"vertical" }}
              onFocus={(e) => e.target.style.boxShadow = `0 0 0 2px ${C.teal}44`}
              onBlur={(e)  => e.target.style.boxShadow = "none"}
            />
            <p style={{ margin:"3px 0 0", fontSize:11, color:C.slate, textAlign:"right" }}>
              {info.about.length}/500
            </p>
          </Field>

          {/* Education */}
          <div style={{
            borderTop:"1px solid #e2e8f0",
            paddingTop:20, marginTop:4,
          }}>
            <p style={{ margin:"0 0 16px", fontSize:13, fontWeight:700, color:C.navy }}>
              Education
            </p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
              <Field label="Degree">
                <input
                  value={info.degree}
                  onChange={setInfoField("degree")}
                  placeholder="e.g. B.Tech Computer Science"
                  style={inputStyle}
                  onFocus={(e) => e.target.style.boxShadow = `0 0 0 2px ${C.teal}44`}
                  onBlur={(e)  => e.target.style.boxShadow = "none"}
                />
              </Field>
              <Field label="Graduation Year">
                <input
                  value={info.year}
                  onChange={setInfoField("year")}
                  type="number" min="1990" max="2040"
                  placeholder="e.g. 2026"
                  style={inputStyle}
                  onFocus={(e) => e.target.style.boxShadow = `0 0 0 2px ${C.teal}44`}
                  onBlur={(e)  => e.target.style.boxShadow = "none"}
                />
              </Field>
            </div>
            <Field label="Institution">
              <input
                value={info.institution}
                onChange={setInfoField("institution")}
                placeholder="e.g. Bangalore Institute of Technology"
                style={inputStyle}
                onFocus={(e) => e.target.style.boxShadow = `0 0 0 2px ${C.teal}44`}
                onBlur={(e)  => e.target.style.boxShadow = "none"}
              />
            </Field>
          </div>

          <button
            onClick={saveInfo}
            disabled={saving}
            style={{
              background: saving ? "#94a3b8" : C.teal,
              color:"#fff", border:"none",
              borderRadius:6, padding:"10px 28px",
              fontSize:14, fontWeight:700,
              cursor: saving ? "not-allowed" : "pointer",
              marginTop:8,
            }}
          >
            {saving ? "Saving…" : "Save Info"}
          </button>
        </div>
      )}

      {/* ── Tab: Skills ─────────────────────────────────── */}
      {tab === "skills" && (
        <div style={{
          background:C.white, borderRadius:8, padding:28,
          border:"1px solid #e2e8f0",
          boxShadow:"0 2px 8px rgba(0,0,0,0.06)",
        }}>
          <p style={{ margin:"0 0 16px", color:C.slate, fontSize:13 }}>
            Add all technologies you are comfortable with. Skills used in your
            verified GitHub projects automatically receive bonus scoring.
          </p>

          <Field
            label="Your Skills"
            hint="Press Enter, Tab, or comma after each skill to add it."
          >
            <TagInput tags={skills} onChange={setSkills} />
          </Field>

          <div style={{
            padding:"12px 16px", background:C.mild,
            borderRadius:6, marginBottom:20, fontSize:13,
          }}>
            <span style={{ color:C.navy, fontWeight:700 }}>
              {skills.length} skills declared
            </span>
            <span style={{ color:C.slate, marginLeft:8 }}>
              — Scoring: declaration (20%) + resume mention (30%) + project usage (50%) per skill
            </span>
          </div>

          <button
            onClick={saveSkills}
            disabled={saving}
            style={{
              background: saving ? "#94a3b8" : C.teal,
              color:"#fff", border:"none",
              borderRadius:6, padding:"10px 28px",
              fontSize:14, fontWeight:700,
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            {saving ? "Saving…" : "Save Skills"}
          </button>
        </div>
      )}

      {/* ── Tab: Resume ─────────────────────────────────── */}
      {tab === "resume" && (
        <div style={{
          background:C.white, borderRadius:8, padding:28,
          border:"1px solid #e2e8f0",
          boxShadow:"0 2px 8px rgba(0,0,0,0.06)",
          position:"relative",
        }}>
          {/* Lock if not verified */}
          {!isVerified && (
            <div style={{
              position:"absolute", inset:0, zIndex:5,
              background:"rgba(15,23,42,0.5)",
              backdropFilter:"blur(5px)", borderRadius:8,
              display:"flex", flexDirection:"column",
              alignItems:"center", justifyContent:"center", gap:12,
            }}>
              <div style={{ fontSize:36 }}>🔒</div>
              <p style={{ color:"#fff", fontWeight:700, fontSize:15, margin:0 }}>
                GitHub verification required to upload resume
              </p>
              <a href="/api/auth/github" style={{
                background:C.teal, color:"#fff",
                padding:"9px 22px", borderRadius:6,
                fontSize:14, fontWeight:600, textDecoration:"none",
              }}>
                Connect GitHub
              </a>
            </div>
          )}

          <p style={{ margin:"0 0 16px", color:C.slate, fontSize:13 }}>
            Upload your latest resume in PDF format. It will be automatically
            scanned for ATS scoring across Section Completeness, Keyword Density,
            and Format Quality.
          </p>

          <DropZone
            onFile={handleResumeFile}
            currentUrl={candidate?.resume_url}
            uploading={uploading}
            uploadMsg={uploadMsg}
          />
        </div>
      )}
    </div>
  );
}
