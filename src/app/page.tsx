import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { CreateForm } from "./_sections/create_modal";
import { Suspense } from "react";
import { DataTable } from "./_sections/data-table";
import { columns } from "./_sections/columns";

export default async function Home() {
  const session = await getServerAuthSession();
  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-slate-800 to-slate-950 text-white">
      <div className="container flex flex-col items-center justify-center gap-2 ">
        <h1 className="mt-10 text-5xl font-extrabold tracking-tight sm:text-[4rem]">
          URL <span className="text-">Shortner</span> Demo
        </h1>
        <div className="flex flex-col items-center gap-1">
          <div className="flex flex-col items-center justify-center gap-4">
            <p className="mt-2 text-center text-2xl text-white">
              {session && <span>Logged in as {session.user.email}</span>}
            </p>
            <Link
              href={session ? "/api/auth/signout" : "/api/auth/signin"}
              className="mt-2 rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
            >
              {session ? "Sign out" : "Sign in"}
            </Link>
          </div>
        </div>
        <Suspense fallback={<p>Loading your urls....</p>}>
          <ShowAllUrls />
        </Suspense>
      </div>
    </main>
  );
}

async function ShowAllUrls() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const all_urls = await api.getall_tinyurls.query();

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Urls</h2>
          <p className="text-muted-foreground">
            These are all the urls that you have.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <CreateForm />
        </div>
      </div>
      <DataTable columns={columns} data={all_urls} />
    </div>
  );
}
