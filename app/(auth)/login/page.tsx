"use client";

import { useLogin } from "@/features/auth/hook";
import { useState } from "react";

export default function LoginPage() {
  const { mutate } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-[300px] space-y-4">
        <input
          className="w-full border p-2"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full border p-2"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full bg-black text-white p-2"
          onClick={() => mutate({ email, password })}
        >
          Login
        </button>
      </div>
    </div>
  );
}
