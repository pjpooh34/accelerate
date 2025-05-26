import SignupForm from "@/components/auth/signup-form";
import { useRedirectAfterLogin } from "@/hooks/use-redirect";

export default function Signup() {
  useRedirectAfterLogin();
  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4 py-12">
      <div className="w-full max-w-md">
        <SignupForm />
      </div>
    </div>
  );
}