import Head from "next/head";
import { api } from "~/utils/api";
import type { GetStaticPropsContext, NextPage } from "next";
import { IoMdArrowRoundBack } from "react-icons/io";
import Link from "next/link";
import { listOfMaps } from "~/data/listOfMaps";
import { useRouter } from "next/router";
import Image from "next/image";
import NadeCard from "~/components/NadeCard";
import { useState } from "react";
import { Checkbox, CheckboxGroup, Skeleton } from "@nextui-org/react";

interface MapDataInterface {
  name: string;
  path: string;
  background: string;
  logo: string;
}

const MapPage: NextPage<{ mapData: MapDataInterface; hasError: boolean }> = ({
  mapData,
  hasError,
}) => {
  const { data, isFetched: nadesFetched } = api.nades.getNadesByMap.useQuery({
    map: mapData.name,
  });
  const router = useRouter();
  const [selected, setSelected] = useState(["cs2"]);
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
      <div className="relative min-h-screen w-full">
        <Link href="/maps" className="absolute z-10">
          <IoMdArrowRoundBack className="m-3 text-3xl" />
        </Link>
        <div className="pointer-events-none static flex select-none flex-col items-center justify-center gap-2">
          <Image
            src={mapData.background}
            alt="Map Background"
            fill={true}
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
        {/* Filters */}
        <div className="mt-6 flex flex-col items-center gap-4">
          <CheckboxGroup
            color="primary"
            value={selected}
            orientation="horizontal"
            onValueChange={setSelected}
          >
            <Checkbox value="cs2">CS2</Checkbox>
            <Checkbox value="csgo">CS:GO</Checkbox>
            <Checkbox value="terrorist">T-Sided</Checkbox>
            <Checkbox value="counter-terrorist">CT-Sided</Checkbox>
          </CheckboxGroup>
        </div>

        <div className="flex w-full flex-1 flex-col items-center justify-center gap-4 py-12 text-center md:flex-row md:flex-wrap">
          {data?.map((mapNades) => (
            <Skeleton
              isLoaded={nadesFetched}
              key={mapNades.nade.id}
              className="h-[200px] w-[350px] min-w-[350px] max-w-[500px] rounded-xl md:h-[250px] md:w-[450px]"
            >
              <NadeCard {...mapNades} />
            </Skeleton>
          ))}
        </div>
      </div>
    </>
  );
};

export function getStaticProps(context: GetStaticPropsContext) {
  const mapPath = context.params!.map;

  const data = listOfMaps.map((map) => {
    return {
      name: map.name,
      path: map.path,
      background: map.background,
      logo: map.logo,
    };
  });

  const foundMap = data?.find(
    (item: MapDataInterface) => mapPath === item.path.replace("/", "")
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
    revalidate: 30,
  };
}

export function getStaticPaths() {
  const data = listOfMaps.map((map) => {
    return {
      name: map.name,
      path: map.path,
      background: map.background,
      logo: map.logo,
    };
  });

  const paths = data.map((map: MapDataInterface) => ({
    params: { map: map.path.replace("/", "") },
  }));

  return {
    paths: paths,
    fallback: false,
  };
}

export default MapPage;
