import Link from "next/link";

import { getSession, signout } from "@/lib/auth";

export default async function Home() {
  const session = await getSession();

  return (
    <div>
      SERVER COMPONENT {session.user?.email}
      <div className="mt-4 bg-gray-50">
        <Link href="/sign-in">
          <button>SIGN IN</button>
        </Link>
      </div>
      <div className="mt-4 bg-gray-50">
        <button onClick={signout}>SIGN OUT</button>
      </div>
    </div>
  );
}
