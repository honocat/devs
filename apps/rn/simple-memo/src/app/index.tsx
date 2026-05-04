import { Redirect, router } from "expo-router";

import { useEffect } from "react";

import { auth } from "../config";
import { onAuthStateChanged } from "firebase/auth";

export default function Index() {
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user !== null) {
        router.replace("/(memo)/list");
      }
    });
  }, []);

  return <Redirect href="/(auth)/login" />;
}
