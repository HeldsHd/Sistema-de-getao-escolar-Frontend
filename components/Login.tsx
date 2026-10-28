"use client";

import { GraduationCap, LockKeyhole, ShieldCheck, User } from "lucide-react";
import { useState } from "react";
import Button from "@/components/Button";

export default function Login() {
  const [password, setPassword] = useState("");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-md py-xl">
      <div className="absolute min-h-[560px] w-[min(100%,720px)] flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-xl desktop:flex">
        <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden border-b border-border bg-gradient-to-br from-[#3c3d64] to-[#887cbd] px-lg py-2xl text-center desktop:h-screen desktop:flex ">
          <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full border border-white/10" />
          <div className="absolute -bottom-24 -left-10 h-56 w-56 rounded-full border border-white/10" />
          <div className="relative flex flex-col items-center gap-md">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white shadow-lg">
              <GraduationCap size={30} aria-hidden="true" />
            </div>
            <span className="rounded-full border border-white/20 bg-white/10 px-md py-xs text-caption font-medium tracking-wide text-white">
              PORTAL ACADÊMICO
            </span>
            <div className="flex flex-col gap-xs">
              <h1 className="text-h1 font-bold text-surface">Bem-vindo(a)</h1>
              <p className="text-body text-white/85">
                Acesse sua conta para acompanhar as informações da sua escola.
              </p>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-2 flex-col justify-center gap-lg p-lg sm:p-2xl">
          <div className="flex flex-col gap-lg">
            <div className="flex flex-col gap-xs">
              <label htmlFor="email" className="text-label font-medium text-text">
                E-mail
              </label>
              <div className="flex h-12 items-center gap-sm rounded-md border border-border bg-background px-md transition-colors hover:border-icon focus-within:border-icon focus-within:ring-2 focus-within:ring-icon/20">
                <User size={18} aria-hidden="true" className="shrink-0 text-primary" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="voce@exemplo.com"
                  className="h-full min-w-0 flex-1 border-0 bg-transparent text-text placeholder:text-text-muted focus:outline-none"
                />
              </div>
              <p className="text-caption text-text-muted">
                Informe seu e-mail para acessar sua conta.
              </p>
            </div>

            <div className="flex flex-col gap-xs">
              <label htmlFor="password" className="text-label font-medium text-text">
                Senha
              </label>
              <div className="flex h-12 items-center gap-sm rounded-md border border-border bg-background px-md transition-colors hover:border-icon focus-within:border-icon focus-within:ring-2 focus-within:ring-icon/20">
                <LockKeyhole size={18} aria-hidden="true" className="shrink-0 text-primary" />
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Digite sua senha"
                  minLength={8}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  aria-describedby="password-requirement"
                  className="h-full min-w-0 flex-1 border-0 bg-transparent text-text placeholder:text-text-muted focus:outline-none"
                />
              </div>
              <p id="password-requirement" className="text-caption text-text-muted">
                A senha deve ter pelo menos 8 caracteres.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-md">
            <Button disabled={password.length < 8} className="w-full">
              Entrar
            </Button>
            <div className="flex items-center justify-center gap-xs text-caption text-text-muted">
              <ShieldCheck size={16} aria-hidden="true" className="text-success" />
              <span>Seus dados são protegidos com segurança.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
