import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import adminApi from "../../utils/adminApi";
import { Button } from "../../components/ui/Button";

export default function CouponsAdmin() {
  const couponsQuery = useQuery({
    queryKey: ["admin-coupons"],
    queryFn: async () => (await adminApi.get("/admin/coupons")).data,
  });

  const form = useForm({
    defaultValues: {
      code: "",
      type: "percentage",
      value: 10,
      minOrderAmount: 0,
      expiryDate: "",
      usageLimit: 100,
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await adminApi.post("/admin/coupons", values);
      toast.success("Coupon created");
      form.reset();
      couponsQuery.refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to create coupon");
    }
  });

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <div className="rounded-[2rem] bg-white p-6 shadow-sm">
        <h1 className="font-display text-4xl text-slate-900">Coupons</h1>
        <form onSubmit={onSubmit} className="mt-8 grid gap-4">
          <input {...form.register("code")} placeholder="Code" className="rounded-2xl border border-slate-200 px-4 py-3" />
          <select {...form.register("type")} className="rounded-2xl border border-slate-200 px-4 py-3">
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed</option>
          </select>
          <input {...form.register("value")} placeholder="Value" className="rounded-2xl border border-slate-200 px-4 py-3" />
          <input
            {...form.register("minOrderAmount")}
            placeholder="Minimum order amount"
            className="rounded-2xl border border-slate-200 px-4 py-3"
          />
          <input {...form.register("expiryDate")} type="date" className="rounded-2xl border border-slate-200 px-4 py-3" />
          <Button type="submit" className="w-fit">
            Save coupon
          </Button>
        </form>
      </div>
      <div className="rounded-[2rem] bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Active Coupons</h2>
        <div className="mt-6 space-y-3">
          {(couponsQuery.data?.items || []).map((coupon) => (
            <div key={coupon._id} className="rounded-2xl border border-slate-100 px-4 py-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">{coupon.code}</span>
                <span className="capitalize text-slate-500">{coupon.type}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
