// PasswordStrengthInput.tsx
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Check, Eye, EyeOff, X } from "lucide-react";
import React, { useMemo, useState } from "react";
import type { ControllerRenderProps, FieldValues } from "react-hook-form";

export interface PasswordStrengthInputProps
    extends ControllerRenderProps<FieldValues> {
    className?: string;
    placeholder?: string;
    triggerHighlight?: boolean;
    hidePasswordRequirementsList?: boolean;
}

export const PasswordStrengthInput = React.forwardRef<
    HTMLInputElement,
    PasswordStrengthInputProps
>(({ className, placeholder, value, triggerHighlight, hidePasswordRequirementsList = false, ...props }, ref) => {
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const toggleVisibility = () => setIsVisible((prevState) => !prevState);

    const checkStrength = (password: string) => {
        const requirements = [
            { regex: /.{8,}/, text: "At least 8 characters" },
            { regex: /[0-9]/, text: "At least 1 number" },
            { regex: /[a-z]/, text: "At least 1 lowercase letter" },
            { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
            {
                regex: /[@$!%*?&#]/,
                text: "At least 1 special character (@$!%*?&#)",
            },
        ];

        return requirements.map((req) => ({
            met: req.regex.test(password),
            text: req.text,
        }));
    };

    const strength = checkStrength(value);

    const strengthScore = useMemo(() => {
        return strength.filter((req) => req.met).length;
    }, [strength]);

    const getStrengthColor = (score: number) => {
        if (score === 0) return "bg-border";
        if (score <= 1) return "bg-red-500";
        if (score <= 3) return "bg-orange-500";
        if (score === 4) return "bg-amber-500";
        return "bg-emerald-500";
    };

    const getStrengthText = (score: number) => {
        if (score === 0) return "Enter a password";
        if (score <= 2) return "Weak password";
        if (score <= 4) return "Medium password";
        return "Strong password";
    };

    return (
        <div>
            <div className="relative">
                <Input
                    id="input-51"
                    className={cn("pe-9", className)}
                    placeholder={placeholder ? placeholder : "Password"}
                    type={isVisible ? "text" : "password"}
                    aria-invalid={strengthScore < 5}
                    aria-describedby="password-strength"
                    {...props}
                    ref={ref}
                />
                <button
                    className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                    type="button"
                    onClick={toggleVisibility}
                    aria-label={isVisible ? "Hide password" : "Show password"}
                    aria-pressed={isVisible}
                    aria-controls="password"
                >
                    {isVisible ? (
                        <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
                    ) : (
                        <Eye size={16} strokeWidth={2} aria-hidden="true" />
                    )}
                </button>
            </div>

            {/* Password strength indicator */}
            <div
                className="mb-4 mt-3 h-1 w-full overflow-hidden rounded-full bg-border"
                role="progressbar"
                aria-valuenow={strengthScore}
                aria-valuemin={0}
                aria-valuemax={5}
                aria-label="Password strength"
            >
                <div
                    className={`h-full ${getStrengthColor(
                        strengthScore
                    )} transition-all duration-500 ease-out`}
                    style={{ width: `${(strengthScore / 5) * 100}%` }}
                ></div>
            </div>

            {/* Password requirements list */}
            {!hidePasswordRequirementsList &&
                <>
                    <p
                        id="password-strength"
                        className="mb-2 text-sm font-medium text-foreground"
                    >
                        {getStrengthText(strengthScore)}. Must contain:
                    </p>
                    <ul className="space-y-1.5" aria-label="Password requirements">
                        {strength.map((req, index) => (
                            <li key={index} className="flex items-center gap-2">
                                {req.met ? (
                                    <Check
                                        size={16}
                                        className="text-emerald-500"
                                        aria-hidden="true"
                                    />
                                ) : (
                                    <X
                                        size={16}
                                        className={cn(
                                            "text-muted-foreground/80",
                                            triggerHighlight && "text-red-500"
                                        )}
                                        aria-hidden="true"
                                    />
                                )}
                                <span
                                    className={cn(
                                        "text-xs",
                                        req.met
                                            ? "text-emerald-600"
                                            : triggerHighlight
                                                ? "text-red-500"
                                                : "text-muted-foreground"
                                    )}
                                >
                                    {req.text}
                                    <span className="sr-only">
                                        {req.met
                                            ? " - Requirement met"
                                            : " - Requirement not met"}
                                    </span>
                                </span>
                            </li>
                        ))}
                    </ul>
                </>
            }
        </div>
    );
});
