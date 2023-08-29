import React from "react";
import { PageLayout } from "~/components/layout";

const index = () => {
  return (
    <PageLayout>
      <div className="flex h-full min-h-screen w-full items-center justify-center text-5xl">
        <span className="flex flex-col gap-6 p-4 text-center">
          <h1>Live Game</h1>
          <h2 className="text-3xl">Coming soon...</h2>
        </span>
      </div>
    </PageLayout>
  );
};

export default index;
