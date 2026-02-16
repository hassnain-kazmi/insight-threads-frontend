import { Link } from "react-router-dom";

export const AuthNav = () => (
  <nav className="flex-shrink-0 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 w-full">
    <div className="flex h-14 sm:h-16 w-full items-center justify-between px-4 sm:px-8 lg:px-14 gap-4">
      <Link
        to="/"
        className="flex items-center gap-2 sm:gap-2.5 min-h-[44px] items-center"
      >
        <img
          src="/favicon.svg"
          alt=""
          className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg"
        />
        <span className="font-semibold text-foreground text-base sm:text-lg tracking-tight truncate">
          InsightThreads
        </span>
      </Link>
      <div className="flex items-center gap-3 sm:gap-6 shrink-0">
        <Link
          to="/login"
          className="min-h-[44px] min-w-[44px] sm:min-w-0 inline-flex items-center justify-center text-sm font-medium text-muted-foreground hover:text-foreground py-2 px-2 sm:px-0 transition-colors"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="inline-flex items-center justify-center min-h-[44px] rounded-lg bg-primary px-4 py-2.5 sm:px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 shadow-sm"
        >
          Register
        </Link>
      </div>
    </div>
  </nav>
);
