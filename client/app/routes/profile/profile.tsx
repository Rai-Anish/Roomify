import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "~/store/authStore";
import { useProfile } from "~/hooks/useUser";
import ProfileStats from "~/components/profile/ProfileStats";
import EditProfileForm from "~/components/profile/EditProfileForm";
import ChangePasswordForm from "~/components/profile/ChangePasswordForm";
import DangerZone from "~/components/profile/DangerZone";
import ProfileSkeleton from "./profile-skeleton";

export default function Profile() {
  const navigate = useNavigate();
  const { user, _hasHydrated } = useAuthStore();
  const { data, isLoading } = useProfile();

  useEffect(() => {
    if (_hasHydrated && !user) navigate("/login");
  }, [user, _hasHydrated, navigate]);

  if (!_hasHydrated || isLoading) {
    return <ProfileSkeleton />
  }

  const currentUser = user ?? data?.user;

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        <div>
            <h1 className="text-3xl font-serif font-bold text-zinc-900">Profile</h1>
            <p className="text-zinc-500 text-sm mt-1">Manage your account settings</p>
        </div>
        
        <ProfileStats stats={data?.stats} />

        <EditProfileForm currentUser={currentUser} />

        {currentUser?.provider === "LOCAL" && (
          <ChangePasswordForm />
        )}

        <DangerZone />
      </div>
    </div>
  );
}