import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import theme from "../theme";
import React from "react";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: any) {
  console.log("NODE_ENV: " + process.env.NODE_ENV);
  console.log("Public server url: " + process.env.NEXT_PUBLIC_SERVER_URL);
  return (
    <ChakraProvider resetCSS theme={theme}>
      <ColorModeProvider
        options={{
          useSystemColorMode: true,
        }}
      >
        <Component {...pageProps} />
      </ColorModeProvider>
    </ChakraProvider>
  );
}

// export default MyApp;
export default MyApp;
