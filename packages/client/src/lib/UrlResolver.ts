class UrlResolver {
  index() {
    return "/";
  }

  // API
  graphql() {
    return `${process.env.NEXT_PUBLIC_SERVER_URL}/graphql`;
  }

  signS3() {
    return `${process.env.NEXT_PUBLIC_SERVER_URL}/api/s3/sign-and-save`;
  }
}

export const urlResolver = new UrlResolver();
