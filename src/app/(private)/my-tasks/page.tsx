"use client";

import { useSession } from "@/components/providers/session-provider";
import api from "@/lib/api";
import Link from "next/link";
import { useEffect } from "react";

export default function MyTasksPage() {
  const session = useSession();

  console.log({ session });

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get("api/dashboard");
      console.log(">>> res:", res.data);
    };

    fetchData();
  }, []);

  return (
    <div>
      MY TASKS PAGE - PRIVATE
      <Link href="/"> Go to Home</Link>
    </div>
  );
}
