import React from "react";
import CreateNadeModal from "~/components/CreateNadeModal";
import { PageLayout } from "~/components/layout";
import { listOfMaps } from "~/data/listOfMaps";

const Maps = () => {
  return (
    <PageLayout>
      <div className="h-fit px-8 py-4 md:mx-16 xl:h-screen">
        <div className="flex justify-end">
          <CreateNadeModal />
        </div>
        <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {listOfMaps.map((mapitem) => {
            const { id } = mapitem;
            return (
              <a
                href={`/maps` + mapitem.path}
                key={id}
                className="group my-2 flex flex-col justify-between rounded-lg transition-all duration-200 hover:-translate-y-2 hover:opacity-50"
              >
                <img
                  src={mapitem.background}
                  alt="Map Background"
                  className="h-auto justify-normal rounded-t-lg"
                />
                <div
                  className="text-md flex w-full items-center rounded-b-lg bg-zinc-900 font-semibold text-text"
                  id="mapitem"
                >
                  <img
                    src={mapitem.logo}
                    alt={mapitem.name}
                    className="mr-2 h-12 w-12 p-2"
                  />
                  <span>{mapitem.name}</span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </PageLayout>
  );
};

export default Maps;
