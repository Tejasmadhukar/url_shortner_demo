import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { CreateForm } from "./_sections/create_modal";
import { Suspense } from "react";
import { DataTable } from "./_sections/data-table";
import { columns } from "./_sections/columns";
import { ModeToggle } from "./theme-switch";
import { Spotlight } from "~/components/Spotlight";
import { IoIosLink } from "react-icons/io"; 

export default async function Home() {
  const session = await getServerAuthSession();
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-200 to-slate-150 text-black dark:from-slate-800 dark:to-slate-950 dark:text-white">
      <div className="absolute inset-0 z-0 bg-no-repeat bg-center bg-cover opacity-20" style={{ backgroundImage: "url('/grid-background.png')" }}></div>
      {!session && (
        <div className="absolute top-24 right-24">
          <ModeToggle />
        </div>
      )}
      <div className={`container flex flex-col items-center justify-center gap-2 z-10 ${!session ? 'rounded-xl py-12 border bg-white bg-opacity-5 w-full max-w-3xl' : 'w-full max-w-full px-4'}`}>
        {!session ? (
          <>
            <h1 className="p-12 text-2xl font-extrabold tracking-tight sm:text-[4rem] text-center">
              URL <span className="text-">Shortner</span> Demo
            </h1>
            <p className="pb-2 text-center text-xl dark:text-white">
              Welcome to the URL Shortner Demo. Please sign in to manage your URLs.
            </p>
            <Link
              href={session ? "/api/auth/signout" : "/api/auth/signin"}
              className="border-2 border-blue-500 rounded-full bg-black/10 px-4 py-2 font-semibold no-underline transition hover:bg-white/20 dark:bg-white/10 dark:hover:bg-black/20"
            >
              {session ? "Sign out" : "Sign in"}
            </Link>
          </>
        ) : (
          <div className="container flex justify-between items-center w-full p-4">
            <div className="flex space-x-4">
              <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">
                URL <span className="text-">Shortner</span> Demo
              </h1>
              <ModeToggle />
            </div>
            <div className="flex items-center space-x-4">
              <p className="text-center text-xl dark:text-white">
                Logged in as {session.user.email}
              </p>
              <Link
                href={session ? "/api/auth/signout" : "/api/auth/signin"}
                className="border-2 border-blue-500 rounded-full bg-black/10 px-4 py-2 font-semibold no-underline transition hover:bg-white/20 dark:bg-white/10 dark:hover:bg-black/20"
              >
                {session ? "Sign out" : "Sign in"}
              </Link>
            </div>
          </div>
        )}
        <div className="container flex flex-col items-center gap-1 w-full">
          {session && (
            <div className="flex flex-col items-center justify-center gap-4 w-full">
              <Suspense fallback={<p>Loading your urls....</p>}>
                <ShowAllUrls />
              </Suspense>
            </div>
          )}
        </div>
      </div>
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20 z-20"
        fill="white"
      />
    </main>
  );
}

async function ShowAllUrls() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const all_urls = await api.getall_tinyurls.query();

  return (
    <div className="hidden h-full w-full flex-1 flex-col space-y-8 p-8 px-4 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center">
          <IoIosLink className="w-16 h-16 text-blue-500 p-2 border-4  rounded-lg" />
          <div className="pl-2">
            <h2 className="text-2xl font-bold tracking-tight">Urls</h2>
            <p className="text-muted-foreground">
              These are all the urls that you have.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <CreateForm />
        </div>
      </div>
      <DataTable columns={columns} data={all_urls} />
    </div>
  );
}


