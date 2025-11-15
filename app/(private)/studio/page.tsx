"use client";

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
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Page Protégée</h1>
          <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
            Déconnexion
          </button>
        </div>

        <div className="grid gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Données du contexte Auth</h2>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
              <p>
                <strong>Prénom:</strong> {user?.firstname}
              </p>
              <p>
                <strong>Nom:</strong> {user?.lastname}
              </p>
              {user?.id && (
                <p>
                  <strong>ID:</strong> {user.id}
                </p>
              )}
            </div>
          </div>

          {userData && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Données du contexte User (fetchMe)</h2>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Email:</strong> {userData.email}
                </p>
                <p>
                  <strong>Prénom:</strong> {userData.firstname}
                </p>
                <p>
                  <strong>Nom:</strong> {userData.lastname}
                </p>
                {userData.id && (
                  <p>
                    <strong>ID:</strong> {userData.id}
                  </p>
                )}
                {userData.roles && userData.roles.length > 0 && (
                  <p>
                    <strong>Rôles:</strong> {userData.roles.join(", ")}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Données du contexte Stream</h2>
            <div className="space-y-2 text-sm">
              {streams.member.map((stream) => (
                <div key={stream.id}>
                  <h3 className="text-lg font-semibold">{stream.name}</h3>
                  <p className="text-sm text-gray-500">{stream.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
