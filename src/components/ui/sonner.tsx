
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          closeButton:
            "group-[.toast]:bg-transparent group-[.toast]:text-foreground group-[.toast]:opacity-70 group-[.toast]:hover:opacity-100",
        },
        duration: 3000, // Changed from 5000 to 3000
        closeButton: true,
      }}
      expand={false}
      position="bottom-center"
      hotkey={["altKey", "KeyT"]}
      {...props}
    />
  )
}

export { Toaster, toast } from "sonner"
