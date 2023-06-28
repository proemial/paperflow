import { getSession } from "@auth0/nextjs-auth0";
import { LandingPage } from "./landing-page";
// import { fetchRoles } from "@/app/api/endpoints";
// import { redirect } from "next/navigation";
import { ListPage } from "./list-page";

export default async function HomePage() {
  const session = await getSession();
  // console.log(session);
  // if (!session?.user['http://your-namespace/roles'].includes('admin')) {
  //   return { props: { error: 'Forbidden' } }
  // }

  if (!session) {
    return <LandingPage />;
  }

  // try {
  //   const json = await fetchRoles(session.user.sub, session.idToken);
  //   console.log("fetchRoles", json);

  //   // const isMember = !!json.find((role) => role.name === "member");
  //   // if (!isMember) {
  //   //   return <LandingPage />;
  //   // }
  // } catch (e) {
  //   console.error(e);

  //   // redirect("/api/auth/logout");
  // }

  return (
    <>
      {/* @ts-expect-error Server Component */}
      <ListPage />
    </>
  );
}
