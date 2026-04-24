import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import adminApi from "../../utils/adminApi";

export default function UsersAdmin() {
  const queryClient = useQueryClient();
  const usersQuery = useQuery({
    queryKey: ["admin-users-page"],
    queryFn: async () => (await adminApi.get("/admin/users")).data,
  });
  const deleteUserMutation = useMutation({
    mutationFn: async (userId) => (await adminApi.delete(`/admin/users/${userId}`)).data,
    onSuccess: () => {
      toast.success("User removed");
      queryClient.invalidateQueries({ queryKey: ["admin-users-page"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Unable to remove user");
    },
  });

  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-sm">
      <h1 className="font-display text-4xl text-slate-900">Users</h1>
      <div className="mt-6 space-y-4">
        {(usersQuery.data?.items || []).map((user) => (
          <div key={user._id} className="rounded-2xl border border-slate-100 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-900">{user.name}</p>
                <p className="text-sm text-slate-500">{user.email}</p>
              </div>
              <div className="text-right text-sm">
                <p className="capitalize text-slate-900">{user.role}</p>
                <p className="text-slate-500">{user.orderCount || 0} orders</p>
              </div>
              <button
                className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                onClick={() => deleteUserMutation.mutate(user._id)}
                disabled={deleteUserMutation.isPending}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
