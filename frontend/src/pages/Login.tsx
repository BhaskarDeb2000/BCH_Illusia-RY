import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().default(false),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, isAuthenticating, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await signIn(values.email, values.password, values.rememberMe);
      toast.success("Login successful!", {
        description: "Welcome back to Illusia Storage System.",
      });

      // Redirect to the page the user was trying to access, or home
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (error) {
      // Error is already handled in useAuth hook
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center py-12">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Sign In</h1>
            <p className="text-muted-foreground mt-2">
              Enter your credentials to continue
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="example@email.com"
                        {...field}
                        disabled={isAuthenticating}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="******"
                          {...field}
                          disabled={isAuthenticating}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                          onClick={toggleShowPassword}
                          disabled={isAuthenticating}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <div className="flex justify-between items-center">
                      <FormField
                        control={form.control}
                        name="rememberMe"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={isAuthenticating}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              Remember me
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                      <Link
                        to="/forgot-password"
                        className="text-sm text-illusia-purple hover:text-illusia-purple-dark"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-illusia-purple hover:bg-illusia-purple-dark"
                disabled={isAuthenticating}
              >
                {isAuthenticating ? (
                  <div className="flex items-center">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </div>
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account yet?{" "}
              <Link
                to="/register"
                className="text-illusia-purple font-medium hover:text-illusia-purple-dark"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
