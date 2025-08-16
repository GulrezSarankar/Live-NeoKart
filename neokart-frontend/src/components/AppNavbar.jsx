import React, { useState } from "react";
import Navbar from "./Navbar";
import ProfileModal from "./ProfileModal";
import { useAuth } from "../contexts/AuthContext";

const AppNavbar = () => {
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Navbar onEditProfile={() => setModalOpen(true)} />
      {user && (
        <ProfileModal
          user={user}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
};

export default AppNavbar;
