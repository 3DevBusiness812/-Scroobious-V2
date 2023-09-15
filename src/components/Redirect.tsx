import { useRouter } from "next/router";
import { FC } from "react";

const Redirect: FC<{ to: string }> = ({ to }) => {
  const router = useRouter();

  if (typeof window !== "undefined") router.push(to);

  return null;
};

export default Redirect;
