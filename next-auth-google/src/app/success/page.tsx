"use client";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <h1>Loading...</h1>;
  } else if (status === "authenticated") {
    return (
      <>
        <h1>Login Success!</h1>
        <h2>Name: {session?.user?.username}</h2>
        <h2>Email: {session?.user?.email}</h2>
        <h2>Id: {session?.user?.id}</h2>
        <Button
          onClick={async () => {
            // sign in with github
            router.push("/auth/signout");
          }}
          className="flex w-full justify-center"
          variant={"outline"}
        >
          SignOut
        </Button>
      </>
    );
  } else {
    return <h1>Unauthencated</h1>;
  }
}
