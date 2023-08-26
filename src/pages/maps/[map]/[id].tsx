import Head from "next/head";
import { api } from "~/utils/api";
import type { GetStaticPropsContext, NextPage } from "next";
import { PageLayout } from "~/components/layout";
import { generateSSGHelper } from "~/server/helpers/serverSideHelper";
import { IoMdArrowRoundBack } from "react-icons/io";
import Link from "next/link";
import NadeCard from "~/components/NadeCard";

const SingleNadePage: NextPage<{ id: string }> = ({ id }) => {
  const { data } = api.nades.getById.useQuery({
    id,
  });

  if (!data) return <div>404 Not Found</div>;

  return (
    <>
      <Head>
        <title>{`${data.nade.start} - ${data.author.username}`}</title>
      </Head>
      <PageLayout>
        <Link href={`/maps/${data.nade.map.toLowerCase()}`}>
          <IoMdArrowRoundBack className="m-3 text-3xl" />
        </Link>
        <NadeCard {...data} />
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
