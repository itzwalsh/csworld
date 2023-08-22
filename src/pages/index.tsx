import { useUser } from "@clerk/nextjs";
import { Link } from "@nextui-org/react";
import { env } from "process";
import NadeCard from "~/components/NadeCard";
import Nav from "~/components/Nav";
import { PageLayout } from "~/components/layout";
import { LoadingPage } from "~/components/loading";
import { api } from "~/utils/api";

function RecentNades() {
  const { data, isLoading: nadesLoading } = api.nades.getAll.useQuery();

  if (nadesLoading)
    return (
      <div className="flex-grow">
        <LoadingPage />
      </div>
    );

  if (!data) return <div>Something went wrong</div>;

  /* User's most viewed nades */
  return (
    <section className="flex flex-col items-center justify-center gap-8 py-2">
      <h1 className="flex w-full items-center justify-center text-3xl font-bold">
        Recently added nades
      </h1>
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-4 px-20 text-center md:flex-row md:flex-wrap">
        {data.slice(0, 3).map((recentNades) => (
          <NadeCard {...recentNades} key={recentNades.nade.id} />
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const { isSignedIn } = useUser();

  return (
    <>
      <PageLayout>
        <div className="">
          {/* Hero section: Welcome to CS World */}
          <section className="flex flex-col items-center justify-center py-32">
            <div className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
              <h1 className="w-full text-4xl font-bold md:text-6xl">
                Welcome to <a className="text-accent">CS World!</a>
              </h1>
              <p className="mt-3 text-lg md:text-2xl">
                {isSignedIn
                  ? "Get started by adding your first nade"
                  : "Sign in to get started!"}
              </p>
              {isSignedIn && (
                <div className="mt-6 flex max-w-4xl flex-wrap items-center justify-around">
                  <Link color="foreground" href="/maps" size="md">
                    <button className="group mt-6 w-48 rounded-xl border-2 bg-accent p-4 transition-all duration-200 hover:border-2 hover:border-accent hover:bg-text">
                      <h3 className="text-2xl font-bold group-hover:text-accent">
                        Create &rarr;
                      </h3>
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </section>
          <RecentNades />
        </div>
      </PageLayout>
    </>
  );
}
