'use client'

import { useAuthActions } from "@convex-dev/auth/react";

export default function LogIn() {
  const { signIn } = useAuthActions();
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        void signIn("resend", formData);
      }}
    >
      <input name="email" placeholder="Email" type="text" />
      <button type="submit">Send sign-in link</button>
    </form>
  );
}