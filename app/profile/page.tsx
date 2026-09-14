import ProfilePage from "@/components/ProfileComponent";
import { auth } from "@clerk/nextjs/server";

export default async function page() {
  await auth.protect();

  return <ProfilePage />;
}