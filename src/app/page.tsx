import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function Home() {
  const session = await getServerAuthSession();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          URL <span className="text-[hsl(280,100%,70%)]">Shortner</span> Demo
        </h1>
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center text-2xl text-white">
              {session && <span>Logged in as {session.user?.name}</span>}
            </p>
            <Link
              href={session ? "/api/auth/signout" : "/api/auth/signin"}
              className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
            >
              {session ? "Sign out" : "Sign in"}
            </Link>
          </div>
        </div>
        <ShowAllUrls />
        <CreateUrl />
      </div>
    </main>
  );
}

async function ShowAllUrls() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const all_urls = await api.getall_tinyurls.query();

  if (!all_urls) return <h1>You have no urls right now</h1>;

  all_urls.map((val) => {
    return (
      <>
        <h1>
          `Your tiny url - ${val.tinyurl} is mapped to ${val.forwardedTo}`
        </h1>
      </>
    );
  });
}

async function CreateUrl() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  return <h1>Implement this !!!</h1>;
}
