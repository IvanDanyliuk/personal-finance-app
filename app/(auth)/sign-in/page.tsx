'use client'

import { Button } from "@/components/ui/button";
import { signInWithProvider } from "@/lib/actions/user.action";

export default function SignInPage() {
  const signInWithGoogle = async () => {
    await signInWithProvider('google');
  }

  return (
    <div>
      <form action="">Sign In Form</form>
      <Button 
        type='button'
        onClick={signInWithGoogle}
      >
        Sign-In with Google
      </Button>
    </div>
  )
}