import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-[#5e6ad2]/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-[#5e6ad2] text-white hover:bg-[#6b77d8] border-[rgba(255,255,255,0.10)]",
        outline:
          "bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.10)] text-[#d0d6e0] hover:bg-[rgba(255,255,255,0.08)] hover:text-white",
        secondary:
          "bg-[rgba(255,255,255,0.06)] text-[#d0d6e0] hover:bg-[rgba(255,255,255,0.10)] hover:text-white border-[rgba(255,255,255,0.08)]",
        ghost:
          "text-[#8a8f98] hover:bg-[rgba(255,255,255,0.06)] hover:text-[#d0d6e0] border-transparent",
        destructive:
          "bg-[rgba(239,68,68,0.15)] text-[#f87171] hover:bg-[rgba(239,68,68,0.25)] border-[rgba(239,68,68,0.25)]",
        link: "text-[#7170ff] underline-offset-4 hover:underline border-transparent",
      },
      size: {
        default: "h-8 gap-1.5 px-3",
        xs: "h-6 gap-1 rounded-md px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-md px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-4",
        icon: "size-8",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7 rounded-md",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
