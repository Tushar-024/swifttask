"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const { logout } = useAuth(); 

  const handleSignOut = async () => {
    logout();

    redirect("/");
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <nav className="flex gap-4">
            <Link
              href="/dashboard"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/tasks"
              className="text-gray-600 hover:text-gray-900"
            >
              Tasks
            </Link>
          </nav>
          <Button variant="outline" onClick={handleSignOut}>
            Sign out
          </Button>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
