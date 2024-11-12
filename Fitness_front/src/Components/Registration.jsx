import React, { useContext, useState } from 'react'
import axios from 'axios'
import { assets } from '../assets/assets'
import { useTranslation } from 'react-i18next'
import { StoreContext } from '../Context/StoreContext'
import { X } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
// import { axiosInstanceSpring } from '@/api/axios';

export default function Registration({ setShowLogin }) {
  const { setToken, setUserId } = useContext(StoreContext)
  const { t } = useTranslation()
  const [currState, setCurrState] = useState('Login')
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const { toast } = useToast()

  const onChangeHandler = (event) => {
    const name = event.target.name
    const value = event.target.value
    setData((prevData) => ({ ...prevData, [name]: value }))
  }

  const onLogin = async (event) => {
    event.preventDefault()
    let newUrl = "http://localhost:8080"

    if (currState === "Login") {
       newUrl += "/api/users/login"
    } else {
       newUrl += "/api/users/register"
    }

    try {
      const response = await axios.post(newUrl, data)
      console.log(response)

      if (response && response.data && response.data.success) {
        console.log(response.data.token)
        console.log(response.data.userId)
        setToken(response.data.token)
        setUserId(response.data.userId)
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("userId", response.data.userId)
        setShowLogin(false)

        if (toast) {
          toast({
            title: t("Success!"),
            description: response.data.message || t("You have successfully logged in."),
            duration: 3000,
          })
        } else {
          console.log("Toast function not available")
        }

      } else {
        const message = response?.data?.message || t("Something went wrong. Please try again.")
        console.error(message)
        if (toast) {
          toast({
            variant: "destructive",
            title: t("Error"),
            description: message,
            duration: 3000,
          })
        }
      }
    } catch (error) {
      console.error(error)
      if (toast) {
        toast({
          variant: "destructive",
          title: t("Error"),
          description: t("An error occurred while processing your request."),
          duration: 3000,
        })
      }
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className='w-full max-w-md mx-auto p-6 bg-white shadow-md rounded-lg'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-semibold'>{t(currState)}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowLogin(false)}
            aria-label={t("Close")}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <form onSubmit={onLogin} className='space-y-4'>
          {currState === 'Sign Up' && (
            <Input
              type='text'
              name='name'
              onChange={onChangeHandler}
              value={data.name}
              placeholder={t('Your name')}
              required
            />
          )}
          <Input
            type='email'
            name='email'
            onChange={onChangeHandler}
            value={data.email}
            placeholder={t('Your email')}
            required
          />
          <Input
            type='password'
            name='password'
            onChange={onChangeHandler}
            value={data.password}
            placeholder={t('Password')}
            required
          />
          <Button
            className='w-full'
            type='submit'
          >
            {currState === 'Sign Up' ? t('createAccount') : t('Login')}
          </Button>
          <div className='flex items-center space-x-2'>
            <Checkbox id="terms" required />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t("By continuing, I agree to the terms of use & privacy policy")}
            </label>
          </div>
          {currState === 'Login' ? (
            <p className='text-sm text-gray-600'>
              {t("Create a new account")}
              <Button
                variant="link"
                onClick={() => setCurrState('Sign Up')}
                className='p-0 h-auto font-normal'
              >
                {t("Click here")}
              </Button>
            </p>
          ) : (
            <p className='text-sm text-gray-600'>
              {t("Already have an account?")}
              <Button
                variant="link"
                onClick={() => setCurrState('Login')}
                className='p-0 h-auto font-normal'
              >
                {t("Login here")}
              </Button>
            </p>
          )}
        </form>
      </div>
      <Toaster />
    </div>
  )
}
