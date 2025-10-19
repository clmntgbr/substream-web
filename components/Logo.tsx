import Image from "next/image";

export function Logo() {
  return (
    <div className="relative">
      <Image src="/logoblack.svg" alt="Logo" width={100} height={100} />
    </div>
  );
}
