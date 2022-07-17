import { Box } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import Dropzone from "react-dropzone";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import { Wrapper } from "../components/Wrapper";
import { useCreatePostMutation } from "../generated/graphql";
import { useIsAuth } from "../util/useIsAuth";
import { withApollo } from "../util/withApollo";

const CreatePost: React.FC<{}> = ({}) => {
  //router import for below, not for useIsAuth
  useIsAuth();

  const [createPost] = useCreatePostMutation();
  const router = useRouter();

  return (
    <Layout variant="small">
      <Wrapper variant="small">
        <Formik
          initialValues={{
            title: "",
            text: "",
          }}
          onSubmit={async (values) => {
            try {
              const { errors } = await createPost({
                variables: {
                  input: {
                    title: values.title,
                    text: values.text,
                  },
                },
                update: (cache) => {
                  cache.evict({ fieldName: "posts:{}" });
                },
              });
              if (!errors) {
                router.push("/");
              }
            } catch (error) {
              console.log(error.message);
            }

            // if there is error, the global error in craeteUrqlclient will handle it, so no need to handle here
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField name="title" placeholder="title" label="title" />
              <Box mt={4}>
                {" "}
                <InputField
                  textarea={true}
                  name="text"
                  placeholder="text..."
                  label="Body"
                />
                <Dropzone
                  onDrop={handleOnDropThumbnail}
                  // maxSize={1000 * 1}
                  multiple={false}
                  // accept="video/mp4"
                >
                  {({ getRootProps, getInputProps }) => (
                    <Box mt={2}>
                      <Box mb={2}>Thumbnail Image</Box>
                      <Box
                        cursor="pointer"
                        border="1px"
                        borderColor="gray.200"
                        padding={4}
                      >
                        <div {...getRootProps()}>
                          <input {...getInputProps()} />
                          <p>
                            Drag and drop a thumbnail image here, or click to
                            select the file
                          </p>
                        </div>
                      </Box>
                    </Box>
                  )}
                </Dropzone>
                <Dropzone
                  onDrop={handleOnDropVideo}
                  // maxSize={1000 * 1}
                  multiple={false}
                  // accept="video/mp4"
                >
                  {({ getRootProps, getInputProps }) => (
                    <Box mt={2}>
                      <Box mb={2}>Video</Box>
                      <Box
                        cursor="pointer"
                        border="1px"
                        borderColor="gray.200"
                        padding={4}
                      >
                        <div {...getRootProps()}>
                          <input {...getInputProps()} />
                          <p>
                            Drag and drop a video here, or click to select the
                            file
                          </p>
                        </div>
                      </Box>
                    </Box>
                  )}
                </Dropzone>
              </Box>

              <Button
                mt={4}
                type="submit"
                isLoading={isSubmitting}
                colorScheme="teal"
              >
                {" "}
                Create Post
              </Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </Layout>
  );
};

export default withApollo({ ssr: false })(CreatePost);
