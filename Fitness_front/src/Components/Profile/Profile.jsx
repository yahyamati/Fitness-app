import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Pencil, Save, X, Camera, Mail, MapPin, Phone, Briefcase } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

const Profile = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    phoneNumber: '',
    occupation: ''
  });

  const token = localStorage.getItem('token');
  const decodedToken = JSON.parse(atob(token.split('.')[1]));
  const userId = decodedToken.userId;
  const name = decodedToken.name;

  const defaultProfileData = {
    name: name,
    email: 'Email',
    bio: 'Bio',
    location: 'Location',
    phoneNumber: 'Phone Number',
    occupation: 'Occupation'
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!token) {
          setError('No token found in localStorage');
          return;
        }

        
        const response = await axios.get(`http://localhost:3000/node-api/api/Profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        
        const userData = response.data;
        if (!userData) {
          setError('User not found');
          setCurrentUser(defaultProfileData);
        } else {
          setCurrentUser(userData);
          setFormData({
            name: userData.name || '',
            email: userData.email || '',
            bio: userData.bio || '',
            location: userData.location || '',
            phoneNumber: userData.phoneNumber || '',
            occupation: userData.occupation || ''
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Error fetching profile');
        setCurrentUser(defaultProfileData); 
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:3000/node-api/api/Profile/${userId}`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setCurrentUser(response.data);
      setSaveSuccess(true);
      setIsEditing(false);

      
      toast({
        title: "Success!",
        description: "You have successfully updated your profile.",
        duration: 3000,
      });

      
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
      toast({
        variant: "destructive",
        title: t("Error"),
        description: message,
        duration: 3000,
      })
    }
  };

  return (
    <div className="pt-[110px] container mx-auto p-6 relative min-h-screen">

      
      <Card className="max-w-xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-end">
            <Button variant="outline" size="icon" onClick={() => setIsEditing(true)}>
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {currentUser ? (
                  <span className="text-4xl text-gray-600">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <Camera className="w-8 h-8 text-gray-400" />
                )}
              </div>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">{currentUser?.name}</CardTitle>
          <p className="text-gray-500">{currentUser?.occupation}</p>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <Label>Bio</Label>
                <Input
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Enter your bio"
                />
              </div>
              <div>
                <Label>Location</Label>
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter your location"
                />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <Label>Occupation</Label>
                <Input
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  placeholder="Enter your occupation"
                />
              </div>
              <div className="flex space-x-4">
                <Button type="submit" variant="outline" className="bg-blue-500 text-white">
                  <Save className="mr-2" />
                  Save
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-300 text-gray-800"
                >
                  <X className="mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <span>{currentUser?.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span>{currentUser?.location}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-500" />
                <span>{currentUser?.phoneNumber}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Briefcase className="w-5 h-5 text-gray-500" />
                <span>{currentUser?.bio}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
};

export default Profile;
