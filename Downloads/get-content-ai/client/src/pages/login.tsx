import LoginForm from "@/components/auth/login-form";
import { useRedirectAfterLogin } from "@/hooks/use-redirect";

export default function Login() {
  useRedirectAfterLogin();
  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4 py-12">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}