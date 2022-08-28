import React from "react";

import {
  useAddressQuery,
  useDeleteAddressMutation,
  useMeQuery,
} from "../../../generated/graphql";
import NextLink from "next/link";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Box, IconButton, Link, Text } from "@chakra-ui/react";
import { useIsAuth } from "../../../util/useIsAuth";
import { withApollo } from "../../../util/withApollo";
import Button, {
  ButtonTypes,
  HTMLButtonType,
} from "../../../components/Buttons/Button";
import { urlResolver } from "../../../lib/UrlResolver";
import { Layout } from "../../../components/layouts/Layout";
import PageHeading from "../../../components/typography/PageHeading";

interface addressProps {}

const Address: React.FC<addressProps> = ({}) => {
  useIsAuth();
  const { data, loading } = useAddressQuery();
  const { data: meData } = useMeQuery();
  const [deleteAddress] = useDeleteAddressMutation();

  if (loading) {
    return (
      <Layout heading="Loading">
        <div>loading ...</div>
      </Layout>
    );
  }
  const noAddress = (
    <Layout heading="No address">
      <Text>You have not added yoru address yet</Text>

      <Button
        type={ButtonTypes.PRIMARY}
        label="Add address"
        buttonType={HTMLButtonType.SUBMIT}
        spacing="px-3.5 mt-2"
        href={urlResolver.createAddress()}
      />
    </Layout>
  );
  return !data ? (
    noAddress
  ) : (
    <Layout heading="My address">
      <PageHeading>Address</PageHeading>
      <Box>
        <Text>
          {data?.address.line1} {data?.address.line2}{" "}
          {data?.address.subDistrict} {data?.address.district}{" "}
          <Text>
            {" "}
            {data?.address.province} {data?.address.country}{" "}
            {data?.address.postcode}
          </Text>
        </Text>
      </Box>

      {!meData?.me ? null : (
        <Box>
          <Text>แก้ไขที่อยู่</Text>
          <NextLink href="/account/address/edit/" as="/account/address/edit/">
            <IconButton
              as={Link}
              aria-label="Edit post"
              icon={<EditIcon />}
            ></IconButton>
          </NextLink>

          <IconButton
            aria-label="Delete post"
            icon={<DeleteIcon />}
            onClick={() =>
              deleteAddress({ variables: { id: data.address.id } })
            }
          ></IconButton>
        </Box>
      )}
    </Layout>
  );
};

export default withApollo({ ssr: false })(Address);
