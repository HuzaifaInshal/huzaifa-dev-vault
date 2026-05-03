"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { handleRippleAnimation } from "@/lib/ui/handleRippleAnimation";
import { ButtonHTMLAttributes } from "react";
import NextLink from "next/link";

const buttonVariants = cva(
cn(
"inline-flex items-center justify-center gap-2 relative",
"whitespace-nowrap cursor-pointer rounded-md outline-none",
"font-semibold transition-all duration-200 disabled:cursor-not-allowed data-[externaldisabled=true]:opacity/90",
"[&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0",
"relative overflow-hidden",
"disabled:opacity-60"
),
{
variants: {
variant: {
default:
"bg-[image:var(--gradient)] [&_.loader-container]:bg-[image:var(--gradient)] hover:opacity-90 text-white",
["outline-transparent"]:
"text-text-primary border border-border-primary hover:bg-black/5 disabled:hover:bg-transparent shadow-[0px_1px_2px_0px_#00000014]",
outline:
"border border-primary hover:bg-primary/10 disabled:hover:bg-transparent text-primary",
secondary: "",
ghost:
"text-text-primary hover:bg-black/5 disabled:hover:bg-transparent",
destructive: "",
link: "text-primary underline-offset-4 hover:underline"
},
size: {
default: "h-9 px-8 py-2",
xs: "h-7 px-3 text-sm",
sm: "h-8 gap-1.5 px-4 text-sm",
lg: "h-12 px-10",
icon: "size-9 rounded-full",
xlg: "h-12 px-12",
full: "h-12 w-full",
fit: "h-10 w-fit px-0"
}
},
defaultVariants: {
variant: "default",
size: "default"
}
}
);

type Props = ButtonHTMLAttributes<HTMLButtonElement> &
VariantProps<typeof buttonVariants> & {
component?: React.ElementType;
link?: string;
isLoading?: boolean;
};

function Button({
className,
variant = "default",
size = "default",
component: ComponentOverride,
link,
children,
isLoading,
...props
}: Props) {
const Comp = ComponentOverride || "button";

const finalVariant = variant
? variant === "outline"
? "bg-primary/80"
: ["outline-transparent", "ghost"].includes(variant)
? "bg-black/50"
: undefined
: undefined;

const Loading = () => {
if (isLoading) {
return (
<span className="absolute flex center top-0 bottom-0 left-0 right-0 loader-container z-10">
<LoaderCircle className={cn("animate-spin")} />
</span>
);
}
return <></>;
};

if (link) {
return (
<NextLink
href={link}
className={cn(buttonVariants({ variant, size, className }))}
data-externaldisabled={`${props.disabled}`}
onMouseDown={(e) => {
handleRippleAnimation(
e as unknown as React.MouseEvent<HTMLButtonElement, MouseEvent>,
finalVariant
);
props.onMouseDown?.(
e as unknown as React.MouseEvent<HTMLButtonElement, MouseEvent>
);
}} >
{Loading()}
{children}
</NextLink>
);
}
return (
<Comp
{...props}
data-slot="button"
className={cn(buttonVariants({ variant, size, className }))}
data-externaldisabled={`${props.disabled}`}
onMouseDown={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
handleRippleAnimation(e, finalVariant);
props.onMouseDown?.(e);
}} >
{Loading()}
{children}
</Comp>
);
}

export { Button, buttonVariants };
