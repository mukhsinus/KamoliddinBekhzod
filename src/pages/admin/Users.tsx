// pages/admin/Users.tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import api from "@/services/api";
import { useI18n } from "@/lib/i18n";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive?: boolean;
}

const SUPER_ADMIN_EMAIL = "kamolovmuhsin@icloud.com";

export default function Users() {
  const { t } = useI18n();
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
        <h1 className="text-3xl font-bold">{t('admin.users.title')}</h1>
      </div>

      {/* FILTER */}
      <div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="w-full sm:w-60 border rounded-lg px-4 py-2"
        >
          <option value="">{t('admin.users.allRoles')}</option>
          <option value="participant">{t('admin.users.participant')}</option>
          <option value="jury">{t('admin.users.jury')}</option>
          <option value="admin">{t('admin.users.admin')}</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[800px] w-full text-left text-sm">

            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3">{t('admin.users.name')}</th>
                <th className="px-4 py-3">{t('admin.users.email')}</th>
                <th className="px-4 py-3">{t('admin.users.role')}</th>
                <th className="px-4 py-3">{t('admin.users.status')}</th>
                <th className="px-4 py-3">{t('admin.users.actions')}</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => {

                const isSuperAdmin =
                  user.email.toLowerCase() === SUPER_ADMIN_EMAIL;

                return (
                  <tr key={user._id} className="border-b">

                    <td className="px-4 py-3 font-medium">
                      {user.firstName} {user.lastName}
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {user.email}
                    </td>

                    {/* ROLE */}
                    <td className="px-4 py-3">

                      {isSuperAdmin ? (
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md text-sm">
                          Суперадмин
                        </span>
                      ) : (
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
                          <option value="participant">
                            {t('admin.users.participant')}
                          </option>
                          <option value="jury">
                            {t('admin.users.jury')}
                          </option>
                          <option value="admin">
                            {t('admin.users.admin')}
                          </option>
                        </select>
                      )}

                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-3">
                      {user.isActive !== false ? (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                          {t('admin.users.active')}
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                          {t('admin.users.disabled')}
                        </span>
                      )}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-4 py-3">
                      <button
                        disabled={
                          toggleActive.isPending || isSuperAdmin
                        }
                        onClick={() =>
                          toggleActive.mutate({
                            id: user._id,
                            isActive: !(user.isActive !== false)
                          })
                        }
                        className={`px-3 py-1 text-sm border rounded-md ${
                          isSuperAdmin
                            ? "opacity-40 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {user.isActive !== false
                          ? t('admin.users.deactivate')
                          : t('admin.users.activate')}
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
}