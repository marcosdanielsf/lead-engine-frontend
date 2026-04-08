import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, style, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-md px-2.5 py-2 text-sm transition-colors outline-none",
        "placeholder:text-[#62666d]",
        "focus-visible:ring-2 focus-visible:ring-[#5e6ad2]/50 focus-visible:border-[#5e6ad2]",
        "disabled:cursor-not-allowed disabled:opacity-40",
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

export { Textarea }
