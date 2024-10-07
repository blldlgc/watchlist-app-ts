import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { auth } from "@/config/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile } from 'firebase/auth';
import { DialogManager } from "@/components/DialogManager";


const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');
    

    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          await signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
          setError('Login failed. Please check your credentials.');
      }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: fullName
    });
    console.log("User registered successfully with full name:", fullName);
    } catch (error) {
        setError('Signup failed. Please try again.');
    }
};

const handleForgotPassword = async () => {
  if (!email) {
      setError('Please enter your email address.');
      return;
  }
  try {
      await sendPasswordResetEmail(auth, email);
    DialogManager.show(
      "Password Reset",
      "A password reset link has been sent to your email.",
      < >
    
      </>
      );
  } catch (error) {
      setError('Failed to send password reset email. Please try again.');
  }
};

const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
  setter(value);
  setError(''); // Error'u sıfırlar
};

    return (
        <div className="flex items-center justify-center w-screen h-screen bg-gray-50">
          <Tabs defaultValue="login" className="w-full max-w-[400px] p-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Log in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card >
                <CardHeader>
                  <CardTitle>Log in</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin}>
                    <div className="mb-4">
                      <Input 
                      type="email" 
                      placeholder="Email"
                      value={email}
                       onChange={(e) => handleInputChange(setEmail, e.target.value)}
                      />
                    </div>
                    <div className="mb-6">
                      <Input 
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => handleInputChange(setPassword, e.target.value)}
                       />
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2 mb-2">{error}</p>}
                    <Button className="w-full" type="submit">Log in</Button>
                  </form>
                </CardContent>
                <CardFooter>
                <p className="text-sm text-center w-full">
                    <button onClick={handleForgotPassword} className="text-blue-500">Forgot password?</button>
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="signup">
              <Card >
                <CardHeader>
                  <CardTitle>Sign up</CardTitle>
                </CardHeader>
                <CardContent>
                <form onSubmit={handleSignup}>
                    <div className="mb-4">
                      <Input 
                        type="text" 
                        placeholder="Full Name" 
                        value={fullName} 
                        onChange={(e) => handleInputChange(setFullName, e.target.value)} 
                      />
                    </div>
                    <div className="mb-4">
                      <Input 
                        type="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => handleInputChange(setEmail, e.target.value)}
                      />
                    </div>
                    <div className="mb-6">
                      <Input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => handleInputChange(setPassword, e.target.value)}
                      />
                    </div>
                    <Button className="w-full" type="submit">Sign up</Button>
                    
                  </form>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-center w-full">
                  By signing up, you agree to our Terms , Privacy Policy and Cookies Policy .
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>

    </div>
    );
};

export default LoginPage;