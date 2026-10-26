import { LockKeyhole, User } from "lucide-react";

export default function LoginCard() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex h-[70vh] w-[80%] max-w-[720px] flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-md">
        <div className="flex w-full flex-1 items-center justify-center border-b border-border bg-border-strong">
          <div className="flex flex-col items-center justify-center gap-sm">
            <h1 className="text-h1 font-bold text-surface">Login</h1>
            <p className="text-body text-surface">Sign in to your account</p>
          </div>
        </div>

        <div className="flex w-full flex-2 flex-col justify-center gap-lg p-md">
          <div className="flex flex-col gap-md">
            <label className="flex h-12 items-center gap-sm rounded-sm border border-border bg-background px-md py-sm  hover:border-icon hover:border-2">
              <User size={18} className="text-primary" />
              <input
                type="text"
                placeholder="Username"
                className="h-12 border-0 bg-transparent text-text placeholder:text-text-muted focus:outline-none"
              />
            </label>

            <label className="flex h-12 items-center gap-sm rounded-sm border border-border bg-background px-md py-sm hover:border-icon hover:border-2">
              <LockKeyhole size={18} className="text-primary" />
              <input
                type="password"
                placeholder="Password"
                className="h-12 border-0 bg-transparent text-text placeholder:text-text-muted focus:outline-none"
              />
            </label>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              className="cursor-pointer text-caption text-primary hover:underline"
            >
              Forgot password?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
