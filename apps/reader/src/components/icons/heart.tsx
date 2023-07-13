import Image from "next/image";
import heart from "src/images/heart.svg";

export function HeartIcon() {
  // @ts-ignore
  return <Image src={heart} alt="" />;
}
