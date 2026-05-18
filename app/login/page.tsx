"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Lock, User, ArrowRight, Sparkles, Shield } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError("Username atau password salah");
        setLoading(false);
      }
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="relative flex min-h-screen bg-background transition-colors duration-300">
      {/* LEFT — Login Form */}
      <div className="relative z-10 flex w-full flex-col justify-center px-6 sm:px-12 lg:w-[480px] lg:min-w-[480px]">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto w-full max-w-sm"
        >
          {/* Logo */}
          <div className="mb-10">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white text-sm font-bold shadow-[0_0_20px_rgba(139,92,246,0.4)]">
                A/
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                Dashboard
              </span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">Selamat datang</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Masuk untuk mengelola portofolio Anda
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="login-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  className="w-full rounded-xl border border-border bg-muted py-3.5 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-200 focus:border-violet-500/50 focus:bg-muted/80 focus:ring-2 focus:ring-violet-500/20"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full rounded-xl border border-border bg-muted py-3.5 pl-11 pr-12 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-200 focus:border-violet-500/50 focus:bg-muted/80 focus:ring-2 focus:ring-violet-500/20"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-500"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-violet-600 py-3.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all duration-200 hover:bg-violet-500 hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </motion.button>
          </form>

          {/* Security hint */}
          <div className="mt-8 flex items-center gap-2 text-[10px] text-muted-foreground">
            <Shield className="h-3 w-3" />
            <span>Dilindungi dengan enkripsi cookie sesi yang aman</span>
          </div>
        </motion.div>
      </div>

      {/* RIGHT — Animated Visual */}
      <div className="relative hidden flex-1 overflow-hidden lg:block">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/30 via-background to-purple-900/20 dark:from-violet-950/80 dark:via-[#0a0a0a] dark:to-purple-950/50" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(139,92,246,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(139,92,246,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Animated orbs */}
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[20%] top-[30%] h-[300px] w-[300px] rounded-full bg-violet-600/20 blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[20%] bottom-[30%] h-[250px] w-[250px] rounded-full bg-purple-500/15 blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, 20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[40%] top-[50%] h-[200px] w-[200px] rounded-full bg-blue-500/10 blur-[80px]"
        />

        {/* Floating cards */}
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="relative w-full max-w-lg">
            {/* Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mb-4"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="rounded-2xl border border-border bg-card/80 p-6 backdrop-blur-md shadow-xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 dark:bg-violet-500/20">
                    <Sparkles className="h-5 w-5 text-violet-500 dark:text-violet-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">Dashboard Admin</div>
                    <div className="text-[10px] text-muted-foreground">Kelola semua konten portofolio</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                    <span className="text-xs text-muted-foreground">Profile</span>
                    <div className="h-1.5 w-20 rounded-full bg-violet-500/40" />
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                    <span className="text-xs text-muted-foreground">Projects</span>
                    <div className="h-1.5 w-16 rounded-full bg-emerald-500/40" />
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                    <span className="text-xs text-muted-foreground">Translations</span>
                    <div className="h-1.5 w-24 rounded-full bg-blue-500/40" />
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="ml-12"
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="rounded-2xl border border-border bg-card/80 p-6 backdrop-blur-md shadow-xl"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600" />
                  <div>
                    <div className="text-sm font-semibold text-foreground">Cleo Ameylia</div>
                    <div className="text-[10px] text-green-500">● Online</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Projects", value: "3" },
                    { label: "Languages", value: "5" },
                    { label: "Sections", value: "8" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-lg bg-muted/50 p-2 text-center">
                      <div className="text-lg font-bold text-foreground">{s.value}</div>
                      <div className="text-[9px] text-muted-foreground">{s.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-violet-500/40"
            style={{
              left: `${10 + (i * 37) % 80}%`,
              top: `${5 + (i * 53) % 90}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + (i % 3),
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
