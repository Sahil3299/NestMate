import React from "react";
import { useNavigate } from "react-router-dom";
import ProfileForm from "../components/profile/ProfileForm";

export default function ProfileSetupPage() {
  const navigate = useNavigate();
  return <ProfileForm onSaved={() => navigate("/matches")} />;
}

