import { CheckIcon, ChevronsUpDown } from "lucide-react";

import * as React from "react";

import * as RPNInput from "react-phone-number-input";

import flags from "react-phone-number-input/flags";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

type PhoneInputProps = Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value"
> &
    Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {
        onChange?: (value: RPNInput.Value) => void;
    };

const PhoneInput: React.ForwardRefExoticComponent<PhoneInputProps> =
    React.forwardRef<
        React.ComponentRef<typeof RPNInput.default>,
        PhoneInputProps
    >(({ className, onChange, ...props }, ref) => {
        return (
            <RPNInput.default
                ref={ref}
                className={cn("flex", className)}
                flagComponent={FlagComponent}
                countrySelectComponent={CountrySelect}
                inputComponent={InputComponent}
                /**
                 * Handles the onChange event.
                 *
                 * react-phone-number-input might trigger the onChange event as undefined
                 * when a valid phone number is not entered. To prevent this,
                 * the value is coerced to an empty string.
                 *
                 * @param {E164Number | undefined} value - The entered value
                 */
                onChange={(value) => onChange?.(value as RPNInput.Value)}
                {...props}
            />
        );
    });
PhoneInput.displayName = "PhoneInput";

const InputComponent = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
    ({ className, ...props }, ref) => (
        <Input
            className={cn("rounded-e-lg rounded-s-none", className)}
            {...props}
            ref={ref}
        />
    )
);
InputComponent.displayName = "InputComponent";

type CountrySelectOption = { label: string; value: RPNInput.Country };

type CountrySelectProps = {
    disabled?: boolean;
    value: RPNInput.Country;
    onChange: (value: RPNInput.Country) => void;
    options: CountrySelectOption[];
};

const CountryItem = React.memo(
    ({
        option,
        value,
        onSelect,
    }: {
        option: CountrySelectOption;
        value: RPNInput.Country;
        onSelect: (country: RPNInput.Country) => void;
    }) => (
        <CommandItem className="gap-2" onSelect={() => onSelect(option.value)}>
            <FlagComponent
                key={option.value}
                country={option.value}
                countryName={option.label}
            />
            <span className="flex-1 text-sm">{option.label}</span>
            {option.value && (
                <span className="text-foreground/50 text-sm">
                    {`+${RPNInput.getCountryCallingCode(option.value)}`}
                </span>
            )}
            <CheckIcon
                className={cn(
                    "ml-auto h-4 w-4",
                    option.value === value ? "opacity-100" : "opacity-0"
                )}
            />
        </CommandItem>
    )
);

const CountrySelect = ({
    disabled,
    value,
    onChange,
    options,
}: CountrySelectProps) => {

    const countriesMemo = React.useMemo(
        () => options.filter((x) => x.value !== "EH"),
        [options]
    );

    const handleSelect = React.useCallback(
        (country: RPNInput.Country) => {
            onChange(country);
        },
        [onChange]
    );

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant={"outline"}
                    className={cn(
                        "flex gap-1 rounded-e-none rounded-s-lg px-3"
                    )}
                    disabled={disabled}
                >
                    <FlagComponent country={value} countryName={value} />
                    <ChevronsUpDown
                        className={cn(
                            "-mr-2 h-[14px] w-[14px] text-muted-foreground opacity-50",
                            disabled ? "hidden" : "opacity-100"
                        )}
                    />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
                <Command>
                    <CommandList className="overflow-hidden">
                        <ScrollArea className="h-72">
                            <CommandInput
                                placeholder="Search country..."
                            />
                            <CommandEmpty>No country found.</CommandEmpty>
                            <CommandGroup>
                                {countriesMemo.map((option, index) => (
                                    <CountryItem
                                        key={index}
                                        option={option}
                                        value={value}
                                        onSelect={handleSelect}
                                    />
                                ))}
                            </CommandGroup>
                        </ScrollArea>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
    const Flag = flags[country];

    return (
        <span className="bg-foreground/20 flex h-4 w-6 *:min-w-full overflow-hidden rounded-sm">
            {Flag && <Flag title={countryName} />}
        </span>
    );
};
FlagComponent.displayName = "FlagComponent";

export { PhoneInput };
