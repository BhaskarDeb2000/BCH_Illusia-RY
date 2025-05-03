import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, UserPlus } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";

const formSchema = z
  .object({
    firstName: z.string().min(1, "Etunimi on pakollinen"),
    lastName: z.string().min(1, "Sukunimi on pakollinen"),
    email: z.string().email("Virheellinen sähköpostiosoite"),
    password: z
      .string()
      .min(8, "Salasanan on oltava vähintään 8 merkkiä pitkä")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Salasanan tulee sisältää isoja ja pieniä kirjaimia sekä numeroita"
      ),
    confirmPassword: z.string(),
    organization: z.string().optional(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "Sinun on hyväksyttävä käyttöehdot jatkaaksesi",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Salasanat eivät täsmää",
    path: ["confirmPassword"],
  });

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      organization: "",
      acceptTerms: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          firstName: values.firstName,
          lastName: values.lastName,
          organization: values.organization,
        },
      },
    });

    setIsLoading(false);

    if (error) {
      toast.error("Registration failed", {
        description: error.message,
      });
      return;
    }

    toast.success("Registration successful!", {
      description: "Your account is now pending admin approval.",
    });
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center py-12">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Rekisteröidy</h1>
            <p className="text-muted-foreground mt-2">
              Luo tili käyttääksesi Illusia Storage -järjestelmää
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Etunimi</FormLabel>
                      <FormControl>
                        <Input placeholder="Etunimi" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sukunimi</FormLabel>
                      <FormControl>
                        <Input placeholder="Sukunimi" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sähköposti</FormLabel>
                    <FormControl>
                      <Input placeholder="esimerkki@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="organization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organisaatio (valinnainen)</FormLabel>
                    <FormControl>
                      <Input placeholder="Organisaation nimi" {...field} />
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
                    <FormLabel>Salasana</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="********"
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vahvista salasana</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="********"
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="acceptTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-normal">
                        Hyväksyn{" "}
                        <a
                          href="/terms"
                          className="text-illusia-purple hover:text-illusia-purple-dark"
                        >
                          käyttöehdot
                        </a>{" "}
                        ja{" "}
                        <a
                          href="/privacy"
                          className="text-illusia-purple hover:text-illusia-purple-dark"
                        >
                          tietosuojakäytännön
                        </a>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-illusia-purple hover:bg-illusia-purple-dark"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Rekisteröidään...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Rekisteröidy
                  </div>
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Onko sinulla jo tili?{" "}
              <Link
                to="/login"
                className="text-illusia-purple font-medium hover:text-illusia-purple-dark"
              >
                Kirjaudu sisään
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
