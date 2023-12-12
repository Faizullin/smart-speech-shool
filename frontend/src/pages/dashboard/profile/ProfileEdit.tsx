import DashboardLayout from "../../../components/layouts/DashboardLayout";
import EditProfileForm from "../../../components/form/profile/EditProfileForm";
import EditPasswordForm from "../../../components/form/profile/EditPasswordForm";
import EditStudentForm from "../../../components/form/profile/EditStudentForm";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function ProfileEdit() {
  const location = useLocation();

  useEffect(() => {
    const { hash } = location;

    if (hash) {
      const targetElement = document.getElementById(hash.substring(1));
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
        });
      }
    }
  }, [location]);
  return (
    <DashboardLayout>
      <EditProfileForm />
      <EditPasswordForm />
      <EditStudentForm />
    </DashboardLayout>
  );
}
