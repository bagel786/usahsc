import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "Register / Join",
  description: "Schools and players interested in joining the USAHSC can register here.",
};

export default function RegisterPage() {
  return (
    <>
      <PageHeader
        eyebrow="Join the league"
        title="Register / Join"
        description="Are you a school, coach, player or parent interested in high-school cricket? Tell us a bit about yourself and we'll be in touch."
      />
      <div className="container-px py-14">
        <div className="mx-auto max-w-3xl">
          <RegisterForm />
        </div>
      </div>
    </>
  );
}
