import React, { useContext, useState } from 'react';
import { Client, Account } from "appwrite";
import { useTranslation } from 'react-i18next';
import { StoreContext } from '../Context/StoreContext';
import { X } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios'; // Ensure axios is used correctly

// Initialize Appwrite
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite endpoint
    .setProject('6741c0750036fb2ccf69'); // Your Appwrite project ID

const account = new Account(client);

export default function Registration({ setShowLogin }) {
  const { setToken, setUserId } = useContext(StoreContext);
  const { t } = useTranslation();
  const [currState, setCurrState] = useState('Login');
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const { toast } = useToast();

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    const newUrl = currState === "Login"
      ? "http://localhost:3000/spring-api/api/users/login"
      : "http://localhost:3000/spring-api/api/users/register";

    try {
      const response = await axios.post(newUrl, data);
      if (response?.data?.success) {
        setToken(response.data.token);
        setUserId(response.data.userId);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.userId);
        setShowLogin(false);
        toast({
          title: t("Success!"),
          description: response.data.message || t("You have successfully logged in."),
          duration: 3000,
        });
      } else {
        toast({
          variant: "destructive",
          title: t("Error"),
          description: response?.data?.message || t("Something went wrong. Please try again."),
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("Error"),
        description: error.response?.data?.message || t("An error occurred while processing your request."),
        duration: 3000,
      });
    }
  };

  const handleGoogleSuccess = async () => {
    try {
      const session = await account.create(
        'google',
        'http://localhost:5173', // Redirect after success
        'http://localhost:5173/failure' // Redirect after failure
      );

      if (session) {
        // Fetch user details after session creation
        const user = await account.get();
        setToken(user.$id);
        setUserId(user.$id);
        localStorage.setItem("token", user.$id);
        localStorage.setItem("userId", user.$id);

        setShowLogin(false);
        toast({
          title: t("Success!"),
          description: t("You have successfully logged in with Google."),
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Google login error:", error); // Ensure detailed error logs
      toast({
        variant: "destructive",
        title: t("Error"),
        description: error.message || t("Google login failed."),
        duration: 3000,
      });
    }
  };

  const handleGoogleFailure = () => {
    toast({
      variant: "destructive",
      title: t("Error"),
      description: t("Google login was unsuccessful. Please try again."),
      duration: 3000,
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="w-full max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">{t(currState)}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowLogin(false)}
            aria-label={t("Close")}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <form onSubmit={onLogin} className="space-y-4">
          {currState === 'Sign Up' && (
            <Input
              type="text"
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              placeholder={t("Your name")}
              required
            />
          )}
          <Input
            type="email"
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            placeholder={t("Your email")}
            required
          />
          <Input
            type="password"
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            placeholder={t("Password")}
            required
          />
          <Button className="w-full" type="submit">
            {currState === 'Sign Up' ? t('createAccount') : t('Login')}
          </Button>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" required />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t("By continuing, I agree to the terms of use & privacy policy")}
            </label>
          </div>
          {currState === 'Login' ? (
            <p className="text-sm text-gray-600">
              {t("Create a new account")}
              <Button
                variant="link"
                onClick={() => setCurrState('Sign Up')}
                className="p-0 h-auto font-normal"
              >
                {t("Click here")}
              </Button>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              {t("Already have an account?")}
              <Button
                variant="link"
                onClick={() => setCurrState('Login')}
                className="p-0 h-auto font-normal"
              >
                {t("Login here")}
              </Button>
            </p>
          )}
        </form>
        <div className="mt-4">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
          />
        </div>
      </div>
      <Toaster />
    </div>
  );
}
