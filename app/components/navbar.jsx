import { ModeToggle } from "./toggleTheme";
import { Badge } from "@/components/ui/badge"
export function Navbar() {
  return (
    <div className="flex flex-row justify-around py-4 w-full">
      <Badge variant="outline"><p className="flex self-center text-2xl font-bold text-[#ef4444]">Airavat</p></Badge>
      <div className="flex flex-row gap-6">
        <ModeToggle />
      </div>
    </div>
  );
}