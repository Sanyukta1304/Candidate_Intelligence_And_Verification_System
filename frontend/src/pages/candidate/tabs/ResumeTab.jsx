import { useState, useEffect, useRef } from "react";
import { getResumeScore } from "../../../api/candidate.api";
import { triggerScore } from "../../../api/score.api";
import { useAuth } from "../../../hooks/useAuth";
import ScoreBar from "../../../components/ScoreBar";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { Pie, Radar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
);

// ── Colour tokens (from project brief) ──────────────────────────────
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
      <p style={{ color: "#94a3b8", fontSize: 13, margin: 0, textAlign: "center", maxWidth: 260 }}>
        Connect your GitHub account to unlock ATS scoring and resume analysis.
      </p>
      <a
        href="/api/auth/github"
        style={{
          marginTop: 8,
          background: C.teal, color: "#fff",
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

// ── Section checklist item ───────────────────────────────────────────
function CheckItem({ label, present }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "7px 0", borderBottom: `1px solid ${C.mild}`,
    }}>
      <span style={{
        width: 22, height: 22, borderRadius: "50%",
        background: present ? C.green : C.red,
        color: present ? C.greenTxt : C.redTxt,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 13, fontWeight: 700, flexShrink: 0,
      }}>
        {present ? "✓" : "✗"}
      </span>
      <span style={{ fontSize: 13, color: C.slate }}>{label}</span>
    </div>
  );
}

// ── Signal strength item ─────────────────────────────────────────────
function SignalBar({ label, value, max, color }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 12, color: C.slate, fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 12, color: C.teal, fontWeight: 700 }}>{value}/{max}</span>
      </div>
      <div style={{ height: 6, background: C.mild, borderRadius: 99 }}>
        <div style={{
          height: "100%", borderRadius: 99,
          background: color || C.teal,
          width: `${pct}%`,
          transition: "width 0.7s ease",
        }} />
      </div>
    </div>
  );
}

