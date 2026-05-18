/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { Save, Upload, Plus, Trash2, Check, Loader2, Globe, RefreshCw, Sparkles, Sun, Moon, Monitor, Eye, X, Image as ImageIcon, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";

interface PortfolioData {
  profileImage: string;
  socialLinks: { instagram: string; email: string; github: string; resume: string };
  projects: Array<{
    id: number; title: string; description: string; image?: string; tags: string[]; github: string; demo: string;
    stars: string; gradient: string; screenColor: string; metricValue: string; metricLabel: string;
  }>;
  aboutStats: { companiesValue: number; fundingValue: number; usersValue: number; countriesValue: number };
  statsData: { usersValue: number; arrValue: number; uptimeValue: number; ratingValue: number; teamValue: number };
}

type TranslationsData = Record<string, Record<string, unknown>>;

function Card({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-border bg-card p-6 shadow-sm", className)}>
      <h3 className="mb-4 text-sm font-semibold text-violet-500 dark:text-violet-400 uppercase tracking-wider">{title}</h3>
      {children}
    </div>
  );
}

function Input({ label, value, onChange, type = "text", placeholder, isTranslating, onPreview }: {
  label: string; value: string | number; onChange: (v: string) => void; type?: string; placeholder?: string; isTranslating?: boolean; onPreview?: () => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center justify-between text-xs font-medium text-muted-foreground">
        {label}
        <div className="flex items-center gap-2">
          {isTranslating && <Loader2 className="h-3 w-3 animate-spin text-violet-500" />}
          {onPreview && (
            <button type="button" onClick={onPreview} className="text-muted-foreground hover:text-violet-500 transition-colors" title="Lihat di Web">
              <Eye className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </label>
      <input
        type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground outline-none transition-all focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 placeholder:text-muted-foreground/50"
      />
    </div>
  );
}

function Textarea({ label, value, onChange, rows = 3, isTranslating, onPreview }: {
  label: string; value: string; onChange: (v: string) => void; rows?: number; isTranslating?: boolean; onPreview?: () => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center justify-between text-xs font-medium text-muted-foreground">
        {label}
        <div className="flex items-center gap-2">
          {isTranslating && <Loader2 className="h-3 w-3 animate-spin text-violet-500" />}
          {onPreview && (
            <button type="button" onClick={onPreview} className="text-muted-foreground hover:text-violet-500 transition-colors" title="Lihat di Web">
              <Eye className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </label>
      <textarea
        value={value} onChange={(e) => onChange(e.target.value)} rows={rows}
        className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground outline-none transition-all focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 resize-none placeholder:text-muted-foreground/50"
      />
    </div>
  );
}

import { Suspense } from "react";

function DashboardContent() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "overview";
  const { theme, setTheme } = useTheme();
  const { locale, setLocale } = useLanguage();
  const locales = ["en", "id", "es", "ja", "fr"];
  const localeNames: Record<string, string> = { en: "English", id: "Indonesia", es: "Español", ja: "日本語", fr: "Français" };
  const [mounted, setMounted] = useState(false);
  
  const [data, setData] = useState<PortfolioData | null>(null);
  const [translations, setTranslations] = useState<TranslationsData | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // AI Translation State
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [translatingFields, setTranslatingFields] = useState<Record<string, boolean>>({});
  const translationTimeouts = useRef<Record<string, NodeJS.Timeout>>({});
  
  // Preview Modal State
  const [previewPath, setPreviewPath] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [dataRes, transRes] = await Promise.all([
        fetch("/api/data"),
        fetch("/api/translations"),
      ]);
      setData(await dataRes.json());
      const t = await transRes.json();
      if (t && !t.error) setTranslations(t);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { 
    setMounted(true);
    fetchData(); 
  }, [fetchData]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setPreviewPath(null); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const iframeReady = useRef(false);
  
  useEffect(() => {
    if (!previewPath) iframeReady.current = false;
  }, [previewPath]);

  // Handle message post for preview iframe
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'PREVIEW_READY') {
        iframeReady.current = true;
        if (previewPath) {
          const frame = document.getElementById("preview-frame") as HTMLIFrameElement;
          frame?.contentWindow?.postMessage({ type: 'HIGHLIGHT', path: previewPath }, '*');
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [previewPath]);

  useEffect(() => {
    if (previewPath && iframeReady.current) {
      const frame = document.getElementById("preview-frame") as HTMLIFrameElement;
      frame?.contentWindow?.postMessage({ type: 'HIGHLIGHT', path: previewPath }, '*');
    }
  }, [previewPath]);

  const saveData = async () => {
    if (!data) return;
    setSaving(true);
    try {
      await fetch("/api/data", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (translations) {
        await fetch("/api/translations", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(translations),
        });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, projectId?: number) => {
    const file = e.target.files?.[0];
    if (!file || !data) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      // Upload using standard /api/upload (configured to Cloudinary 'auto' type)
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const result = await res.json();
      if (result.success) {
        if (projectId !== undefined) {
          setData(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              projects: prev.projects.map(p => p.id === projectId ? { ...p, image: result.url } : p)
            };
          });
        } else {
          setData({ ...data, profileImage: result.url });
        }
      }
    } catch (e) { console.error(e); }
    setUploading(false);
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !data) return;
    setUploadingPdf(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      // We use Cloudinary to ensure persistence on Vercel
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const result = await res.json();
      if (result.success) {
        setData({ ...data, socialLinks: { ...data.socialLinks, resume: result.url } });
      }
    } catch (e) { console.error(e); }
    setUploadingPdf(false);
  };

  const updateTranslation = (currentLocale: string, path: string, value: string) => {
    if (!translations) return;
    
    // 1. Update active language immediately
    const copy = JSON.parse(JSON.stringify(translations));
    const keys = path.split(".");
    let obj = copy[currentLocale];
    for (let i = 0; i < keys.length - 1; i++) {
      if (!obj[keys[i]]) obj[keys[i]] = {};
      obj = obj[keys[i]] as Record<string, unknown>;
    }
    obj[keys[keys.length - 1]] = value;
    setTranslations(copy);

    // 2. AI Auto-Translate Logic
    if (autoTranslate) {
      if (translationTimeouts.current[path]) {
        clearTimeout(translationTimeouts.current[path]);
      }
      
      setTranslatingFields(prev => ({ ...prev, [path]: true }));
      
      translationTimeouts.current[path] = setTimeout(async () => {
        try {
          const targetLangs = locales.filter(l => l !== currentLocale);
          
          const res = await fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: value, sourceLang: currentLocale, targetLangs })
          });
          const apiData = await res.json();
          
          if (apiData.translations) {
            setTranslations(prev => {
              if (!prev) return prev;
              const newCopy = JSON.parse(JSON.stringify(prev));
              targetLangs.forEach(lang => {
                let targetObj = newCopy[lang];
                for (let i = 0; i < keys.length - 1; i++) {
                  if (!targetObj[keys[i]]) targetObj[keys[i]] = {};
                  targetObj = targetObj[keys[i]];
                }
                targetObj[keys[keys.length - 1]] = apiData.translations[lang];
              });
              return newCopy;
            });
          }
        } catch (e) {
          console.error("Auto translate error:", e);
        } finally {
          setTranslatingFields(prev => ({ ...prev, [path]: false }));
        }
      }, 1200);
    }
  };

  const getTranslation = (currentLocale: string, path: string): string => {
    if (!translations) return "";
    const keys = path.split(".");
    let obj: unknown = translations[currentLocale];
    for (const k of keys) {
      if (obj && typeof obj === "object" && k in (obj as Record<string, unknown>)) {
        obj = (obj as Record<string, unknown>)[k];
      } else return "";
    }
    return typeof obj === "string" ? obj : "";
  };

  if (loading || !data || !mounted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto w-full max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {tab === "overview" ? "Dashboard" : tab === "image" ? "Profile & PDF" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </h1>
            <p className="text-sm text-muted-foreground">Kelola konten portofolio Anda secara real-time</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Language Switcher */}
            {(tab === "translations" || tab === "profile" || tab === "timeline" || tab === "services") && (
              <div className="flex items-center rounded-xl border border-border bg-muted/50 p-1">
                {locales.map(l => (
                  <button 
                    key={l}
                    onClick={() => setLocale(l as "en" | "id" | "es" | "ja" | "fr")}
                    className={cn(
                      "px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all uppercase", 
                      locale === l ? "bg-background shadow-sm text-blue-500" : "text-muted-foreground hover:text-foreground"
                    )}
                    title={`Ganti bahasa ke ${localeNames[l]}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            )}

            {/* Theme Switcher */}
            <div className="flex items-center rounded-xl border border-border bg-muted/50 p-1">
              <button 
                onClick={() => setTheme("light")} 
                className={cn("p-1.5 rounded-lg transition-all", theme === "light" ? "bg-background shadow-sm text-violet-500" : "text-muted-foreground hover:text-foreground")}
                title="Terang"
              >
                <Sun className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setTheme("dark")} 
                className={cn("p-1.5 rounded-lg transition-all", theme === "dark" ? "bg-background shadow-sm text-violet-500" : "text-muted-foreground hover:text-foreground")}
                title="Gelap"
              >
                <Moon className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setTheme("system")} 
                className={cn("p-1.5 rounded-lg transition-all", theme === "system" ? "bg-background shadow-sm text-violet-500" : "text-muted-foreground hover:text-foreground")}
                title="Otomatis Sistem"
              >
                <Monitor className="w-4 h-4" />
              </button>
            </div>

            {/* Global AI Translate Toggle */}
            <button
              onClick={() => setAutoTranslate(!autoTranslate)}
              className={cn(
                "group relative flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition-all duration-300",
                autoTranslate 
                  ? "border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-300 shadow-sm" 
                  : "border-border bg-muted/50 text-muted-foreground hover:text-foreground"
              )}
            >
              <Sparkles className={cn("h-3.5 w-3.5", autoTranslate ? "text-violet-500" : "opacity-50")} />
              AI Auto-Translate
              <div className={cn(
                "ml-1 h-2 w-2 rounded-full transition-colors", 
                autoTranslate ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-muted-foreground/30"
              )} />
            </button>
            
            <motion.button onClick={fetchData} whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
              <RefreshCw className="h-4 w-4" /> Refresh
            </motion.button>
            <motion.button onClick={saveData} disabled={saving} whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-violet-700 transition-all disabled:opacity-50">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
              {saving ? "Menyimpan..." : saved ? "Tersimpan!" : "Simpan"}
            </motion.button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>

            {/* OVERVIEW */}
            {tab === "overview" && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { label: "Projects", value: data.projects.length, color: "text-violet-500", bg: "bg-violet-500/10" },
                  { label: "Languages", value: "5", color: "text-blue-500", bg: "bg-blue-500/10" },
                  { label: "Sections", value: "8", color: "text-green-500", bg: "bg-green-500/10" },
                  { label: "Profile Image", value: data.profileImage ? "✓" : "✗", color: data.profileImage ? "text-green-500" : "text-red-500", bg: data.profileImage ? "bg-green-500/10" : "bg-red-500/10" },
                  { label: "Total Users", value: `${data.statsData.usersValue}K+`, color: "text-orange-500", bg: "bg-orange-500/10" },
                  { label: "Team", value: `${data.statsData.teamValue}+`, color: "text-pink-500", bg: "bg-pink-500/10" },
                ].map((s) => (
                  <div key={s.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                    <div className={cn("mb-2 inline-flex rounded-lg p-2", s.bg)}>
                      <span className={cn("text-lg font-bold", s.color)}>{s.value}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
            )}

            {/* PROFILE & PDF */}
            {tab === "image" && (
              <div className="space-y-4">
                <Card title="Foto Profil">
                  <input type="file" ref={fileInputRef} accept="image/*" onChange={handleImageUpload} className="hidden" />
                  <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                    <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl border border-border bg-muted">
                      {data.profileImage ? (
                        <img src={data.profileImage} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-5xl">👤</div>
                      )}
                    </div>
                    <div className="space-y-3 flex-1">
                      <p className="text-sm text-muted-foreground">Upload foto profil baru. Gambar akan disimpan di Cloudinary.</p>
                      <motion.button onClick={() => fileInputRef.current?.click()} disabled={uploading} whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-2.5 text-sm font-medium text-violet-600 dark:text-violet-400 hover:bg-violet-500/20 transition-all disabled:opacity-50">
                        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
                        {uploading ? "Mengunggah..." : "Upload Gambar Profil"}
                      </motion.button>
                      {data.profileImage && (
                        <Input label="Image URL (Cloudinary)" value={data.profileImage} onChange={(v) => setData({ ...data, profileImage: v })} />
                      )}
                    </div>
                  </div>
                </Card>

                <Card title="Dokumen Resume (PDF)">
                  <input type="file" ref={pdfInputRef} accept="application/pdf" onChange={handlePdfUpload} className="hidden" />
                  <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                    <div className="relative h-32 w-32 shrink-0 flex items-center justify-center rounded-2xl border border-border bg-muted text-red-500/70">
                      <FileText className="h-12 w-12" />
                    </div>
                    <div className="space-y-3 flex-1">
                      <p className="text-sm text-muted-foreground">Upload file resume/CV Anda (hanya PDF). Karena aplikasi Anda menggunakan sistem serverless Cloudinary, file akan ter-upload ke Cloud secara persisten, namun saat pengunjung mendownloadnya, browser akan otomatis menamai ulang file tersebut menjadi <code className="bg-muted px-1 py-0.5 rounded text-foreground">Resume_Cleo.pdf</code>.</p>
                      <motion.button onClick={() => pdfInputRef.current?.click()} disabled={uploadingPdf} whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-50">
                        {uploadingPdf ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                        {uploadingPdf ? "Mengunggah PDF..." : "Upload Resume PDF"}
                      </motion.button>
                      <Input label="Resume URL Path (Cloudinary Auto)" value={data.socialLinks.resume} onChange={(v) => setData({ ...data, socialLinks: { ...data.socialLinks, resume: v } })} />
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* PROFILE & HERO */}
            {tab === "profile" && translations && (
              <div className="space-y-4">
                <Card title="Social Links">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input label="Instagram URL" value={data.socialLinks.instagram} onChange={(v) => setData({ ...data, socialLinks: { ...data.socialLinks, instagram: v } })} />
                    <Input label="Email" value={data.socialLinks.email} onChange={(v) => setData({ ...data, socialLinks: { ...data.socialLinks, email: v } })} />
                    <Input label="GitHub URL" value={data.socialLinks.github} onChange={(v) => setData({ ...data, socialLinks: { ...data.socialLinks, github: v } })} />
                    <Input label="Resume URL" value={data.socialLinks.resume} onChange={(v) => setData({ ...data, socialLinks: { ...data.socialLinks, resume: v } })} />
                  </div>
                </Card>
                <Card title={`Hero — ${localeNames[locale]}`}>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <Input label="Badge" isTranslating={translatingFields["hero.badge"]} value={getTranslation(locale, "hero.badge")} onChange={(v) => updateTranslation(locale, "hero.badge", v)} onPreview={() => setPreviewPath("hero.badge")} />
                      <Input label="Profile Name" isTranslating={translatingFields["hero.profile.name"]} value={getTranslation(locale, "hero.profile.name")} onChange={(v) => updateTranslation(locale, "hero.profile.name", v)} onPreview={() => setPreviewPath("hero.profile.name")} />
                    </div>
                    <Input label="Headline 1" isTranslating={translatingFields["hero.headline1"]} value={getTranslation(locale, "hero.headline1")} onChange={(v) => updateTranslation(locale, "hero.headline1", v)} onPreview={() => setPreviewPath("hero.headline1")} />
                    <Input label="Headline 2" isTranslating={translatingFields["hero.headline2"]} value={getTranslation(locale, "hero.headline2")} onChange={(v) => updateTranslation(locale, "hero.headline2", v)} onPreview={() => setPreviewPath("hero.headline2")} />
                    <Input label="Headline Accent" isTranslating={translatingFields["hero.headlineAccent"]} value={getTranslation(locale, "hero.headlineAccent")} onChange={(v) => updateTranslation(locale, "hero.headlineAccent", v)} onPreview={() => setPreviewPath("hero.headlineAccent")} />
                    <Textarea label="Description" isTranslating={translatingFields["hero.description"]} value={getTranslation(locale, "hero.description")} onChange={(v) => updateTranslation(locale, "hero.description", v)} onPreview={() => setPreviewPath("hero.description")} />
                    <Input label="Profile Title" isTranslating={translatingFields["hero.profile.title"]} value={getTranslation(locale, "hero.profile.title")} onChange={(v) => updateTranslation(locale, "hero.profile.title", v)} onPreview={() => setPreviewPath("hero.profile.title")} />
                    <Textarea label="Profile Bio" isTranslating={translatingFields["hero.profile.bio"]} value={getTranslation(locale, "hero.profile.bio")} onChange={(v) => updateTranslation(locale, "hero.profile.bio", v)} rows={2} onPreview={() => setPreviewPath("hero.profile.bio")} />
                    <Input label="Location" isTranslating={translatingFields["hero.profile.location"]} value={getTranslation(locale, "hero.profile.location")} onChange={(v) => updateTranslation(locale, "hero.profile.location", v)} onPreview={() => setPreviewPath("hero.profile.location")} />
                  </div>
                </Card>
              </div>
            )}

            {/* PROJECTS */}
            {tab === "projects" && (
              <div className="space-y-4">
                {data.projects.map((project, i) => (
                  <Card key={project.id} title={`Project ${i + 1}: ${project.title}`}>
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="flex-1 space-y-3">
                        <Input label="Title" value={project.title} onChange={(v) => {
                          const p = [...data.projects]; p[i] = { ...p[i], title: v }; setData({ ...data, projects: p });
                        }} />
                        <Textarea label="Description" value={project.description || ""} onChange={(v) => {
                          const p = [...data.projects]; p[i] = { ...p[i], description: v }; setData({ ...data, projects: p });
                        }} />
                        <div className="grid grid-cols-2 gap-3">
                          <Input label="GitHub URL" value={project.github} onChange={(v) => {
                            const p = [...data.projects]; p[i] = { ...p[i], github: v }; setData({ ...data, projects: p });
                          }} />
                          <Input label="Demo URL" value={project.demo} onChange={(v) => {
                            const p = [...data.projects]; p[i] = { ...p[i], demo: v }; setData({ ...data, projects: p });
                          }} />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <Input label="Stars" value={project.stars} onChange={(v) => {
                            const p = [...data.projects]; p[i] = { ...p[i], stars: v }; setData({ ...data, projects: p });
                          }} />
                          <Input label="Metric Value" value={project.metricValue} onChange={(v) => {
                            const p = [...data.projects]; p[i] = { ...p[i], metricValue: v }; setData({ ...data, projects: p });
                          }} />
                          <Input label="Metric Label" value={project.metricLabel} onChange={(v) => {
                            const p = [...data.projects]; p[i] = { ...p[i], metricLabel: v }; setData({ ...data, projects: p });
                          }} />
                        </div>
                        <Input label="Tags (comma separated)" value={project.tags.join(", ")} onChange={(v) => {
                          const p = [...data.projects]; p[i] = { ...p[i], tags: v.split(",").map(t => t.trim()).filter(Boolean) }; setData({ ...data, projects: p });
                        }} />
                      </div>
                      <div className="w-full lg:w-64 shrink-0 space-y-3">
                        <label className="text-xs font-medium text-muted-foreground">Project Image</label>
                        <div className="h-32 w-full rounded-xl border border-border bg-muted overflow-hidden relative flex items-center justify-center group">
                          {project.image ? (
                            <img src={project.image} alt="Project" className="h-full w-full object-cover" />
                          ) : (
                            <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
                          )}
                          <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                            <span className="text-xs font-medium text-white flex items-center gap-1"><Upload className="w-3 h-3"/> Upload</span>
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, project.id)} />
                          </label>
                        </div>
                        <p className="text-[10px] text-muted-foreground">Opsional. Jika kosong namun Demo URL terisi, iframe akan ditampilkan secara interaktif.</p>
                        
                        <div className="pt-4">
                          <button onClick={() => {
                            setData({ ...data, projects: data.projects.filter((_, j) => j !== i) });
                          }} className="flex items-center gap-1 text-xs text-red-500/80 hover:text-red-500 transition-colors w-full justify-center rounded-lg border border-red-500/20 bg-red-500/10 py-2">
                            <Trash2 className="h-3 w-3" /> Hapus Project
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => {
                  const newId = Math.max(...data.projects.map(p => p.id), 0) + 1;
                  setData({ ...data, projects: [...data.projects, {
                    id: newId, title: "New Project", description: "Project description...", tags: [], github: "", demo: "", stars: "0",
                    gradient: "from-violet-500/20 via-purple-500/10 to-transparent", screenColor: "bg-violet-950/50",
                    metricValue: "0", metricLabel: "Users",
                  }]});
                }} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-4 text-sm text-muted-foreground hover:border-violet-500/50 hover:text-violet-500 transition-all">
                  <Plus className="h-4 w-4" /> Tambah Project Baru
                </motion.button>
              </div>
            )}

            {/* STATS */}
            {tab === "stats" && (
              <div className="space-y-4">
                <Card title="About Section Stats">
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Projects Made" value={data.aboutStats.companiesValue} type="number" onChange={(v) => setData({ ...data, aboutStats: { ...data.aboutStats, companiesValue: Number(v) } })} />
                    <Input label="Scholarship ($M)" value={data.aboutStats.fundingValue} type="number" onChange={(v) => setData({ ...data, aboutStats: { ...data.aboutStats, fundingValue: Number(v) } })} />
                    <Input label="People Helped (K)" value={data.aboutStats.usersValue} type="number" onChange={(v) => setData({ ...data, aboutStats: { ...data.aboutStats, usersValue: Number(v) } })} />
                    <Input label="Communities" value={data.aboutStats.countriesValue} type="number" onChange={(v) => setData({ ...data, aboutStats: { ...data.aboutStats, countriesValue: Number(v) } })} />
                  </div>
                </Card>
                <Card title="Impact Section Stats">
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Total Users (K)" value={data.statsData.usersValue} type="number" onChange={(v) => setData({ ...data, statsData: { ...data.statsData, usersValue: Number(v) } })} />
                    <Input label="ARR ($M)" value={data.statsData.arrValue} type="number" onChange={(v) => setData({ ...data, statsData: { ...data.statsData, arrValue: Number(v) } })} />
                    <Input label="Uptime (%)" value={data.statsData.uptimeValue} type="number" onChange={(v) => setData({ ...data, statsData: { ...data.statsData, uptimeValue: Number(v) } })} />
                    <Input label="Rating (/5)" value={data.statsData.ratingValue} type="number" onChange={(v) => setData({ ...data, statsData: { ...data.statsData, ratingValue: Number(v) } })} />
                    <Input label="Team Members" value={data.statsData.teamValue} type="number" onChange={(v) => setData({ ...data, statsData: { ...data.statsData, teamValue: Number(v) } })} />
                  </div>
                </Card>
              </div>
            )}

            {/* TRANSLATIONS (all sections) */}
            {tab === "translations" && translations && (
              <div className="space-y-4">
                <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-3 text-xs text-blue-600 dark:text-blue-400 flex flex-col sm:flex-row sm:items-center gap-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 shrink-0" />
                    <span>
                      {autoTranslate 
                        ? `Mengedit bahasa ${localeNames[locale]}. Bahasa lain di-translate otomatis!` 
                        : `Mengedit bahasa ${localeNames[locale]}.`}
                    </span>
                  </div>
                </div>

                <Card title={`Navbar — ${localeNames[locale]}`}>
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="About" isTranslating={translatingFields["nav.about"]} value={getTranslation(locale, "nav.about")} onChange={(v) => updateTranslation(locale, "nav.about", v)} />
                    <Input label="Ventures" isTranslating={translatingFields["nav.ventures"]} value={getTranslation(locale, "nav.ventures")} onChange={(v) => updateTranslation(locale, "nav.ventures", v)} />
                    <Input label="Work" isTranslating={translatingFields["nav.work"]} value={getTranslation(locale, "nav.work")} onChange={(v) => updateTranslation(locale, "nav.work", v)} />
                    <Input label="Contact" isTranslating={translatingFields["nav.contact"]} value={getTranslation(locale, "nav.contact")} onChange={(v) => updateTranslation(locale, "nav.contact", v)} />
                  </div>
                </Card>

                <Card title={`About Section — ${localeNames[locale]}`}>
                  <div className="space-y-3">
                    <Input label="Section Label" isTranslating={translatingFields["about.sectionLabel"]} value={getTranslation(locale, "about.sectionLabel")} onChange={(v) => updateTranslation(locale, "about.sectionLabel", v)} />
                    <Input label="Headline" isTranslating={translatingFields["about.headline"]} value={getTranslation(locale, "about.headline")} onChange={(v) => updateTranslation(locale, "about.headline", v)} />
                    <Input label="Headline 2" isTranslating={translatingFields["about.headline2"]} value={getTranslation(locale, "about.headline2")} onChange={(v) => updateTranslation(locale, "about.headline2", v)} />
                    <Input label="Headline Accent" isTranslating={translatingFields["about.headlineAccent"]} value={getTranslation(locale, "about.headlineAccent")} onChange={(v) => updateTranslation(locale, "about.headlineAccent", v)} />
                    <Textarea label="Description 1" isTranslating={translatingFields["about.description1"]} value={getTranslation(locale, "about.description1")} onChange={(v) => updateTranslation(locale, "about.description1", v)} rows={2} />
                    <Textarea label="Description 2" isTranslating={translatingFields["about.description2"]} value={getTranslation(locale, "about.description2")} onChange={(v) => updateTranslation(locale, "about.description2", v)} rows={2} />
                  </div>
                </Card>
                
                <Card title={`Command Menu — ${localeNames[locale]}`}>
                  <div className="space-y-3">
                    <Input label="Search Placeholder" isTranslating={translatingFields["command.placeholder"]} value={getTranslation(locale, "command.placeholder")} onChange={(v) => updateTranslation(locale, "command.placeholder", v)} />
                    <Input label="No Results Text" isTranslating={translatingFields["command.noResults"]} value={getTranslation(locale, "command.noResults")} onChange={(v) => updateTranslation(locale, "command.noResults", v)} />
                  </div>
                </Card>

                <Card title={`Contact Section — ${localeNames[locale]}`}>
                  <div className="space-y-3">
                    <Input label="Headline" isTranslating={translatingFields["contact.headline"]} value={getTranslation(locale, "contact.headline")} onChange={(v) => updateTranslation(locale, "contact.headline", v)} />
                    <Input label="Headline Accent" isTranslating={translatingFields["contact.headlineAccent"]} value={getTranslation(locale, "contact.headlineAccent")} onChange={(v) => updateTranslation(locale, "contact.headlineAccent", v)} />
                    <Textarea label="Description" isTranslating={translatingFields["contact.description"]} value={getTranslation(locale, "contact.description")} onChange={(v) => updateTranslation(locale, "contact.description", v)} rows={2} />
                  </div>
                </Card>
              </div>
            )}

            {/* TIMELINE */}
            {tab === "timeline" && translations && (
              <div className="space-y-4">
                <Card title={`Timeline — ${localeNames[locale]}`}>
                  <div className="space-y-3">
                    <Input label="Section Label" isTranslating={translatingFields["timeline.sectionLabel"]} value={getTranslation(locale, "timeline.sectionLabel")} onChange={(v) => updateTranslation(locale, "timeline.sectionLabel", v)} />
                    <Input label="Headline" isTranslating={translatingFields["timeline.headline"]} value={getTranslation(locale, "timeline.headline")} onChange={(v) => updateTranslation(locale, "timeline.headline", v)} />
                    <Input label="Headline Accent" isTranslating={translatingFields["timeline.headlineAccent"]} value={getTranslation(locale, "timeline.headlineAccent")} onChange={(v) => updateTranslation(locale, "timeline.headlineAccent", v)} />
                  </div>
                </Card>
              </div>
            )}

            {/* SERVICES */}
            {tab === "services" && translations && (
              <div className="space-y-4">
                <Card title={`Services — ${localeNames[locale]}`}>
                  <Input label="Section Label" isTranslating={translatingFields["services.sectionLabel"]} value={getTranslation(locale, "services.sectionLabel")} onChange={(v) => updateTranslation(locale, "services.sectionLabel", v)} />
                </Card>
              </div>
            )}

            {/* CONTACT */}
            {tab === "contact" && (
              <Card title="Social & Contact Links">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input label="Instagram URL" value={data.socialLinks.instagram} onChange={(v) => setData({ ...data, socialLinks: { ...data.socialLinks, instagram: v } })} />
                  <Input label="Email" value={data.socialLinks.email} onChange={(v) => setData({ ...data, socialLinks: { ...data.socialLinks, email: v } })} />
                  <Input label="GitHub URL" value={data.socialLinks.github} onChange={(v) => setData({ ...data, socialLinks: { ...data.socialLinks, github: v } })} />
                  <Input label="Resume URL" value={data.socialLinks.resume} onChange={(v) => setData({ ...data, socialLinks: { ...data.socialLinks, resume: v } })} />
                </div>
              </Card>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* HIGHLIGHT PREVIEW MODAL */}
      <AnimatePresence>
        {previewPath && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 lg:p-8"
            onClick={() => setPreviewPath(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="relative w-full h-full max-w-7xl rounded-2xl overflow-hidden bg-background border border-border shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-3 border-b border-border bg-card shadow-sm z-10">
                <div className="flex items-center gap-3 text-sm font-medium">
                  <div className="p-1.5 rounded-lg bg-violet-500/10 text-violet-500">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-muted-foreground mr-1">Previewing:</span>
                    <span className="text-foreground bg-muted px-1.5 py-0.5 rounded text-xs font-mono">{previewPath}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setPreviewPath(null)} 
                  className="p-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 w-full bg-muted relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground/30" />
                </div>
                <iframe 
                  id="preview-frame" 
                  src="/" 
                  className="relative z-10 w-full h-full border-0 bg-background" 
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-violet-500" /></div>}>
      <DashboardContent />
    </Suspense>
  );
}
