import Head from "next/head";
import { api } from "~/utils/api";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { PageLayout } from "~/components/layout";
import { IoMdArrowRoundBack } from "react-icons/io";
import Link from "next/link";
import { listOfMaps } from "~/data/listOfMaps";
import { useRouter } from "next/router";
import Image from "next/image";
import NadeCard from "~/components/NadeCard";
import { LoadingSpinner } from "~/components/loading";

interface MapInterface {
  name: string;
  path: string;
  background: string;
  logo: string;
}

async function getMapData() {
  const data = listOfMaps.map((map) => {
    return {
      name: map.name,
      path: map.path,
      background: map.background,
      logo: map.logo,
    };
  });
  return data;
}

const MapPage: NextPage<{ mapData: MapInterface; hasError: boolean }> = ({
  mapData,
  hasError,
}) => {
  const { data } = api.nades.getNadesByMap.useQuery({
    map: mapData.name,
  });
  const router = useRouter();

  if (hasError) {
    return <h1>Error - please try another parameter</h1>;
  }

  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }
  return (
    <>
      <Head>
        <link rel="icon" href={`${mapData.logo}`} />
        <title>{`CS World - ${mapData.name}`}</title>
      </Head>
      <PageLayout>
        {/* <MapNadesView /> */}
        <div className="relative h-36 w-full">
          <Link href="/maps" className="absolute z-10">
            <IoMdArrowRoundBack className="m-3 text-3xl" />
          </Link>
          <Image
            src={mapData.background}
            alt="Map Background"
            fill
            priority
            className="absolute object-cover opacity-20"
          />
          <h1 className="flex h-full items-center justify-center text-4xl">
            {mapData.name}
          </h1>
        </div>
        <div className="mt-14 flex w-full flex-1 flex-col items-center justify-center gap-4 p-8 text-center md:flex-row md:flex-wrap">
          {data?.map((mapNades) => (
            <NadeCard {...mapNades} key={mapNades.nade.id} />
          )) ?? <LoadingSpinner size={36} />}
        </div>
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const mapName = context.params?.map;

  const data = await getMapData();

  const foundMap = data?.find(
    (item: MapInterface) => mapName === item.name.toLowerCase()
  );

  if (!foundMap) {
    return {
      props: { hasError: true },
    };
  }

  return {
    props: {
      mapData: foundMap,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const data = await getMapData();
  const pathsWithParams = data.map((map: MapInterface) => ({
    params: { map: map.name.toLowerCase() },
  }));

  return {
    paths: pathsWithParams,
    fallback: true,
  };
};

export default MapPage;
