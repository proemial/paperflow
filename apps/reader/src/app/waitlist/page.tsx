"use client";
import { Button } from "@/src/components/shadcn-ui/button";
import { useUser } from "@auth0/nextjs-auth0/client";
import { QueryClientProvider, useMutation } from "@tanstack/react-query";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import logo from "src/images/logo.png";
import * as yup from "yup";
import { postToSlack } from "./slack";
import { setCookie } from "cookies-next";
import { queryClient } from "@/src/state/react-query";

export const revalidate = 1;

export default function WaitlistPage() {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      window.location.href = "/";
    }
  }, [user]);

  return (
    <QueryClientProvider client={queryClient}>
      <main className={`min-h-[calc(100dvh-48px)] flex flex-col justify-begin`}>
        <div
          className={`h-[calc(100dvh-48px)] max-h-screen flex flex-col justify-center items-center bg-zinc-900`}
        >
          <div className="h-[10%]"></div>
          <div className="h-[50%] w-full flex flex-col justify-center items-center">
            <img src={logo.src} style={{ maxHeight: "40%" }} />
            <div className="text-3xl md:text-7xl">Paperflow</div>
          </div>
          <div className="h-[40%] w-full flex justify-center items-begin">
            <WaitlistForm />
          </div>
        </div>
      </main>
    </QueryClientProvider>
  );
}

type WaitlistFormInput = {
  name: string;
  email: string;
};

function WaitlistForm() {
  const { mutate } = useMutation(postToSlack);
  const { push } = useRouter();

  const validationSchema = yup.object({
    name: yup.string().required(),
    email: yup.string().required(),
  });

  const handleSubmit = (input: WaitlistFormInput) => {
    mutate(input, {
      onSuccess: async (response) => {
        setCookie("status", "waitlist");
        push("/?reload=true");
      },
    });
  };

  const inputStyle = (errorText?: string) =>
    `h-10 rounded-md pl-[8px] focus:outline-none ${
      errorText ? "border-2 border-red-600" : ""
    }`;

  return (
    <Formik
      initialValues={{ name: "", email: "" }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
      }) => (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 w-[80%] text-black"
        >
          <div className="text-white text-center">
            Submit your details to join our waitlist.
          </div>
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.name}
            className={inputStyle(errors.name && touched.name && errors.name)}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.email}
            className={inputStyle(
              errors.email && touched.email && errors.email
            )}
          />
          <Button type="submit" disabled={isSubmitting}>
            Submit
          </Button>
        </form>
      )}
    </Formik>
  );
}
