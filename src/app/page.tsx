import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { CreateForm } from "./_sections/create_modal";
import { Suspense } from "react";
import { Button } from "~/components/ui/button";
import { revalidatePath } from "next/cache";

export default async function Home() {
  const session = await getServerAuthSession();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-800 to-slate-950 text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          URL <span className="text-">Shortner</span> Demo
        </h1>
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center text-2xl text-white">
              {session && <span>Logged in as {session.user.email}</span>}
            </p>
            <Link
              href={session ? "/api/auth/signout" : "/api/auth/signin"}
              className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
            >
              {session ? "Sign out" : "Sign in"}
            </Link>
          </div>
        </div>
        <Suspense fallback={<p>Loading your urls....</p>}>
          <ShowAllUrls />
        </Suspense>
        <CreateUrl />
      </div>
    </main>
  );
}

async function ShowAllUrls() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const all_urls = await api.getall_tinyurls.query();

  if (all_urls.length == 0 || !all_urls) return <h1>You have no tinyurls</h1>;

  return (
    <>
      <h1 className="text-2xl font-bold text-white">Your urls</h1>
      {all_urls.map((url) => {
        const tiny_url =
          "https://url-shortner-demo.vercel.app" + "/" + url.tinyurl;

        const DeleteUrlAction = async () => {
          "use server";
          await api.delete_tinyUrl.mutate({ urlId: url.id });
          revalidatePath("/");
        };
        return (
          <div
            key={url.id}
            className="flex flex-col items-center justify-center space-y-1"
          >
            <p>
              Your tiny url{" "}
              <Link href={tiny_url} target="_blank" className="text-blue-400">
                {tiny_url}
              </Link>{" "}
              redirects to this{" "}
              <Link
                href={url.forwardedTo}
                target="_blank"
                className="text-blue-500"
              >
                Link
              </Link>
            </p>{" "}
            {url.isNotificationRequired && <p>Notification are enabled</p>}
            {url.isAuthRequired && <p>Auth is required</p>}
            <form>
              <Button
                variant="destructive"
                formAction={DeleteUrlAction}
                className="ml-2"
              >
                Delete
              </Button>
            </form>
          </div>
        );
      })}
    </>
  );
}

async function CreateUrl() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  return (
    <>
      <h1 className="text-center text-3xl font-bold text-white">
        Create a tiny url
      </h1>
      <CreateForm />
    </>
  );
}
