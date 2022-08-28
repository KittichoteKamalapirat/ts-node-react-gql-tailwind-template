import { WarningIcon } from "@chakra-ui/icons";
import { Flex, Text } from "@chakra-ui/react";
import React from "react";
import { urlResolver } from "../../lib/UrlResolver";
import Button, { ButtonTypes } from "../Buttons/Button";

interface Props {
  text?: string;
  overlay?: boolean;
}

export const Error = ({ text }: Props) => {
  const homeUrl = urlResolver.index();
  return (
    <Flex
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
      height="70vh"
    >
      <Flex flexDirection="column" justifyContent="center" alignItems="center">
        <WarningIcon color="alert" fontSize="5xl" mb={5} />
        <Text color="alert" fontWeight="bold" mb={5} textAlign="center">
          {text || "Hmm.. something is wrong"}
        </Text>

        <Button
          href={homeUrl}
          label="Back to Home"
          type={ButtonTypes.PRIMARY}
        />
      </Flex>
    </Flex>
  );
};
