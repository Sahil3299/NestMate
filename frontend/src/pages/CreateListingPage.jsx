import React from "react";
import { useNavigate } from "react-router-dom";
import CreateListingForm from "../components/CreateListingForm";

export default function CreateListingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <CreateListingForm
        onSuccess={() => {
          navigate("/listings");
        }}
      />
    </div>
  );
}
