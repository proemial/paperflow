import logo from "../../components/logo-with-text.png";
import Image from "next/image";

export function LandingPage() {
  return (
    <div className="flex m-2 h-full items-center justify-center dark:invert-[1]">
      <Image
        src={logo}
        alt="Paperflow Logo"
        style={{
          maxWidth: "50%",
          maxHeight: "50%",
          width: "auto",
          height: "auto",
        }}
      />
    </div>
  );
}
