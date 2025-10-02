import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Mail, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const requestAccessSchema = z.object({
  email: z.string().email("Please enter a valid email address").refine(
    (email) => email.includes('@socialmarketing.com'),
    "Only BWA employees with @socialmarketing.com email addresses can request access"
  ),
  name: z.string().min(1, "Please enter your full name"),
});

type LoginForm = z.infer<typeof loginSchema>;
type RequestAccessForm = z.infer<typeof requestAccessSchema>;

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const { toast } = useToast();

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "" },
  });

  const requestForm = useForm<RequestAccessForm>({
    resolver: zodResolver(requestAccessSchema),
    defaultValues: { email: "", name: "" },
  });

  const handleLogin = async (data: LoginForm) => {
    setIsLoading(true);
    setMessage(null);
    
    try {
      await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      
      toast({
        title: "Login successful",
        description: "Welcome to the BWA signature generator!",
      });
      
      // Refresh the page to update auth state
      window.location.reload();
    } catch (error: any) {
      const errorMessage = error.message || "Login failed";
      setMessage({ type: 'error', text: errorMessage });
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestAccess = async (data: RequestAccessForm) => {
    setIsLoading(true);
    setMessage(null);
    
    try {
      const response = await apiRequest('/api/auth/request-access', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      
      setMessage({ 
        type: 'success', 
        text: "Access requested successfully! Please contact your administrator for approval." 
      });
      
      toast({
        title: "Request sent",
        description: "Your access request has been submitted for approval.",
      });
      
      requestForm.reset();
    } catch (error: any) {
      const errorMessage = error.message || "Request failed";
      setMessage({ type: 'error', text: errorMessage });
      toast({
        title: "Request failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-700 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">BWA Signature Generator</h1>
          <p className="text-slate-600 mt-2">Secure access for BWA employees only</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex space-x-1">
              <Button
                variant={isLogin ? "default" : "ghost"}
                size="sm"
                onClick={() => setIsLogin(true)}
                className="flex-1"
              >
                Login
              </Button>
              <Button
                variant={!isLogin ? "default" : "ghost"}
                size="sm"
                onClick={() => setIsLogin(false)}
                className="flex-1"
              >
                Request Access
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {message && (
              <Alert variant={message.type === 'error' ? "destructive" : "default"}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}

            {isLogin ? (
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                <div>
                  <Label htmlFor="email">BWA Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.name@socialmarketing.com"
                    {...loginForm.register("email")}
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            ) : (
              <form onSubmit={requestForm.handleSubmit(handleRequestAccess)} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    {...requestForm.register("name")}
                  />
                  {requestForm.formState.errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {requestForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="request-email">BWA Email Address</Label>
                  <Input
                    id="request-email"
                    type="email"
                    placeholder="your.name@socialmarketing.com"
                    {...requestForm.register("email")}
                  />
                  {requestForm.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {requestForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Requesting..." : "Request Access"}
                </Button>
              </form>
            )}

            <div className="text-center text-sm text-slate-600">
              <div className="flex items-center justify-center space-x-1">
                <Mail className="w-4 h-4" />
                <span>BWA employees only</span>
              </div>
              <p className="mt-1">Contact your administrator for access approval</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}