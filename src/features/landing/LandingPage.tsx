import { Link, Navigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { PausedNoticeBanner } from "@/components/layout/PausedNoticeBanner";
import { AuthNav } from "@/components/layout/AuthNav";
import { Layers, BarChart3, Sparkles } from "lucide-react";

const heroFeatures = [
  {
    icon: Layers,
    title: "Topic clustering",
    description:
      "RSS, Hacker News, and GitHub content grouped into coherent themes.",
  },
  {
    icon: BarChart3,
    title: "Trends & sentiment",
    description: "Trending scores, timeseries, and sentiment at a glance.",
  },
  {
    icon: Sparkles,
    title: "AI insights & search",
    description: "Narrative summaries, anomaly alerts, and semantic search.",
  },
];

export const LandingPage = () => {
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen sm:h-screen overflow-auto sm:overflow-hidden bg-background flex flex-col">
      <div className="flex-shrink-0">
        <PausedNoticeBanner />
      </div>

      <AuthNav />

      <header className="flex-1 min-h-0 overflow-auto sm:overflow-hidden flex flex-col">
        <div className="mx-auto w-full max-w-6xl flex-1 min-h-0 flex flex-col px-4 sm:pl-6 sm:pr-8 lg:pl-8 lg:pr-14 pt-8 pb-10 sm:pt-14 sm:pb-12 lg:pt-20">
          <div className="grid flex-1 min-h-0 gap-8 sm:gap-14 lg:gap-20 grid-cols-1 lg:grid-cols-[1.4fr_1fr] lg:items-stretch">
            <div className="flex flex-col text-left min-h-0 animate-in fade-in-0 slide-in-from-left-4 duration-500">
              <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl lg:text-3xl leading-tight">
                Transform your data with
                <br />
                <span className="text-primary text-3xl font-bold sm:text-4xl lg:text-5xl xl:text-[3rem] tracking-tight">
                  InsightThreads
                </span>
              </h1>
              <p className="mt-4 sm:mt-5 text-sm text-muted-foreground max-w-xl leading-relaxed sm:text-[15px] lg:text-base">
                The intelligent platform that ingests unstructured text from
                RSS, Hacker News, and GitHub—then helps you cluster, analyze,
                and visualize insights with topic analysis, sentiment, trends,
                and AI-generated narratives.
              </p>

              <ul
                className="mt-6 sm:mt-8 space-y-5 sm:space-y-6 text-left"
                role="list"
              >
                {heroFeatures.map((item) => (
                  <li
                    key={item.title}
                    className="flex gap-4 text-left items-start"
                  >
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border-2 border-primary text-primary bg-transparent mt-0.5">
                      <item.icon
                        className="h-5 w-5"
                        aria-hidden
                        strokeWidth={2}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-foreground text-base">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 leading-snug">
                        {item.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6 sm:mt-8 flex flex-wrap gap-3 sm:gap-4 justify-start">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center min-h-[44px] rounded-lg bg-primary px-5 py-3 sm:px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 shadow-sm"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center min-h-[44px] rounded-lg border border-border bg-background px-5 py-3 sm:px-6 text-sm font-medium text-foreground hover:bg-accent active:scale-[0.98] transition-all duration-200"
                >
                  Sign In
                </Link>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center min-h-0 w-full animate-in fade-in-0 slide-in-from-right-4 duration-500">
              <div className="relative w-full max-w-[240px] sm:max-w-[260px] lg:max-w-[260px] flex flex-col items-center">
                <div className="relative w-full aspect-square rounded-2xl bg-gradient-to-br from-primary/20 via-primary/8 to-primary/5 border border-primary/20 flex items-center justify-center overflow-hidden shadow min-h-[180px] max-h-[min(40vh,280px)] sm:min-h-[220px] sm:max-h-[min(48vh,360px)]">
                  <svg
                    viewBox="0 0 200 200"
                    className="h-[85%] w-[85%] text-primary"
                    aria-hidden
                    fill="none"
                  >
                    <defs>
                      <linearGradient
                        id="heroCluster"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          stopColor="currentColor"
                          stopOpacity="0.35"
                        />
                        <stop
                          offset="100%"
                          stopColor="currentColor"
                          stopOpacity="0.08"
                        />
                      </linearGradient>
                      <linearGradient
                        id="heroGlow"
                        x1="50%"
                        y1="0%"
                        x2="50%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          stopColor="currentColor"
                          stopOpacity="0.15"
                        />
                        <stop
                          offset="100%"
                          stopColor="currentColor"
                          stopOpacity="0"
                        />
                      </linearGradient>
                      <filter
                        id="heroSoft"
                        x="-20%"
                        y="-20%"
                        width="140%"
                        height="140%"
                      >
                        <feGaussianBlur
                          in="SourceGraphic"
                          stdDeviation="1"
                          result="blur"
                        />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <ellipse
                      cx="100"
                      cy="95"
                      rx="55"
                      ry="50"
                      fill="url(#heroGlow)"
                    />
                    <rect
                      x="35"
                      y="155"
                      width="18"
                      height="22"
                      rx="3"
                      fill="currentColor"
                      fillOpacity="0.2"
                    />
                    <rect
                      x="91"
                      y="158"
                      width="18"
                      height="19"
                      rx="3"
                      fill="currentColor"
                      fillOpacity="0.25"
                    />
                    <rect
                      x="147"
                      y="156"
                      width="18"
                      height="21"
                      rx="3"
                      fill="currentColor"
                      fillOpacity="0.2"
                    />
                    <path
                      d="M 44 155 Q 44 110 68 88"
                      stroke="currentColor"
                      strokeOpacity="0.2"
                      strokeWidth="1.2"
                      fill="none"
                    />
                    <path
                      d="M 100 158 Q 100 115 100 92"
                      stroke="currentColor"
                      strokeOpacity="0.2"
                      strokeWidth="1.2"
                      fill="none"
                    />
                    <path
                      d="M 156 156 Q 156 110 132 88"
                      stroke="currentColor"
                      strokeOpacity="0.2"
                      strokeWidth="1.2"
                      fill="none"
                    />
                    <g filter="url(#heroSoft)">
                      <circle
                        cx="72"
                        cy="82"
                        r="14"
                        fill="url(#heroCluster)"
                        stroke="currentColor"
                        strokeOpacity="0.25"
                        strokeWidth="0.8"
                      />
                      <circle
                        cx="128"
                        cy="78"
                        r="14"
                        fill="url(#heroCluster)"
                        stroke="currentColor"
                        strokeOpacity="0.25"
                        strokeWidth="0.8"
                      />
                      <circle
                        cx="100"
                        cy="105"
                        r="16"
                        fill="url(#heroCluster)"
                        stroke="currentColor"
                        strokeOpacity="0.3"
                        strokeWidth="0.8"
                      />
                      <circle
                        cx="85"
                        cy="115"
                        r="10"
                        fill="currentColor"
                        fillOpacity="0.2"
                        stroke="currentColor"
                        strokeOpacity="0.2"
                        strokeWidth="0.6"
                      />
                      <circle
                        cx="115"
                        cy="112"
                        r="10"
                        fill="currentColor"
                        fillOpacity="0.2"
                        stroke="currentColor"
                        strokeOpacity="0.2"
                        strokeWidth="0.6"
                      />
                      <line
                        x1="72"
                        y1="82"
                        x2="100"
                        y2="105"
                        stroke="currentColor"
                        strokeOpacity="0.2"
                        strokeWidth="0.8"
                      />
                      <line
                        x1="128"
                        y1="78"
                        x2="100"
                        y2="105"
                        stroke="currentColor"
                        strokeOpacity="0.2"
                        strokeWidth="0.8"
                      />
                      <line
                        x1="85"
                        y1="115"
                        x2="100"
                        y2="105"
                        stroke="currentColor"
                        strokeOpacity="0.18"
                        strokeWidth="0.6"
                      />
                      <line
                        x1="115"
                        y1="112"
                        x2="100"
                        y2="105"
                        stroke="currentColor"
                        strokeOpacity="0.18"
                        strokeWidth="0.6"
                      />
                    </g>
                    <path
                      d="M 125 55 L 145 45 L 165 38 L 178 28"
                      stroke="currentColor"
                      strokeOpacity="0.35"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="178"
                      cy="28"
                      r="5"
                      fill="currentColor"
                      fillOpacity="0.4"
                    />
                    <path
                      d="M 100 42 L 102 48 L 108 48 L 103 52 L 105 58 L 100 54 L 95 58 L 97 52 L 92 48 L 98 48 Z"
                      fill="currentColor"
                      fillOpacity="0.45"
                    />
                  </svg>
                </div>
                <div className="mt-5 w-full rounded-xl border border-border bg-card p-4 shadow flex-shrink-0">
                  <div className="space-y-2.5">
                    {[90, 65, 45].map((w, i) => (
                      <div
                        key={i}
                        className={`h-2.5 rounded ${i === 0 ? "bg-primary/30" : "bg-primary/15"}`}
                        style={{ width: `${w}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};
