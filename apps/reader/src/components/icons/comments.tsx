import Image from "next/image";
import comments from "src/images/comments.svg";

export function CommentsIcon() {
  // @ts-ignore
  return <Image src={comments} alt="" />;
}
