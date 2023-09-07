import { SignInButton, useUser } from "@clerk/nextjs";
import { Link, Skeleton } from "@nextui-org/react";
import { type NextPage } from "next";
import NadeCard from "~/components/NadeCard";
import { api } from "~/utils/api";

const RecentNades = () => {
  const { data, isLoading: nadesLoading } = api.nades.getAll.useQuery();

  if (!data) return <div>Something went wrong</div>;

  /* User's most viewed nades */
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-4 md:gap-8 md:py-8">
      <h1 className="flex w-full items-center justify-center text-3xl font-bold">
        Recently added nades
      </h1>
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-4 px-20 text-center md:flex-row md:flex-wrap">
        {data.slice(0, 3).map((recentNades) => (
          <Skeleton
            isLoaded={!nadesLoading}
            className="h-[200px] w-[350px] min-w-[350px] max-w-[500px] rounded-xl md:h-[250px] md:w-[450px]"
            key={recentNades.nade.id}
          >
            <NadeCard {...recentNades} />
          </Skeleton>
        ))}
      </div>
    </section>
  );
};

const Home: NextPage = () => {
  const { isSignedIn } = useUser();

  return (
    <>
      {/* Hero section: Welcome to CS World */}
      <section className="flex flex-col items-center justify-center">
        <div className="mt-12 flex w-11/12 flex-1 flex-col items-center justify-center gap-4 bg-zinc-900 py-16 text-center md:gap-8 md:py-28">
          <h1 className="w-full text-4xl font-bold md:text-6xl">
            Welcome to <a className="text-accent">CS World</a>
          </h1>
          <p className="text-lg md:text-2xl">
            {isSignedIn
              ? "Get started by adding a nade!"
              : "Sign in to get started!"}
          </p>
          <div className="flex max-w-4xl flex-wrap items-center justify-around">
            {isSignedIn ? (
              <Link color="foreground" href="/maps">
                <button className="group w-48 rounded-xl bg-accent p-4 transition-all duration-200  hover:bg-text">
                  <h3 className="text-2xl font-bold group-hover:text-accent">
                    Create &rarr;
                  </h3>
                </button>
              </Link>
            ) : (
              <Link color="foreground" href="/maps">
                <SignInButton>
                  <button className="group w-48 rounded-xl bg-accent p-4 transition-all duration-200  hover:bg-text">
                    <h3 className="text-2xl font-bold group-hover:text-accent">
                      Sign in &rarr;
                    </h3>
                  </button>
                </SignInButton>
              </Link>
            )}
          </div>
        </div>
        {isSignedIn && <RecentNades />}
      </section>
    </>
  );
};

export default Home;
