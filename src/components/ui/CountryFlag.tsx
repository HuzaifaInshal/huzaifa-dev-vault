"use client";
import Image from "next/image";
import { useState } from "react";

const CountryFlag = ({ countryCode }: { countryCode?: string | null }) => {
  const [error, setError] = useState(false);
  const isValidCode =
    typeof countryCode === "string" && /^[A-Za-z]{2}$/.test(countryCode);

  if (!isValidCode || error) {
    return (
      <div className="border border-border-primary rounded-full h-7 w-7 flex center">
        ?
      </div>
    );
  }
  const code = countryCode.toLowerCase();
  return (
    <Image
      src={`https://flagcdn.com/256x192/${code}.png`}
      // srcSet={`https://flagcdn.com/32x24/${code}.png 2x,
      //          https://flagcdn.com/48x36/${code}.png 3x`}
      width="24"
      height="18"
      alt={countryCode}
      onError={() => setError(true)}
    />
  );
};

export default CountryFlag;
