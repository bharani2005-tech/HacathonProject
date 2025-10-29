import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

const BACKEND_URL = "https://ua9zkv.vercel.app/api";

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if ((isLogin && (!formData.email || !formData.password)) ||
        (!isLogin && (!formData.name || !formData.email || !formData.password))) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const payload = { client_name: isLogin ? formData.email : formData.name };
      const res = await fetch(`${BACKEND_URL}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("user", JSON.stringify(data));
        toast.success(isLogin ? "Login successful! Redirecting..." : "Account created! Redirecting...");
        setTimeout(() => navigate("/tracking"), 1000);
      } else {
        const errData = await res.json();
        toast.error(errData.error || "Something went wrong!");
      }

    } catch (err) {
      console.error(err);
      toast.error("Server error. Try again later.");
    }
  };

  const handleGuestAccess = () => {
    localStorage.setItem("user", JSON.stringify({ email: "guest@tracker.com", isGuest: true }));
    toast.success("Continuing as guest...");
    setTimeout(() => navigate("/tracking"), 500);
  };

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary) / 0.1) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(var(--primary) / 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        ></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        <Button onClick={() => navigate('/')} variant="ghost" className="mb-6 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Button>

        <Card className="glass p-8 border-border/30 shadow-card">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow-cyan">
                <MapPin className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p className="text-muted-foreground">{isLogin ? 'Sign in to access your tracking dashboard' : 'Join us and start tracking locations in 3D'}</p>
          </div>

          <div className="flex gap-2 mb-6 p-1 bg-muted/20 rounded-lg">
            <Button type="button" onClick={() => setIsLogin(true)}
              className={`flex-1 transition-all duration-300 ${isLogin ? 'bg-gradient-primary text-white shadow-glow-cyan' : 'bg-transparent text-muted-foreground hover:text-foreground'}`}>Login</Button>
            <Button type="button" onClick={() => setIsLogin(false)}
              className={`flex-1 transition-all duration-300 ${!isLogin ? 'bg-gradient-primary text-white shadow-glow-cyan' : 'bg-transparent text-muted-foreground hover:text-foreground'}`}>Sign Up</Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin &&
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground flex items-center gap-2"><User className="w-4 h-4 text-primary" /> Full Name</Label>
                <Input id="name" name="name" type="text" placeholder="John Doe" value={formData.name} onChange={handleInputChange} className="bg-input border-border/50 focus:border-primary transition-all duration-300 text-foreground placeholder:text-muted-foreground" />
              </div>
            }

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> Email Address</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleInputChange} className="bg-input border-border/50 focus:border-primary transition-all duration-300 text-foreground placeholder:text-muted-foreground" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground flex items-center gap-2"><Lock className="w-4 h-4 text-primary" /> Password</Label>
              <Input id="password" name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleInputChange} className="bg-input border-border/50 focus:border-primary transition-all duration-300 text-foreground placeholder:text-muted-foreground" />
            </div>

            {isLogin &&
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-border" />
                  <span className="text-muted-foreground">Remember me</span>
                </label>
                <button type="button" className="text-primary hover:text-primary/80 transition-colors">Forgot password?</button>
              </div>
            }

            <Button type="submit" className="w-full bg-gradient-primary text-white hover:opacity-90 shadow-glow-cyan transition-all duration-300 hover:scale-105 py-6 text-base">{isLogin ? 'Sign In' : 'Create Account'}</Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/50"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-4 bg-card text-muted-foreground">OR</span></div>
          </div>

          <Button type="button" onClick={handleGuestAccess} variant="outline" className="w-full border-border/50 text-foreground hover:bg-muted/20 transition-all duration-300 py-6 text-base">Continue as Guest</Button>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-primary hover:text-primary/80 transition-colors font-semibold">{isLogin ? 'Sign up' : 'Log in'}</button>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
