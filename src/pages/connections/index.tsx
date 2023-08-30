import React from "react";
import { PageLayout } from "~/components/layout";
import { BiLogoSteam } from "react-icons/bi";
import { SiFaceit } from "react-icons/si";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import { toast } from "react-hot-toast";

const handleSteamConnection = () => {
  toast.success("Steam connection successful!");
};

const handleFaceitConnection = () => {
  toast.success("Faceit connection successful!");
};

const Connections = () => {
  return (
    <PageLayout>
      <div className="h-full min-h-screen">
        {/* Hero section: Welcome to CS World */}
        <section className="flex flex-col items-center justify-center">
          <div className="mt-12 flex w-11/12 flex-1 flex-col items-center justify-center gap-4 bg-zinc-900 py-8 text-center md:py-16">
            <h1 className="w-full text-4xl font-bold md:text-6xl">
              External Connections
            </h1>
            <p className="text-lg md:text-2xl">
              Please link your Steam + Faceit accounts to start tracking!
            </p>
            <p>(this is a work in progress)</p>
            <div className="flex h-96 w-72 items-center justify-center rounded-md bg-zinc-950 text-center">
              <div className="flex w-full flex-col items-center px-4">
                <Tabs aria-label="Connection Options">
                  <Tab
                    key="steam"
                    title={
                      <div className="flex items-center space-x-2">
                        <BiLogoSteam className="text-xl" />
                        <span>Steam</span>
                      </div>
                    }
                  >
                    <Card
                      classNames={{
                        base: "shadow-none",
                      }}
                    >
                      <CardBody className="flex h-72 items-center justify-start">
                        <button
                          className="flex cursor-pointer items-center justify-center space-x-2 rounded-lg bg-zinc-950 px-3 py-4 font-semibold uppercase text-white"
                          onClick={handleSteamConnection}
                        >
                          <span className="flex w-full text-sm font-semibold uppercase">
                            <p>Connect with Steam</p>
                          </span>
                          <BiLogoSteam className="inline-block text-2xl md:ml-2" />
                        </button>
                      </CardBody>
                    </Card>
                  </Tab>
                  <Tab
                    key="faceit"
                    title={
                      <div className="flex items-center space-x-2">
                        <SiFaceit className="text-xl text-accent" />
                        <span>Faceit</span>
                      </div>
                    }
                  >
                    <Card
                      classNames={{
                        base: "shadow-none",
                      }}
                    >
                      <CardBody className="flex h-72 items-center justify-start">
                        <button
                          className="flex cursor-pointer items-center justify-center space-x-2 rounded-lg bg-accent px-3 py-4 font-semibold uppercase text-white"
                          onClick={handleFaceitConnection}
                        >
                          <span className="flex text-sm font-semibold uppercase">
                            <p>Connect with Faceit</p>
                          </span>
                          <SiFaceit className="inline-block text-2xl md:ml-2" />
                        </button>
                      </CardBody>
                    </Card>
                  </Tab>
                </Tabs>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default Connections;
