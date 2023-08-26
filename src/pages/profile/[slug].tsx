import Head from "next/head";
import { api } from "~/utils/api";
import type { GetStaticPropsContext, NextPage } from "next";
import Image from "next/image";
import { LoadingSpinner } from "~/components/loading";
import { generateSSGHelper } from "~/server/helpers/serverSideHelper";
import { IoMdArrowRoundBack } from "react-icons/io";
import Link from "next/link";
import { PageLayout } from "~/components/layout";
import { env } from "process";
import { useEffect } from "react";
import RecentMatches from "~/components/RecentMatches";

// const apiKey = env.FACEIT_API_KEY;
const apiKey = "91243727-594b-4f9e-a208-65a9a3fcb656";
const playerId = "3e1b338d-4650-456a-a4eb-b2730f350509";
let matchStatsArray: any[] = [];

const ProfilePage: NextPage<{ username: string; matchIds: [] }> = ({
  username,
  matchIds,
}) => {
  useEffect(() => {
    getMatchStatsFromIds(matchIds);
  }, []);

  async function getMatchStatsFromIds(matchIds: string[]): Promise<void> {
    const fetchPromises = matchIds.map((matchId) => {
      const getMatchStatsUrl = `https://open.faceit.com/data/v4/matches/${matchId}/stats`;

      return fetch(getMatchStatsUrl, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json",
        },
      }).then((res) => {
        if (res.status === 200) return res.json();
        throw new Error("Failed to get match statistics");
      });
    });

    const results = await Promise.allSettled(fetchPromises);

    results.forEach((result) => {
      if (result.status === "fulfilled") {
        matchStatsArray.push(result.value);
        if (matchStatsArray.length > 10) {
          // If the array size exceeds 10, remove the oldest item
          matchStatsArray.shift();
        }
      } else {
        console.log(result.reason);
      }
    });
  }

  // end faceit api stuff

  const { data } = api.profile.getUserByUsername.useQuery({
    username: username.replace(/"/g, ""), // Remove double quotes
  });
  const profileOwner = data?.username ?? data?.externalUsername ?? "unknown";

  if (!data) return <div>Something went wrong</div>;

  return (
    <>
      <Head>
        <title>{data.username ?? data.externalUsername}</title>
      </Head>
      <PageLayout>
        <div className="relative left-0 right-0 mx-auto h-36 w-full bg-gray-900 md:w-10/12">
          <Link href="/" className="m-3 inline-block">
            <IoMdArrowRoundBack className="text-3xl" />
          </Link>
          <Image
            src={data.profilePicture}
            alt={`${
              data.username ?? data.externalUsername ?? "unknown"
            }'s profile picture`}
            width={128}
            height={128}
            priority={true}
            unoptimized={true}
            className="absolute bottom-0 left-0 right-0 mx-auto -mb-[64px] rounded-full bg-background ring-4 ring-text"
          />
        </div>
        <div className="h-[64px]"></div>
        <div className="flex justify-center p-4 text-2xl font-bold">
          {profileOwner}
        </div>
        <div className="left-0 right-0 mx-auto flex h-full w-full flex-col items-center justify-center gap-8 border-t border-gray-400 py-4 text-xl font-medium md:w-10/12">
          <p>{`${profileOwner}'s recent matches`}</p>
          <div className="flex w-full flex-1 flex-col items-center justify-center gap-4 text-center text-text md:flex-row md:flex-wrap">
            <RecentMatches
              matchStatsArray={matchStatsArray}
              playerId={playerId}
            />
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export async function getStaticProps(
  context: GetStaticPropsContext<{ slug: string }>
) {
  const obtainMatchIdsUrl = `https://open.faceit.com/data/v4/players/${playerId}/history?game=csgo&offset=0&limit=10`;

  const res = await fetch(obtainMatchIdsUrl, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
    },
  });
  const matchIds = await res.json();

  const helpers = generateSSGHelper();
  const slug = context.params!.slug;
  const username = JSON.stringify(slug.replace("@", ""));
  if (typeof slug !== "string") throw new Error("no slug");

  await helpers.profile.getUserByUsername.prefetch({ username }); // Fetch data for the queried username

  return {
    props: {
      trpcState: helpers.dehydrate(),
      username,
      matchIds: matchIds.items.map((item: any) => item.match_id),
    },
    revalidate: 1,
  };
}

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default ProfilePage;
