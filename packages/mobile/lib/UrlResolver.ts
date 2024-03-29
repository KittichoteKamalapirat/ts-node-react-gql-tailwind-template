import Constants from "expo-constants";

class UrlResolver {
  index() {
    return "/";
  }

  // API
  graphql() {
    return `${Constants.manifest?.extra?.PUBLIC_SERVER_URL}/graphql`;
  }
}

export const urlResolver = new UrlResolver();
