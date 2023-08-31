import React, { type PropsWithChildren } from "react";
import Nav from "./Nav";
import Footer from "./Footer";

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <>
      <Nav />
      <main className="flex h-full min-h-screen justify-center">
        <div className="flex h-full w-full flex-col">{props.children}</div>
      </main>
      <Footer />
    </>
  );
};

export default PageLayout;