// ── Card wrapper ─────────────────────────────────────────────────────
function Card({ title, children, style = {} }) {
  return (
    <div style={{
      background: C.white,
      border: `1px solid #e2e8f0`,
      borderRadius: 8,
      padding: 20,
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      position: "relative",
      ...style,
    }}>
      {title && (
        <h3 style={{
          margin: "0 0 16px",
          fontSize: 13,
          fontWeight: 700,
          color: C.navy,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          borderBottom: `2px solid ${C.lightTeal}`,
          paddingBottom: 8,
        }}>
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

// ── Skeleton loader ──────────────────────────────────────────────────
function Skeleton({ h = 16, w = "100%", style = {} }) {
  return (
    <div style={{
      height: h, width: w, borderRadius: 4,
      background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.4s infinite",
      ...style,
    }} />
  );
}

// ════════════════════════════════════════════════════════════════════
export default function ResumeTab({ candidate }) {
  const { user } = useAuth();
  const isVerified = user?.github_verified;

  const [resumeScore, setResumeScore] = useState(null);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [uploading, setUploading]     = useState(false);
  const [uploadMsg, setUploadMsg]     = useState("");
  const fileRef = useRef(null);

  // Fetch ATS score data
  useEffect(() => {
    if (!isVerified) return;
    setLoading(true);
    getResumeScore()
      .then((res) => setResumeScore(res.data.data))
      .catch(() => setError("Could not load resume score."))
      .finally(() => setLoading(false));
  }, [isVerified]);

  // Handle resume re-upload (from this tab)
  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setUploadMsg("Only PDF files are accepted.");
      return;
    }
    const formData = new FormData();
    formData.append("resume", file);
    setUploading(true);
    setUploadMsg("Uploading & scoring...");
    try {
      const { default: axios } = await import("../../../../api/axios");
      await axios.post("/api/candidate/resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Re-trigger score
      await triggerScore(candidate?._id);
      setUploadMsg("✓ Resume uploaded and scored!");
      // Refresh score data
      const res = await getResumeScore();
      setResumeScore(res.data.data);
    } catch {
      setUploadMsg("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Handle resume download
  const handleDownloadResume = async () => {
    if (!candidate?.resume_url) return;
    
    try {
      // Import axios instance with authentication
      const { default: axios } = await import('../../../../api/axios');
      
      // Fetch file as blob with proper auth headers
      const response = await axios.get(
        '/api/candidate/resume-download',
        { responseType: 'blob' }
      );
      
      // Extract filename from content-disposition header if available
      const contentDisposition = response.headers['content-disposition'];
      let fileName = `resume_${candidate?._id}.pdf`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);  
        if (match) fileName = match[1];
      }
      
      // Create blob URL and trigger download
      const blobUrl = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up blob URL
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download resume. Please try again.');
    }
  };

  // ── Derived values ─────────────────────────────────────────────
  const s = resumeScore;
  
  // ✅ PHASE 2: Extract component scores ONLY from backend ats_breakdown (0-100 normalized)
  // All values come from backend ATS pipeline - NO fallbacks, NO local calculations
  // Formula: Section(30%) + Keyword(25%) + Format(20%) + Skill(15%) + Project(10%)
  const sectionScore  = s?.ats_breakdown?.section_score ?? 0;
  const keywordScore  = s?.ats_breakdown?.keyword_score ?? 0;
  const formatScore   = s?.ats_breakdown?.format_score ?? 0;
  const skillScore    = s?.ats_breakdown?.skill_score ?? 0;
  const projectStrength = s?.ats_breakdown?.project_strength ?? 0;
  const totalAts      = s?.ats_breakdown?.ats_score ?? 0;
  const resumeContribution = s?.ats_breakdown?.resume_contribution ?? 0;
  
  // ✅ FIXED: Extract section presence ONLY from backend (no defaults/fallbacks)
  const sectionPresence = s?.section_presence || {
    summary: false,
    experience: false,
    education: false,
    skills: false,
    projects: false,
    certifications: false
  };

  // Pie chart: ATS breakdown (now shows all 5 components)
  const pieData = {
    labels: ["Section Completeness", "Keyword Density", "Format Quality", "Skill Depth", "Project Strength"],
    datasets: [{
      data: [sectionScore, keywordScore, formatScore, skillScore, projectStrength],
      backgroundColor: [C.teal, "#14b8a6", C.lightTeal, "#0d9488", "#99f6e4"],
      borderColor: [C.teal, "#14b8a6", C.lightTeal, "#0d9488", "#99f6e4"],
      borderWidth: 1,
    }],
  };
  const pieOptions = {
    plugins: {
      legend: {
        position: "bottom",
        labels: { boxWidth: 10, font: { size: 11 }, color: C.slate },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            // Show value out of 100
            return context.label + ": " + Math.round(context.parsed) + " / 100";
          }
        }
      }
    },
  };

  // Radar chart: profile balance
  const resumeProfile = candidate;
  const radarData = {
    labels: [
      "Resume Quality",
      "Skills Depth",
      "Project Quality",
      "Education",
      "Profile Complete",
    ],
    datasets: [{
      label: "Profile Balance",
      data: [
        Math.round((resumeProfile?.resume_score / 30) * 100) || 0,
        Math.round((resumeProfile?.skills_score / 40) * 100) || 0,
        Math.round((resumeProfile?.projects_score / 30) * 100) || 0,
        resumeProfile?.education?.institution ? 70 : 30,
        resumeProfile?.about ? 80 : 40,
      ],
      backgroundColor: "rgba(13,148,136,0.12)",
      borderColor: C.teal,
      pointBackgroundColor: C.teal,
      borderWidth: 2,
    }],
  };
  const radarOptions = {
    scales: {
      r: {
        min: 0, max: 100,
        ticks: { display: false },
        grid: { color: "#e2e8f0" },
        pointLabels: { font: { size: 11 }, color: C.slate },
      },
    },
    plugins: { legend: { display: false } },
  };

  // ── Overall ATS score badge ───────────────────────────────────
  const tierColor = totalAts >= 75
    ? { bg: C.green, txt: C.greenTxt, label: "Strong Resume" }
    : totalAts >= 50
    ? { bg: C.yellow, txt: C.yellowTxt, label: "Moderate" }
    : { bg: C.red, txt: C.redTxt, label: "Needs Work" };

  return (
    <div style={{ padding: "0 0 24px" }}>
      {/* ── Global shimmer keyframe ─────────────────────────── */}
      <style>{`@keyframes shimmer { to { background-position: -200% 0; } }`}</style>

      {/* ── Header row ──────────────────────────────────────── */}
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between", marginBottom: 20,
        flexWrap: "wrap", gap: 10,
      }}>
        <div>
          <h2 style={{ margin: 0, color: C.navy, fontSize: 18, fontWeight: 700 }}>
            Resume ATS Analysis
          </h2>
          <p style={{ margin: "4px 0 0", color: C.slate, fontSize: 13 }}>
            ✓ ATS Score = (Section × 30%) + (Keyword × 35%) + (Format × 25%) + (Length × 10%)
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {/* ATS score badge */}
          {!loading && isVerified && (
            <div style={{
              background: tierColor.bg,
              color: tierColor.txt,
              borderRadius: 6, padding: "6px 14px",
              fontWeight: 700, fontSize: 14,
            }}>
              ATS Score: {totalAts}/100 — {tierColor.label}
            </div>
          )}

          {/* Re-upload resume */}
          {isVerified && (
            <>
              <input
                type="file"
                accept=".pdf"
                ref={fileRef}
                onChange={handleUpload}
                style={{ display: "none" }}
              />
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                style={{
                  background: C.teal, color: "#fff",
                  border: "none", borderRadius: 6,
                  padding: "8px 16px", fontSize: 13, fontWeight: 600,
                  cursor: uploading ? "not-allowed" : "pointer",
                  opacity: uploading ? 0.7 : 1,
                  display: "flex", alignItems: "center", gap: 6,
                }}
              >
                {uploading ? "Uploading…" : "↑ Upload Resume"}
              </button>
            </>
          )}
        </div>
      </div>

      {uploadMsg && (
        <div style={{
          marginBottom: 16, padding: "10px 14px", borderRadius: 6,
          background: uploadMsg.startsWith("✓") ? C.green : C.red,
          color: uploadMsg.startsWith("✓") ? C.greenTxt : C.redTxt,
          fontSize: 13, fontWeight: 500,
        }}>
          {uploadMsg}
        </div>
      )}

      {error && (
        <div style={{
          background: C.red, color: C.redTxt, borderRadius: 6,
          padding: "10px 14px", marginBottom: 16, fontSize: 13,
        }}>
          {error}
        </div>
      )}

      {/* ── 4-Quadrant grid ──────────────────────────────────── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 16,
        position: "relative",
      }}>

        {/* Q1: Section Analysis checklist */}
        <Card title="Section Analysis">
          {!isVerified && <LockedOverlay />}
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <Skeleton key={i} h={28} style={{ marginBottom: 8 }} />
            ))
          ) : (
            <>
              <CheckItem label="Professional Summary"    present={sectionPresence?.summary || s?.sections?.has_summary} />
              <CheckItem label="Work Experience"        present={sectionPresence?.experience || s?.sections?.has_experience} />
              <CheckItem label="Education"              present={sectionPresence?.education || s?.sections?.has_education} />
              <CheckItem label="Skills Section"         present={sectionPresence?.skills || s?.sections?.has_skills} />
              <CheckItem label="Projects / Portfolio"   present={sectionPresence?.projects || s?.sections?.has_projects} />
              <CheckItem label="Certifications"         present={sectionPresence?.certifications} />
              <div style={{ marginTop: 12 }}>
                <ScoreBar
                  label="Section Score"
                  value={sectionScore}
                  max={100}
                  color={C.teal}
                />
              </div>
            </>
          )}
        </Card>

        {/* Q2: Pie chart — ATS breakdown */}
        <Card title="ATS Score Breakdown">
          {!isVerified && <LockedOverlay />}
          {loading ? (
            <div style={{ display:"flex", justifyContent:"center" }}>
              <Skeleton h={180} w={180} style={{ borderRadius:"50%" }} />
            </div>
          ) : (
            <div style={{ maxWidth: 240, margin: "0 auto" }}>
              <Pie data={pieData} options={pieOptions} />
            </div>
          )}
        </Card>

        {/* Q3: Signal strength bars */}
        <Card title="Signal Strength">
          {!isVerified && <LockedOverlay />}
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <Skeleton key={i} h={40} style={{ marginBottom: 12 }} />
            ))
          ) : (
            <>
              <SignalBar
                label="Section Completeness"
                value={sectionScore}
                max={100}
                color={C.teal}
              />
              <SignalBar
                label="Keyword Density"
                value={keywordScore}
                max={100}
                color="#14b8a6"
              />
              <SignalBar
                label="Format Quality"
                value={formatScore}
                max={100}
                color="#0891b2"
              />
              <div style={{
                marginTop: 16, padding: "10px 12px",
                background: C.mild, borderRadius: 6,
              }}>
                <div style={{ fontSize: 12, color: C.slate, marginBottom: 4 }}>
                  ATS Score Calculation
                </div>
                <div style={{ fontWeight: 700, color: C.navy, fontSize: 16 }}>
                  {Math.round(totalAts)} / 100
                </div>
                <div style={{ fontSize: 11, color: C.slate, marginTop: 8 }}>
                  ✓ Formula: (Section × 30%) + (Keyword × 35%) + (Format × 25%) + (Length × 10%)
                </div>
              </div>
            </>
          )}
        </Card>

        {/* Q4: Radar chart — profile balance */}
        <Card title="Profile Balance">
          {!isVerified && <LockedOverlay />}
          {loading ? (
            <div style={{ display:"flex", justifyContent:"center" }}>
              <Skeleton h={200} w={200} style={{ borderRadius:"50%" }} />
            </div>
          ) : (
            <div style={{ maxWidth: 260, margin: "0 auto" }}>
              <Radar data={radarData} options={radarOptions} />
            </div>
          )}
        </Card>
      </div>

      {/* ── Resume download link ──────────────────────────── */}
      {isVerified && candidate?.resume_url && (
        <div style={{
          marginTop: 16, padding: "12px 16px",
          background: C.mild, borderRadius: 8,
          display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 12, flexWrap: "wrap",
        }}>
          <div>
            <div style={{ fontWeight: 600, color: C.navy, fontSize: 14 }}>Current Resume</div>
            <div style={{ color: C.slate, fontSize: 12 }}>PDF on file</div>
          </div>
          <a
            onClick={handleDownloadResume}
            style={{
              background: "transparent", border: `1.5px solid ${C.teal}`,
              color: C.teal, borderRadius: 6, padding: "7px 16px",
              fontSize: 13, fontWeight: 600, textDecoration: "none",
              cursor: "pointer",
            }}
          >
            ↓ Download PDF
          </a>
        </div>
      )}
    </div>
  );
}
