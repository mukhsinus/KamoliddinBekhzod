// pages/admin/Users.tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import api from "@/services/api";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive?: boolean;
}

export default function Users() {
  const queryClient = useQueryClient();
  const [roleFilter, setRoleFilter] = useState("");

  const { data, isLoading } = useQuery<User[]>({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await api.get("/api/users/admin/all");
      return res.data;
    }
  });

  const changeRole = useMutation({
    mutationFn: async ({
      id,
      role
    }: {
      id: string;
      role: string;
    }) => {
      await api.patch(`/api/users/admin/${id}/role`, { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    }
  });

  const toggleActive = useMutation({
    mutationFn: async ({
      id,
      isActive
    }: {
      id: string;
      isActive: boolean;
    }) => {
      await api.patch(`/api/users/admin/${id}/active`, {
        isActive
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (!data) return null;

  const filteredUsers = roleFilter
    ? data.filter((u) => u.role === roleFilter)
    : data;

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">Users</h1>
      </div>

      {/* FILTER */}
      <div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="w-full sm:w-60 border rounded-lg px-4 py-2"
        >
          <option value="">All Roles</option>
          <option value="participant">Participant</option>
          <option value="jury">Jury</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[800px] w-full text-left text-sm">

          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className="border-b">

                <td className="px-4 py-3 font-medium">
                  {user.firstName} {user.lastName}
                </td>

                <td className="px-4 py-3 text-gray-600">
                  {user.email}
                </td>

                <td className="px-4 py-3">
                  <select
                    value={user.role}
                    disabled={changeRole.isPending}
                    onChange={(e) =>
                      changeRole.mutate({
                        id: user._id,
                        role: e.target.value
                      })
                    }
                    className="border rounded px-3 py-1"
                  >
                    <option value="participant">Participant</option>
                    <option value="jury">Jury</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>

                <td className="px-4 py-3">
                  {user.isActive !== false ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      Active
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                      Disabled
                    </span>
                  )}
                </td>

                <td className="px-4 py-3">
                  <button
                    disabled={toggleActive.isPending}
                    onClick={() =>
                      toggleActive.mutate({
                        id: user._id,
                        isActive: !(user.isActive !== false)
                      })
                    }
                    className="px-3 py-1 text-sm border rounded-md"
                  >
                    {user.isActive !== false
                      ? "Deactivate"
                      : "Activate"}
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
        </div>
      </div>

    </div>
  );
}