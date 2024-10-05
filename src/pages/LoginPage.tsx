import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const LoginPage = () => {
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
                  <form>
                    <div className="mb-4">
                      <Input type="email" placeholder="Email" />
                    </div>
                    <div className="mb-6">
                      <Input type="password" placeholder="Password" />
                    </div>
                    <Button className="w-full">Log in</Button>
                  </form>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-center w-full">
                    Forgot password?
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
                  <form>
                  <div className="mb-4">
                      <Input type="email" placeholder="Full Name" />
                    </div>
                    <div className="mb-4">
                      <Input type="email" placeholder="Email" />
                    </div>
                    <div className="mb-6">
                      <Input type="password" placeholder="Password" />
                    </div>
                    <Button className="w-full">Sign up</Button>
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