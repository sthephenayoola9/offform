"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Check,
  X,
  AlertTriangle,
  Clock,
  ExternalLink,
  Lock,
  Layers,
  FileText,
  User,
  Store,
  Flag,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

interface AdminConsoleClientProps {
  applications: any[];
  reports: any[];
  auditLogs: any[];
}

export function AdminConsoleClient({
  applications: initialApplications,
  reports: initialReports,
  auditLogs: initialAuditLogs,
}: AdminConsoleClientProps) {
  const [activeTab, setActiveTab] = useState<"applications" | "reports" | "audit">("applications");
  const [applications, setApplications] = useState(initialApplications);
  const [reports, setReports] = useState(initialReports);
  const [auditLogs, setAuditLogs] = useState(initialAuditLogs);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Application Review Action
  const handleApplicationReview = async (
    applicationId: string,
    decision: "APPROVE" | "REJECT" | "REQUEST_INFO",
    notes?: string
  ) => {
    setLoadingId(applicationId);
    try {
      const res = await fetch(`/api/admin/applications/${applicationId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision, notes: notes || "Review completed by editorial curator." }),
      });

      if (res.ok) {
        const data = await res.json();
        setApplications(
          applications.map((app) =>
            app.id === applicationId
              ? {
                  ...app,
                  status: data.status,
                  reviewedAt: new Date().toISOString(),
                }
              : app
          )
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  // Moderation Report Action
  const handleReportAction = async (
    reportId: string,
    action: "DISMISS" | "WARNING" | "PAUSE_LISTING" | "ENFORCE",
    notes?: string
  ) => {
    setLoadingId(reportId);
    try {
      const res = await fetch(`/api/admin/reports/${reportId}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, notes: notes || "Action taken by safety team." }),
      });

      if (res.ok) {
        const data = await res.json();
        setReports(
          reports.map((rep) =>
            rep.id === reportId
              ? {
                  ...rep,
                  status: data.status,
                  resolutionAction: data.resolutionAction,
                  resolvedAt: new Date().toISOString(),
                }
              : rep
          )
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  const pendingApps = applications.filter((a) => a.status === "PENDING");
  const pendingReps = reports.filter((r) => r.status === "PENDING");

  return (
    <div className="space-y-8">
      {/* Tabs */}
      <div className="flex border-b border-[#E7E1DB] space-x-8">
        <button
          onClick={() => setActiveTab("applications")}
          className={`pb-4 text-xs font-semibold uppercase tracking-wider transition-all relative flex items-center gap-2 ${
            activeTab === "applications"
              ? "text-[#252321] border-b-2 border-[#A92735]"
              : "text-[#77716D] hover:text-[#252321]"
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Seller Applications</span>
          {pendingApps.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-[#A92735] text-white">
              {pendingApps.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("reports")}
          className={`pb-4 text-xs font-semibold uppercase tracking-wider transition-all relative flex items-center gap-2 ${
            activeTab === "reports"
              ? "text-[#252321] border-b-2 border-[#A92735]"
              : "text-[#77716D] hover:text-[#252321]"
          }`}
        >
          <Flag className="w-4 h-4" />
          <span>Moderation Queue</span>
          {pendingReps.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-[#791D29] text-white">
              {pendingReps.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("audit")}
          className={`pb-4 text-xs font-semibold uppercase tracking-wider transition-all relative flex items-center gap-2 ${
            activeTab === "audit"
              ? "text-[#252321] border-b-2 border-[#A92735]"
              : "text-[#77716D] hover:text-[#252321]"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Audit Log History</span>
        </button>
      </div>

      {/* 1. SELLER APPLICATIONS TAB */}
      {activeTab === "applications" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-editorial text-2xl text-[#252321]">
              Accreditation Dossiers ({applications.length})
            </h2>
            <span className="text-xs text-[#77716D]">
              Requires human craftsmanship and provenance check
            </span>
          </div>

          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white border border-[#E7E1DB] rounded-2xl p-6 shadow-sm space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        app.applicant.avatar ||
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                      }
                      alt={app.businessName}
                      className="w-12 h-12 rounded-full object-cover border border-[#E7E1DB]"
                    />
                    <div>
                      <h3 className="font-editorial text-xl font-semibold text-[#252321]">
                        {app.businessName}
                      </h3>
                      <p className="text-xs text-[#77716D]">
                        Applicant: <span className="font-medium text-[#252321]">{app.applicant.displayName}</span> (@{app.applicant.username}) · Age {app.applicant.age}
                      </p>
                    </div>
                  </div>

                  <div>
                    <span
                      className={`text-[10px] font-mono uppercase px-3 py-1 rounded-full font-semibold tracking-wider ${
                        app.status === "APPROVED"
                          ? "bg-[#EAF5EA] text-[#246B24] border border-[#246B24]/20"
                          : app.status === "PENDING"
                          ? "bg-[#FBECEE] text-[#791D29] border border-[#A92735]/20 animate-pulse"
                          : "bg-[#F4F1EC] text-[#77716D]"
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-[#F8F5F0] p-4 rounded-xl border border-[#E7E1DB]">
                  <div className="space-y-1.5">
                    <p className="font-semibold text-[#252321] uppercase tracking-wider text-[10px]">
                      Creator Bio & Focus
                    </p>
                    <p className="text-[#77716D] leading-relaxed">{app.bio}</p>
                    <div className="pt-1">
                      <a
                        href={app.portfolioUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#A92735] hover:underline font-medium inline-flex items-center gap-1"
                      >
                        Inspect Portfolio / Lookbook <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <p className="font-semibold text-[#252321] uppercase tracking-wider text-[10px]">
                      Studio Machinery & Production Setup
                    </p>
                    <p className="text-[#77716D] leading-relaxed">
                      {app.productionCapabilities}
                    </p>
                    <div className="pt-1 text-[10px] text-[#77716D] flex items-center gap-2">
                      <span className="flex items-center gap-1 font-mono bg-white px-2 py-0.5 rounded border border-[#E7E1DB]">
                        <Lock className="w-2.5 h-2.5" /> ID Ref: {app.idDocumentUrl}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions Bar */}
                {app.status === "PENDING" ? (
                  <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-[#F4F1EC]">
                    <button
                      onClick={() =>
                        handleApplicationReview(
                          app.id,
                          "REQUEST_INFO",
                          "Requesting additional documentation regarding machinery and studio capacity."
                        )
                      }
                      disabled={loadingId === app.id}
                      className="px-3.5 py-1.5 border border-[#E7E1DB] text-[#252321] hover:bg-[#F8F5F0] rounded-full text-xs font-semibold disabled:opacity-50"
                    >
                      Request Details
                    </button>

                    <button
                      onClick={() =>
                        handleApplicationReview(
                          app.id,
                          "REJECT",
                          "Does not meet minimum originality and studio capability standards."
                        )
                      }
                      disabled={loadingId === app.id}
                      className="px-3.5 py-1.5 border border-[#791D29]/30 text-[#791D29] hover:bg-[#FBECEE] rounded-full text-xs font-semibold disabled:opacity-50"
                    >
                      Reject Application
                    </button>

                    <button
                      onClick={() =>
                        handleApplicationReview(
                          app.id,
                          "APPROVE",
                          "Verified portfolio authenticity, studio machinery, and age requirement (18+)."
                        )
                      }
                      disabled={loadingId === app.id}
                      className="px-4 py-1.5 bg-[#252321] text-white hover:bg-[#A92735] rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve Atelier & Grant Seller Role
                    </button>
                  </div>
                ) : (
                  <div className="text-[11px] text-[#77716D] pt-2 border-t border-[#F4F1EC] flex items-center justify-between">
                    <span>
                      Decision recorded on:{" "}
                      {app.reviewedAt
                        ? new Date(app.reviewedAt).toLocaleString()
                        : "Earlier date"}
                    </span>
                    {app.reviewNotes && <span>Notes: {app.reviewNotes}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. MODERATION REPORTS TAB */}
      {activeTab === "reports" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-editorial text-2xl text-[#252321]">
              Community Reports ({reports.length})
            </h2>
            <span className="text-xs text-[#77716D]">
              Hybrid moderation with human adjudicator
            </span>
          </div>

          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-white border border-[#E7E1DB] rounded-2xl p-6 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-[#FBECEE] text-[#791D29] font-bold">
                      {report.category}
                    </span>
                    <span className="text-xs text-[#77716D]">
                      Target: <span className="font-semibold text-[#252321]">{report.targetType}</span> ({report.targetId})
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full font-semibold ${
                      report.status === "PENDING"
                        ? "bg-[#FBECEE] text-[#791D29]"
                        : "bg-[#F4F1EC] text-[#77716D]"
                    }`}
                  >
                    {report.status} {report.resolutionAction ? `(${report.resolutionAction})` : ""}
                  </span>
                </div>

                <div className="p-4 bg-[#F8F5F0] rounded-xl text-xs space-y-1.5 border border-[#E7E1DB]">
                  <p className="font-semibold text-[#252321]">
                    Report filed by @{report.reporter?.username || "member"}
                  </p>
                  <p className="text-[#77716D] leading-relaxed">
                    Reason: {report.reason}
                  </p>
                </div>

                {report.status === "PENDING" && (
                  <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-[#F4F1EC]">
                    <button
                      onClick={() => handleReportAction(report.id, "DISMISS", "No violation found upon inspection.")}
                      disabled={loadingId === report.id}
                      className="px-3.5 py-1.5 border border-[#E7E1DB] text-[#77716D] hover:bg-[#F8F5F0] rounded-full text-xs font-semibold"
                    >
                      Dismiss (No Action)
                    </button>
                    <button
                      onClick={() => handleReportAction(report.id, "WARNING", "Formal advisory guidance issued.")}
                      disabled={loadingId === report.id}
                      className="px-3.5 py-1.5 border border-[#E7E1DB] text-[#252321] hover:bg-[#F8F5F0] rounded-full text-xs font-semibold"
                    >
                      Issue Warning Note
                    </button>
                    <button
                      onClick={() => handleReportAction(report.id, "PAUSE_LISTING", "Listing paused pending provenance verification.")}
                      disabled={loadingId === report.id}
                      className="px-4 py-1.5 bg-[#A92735] text-white hover:bg-[#791D29] rounded-full text-xs font-semibold"
                    >
                      Pause Listing / Restrict
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. AUDIT LOG TAB */}
      {activeTab === "audit" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-editorial text-2xl text-[#252321]">
              Chronological Audit Trail
            </h2>
            <span className="text-xs text-[#77716D]">
              Immutable log of administrative & moderation enforcement
            </span>
          </div>

          <div className="bg-white border border-[#E7E1DB] rounded-2xl overflow-hidden shadow-sm">
            <div className="divide-y divide-[#F4F1EC]">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-4 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[#F8F5F0]/50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold uppercase bg-[#F8F5F0] px-2 py-0.5 rounded border border-[#E7E1DB]">
                        {log.action}
                      </span>
                      <span className="text-[#77716D]">
                        Actor: <strong className="text-[#252321]">@{log.actor?.username || "curator"}</strong>
                      </span>
                    </div>
                    {log.details && (
                      <p className="text-[11px] font-mono text-[#77716D] truncate max-w-xl">
                        {log.details}
                      </p>
                    )}
                  </div>
                  <span className="text-[10px] text-[#77716D] font-mono whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

