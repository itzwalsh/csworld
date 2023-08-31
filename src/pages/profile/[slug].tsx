import Head from "next/head";
import { api } from "~/utils/api";
import type { GetStaticPropsContext, NextPage } from "next";
import Image from "next/image";
import { generateSSGHelper } from "~/server/helpers/serverSideHelper";
import { BiUpload, BiLogoSteam } from "react-icons/bi";
import { SiFaceit } from "react-icons/si";
import RecentMatches from "~/components/RecentMatches";
import { env } from "process";
import { toast } from "react-hot-toast";

const apiKey = env.NEXT_PUBLIC_FACEIT_API_KEY;
const playerId = "3e1b338d-4650-456a-a4eb-b2730f350509";

interface MatchIdsInterface {
  match_id: string;
}

interface MatchStatsInterface {
  rounds: Array<{
    round_stats: {
      Map: string;
    };
    teams: Array<{
      players: Array<{
        player_id: string;
        player_stats: {
          Kills: string;
          Assists: string;
          Deaths: string;
          "K/D Ratio": string;
          "Headshots %": string;
        };
      }>;
      team_stats: {
        "Final Score": string;
        "Team Win": string;
        Team: string;
      };
    }>;
  }>;
}

async function getMatchIds(): Promise<string[]> {
  const getMatchIdsUrl = `https://open.faceit.com/data/v4/players/${playerId}/history?game=csgo&offset=0&limit=10`;

  const res = await fetch(getMatchIdsUrl, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
    },
  });

  if (res.status === 200) {
    const data = (await res.json()) as { items: MatchIdsInterface[] };
    const matchIds: string[] = data.items.map(
      (item: MatchIdsInterface) => item.match_id
    );
    return matchIds;
  } else {
    throw new Error("Failed to get match ids");
  }
}

async function getMatchStatsFromIds(
  matchIds: string[]
): Promise<(MatchStatsInterface | null)[]> {
  const fetchPromises = matchIds.map(async (matchId) => {
    const getMatchStatsUrl = `https://open.faceit.com/data/v4/matches/${matchId}/stats`;

    try {
      const res = await fetch(getMatchStatsUrl, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json",
        },
      });

      if (res.status === 200) {
        const matchStats = (await res.json()) as MatchStatsInterface; // Type assertion here
        return matchStats;
      } else {
        console.log("Failed to get match statistics for match ID:", matchId);
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  });

  const matchStatsResults = await Promise.all(fetchPromises);
  return matchStatsResults.filter((stats) => stats !== null);
}

const ProfilePage: NextPage<{ username: string; matchStatsArray: [] }> = ({
  username,
  matchStatsArray,
}) => {
  const { data } = api.profile.getUserByUsername.useQuery({
    username: username.replace(/"/g, ""), // Remove double quotes
  });
  const profileOwner = data?.username ?? data?.externalUsername ?? "unknown";

  if (!data) return <div>Something went wrong</div>;

  function handleUploadCoverImage() {
    toast.success("I'll implement this later!");
  }
  return (
    <>
      <Head>
        <title>{data.username ?? data.externalUsername}</title>
      </Head>
      <div className="relative left-0 right-0 mx-auto mt-12 h-64 w-11/12 bg-zinc-900">
        <div className="flex justify-between">
          <div className="m-3 flex gap-2">
            <a
              className="rounded-md bg-zinc-950 p-2"
              href="https://www.faceit.com/en/players/ItZWalsh"
              target="_blank"
            >
              <SiFaceit className="text-2xl text-accent" />
            </a>
            <a
              className="rounded-md bg-zinc-950 p-2"
              href="https://steamcommunity.com/id/walshyboi/"
              target="_blank"
            >
              <BiLogoSteam className="text-2xl" />
            </a>
          </div>
          <button
            className="m-3 flex items-center justify-center gap-2 rounded-md bg-zinc-950 p-2 text-center"
            onClick={handleUploadCoverImage}
          >
            <BiUpload className="text-xl" />
            <p className="text-tiny">Upload Cover Image</p>
          </button>
        </div>
        <Image
          src={data.profilePicture}
          alt={`${
            data.username ?? data.externalUsername ?? "unknown"
          }'s profile picture`}
          width={128}
          height={128}
          priority
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
    </>
  );
};

export async function getStaticProps(
  context: GetStaticPropsContext<{ slug: string }>
) {
  const matchIds = await getMatchIds();
  const matchStatsArray = await getMatchStatsFromIds(matchIds);

  const helpers = generateSSGHelper();
  const slug = context.params!.slug;
  const username = JSON.stringify(slug.replace("@", ""));
  if (typeof slug !== "string") throw new Error("no slug");

  await helpers.profile.getUserByUsername.prefetch({ username }); // Fetch data for the queried username

  return {
    props: {
      trpcState: helpers.dehydrate(),
      username,
      matchStatsArray,
    },
    revalidate: 30,
  };
}

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default ProfilePage;
