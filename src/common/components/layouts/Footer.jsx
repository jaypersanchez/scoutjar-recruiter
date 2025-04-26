import { cn } from "@/common/lib/utils";

export default function Footer() {
  return (
    <footer
      className={cn(
        "flex items-center justify-center w-full h-10 px-10 text-center select-none"
      )}
    >
      <p className="mt-1 text-xs font-semibold leading-5 text-neutral-400">
        Copyright &copy; LooKK {new Date().getFullYear()}
      </p>
    </footer>
  );
}
