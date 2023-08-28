import Head from "next/head";
import { api } from "~/utils/api";
import type { GetStaticPropsContext, NextPage } from "next";
import { PageLayout } from "~/components/layout";
import { generateSSGHelper } from "~/server/helpers/serverSideHelper";
import { IoMdArrowRoundBack } from "react-icons/io";
import Link from "next/link";
import Iframe from "react-iframe";
import { getEmbedLink } from "~/helpers/youtubeUrlHelpers";
import Image from "next/image";

const SingleNadePage: NextPage<{ id: string }> = ({ id }) => {
  const { data } = api.nades.getById.useQuery({
    id,
  });

  if (!data) return <div>404 Not Found</div>;

  const nadeUrl = getEmbedLink(data.nade.videoUrl);

  function getNadeImage(nadeType: string) {
    switch (nadeType) {
      case "Smoke":
        return "/smoke-logo.webp";
      case "Flash":
        return "/flash-logo.webp";
      case "Molotov":
        return "/molly-logo.webp";
      case "Nade":
        return "/grenade-logo.webp";
      default:
        return "/smoke-logo.webp";
    }
  }
  function getNadeSide(nadeSide: string) {
    switch (nadeSide) {
      case "Terrorist":
        return "/t-logo.webp";
      case "Counter-Terrorist":
        return "/ct-logo.webp";
      case "Both":
        return "/t-ct-logo.webp";
      default:
        return "/t-ct-logo.webp";
    }
  }
  function getNadeTechnique(nadeTech: string) {
    switch (nadeTech) {
      case "Left-Click":
        return "/leftclick.svg";
      case "Right-Click":
        return "/rightclick.svg";
      case "Middle-Click":
        return "/middleclick.svg";
      default:
        return "/leftclick.svg";
    }
  }
  return (
    <>
      <Head>
        <title>{`${data.nade.end} from ${data.nade.start}`}</title>
      </Head>
      <PageLayout>
        <div className="relative left-0 right-0 mx-auto w-full">
          <Link href={`/maps/${data.nade.map.toLowerCase()}`}>
            <IoMdArrowRoundBack className="m-3 inline-block text-3xl" />
          </Link>

          <div className="flex min-h-screen flex-col md:text-xl">
            <div className="mx-auto flex w-[500px] justify-around border-x-2 border-t-2 bg-zinc-950 py-2 md:w-[750px] md:rounded-t-lg lg:w-[1000px] xl:w-[1250px]">
              <div className="flex flex-col text-center">
                <h1 className="font-medium">Game</h1>
                <p>{data.nade.game}</p>
              </div>
              <div className="flex flex-col text-center">
                <h1 className="font-medium">Map</h1>
                <p>{data.nade.map}</p>
              </div>
              <div className="flex flex-col text-center font-medium">
                Type
                <Image
                  src={getNadeImage(data.nade.type)}
                  alt="Nade Type"
                  priority
                  className="mx-auto inline-block h-6 w-8"
                  width={48}
                  height={48}
                />
              </div>
              <div className="flex flex-col text-center font-medium">
                Side
                <Image
                  src={getNadeSide(data.nade.type)}
                  alt="Nade Side"
                  priority
                  className="mx-auto inline-block h-6 w-6"
                  width={48}
                  height={48}
                />
              </div>
              <div className="flex flex-col text-center font-medium">
                <h1>Technique</h1>
                <Image
                  src={getNadeTechnique(data.nade.technique)}
                  alt="Nade Side"
                  priority
                  className="mx-auto inline-block h-6 w-6"
                  width={48}
                  height={48}
                />
              </div>
            </div>
            <Iframe
              url={nadeUrl}
              id="nadeVideo"
              className="mx-auto aspect-video w-[500px] border-x-2 md:w-[750px] lg:w-[1000px] xl:w-[1250px]"
              display="block"
              position="relative"
            />
            <div className="mx-auto flex w-[500px] justify-evenly border-x-2 border-b-2 bg-zinc-950 py-2 md:w-[750px] md:rounded-b-md lg:w-[1000px] xl:w-[1250px]">
              <div className="mx-auto flex w-11/12 flex-col">
                <h1 className="font-medium">Description</h1>
                <div className="border border-gray-300/20"></div>
                <p className="">{data.nade.description}</p>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export async function getStaticProps(
  context: GetStaticPropsContext<{ id: string }>
) {
  const helpers = generateSSGHelper();

  //this needs a non-null assertion (!) on params to tell TS that its not null/undefined
  const id = context.params!.id;

  if (typeof id !== "string") throw new Error("no id");

  // Fetch data for the queried username
  await helpers.nades.getById.prefetch({ id });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      id,
    },
    revalidate: 1,
  };
}

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default SingleNadePage;
