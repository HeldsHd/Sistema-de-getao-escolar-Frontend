"use client";

import { GraduationCap, LockKeyhole, ShieldCheck, User } from "lucide-react";
import Button from "@/components/Button";
import Input from "@/components/Input"

import { login } from "@/app/actions";

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-md py-xl">
      <div className="absolute h-full desktop:h-[90%] w-full desktop:w-[min(100%,720px)] flex-col overflow-hidden desktop:rounded-2xl desktop:border border-border bg-surface shadow-xl desktop:flex">
        <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden border-b border-border bg-linear-to-br from-[#3c3d64] to-[#887cbd] px-lg py-2xl text-center desktop:h-screen desktop:flex ">
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

        <form
          className="flex w-full flex-2 flex-col justify-center gap-lg p-lg sm:p-2xl"
          action={login}
        >
          <Input 
            icon={User}
            label="E-mail"
            caption="Informe seu e-mail para acessar sua conta."
            name="email"
          />
          <Input 
            icon={LockKeyhole}
            label="Senha"
            name="senha"
          />
          <div className="flex flex-col gap-md">
            <Button className="w-full">Entrar</Button>
            <div className="flex items-center justify-center gap-xs text-caption text-text-muted">
              <ShieldCheck
                size={16}
                aria-hidden="true"
                className="text-success"
              />
              <span>Seus dados são protegidos com segurança.</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
