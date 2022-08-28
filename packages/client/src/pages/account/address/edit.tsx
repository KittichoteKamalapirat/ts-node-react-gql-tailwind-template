import { useRouter } from "next/router";
import React, { Dispatch, SetStateAction } from "react";
import { UseFormSetError } from "react-hook-form";
import AddressEditor, {
  AddressFormValues,
} from "../../../components/forms/AddressEditor";
import { Layout } from "../../../components/layouts/Layout";

import PageHeading from "../../../components/typography/PageHeading";
import { Wrapper } from "../../../components/Wrapper";
import {
  Address,
  AddressInput,
  useAddressQuery,
  useUpdateAddressMutation,
} from "../../../generated/graphql";
import { useIsAuth } from "../../../util/useIsAuth";
import { withApollo } from "../../../util/withApollo";

interface EditAddressProps {}

const EditAddress: React.FC<EditAddressProps> = ({}) => {
  const { data, loading } = useAddressQuery();
  const [updateAddress] = useUpdateAddressMutation();

  const router = useRouter();
  useIsAuth();

  const handleSubmitForm = async (
    data: AddressFormValues,
    setError: UseFormSetError<AddressFormValues>,
    setGenericErrorMessage: Dispatch<SetStateAction<string>>
  ) => {
    const input: AddressInput = {
      name: data.name,
      phoneNumber: data.phoneNumber,
      line1: data.line1,
      line2: data.line2,
      subDistrict: data.subDistrict,
      district: data.district,
      province: data.province,
      country: data.country,
      postcode: data.postcode,
    };
    const { errors } = await updateAddress({
      variables: { input, id: parseInt(router.query.id as string) },
    });
    router.push("/account/address");

    if (errors) {
      throw new Error();
    } else {
      router.back();
    }
    return;
  };

  if (loading) {
    return (
      <Layout heading="loading">
        <div>loading ...</div>
      </Layout>
    );
  }

  if (!loading && !data) {
    return (
      <Layout heading="No address">
        <div>Address not found</div>
      </Layout>
    );
  }
  return (
    <Layout heading="Edit address">
      <Wrapper variant="small">
        <PageHeading heading="Edit address" />
        <AddressEditor
          onSubmitForm={handleSubmitForm}
          initialAddressData={data?.address as Address}
        />
      </Wrapper>
    </Layout>
  );
};

export default withApollo({ ssr: false })(EditAddress);
