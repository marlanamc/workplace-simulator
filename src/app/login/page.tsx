import LoginForm from "./LoginForm";
import { loginsPaused } from "@/lib/login-gate";
import { safeReturn } from "@/lib/lessons/return";

function safeNext(value: string | string[] | undefined) {
  return safeReturn(Array.isArray(value) ? value[0] : value);
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const next = safeNext((await searchParams).next);
  return <LoginForm next={next} paused={loginsPaused()} />;
}
