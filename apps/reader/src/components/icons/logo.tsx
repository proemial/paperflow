import Image from "next/image";
import paperflow from "src/images/logo.png";
import google from "src/images/google.svg";
import twitter from "src/images/twitter.svg";
import github from "src/images/github.svg";

const logos = { paperflow, google, twitter, github };

type Props = {
  variant?: "paperflow" | "google" | "twitter" | "github";
  className?: string;
};
export function Logo({ variant = "paperflow", className }: Props) {
  return (
    <Image
      height={16}
      width={16}
      className={className}
      src={logos[variant]}
      alt=""
    />
  );
}
