import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";

export const useIsAuth = () => {
  const { data, loading } = useMeQuery();

  const router = useRouter();

  useEffect(() => {
    // if login nothing happen
    // if not log in, do this`
    if (!loading && !data?.me) {
      // replace => can't go back to login page
      router.replace("/login?next=" + router.asPath);
    }
  }, [loading, data, router]);
};
