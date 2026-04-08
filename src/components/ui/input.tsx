import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, style, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-md px-2.5 py-1 text-sm transition-colors outline-none",
        "placeholder:text-[#62666d]",
        "focus-visible:ring-2 focus-visible:ring-[#5e6ad2]/50 focus-visible:border-[#5e6ad2]",
        "disabled:pointer-events-none disabled:opacity-40",
        "aria-invalid:border-[rgba(239,68,68,0.5)] aria-invalid:ring-2 aria-invalid:ring-[rgba(239,68,68,0.20)]",
        className
      )}
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.10)",
        color: "#d0d6e0",
        ...style,
      }}
      {...props}
    />
  )
}

export { Input }
