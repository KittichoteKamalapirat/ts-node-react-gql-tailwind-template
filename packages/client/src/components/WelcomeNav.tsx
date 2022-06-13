import { Box, Flex, Heading, Link } from "@chakra-ui/layout";
import { useMediaQuery } from "@chakra-ui/react";
import NextLink from "next/link";
import React, { ReactNode } from "react";
import { NavDrawer } from "./NavDrawer";
import { NavNoDrawer } from "./NavNotDrawer";

interface WelcomeNavProps {
  children: ReactNode;
}

export const WelcomeNav: React.FC<WelcomeNavProps> = ({ children }) => {
  const [isLargerThan30Em] = useMediaQuery("(min-width: 30em)");

  return (
    <Box pt={4}>
      <Box p={2} bgColor="white" alignItems="center" width="100%">
        <Flex
          justifyContent="space-between"
          alignItems="center"
          color="gray.700"
          maxWidth="1000px"
          m="auto"
        >
          <NextLink href="/" passHref>
            <Link
              style={{ textDecoration: "none" }}
              // textDecoration="none"
            >
              <Heading fontSize={["lg", "2xl"]}>Cookknow</Heading>
            </Link>
          </NextLink>

          {isLargerThan30Em ? <NavNoDrawer /> : <NavDrawer />}
        </Flex>
      </Box>

      {children}
    </Box>
  );
};
