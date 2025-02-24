import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardContent } from "../../components/ui/card";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../components/ui/avatar";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Pencil, Save } from "lucide-react";
import axios from "axios";
import { getUserData } from "../util/commonFunction";

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [editedData, setEditedData] = useState({});
  const loggedInUserId = getUserData();

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData(profileData);
  };

  const handleGetUserData = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/users/get_userdata/${loggedInUserId.user}`,
        { withCredentials: true }
      );
      if (res.status === 200) {
        setProfileData(res.data.user);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    handleGetUserData();
  }, []);

  const handleSave = async () => {
    const updatedFields = Object.keys(editedData).reduce((acc, key) => {
      if (editedData[key] !== profileData[key]) {
        acc[key] = editedData[key];
      }
      return acc;
    }, {});

    if (Object.keys(updatedFields).length === 0) {
      setIsEditing(false);
      return;
    }

    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/users/update_user`,
        { id: loggedInUserId.user, ...updatedFields },
        { withCredentials: true }
      );
      if (res.status === 200) {
        setProfileData(res.data.user);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const compressImage = (file, maxSize = 500) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          const scaleFactor = maxSize / Math.max(img.width, img.height);
          canvas.width = img.width * scaleFactor;
          canvas.height = img.height * scaleFactor;

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.5)); // Adjust quality if needed
        };
      };
    });
  };

  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    if (name === "profilePicture" && files.length > 0) {
      const file = files[0];
      const base64url = await compressImage(file);
      setEditedData((prev) => ({
        ...prev,
        profilePicture: base64url,
      }));
    } else {
      setEditedData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={isEditing ? editedData.profilePicture : profileData.profilePicture}
                alt={profileData.userName || "User"}
              />
              <AvatarFallback>
                {(profileData.firstName?.[0] || "") +
                  (profileData.lastName?.[0] || "")}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <input
                type="file"
                accept="image/*"
                name="profilePicture"
                onChange={handleChange}
              />
            )}
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
            {["userName", "firstName", "middleName", "lastName"].map((field) => (
              <div className="space-y-2" key={field}>
                <Label htmlFor={field}>{field.replace(/([A-Z])/g, " $1")}</Label>
                <Input
                  id={field}
                  name={field}
                  value={isEditing ? editedData[field] || "" : profileData[field] || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            ))}
          </div>

          <div className="pt-4">
            <p className="text-sm text-gray-500">Profile ID: {profileData._id}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Profile;
