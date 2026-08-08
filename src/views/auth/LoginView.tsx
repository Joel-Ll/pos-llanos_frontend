import LoginForm from "@/components/auth/LoginForm";

export default function LoginView() {
  return (
    <div className="min-h-screen w-full bg-[url('/pastillas-de-freno.jpg')] bg-cover bg-center bg-no-repeat relative">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 relative z-10 ">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
