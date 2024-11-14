"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"
import { Moon, Sun } from "lucide-react"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer px-1 inline-flex h-12 w-26 shrink-0 cursor-pointer justify-between items-center rounded-full border-2 border-secondary-3 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none flex justify-center items-center h-10 w-10 rounded-full bg-primary-7 shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-10 data-[state=unchecked]:translate-x-0 text-white"
      )}
    >
      <span>
        {props.checked ? <Moon className='w-5 h-5' /> : <Sun className='w-5 h-5' />}
      </span>
    </SwitchPrimitives.Thumb>
    <div className="w-10 h-10 flex justify-center items-center">
      <Moon className='w-5 h-5 data-[state=checked]:hidden' />
    </div>
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
