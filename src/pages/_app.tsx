import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import type { AppProps } from "next/app";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import Head from "next/head";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { Toaster } from "react-hot-toast";
import PageLayout from "~/components/layout";

// 2. Call `extendTheme` and pass your custom values
const theme = extendTheme({
  colors: {
    modal: {
      bg: "#0B0E0F",
    },
  },
});

const MyApp: AppType = ({ Component, pageProps }: AppProps) => {
  return (
    <ClerkProvider {...pageProps}>
      <Head>
        <title>CS World</title>
        <meta name="description" content="😎" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NextUIProvider>
        <NextThemesProvider attribute="class" defaultTheme="dark">
          <ChakraProvider disableGlobalStyle theme={theme}>
            <PageLayout>
              <Component {...pageProps} />
            </PageLayout>
            <Toaster position="bottom-center" reverseOrder={false} />
          </ChakraProvider>
        </NextThemesProvider>
      </NextUIProvider>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
