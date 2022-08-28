import { useRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";
import { UseFormSetError } from "react-hook-form";
import AddressEditor, {
  AddressFormValues,
} from "../../../components/forms/AddressEditor";
import { Layout } from "../../../components/layouts/Layout";

import PageHeading from "../../../components/typography/PageHeading";
import { Wrapper } from "../../../components/Wrapper";
import {
  AddressInput,
  useCreateAddressMutation,
} from "../../../generated/graphql";
import { useIsAuth } from "../../../util/useIsAuth";
import { withApollo } from "../../../util/withApollo";

const CreateAddress = ({}) => {
  const [createAddress] = useCreateAddressMutation();
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
    const { errors } = await createAddress({ variables: { input } });
    router.push("/account/address");

    if (errors) {
      throw new Error();
    } else {
      router.back();
    }
    return;
  };

  return (
    <Layout heading="Add address">
      <Wrapper variant="small">
        <PageHeading heading="Edit address" />
        <AddressEditor
          onSubmitForm={handleSubmitForm}
          initialAddressData={null}
        />
      </Wrapper>
    </Layout>
  );
};

export default withApollo({ ssr: false })(CreateAddress);
