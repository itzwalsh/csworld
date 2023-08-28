import React from "react";

const Footer = () => {
  return (
    <div className="text-md flex w-full items-center justify-center border-t-1 border-gray-400/30 p-2 align-middle text-text">
      Created by walsh | Inspired by{" "}
      <a
        href="https://www.csgonades.com/"
        className="pl-1 text-text/60 hover:brightness-50"
      >
        CS Nades
      </a>
    </div>
  );
};

export default Footer;
