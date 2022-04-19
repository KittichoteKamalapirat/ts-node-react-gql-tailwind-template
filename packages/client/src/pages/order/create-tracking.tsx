import { Button } from "@chakra-ui/button";
import { Box, Center, Flex, Text } from "@chakra-ui/layout";
import { useRadioGroup } from "@chakra-ui/radio";
import { Select } from "@chakra-ui/select";
import { Formik, Form, Field } from "formik";
import { ValuesOfCorrectTypeRule } from "graphql";
import { useRouter } from "next/router";
import React from "react";
import { HeadingLayout } from "../../components/Layout/HeadingLayout";
import { InputField } from "../../components/InputField";
import { Wrapper } from "../../components/Wrapper";
import { useCreateTrackingMutation } from "../../generated/graphql";
import { courierList } from "../../util/constants/courierList";
import { withApollo } from "../../util/withApollo";

interface CreateTrackingProps {}

const CreateTracking: React.FC<CreateTrackingProps> = ({}) => {
  const router = useRouter();
  const { cartItemIds } = router.query;
  console.log({ cartItemIds });

  const [createTracking] = useCreateTrackingMutation();
  return (
    <HeadingLayout heading="Add tracking number">
      <Wrapper>
        <Formik
          initialValues={{
            trackingNo: "",
            courier: "",
          }}
          onSubmit={async (values, { setErrors }) => {
            console.log({ cartItemIds });
            const response = await createTracking({
              variables: {
                input: {
                  trackingNo: values.trackingNo,
                  courier: values.courier,
                  // if only 1 cartItem => not array but string, so i have to turn it to array
                  cartItemIds:
                    typeof cartItemIds === "string"
                      ? [parseInt(cartItemIds)]
                      : (cartItemIds as string[]).map((id) =>
                          parseInt(id as string)
                        ),
                },
              },
            });

            // push to tracking page even when found or not found (but the content in the page will be different)
            // if found -> show the info
            // if not found -> let user knows, maybe it's not added to the system OR wrong number
            router.push(`/order/tracking/${response.data?.createTracking.id}`);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Box my={2}>
                <Text fontWeight="bold">Courier</Text>

                <Field placeholder="Select courier" as="select" name="courier">
                  {courierList.map((courier, index) => (
                    <option key={index} value={courier.key}>
                      {courier.key}
                    </option>
                  ))}
                </Field>
              </Box>
              <Box>
                <Text fontWeight="bold">Tracking Number</Text>
                <InputField name="trackingNo" placeholder="Tracking Number" />
              </Box>
              <Center>
                <Button
                  mt={4}
                  type="submit"
                  isLoading={isSubmitting}
                  color="white"
                >
                  Update tracking
                </Button>
              </Center>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </HeadingLayout>
  );
};

export default withApollo({ ssr: false })(CreateTracking);
