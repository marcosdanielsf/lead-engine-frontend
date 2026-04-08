import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-ring/50 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default:
          "bg-[rgba(94,106,210,0.18)] text-[#818cf8] border-[rgba(94,106,210,0.30)]",
        secondary:
          "bg-[rgba(255,255,255,0.06)] text-[#d0d6e0] border-[rgba(255,255,255,0.10)]",
        destructive:
          "bg-[rgba(239,68,68,0.15)] text-[#f87171] border-[rgba(239,68,68,0.25)]",
        outline:
          "bg-transparent text-[#d0d6e0] border-[rgba(255,255,255,0.12)]",
        ghost:
          "bg-[rgba(255,255,255,0.04)] text-[#8a8f98] border-transparent hover:bg-[rgba(255,255,255,0.08)]",
        success:
          "bg-[rgba(16,185,129,0.15)] text-[#34d399] border-[rgba(16,185,129,0.25)]",
        warning:
          "bg-[rgba(245,158,11,0.15)] text-[#fbbf24] border-[rgba(245,158,11,0.25)]",
        link: "text-[#7170ff] underline-offset-4 hover:underline border-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
