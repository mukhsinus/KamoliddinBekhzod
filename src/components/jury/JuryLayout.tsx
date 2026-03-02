import { Outlet } from "react-router-dom";

export default function JuryLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 border-b bg-white shadow-sm">
        <h1 className="text-2xl font-semibold">
          Jury Panel
        </h1>
      </div>

      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
}