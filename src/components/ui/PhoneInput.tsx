"use client";
import { Command, CommandItem, CommandList } from "cmdk";
import { Popover } from "radix-ui";
import { cn } from "@/lib/utils";
import countriesLib from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import parsePhoneNumberFromString, {
  CountryCode,
  getCountries,
  getCountryCallingCode
} from "libphonenumber-js";
import { Search } from "lucide-react";
import React, { forwardRef, useState } from "react";
import PhoneInput2 from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import CountryFlag from "./CountryFlag";
import LabelContainer from "./LabelContainer";
import { inputStyles, startIconStyles } from "@/styles/ui/inputStyles";
import { ReactDispatch } from "@/types/common";

countriesLib.registerLocale(enLocale);

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, "children"> & {
  label?: string;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  setValue?: ReactDispatch<string>;
  value?: string;
  defaultCountry?: string;
};

const countries = getCountries().filter((each) => each !== "AC");

const getCountryFromNumber = (phone?: string) => {
  if (!phone || !phone.length) {
    return "";
  }
  phone = phone.replaceAll("+", "");
  const parsed = parsePhoneNumberFromString(phone ? `+${phone}` : "");
  return parsed?.country?.toLowerCase();
};

const PhoneInput = forwardRef<HTMLInputElement, Props>(
  (
    {
      containerClassName,
      maxLength,
      required,
      label,
      value,
      onChange,
      defaultCountry,
      error,
      labelClassName,
      setValue,
      ...rest
    },
    // eslint-disable-next-line
    ref
  ) => {
    const [selectedCountry, setSelectedCountry] = useState(
      getCountryFromNumber(value) || defaultCountry
    );
    const [displayCountry, setDisplayCountry] = useState(
      getCountryFromNumber(value) || defaultCountry
    );
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    return (
      <LabelContainer
        error={error}
        htmlFor={rest.id}
        label={label}
        className={containerClassName}
        labelClassName={labelClassName}
        required={required}
      >
        <div
          className={cn(
            "relative",
            "flex items-center",
            "border border-border-primary",
            "focus-within:outline-2 focus-within:outline-primary",
            "rounded-lg"
          )}
        >
          {/* ✅ Custom Dropdown */}
          <Popover.Popover open={open} onOpenChange={setOpen}>
            <Popover.PopoverTrigger
              asChild
              disabled={rest.disabled}
              className="cursor-pointer"
            >
              <button
                type="button"
                className={cn(
                  "min-w-16 2xl:min-w-20",
                  "flex items-center justify-center",
                  "px-2",
                  "border-r border-border-primary",
                  "mr-2",
                  "h-[38px] 2xl:h-12",
                  "bg-background rounded-l-md text-sm font-medium",
                  "cursor-pointer",
                  "whitespace-nowrap"
                )}
                disabled={rest.disabled}
              >
                <span className="mr-1 text-xl mb-[1px] w-[19px] 2xl:w-6">
                  <CountryFlag countryCode={displayCountry} />
                </span>
                <span className="">
                  {displayCountry
                    ? `+${getCountryCallingCode(
                        displayCountry.toUpperCase() as CountryCode
                      )}`
                    : null}
                </span>
              </button>
            </Popover.PopoverTrigger>

            <Popover.PopoverContent
              side="top"
              className="w-[300px] py-3 px-0 bg-background border-border-primary shadow-sm"
            >
              <Command>
                <h1 className="font-medium text-base px-4 pb-2">
                  Select Country Code
                </h1>

                {/* 🔍 Search Box */}
                <div className="px-4 py-2">
                  <div className={cn("relative", "flex", "items-center")}>
                    <div
                      className={cn(
                        startIconStyles,
                        "text-text-secondary px-2"
                      )}
                    >
                      <Search className="size-5" />
                    </div>
                    <input
                      className={cn(inputStyles, "h-9", "pl-12")}
                      placeholder="Search country"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {/* 📋 Filtered List */}
                <CommandList className="custom-scrollbar max-h-48 2xl:max-h-60 overflow-y-auto">
                  {countries
                    .filter((country) => {
                      const isoCode = country.toUpperCase();
                      const countryName =
                        countriesLib.getName(isoCode, "en") || "";
                      const callingCode = `+${getCountryCallingCode(
                        isoCode as CountryCode
                      )}`;

                      const query = searchTerm.trim().toLowerCase();

                      return (
                        isoCode.toLowerCase().includes(query) || // PK
                        countryName.toLowerCase().includes(query) || // Pakistan
                        callingCode.includes(query) // +92
                      );
                    })
                    .map((country) => {
                      const isoCode = country.toUpperCase();
                      const countryName =
                        countriesLib.getName(isoCode, "en") || "";

                      return (
                        <CommandItem
                          key={country}
                          value={country.toLowerCase()}
                          onSelect={() => {
                            setSelectedCountry(country);
                            setDisplayCountry(country);
                            setOpen(false);
                          }}
                          className="flex gap-2 text-sm text-text-primary font-medium cursor-pointer hover:bg-primary/10 px-4 py-2"
                        >
                          <span className="mr-2 text-2xl">
                            <CountryFlag countryCode={country} />
                          </span>
                          {countryName} ({isoCode}) (+
                          {getCountryCallingCode(isoCode as CountryCode)})
                        </CommandItem>
                      );
                    })}
                </CommandList>
              </Command>
            </Popover.PopoverContent>
          </Popover.Popover>
          <PhoneInput2
            country={selectedCountry?.toLowerCase()}
            value={value}
            onChange={(phone, country) => {
              setValue?.(phone);
              if (phone.length === 0) {
                setDisplayCountry("");
                return;
              }
              //   @ts-expect-error not required
              if (country?.countryCode) {
                //   @ts-expect-error not required
                setDisplayCountry(country?.countryCode);
              }
            }}
            disableDropdown
            inputProps={{
              name: "phoneNumber"
            }}
            placeholder={rest.placeholder}
            inputClass={cn(
              rest.disabled && "!cursor-default",
              "!h-[48px] !w-full !bg-background",
              "!ps-0 !border-none rounded-md !text-base"
            )}
            buttonStyle={{ display: "none" }}
            enableSearch={false}
            disabled={rest.disabled}
          />
        </div>
      </LabelContainer>
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export default PhoneInput;
