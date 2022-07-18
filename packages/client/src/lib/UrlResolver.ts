export const urlResolver = {
  // auth
  login: () => {
    return "/login";
  },

  register: () => {
    return "/register";
  },

  forgotPassword: () => {
    return "/forgot-password";
  },

  index: () => {
    return "/";
  },

  createAddress: () => "/account/address/create",
  // API
  graphql: () => {
    return `${process.env.NEXT_PUBLIC_SERVER_URL}/graphql`;
  },

  signS3: () => {
    return `${process.env.NEXT_PUBLIC_SERVER_URL}/api/s3/sign-and-save`;
  },
};
