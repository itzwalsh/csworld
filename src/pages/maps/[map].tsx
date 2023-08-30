import Head from "next/head";
import { api } from "~/utils/api";
import type { GetStaticPropsContext, NextPage } from "next";
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

function getMapData() {
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
        <div className="relative min-h-screen w-full">
          <Link href="/maps" className="absolute z-10">
            <IoMdArrowRoundBack className="m-3 text-3xl" />
          </Link>
          <div className="pointer-events-none static flex select-none flex-col items-center justify-center gap-2">
            <Image
              src={mapData.background}
              alt="Map Background"
              fill
              sizes="100vw"
              layout="fill"
              priority
              className="pointer-events-none absolute select-none object-cover opacity-20"
            />
            <Image
              src={mapData.logo}
              alt="Map Logo"
              width={72}
              height={72}
              className="mt-4"
              priority
            />
            <h1 className="select-none text-4xl">{mapData.name}</h1>
          </div>

          <div className="flex w-full flex-1 flex-col items-center justify-center gap-4 py-12 text-center md:flex-row md:flex-wrap">
            {data?.map((mapNades) => (
              <NadeCard {...mapNades} key={mapNades.nade.id} />
            )) ?? <LoadingSpinner size={36} />}
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export function getStaticProps(context: GetStaticPropsContext) {
  const mapName = context.params?.map;

  const data = getMapData();

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
}

export function getStaticPaths() {
  const data = getMapData();
  const pathsWithParams = data.map((map: MapInterface) => ({
    params: { map: map.name.toLowerCase() },
  }));

  return {
    paths: pathsWithParams,
    fallback: true,
  };
}

export default MapPage;
