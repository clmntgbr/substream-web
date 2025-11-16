"use client";

import Upload from "@/components/features/Upload/video-upload";
import { useAuth } from "@/lib/auth/context";
import { useStream } from "@/lib/stream/context";
import { useUser } from "@/lib/user/context";

export default function StudioPage() {
  const { user, logout } = useAuth();
  const { user: userData } = useUser();
  const { streams } = useStream();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      <Upload />
    </>
  );
}
