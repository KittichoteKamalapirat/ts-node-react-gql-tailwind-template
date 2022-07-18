import { useRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";
import { Control, UseFormSetError } from "react-hook-form";
import { InputType } from "../../constants/inputType";

import { Address, useCreateAddressMutation } from "../../generated/graphql";
import { useIsAuth } from "../../util/useIsAuth";
import Button, { ButtonTypes, HTMLButtonType } from "../Buttons/Button";
import useGeneralForm from "../hooks/useGeneralForm";
import { Layout } from "../Layout";
import TextField, { TextFieldTypes } from "./TextField";

enum FormNames {
  NAME = "name",
  PHONE_NUMBER = "phoneNumber",
  LINE_1 = "line1",
  LINE_2 = "line2",
  SUB_DISTRICT = "subDistrict",
  DISTRICT = "district",
  PROVINCE = "province",
  POSTCODE = "postcode",
  COUNTRY = "country",
}

export interface AddressFormValues {
  name: string;
  phoneNumber: string;
  line1: string;
  line2: string;
  subDistrict: string;
  district: string;
  province: string;
  postcode: string;
  country: string;
}

interface Props {
  initialAddressData: Address | null;
  onSubmitForm: (
    data: AddressFormValues,
    setError: UseFormSetError<AddressFormValues>,
    setGenericErrorMessage: Dispatch<SetStateAction<string>>
  ) => void;
}

export const formatInitialAddressData = (
  initData: Address | null
): AddressFormValues => {
  if (!initData)
    return {
      name: "",
      phoneNumber: "",
      line1: "",
      line2: "",
      subDistrict: "",
      district: "",
      province: "",
      postcode: "",
      country: "",
    };
  const {
    name,
    phoneNumber,
    line1,
    line2,
    subDistrict,
    district,
    province,
    postcode,
    country,
  } = initData;

  return {
    name,
    phoneNumber,
    line1,
    line2,
    subDistrict,
    district,
    province,
    postcode,
    country,
  };
};

const AddressEditor = ({ initialAddressData, onSubmitForm }: Props) => {
  const [createAddress] = useCreateAddressMutation();
  const router = useRouter();
  useIsAuth();

  // setup form
  const { errors, submitForm, control } = useGeneralForm(
    formatInitialAddressData(initialAddressData),
    onSubmitForm
  );

  return (
    <div>
      <form onSubmit={submitForm}>
        <TextField
          name={FormNames.NAME}
          control={control as unknown as Control}
          label="Address Name"
          type={TextFieldTypes.OUTLINED}
          extraClass="w-1/2"
          error={errors[FormNames.NAME]}
          required
        />

        <TextField
          name={FormNames.PHONE_NUMBER}
          control={control as unknown as Control}
          label="Phone number"
          type={TextFieldTypes.OUTLINED}
          extraClass="w-1/2"
          error={errors[FormNames.PHONE_NUMBER]}
          required
        />

        <TextField
          name={FormNames.LINE_1}
          control={control as unknown as Control}
          label="Address Line 1"
          type={TextFieldTypes.OUTLINED}
          extraClass="w-1/2"
          error={errors[FormNames.LINE_1]}
          required
        />

        <TextField
          name={FormNames.LINE_2}
          control={control as unknown as Control}
          label="Address Line 2"
          type={TextFieldTypes.OUTLINED}
          extraClass="w-1/2"
          error={errors[FormNames.LINE_2]}
          required
        />

        <TextField
          name={FormNames.SUB_DISTRICT}
          control={control as unknown as Control}
          label="Sub District"
          type={TextFieldTypes.OUTLINED}
          extraClass="w-1/2"
          error={errors[FormNames.SUB_DISTRICT]}
          inputType={InputType.Password}
          required
        />

        <TextField
          name={FormNames.DISTRICT}
          control={control as unknown as Control}
          label="District"
          type={TextFieldTypes.OUTLINED}
          extraClass="w-1/2"
          error={errors[FormNames.DISTRICT]}
          required
        />

        <TextField
          name={FormNames.PROVINCE}
          control={control as unknown as Control}
          label="Province"
          type={TextFieldTypes.OUTLINED}
          extraClass="w-1/2"
          error={errors[FormNames.PROVINCE]}
          required
        />

        <TextField
          name={FormNames.POSTCODE}
          control={control as unknown as Control}
          label="Postcode"
          type={TextFieldTypes.OUTLINED}
          extraClass="w-1/2"
          error={errors[FormNames.POSTCODE]}
          inputType={InputType.Number}
          required
        />

        <TextField
          name={FormNames.COUNTRY}
          control={control as unknown as Control}
          label="Country"
          type={TextFieldTypes.OUTLINED}
          extraClass="w-1/2"
          error={errors[FormNames.COUNTRY]}
          inputType={InputType.Password}
          required
        />

        <Button
          type={ButtonTypes.PRIMARY}
          label="Add"
          buttonType={HTMLButtonType.SUBMIT}
          spacing="px-3.5 mt-2"
        />
      </form>
    </div>
  );
};

export default AddressEditor;
