import { Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
        <h1 className="text-[30vw] font-black tracking-tighter text-foreground blur-sm">
          404
        </h1>
      </div>

      <div className="relative z-10 text-center space-y-6 p-8">
        <div className="space-y-2">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
            Page Not Found
          </h2>
          <p className="text-xl text-muted-foreground max-w-md mx-auto">
            Oops! The page you're looking for seems to have wandered off into
            the digital void.
          </p>
        </div>

        <div className="pt-8">
          <Link href="/">
            <button className="flex items-center gap-2 mx-auto px-6 py-3 bg-fd-primary text-fd-primary-foreground rounded-md font-medium hover:bg-fd-primary/90 transition-colors">
              <Home className="w-4 h-4" />
              Return Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
