import React, { useEffect, useState } from 'react';
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardContent } from "../../components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/avatar";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Pencil, Save } from "lucide-react";
import axios from 'axios';
import {getUserData} from '../util/commanFunction'

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState("");

  const [editedData, setEditedData] = useState(profileData);

  const loggedInUserId = getUserData()

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData(profileData);
  };
  const handleGetUserData = async()=>{
    try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/get_userdata/${loggedInUserId.user}`,
            {withCredentials:true}
        )
        if(res.status === 200){
            setProfileData(res.data.user)
            // console.log("resUSer : ",res.data.user);
        }
        
    } catch (error) {
        
    }
  }

  useEffect(()=>{
    handleGetUserData()
  },[])

  const handleSave = async() => {
    try {
        const res = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/users/update_user`,
            {
                id: loggedInUserId.user,
                ...editedData
            },
            {withCredentials:true}
        )
        if(res.status === 200){
            setProfileData(res.data.user)
            // console.log("resUSer : ",editedData);
            setIsEditing(false);
            // handleGetUserData() 
        }
        
    } catch (error) {
        console.error("Error in save:", error);
    }

  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profileData.profilePicture} alt={profileData.userName} />
              <AvatarFallback>{profileData.firstName}{profileData.lastName}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">Profile</h1>
              <p className="text-gray-500">Manage your profile information</p>
            </div>
          </div>
          <Button 
            onClick={isEditing ? handleSave : handleEdit}
            className="ml-auto"
          >
            {isEditing ? (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save
              </>
            ) : (
              <>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </>
            )}
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="userName">Username</Label>
              <Input
                id="userName"
                name="userName"
                value={isEditing ? editedData.userName : profileData.userName}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={isEditing ? editedData.firstName : profileData.firstName}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="middleName">Middle Name</Label>
              <Input
                id="middleName"
                name="middleName"
                value={isEditing ? editedData.middleName : profileData.middleName}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={isEditing ? editedData.lastName : profileData.lastName}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="pt-4">
            <p className="text-sm text-gray-500">
              Profile ID: {profileData._id}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Profile;