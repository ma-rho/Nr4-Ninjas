import { LoginForm } from '@/components/admin/LoginForm';

export default function LoginPage() {
  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h1 className="font-headline text-5xl uppercase text-primary md:text-7xl">
            Admin
          </h1>
        </div>
        <div className="mt-12">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
