"use client";

import { useAuth } from "@/lib/auth/context";
import { useEffect } from "react";

export default function Home() {
  const { user, loading, requireAuth } = useAuth();

  useEffect(() => {
    requireAuth();
  }, [requireAuth]);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Bienvenue, {user?.firstname || user?.email}!</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Informations du profil</h2>
          <div className="space-y-3">
            {user?.id && (
              <p>
                <strong>ID:</strong> {user.id}
              </p>
            )}
            {user?.email && (
              <p>
                <strong>Email:</strong> {user.email}
              </p>
            )}
            {user?.firstname && (
              <p>
                <strong>Prénom:</strong> {user.firstname}
              </p>
            )}
            {user?.lastname && (
              <p>
                <strong>Nom:</strong> {user.lastname}
              </p>
            )}
            {user?.roles && user.roles.length > 0 && (
              <p>
                <strong>Rôles:</strong> {user.roles.join(", ")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
