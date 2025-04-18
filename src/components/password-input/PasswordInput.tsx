import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import type { ControllerRenderProps, FieldValues } from "react-hook-form";

export interface PasswordInputProps extends ControllerRenderProps<FieldValues> {
    className?: string;
    placeholder?: string;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ className, placeholder, ...props }, ref) => {
        const [isVisible, setIsVisible] = useState<boolean>(false);

        const toggleVisibility = () => setIsVisible((prevState) => !prevState);

        return (
            <div>
                <div className="relative">
                    <Input
                        id="input-51"
                        className={cn("pe-9", className)}
                        placeholder={placeholder ? placeholder : "Password"}
                        type={isVisible ? "text" : "password"}
                        aria-describedby="password-strength"
                        {...props}
                        ref={ref}
                    />
                    <button
                        className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                        type="button"
                        onClick={toggleVisibility}
                        aria-label={
                            isVisible ? "Hide password" : "Show password"
                        }
                        aria-pressed={isVisible}
                        aria-controls="password"
                    >
                        {isVisible ? (
                            <EyeOff
                                size={16}
                                strokeWidth={2}
                                aria-hidden="true"
                            />
                        ) : (
                            <Eye size={16} strokeWidth={2} aria-hidden="true" />
                        )}
                    </button>
                </div>
            </div>
        );
    }
);
