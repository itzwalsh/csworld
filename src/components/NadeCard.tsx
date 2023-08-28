import React from "react";
import { Link, Button, Card, CardFooter } from "@nextui-org/react";
import Image from "next/image";
import { type RouterOutputs } from "~/utils/api";
import { listOfMaps } from "~/data/listOfMaps";
import Nav from "~/components/Nav";
import { getThumbnail } from "~/helpers/youtubeUrlHelpers";

type UserNades = RouterOutputs["nades"]["getAll"][number];

const NadeCard = (props: UserNades) => {
  const { nade } = props;

  const nadeImage = getThumbnail(`${nade?.videoUrl}/0.jpg`);

  return (
    <Link
      href={`/maps/${nade.map.toLowerCase()}/${nade.id}`}
      className="hover:opacity-50"
    >
      <Card
        isFooterBlurred
        className="col-span-12 h-[200px] w-[350px] min-w-[350px] max-w-[500px] sm:col-span-7 md:h-[250px] md:w-[450px]"
        key={nade?.id}
      >
        <Image
          src={nadeImage ?? "/mirage-background.png"}
          alt="Nade Image"
          fill
          className="rounded-xl object-cover"
        />
        <CardFooter className="absolute bottom-0 z-10 border-t-1 border-default-600 bg-black/40">
          <div className="flex w-full flex-grow items-center gap-2">
            <img
              alt="Map Icon"
              className="h-11 w-10 rounded-full"
              src={
                listOfMaps.find((map) => map.name === nade?.map)?.logo ??
                "/mirage-logo.png"
              }
            />
            <div className="flex flex-col items-start">
              <p className="w-[375px] overflow-hidden text-ellipsis whitespace-nowrap text-left text-tiny text-white md:text-sm">
                {`${nade.end} ${nade.type} from ${nade.start}`}
              </p>
              <p className="w-[375px] overflow-hidden text-ellipsis whitespace-nowrap text-left text-tiny text-white md:text-sm">
                {nade?.description ??
                  "A brief description of the nade that is being shown."}
              </p>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default NadeCard;
