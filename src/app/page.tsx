import Link from "next/link";

import { getSession, signout } from "@/lib/auth";

export default async function Home() {
  const session = await getSession();

  return (
    <div>
      SERVER COMPONENT
      {!session.user && (
        <div className="mt-4 bg-gray-50">
          <Link href="/sign-in" className="text-blue-500 hover:underline">
            <button>SIGN IN</button>
          </Link>
        </div>
      )}
      {session.user && (
        <>
          <div className="mt-4 bg-gray-50">
            <Link href="/sign-in" className="text-blue-500 hover:underline">
              <button>GO TO PRIVATE</button>
            </Link>
          </div>
          <div className="mt-4 bg-gray-50">
            <button onClick={signout}>SIGN OUT</button>
          </div>
        </>
      )}
      <div className="mt-4">YOU ARE: {JSON.stringify(session, null, 2)}</div>
    </div>
  );
}
