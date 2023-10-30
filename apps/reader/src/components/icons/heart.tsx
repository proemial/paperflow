import Image from "next/image";
import heart from "src/images/heart.svg";

export function HeartIcon() {
  return <Image src={heart} alt="" />;
}
