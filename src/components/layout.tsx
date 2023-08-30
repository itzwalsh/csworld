import React, { type PropsWithChildren } from "react";
import Nav from "./Nav";
import Footer from "./Footer";

export const PageLayout = (props: PropsWithChildren<object>) => {
  return (
    <>
      <Nav />
      <main className="flex h-full justify-center">
        <div className="flex h-full min-h-screen w-full flex-col">
          {props.children}
        </div>
      </main>
      <Footer />
    </>
  );
};
