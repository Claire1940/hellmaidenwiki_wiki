"use client";

import { useState, Suspense, lazy } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  ClipboardCheck,
  Clock,
  Eye,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
// import { SidebarAd } from "@/components/ads/SidebarAd";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";
import type { ModuleLinkMap } from "@/lib/buildModuleLinkMap";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

// Conditionally render text as a link or plain span
function LinkedTitle({
  linkData,
  children,
  className,
  locale,
}: {
  linkData: { url: string; title: string } | null | undefined;
  children: React.ReactNode;
  className?: string;
  locale: string;
}) {
  if (linkData) {
    const href = locale === "en" ? linkData.url : `/${locale}${linkData.url}`;
    return (
      <Link
        href={href}
        className={`${className || ""} hover:text-[hsl(var(--nav-theme-light))] hover:underline decoration-[hsl(var(--nav-theme-light))/0.4] underline-offset-4 transition-colors`}
        title={linkData.title}
      >
        {children}
      </Link>
    );
  }
  return <>{children}</>;
}

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  moduleLinkMap: ModuleLinkMap;
  locale: string;
}

export default function HomePageClient({
  latestArticles,
  moduleLinkMap,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://hellmaidenwiki.wiki";

  // Bosses accordion state
  const [encountersExpanded, setEncountersExpanded] = useState<number | null>(
    0,
  );

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Hell Maiden Wiki",
        description:
          "Hell Maiden Wiki covering builds, Spirit Cards, characters, bosses, Circles, achievements, roadmap updates, and Steam Early Access details.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 620,
          caption: "Hell Maiden - Gothic Horde Survival Deckbuilder",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Hell Maiden Wiki",
        alternateName: "Hell Maiden",
        url: siteUrl,
        description:
          "Hell Maiden Wiki resource hub for builds, Spirit Cards, Poets of Limbo, bosses, Circles of Hell, achievements, and Early Access updates",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 620,
          caption: "Hell Maiden Wiki - Gothic Horde Survival Deckbuilder",
        },
        sameAs: [
          "https://store.steampowered.com/app/3372060/Hell_Maiden/",
          "https://steamcommunity.com/app/3372060",
          "https://www.youtube.com/@astralshiftpro",
          "https://x.com/hellmaidengame",
        ],
      },
      {
        "@type": "VideoGame",
        name: "Hell Maiden",
        gamePlatform: ["PC", "Steam"],
        applicationCategory: "Game",
        genre: ["Action", "Roguelike", "Deckbuilder", "Horde Survival"],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 1,
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: "https://store.steampowered.com/app/3372060/Hell_Maiden/",
        },
      },
      {
        "@type": "VideoObject",
        name: "Hell Maiden | Gameplay Trailer",
        description:
          "Official Hell Maiden gameplay trailer showcasing the deckbuilding horde survival action across the Circles of Hell.",
        uploadDate: "2026-07-16",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/90EaQ4buCC8",
        url: "https://www.youtube.com/watch?v=90EaQ4buCC8",
      },
    ],
  };

  const mobileBannerAd = getPreferredMobileBannerSelection();

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 左侧广告容器 - Fixed 定位（social bar 已弃用，保持禁用） */}
      {/* <aside
        className="hidden xl:block fixed top-20 w-40 z-10"
        style={{ left: "calc((100vw - 896px) / 2 - 180px)" }}
      >
        <SidebarAd
          type="sidebar-160x300"
          adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X300}
        />
      </aside> */}

      {/* 右侧广告容器 - Fixed 定位（social bar 已弃用，保持禁用） */}
      {/* <aside
        className="hidden xl:block fixed top-20 w-40 z-10"
        style={{ right: "calc((100vw - 896px) / 2 - 180px)" }}
      >
        <SidebarAd
          type="sidebar-160x600"
          adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X600}
        />
      </aside> */}

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("beginner-guide")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://store.steampowered.com/app/3372060/Hell_Maiden/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnSteamCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section - 紧跟 Hero，进入视口自动播放 */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="90EaQ4buCC8"
              title="Hell Maiden | Gameplay Trailer"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 8 Navigation Cards (模块导航，位于 Video 之后、Latest Updates 之前) */}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {t.tools.cards.map((card: any, index: number) => {
              // 映射卡片索引到 8 个模块的 section ID
              const sectionIds = [
                "beginner-guide",
                "best-builds-spirit-cards",
                "limbo-lust-walkthrough",
                "poets-character-unlocks",
                "bosses-elite-enemies",
                "progression-resources",
                "achievements-guide",
                "early-access-roadmap",
              ];
              const sectionId = sectionIds[index];

              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Latest Updates Section */}
      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={12}
      />

      {/* Module 1: Hell Maiden Beginner Guide */}
      <section id="beginner-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 mb-3 md:mb-4 text-[hsl(var(--nav-theme-light))]">
              <BookOpen className="w-6 h-6" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Getting Started
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              <LinkedTitle
                linkData={moduleLinkMap["hellMaidenBeginnerGuide"]}
                locale={locale}
              >
                {t.modules.hellMaidenBeginnerGuide.title}
              </LinkedTitle>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.hellMaidenBeginnerGuide.intro}
            </p>
          </div>

          {/* Steps */}
          <div className="scroll-reveal space-y-3 md:space-y-4 mb-8 md:mb-10">
            {t.modules.hellMaidenBeginnerGuide.steps.map(
              (step: any, index: number) => (
                <div
                  key={index}
                  className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                    <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground mb-2">
                      {step.description}
                    </p>
                    <p className="text-xs md:text-sm text-[hsl(var(--nav-theme-light))] font-medium">
                      {step.priority}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>

          {/* Quick Tips */}
          <div className="scroll-reveal p-4 md:p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <BookOpen className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold text-base md:text-lg">Quick Tips</h3>
            </div>
            <ul className="space-y-2">
              {t.modules.hellMaidenBeginnerGuide.quickTips.map(
                (tip: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground text-sm">{tip}</span>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* 广告位 4: 第一模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 2: Hell Maiden Best Builds and Spirit Cards */}
      <section
        id="best-builds-spirit-cards"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 mb-3 md:mb-4 text-[hsl(var(--nav-theme-light))]">
              <Sparkles className="w-6 h-6" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Build Crafting
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              <LinkedTitle
                linkData={moduleLinkMap["hellMaidenBestBuilds"]}
                locale={locale}
              >
                {t.modules.hellMaidenBestBuilds.title}
              </LinkedTitle>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.hellMaidenBestBuilds.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {t.modules.hellMaidenBestBuilds.builds.map((build: any, index: number) => (
              <div
                key={index}
                className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <h3 className="text-lg md:text-xl font-bold mb-2 text-[hsl(var(--nav-theme-light))]">
                  {build.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">{build.bestFor}</p>

                <div className="space-y-2.5 text-sm">
                  {build.owners?.length > 0 && (
                    <div className="flex items-start gap-2">
                      <span className="font-semibold min-w-[90px] text-foreground">Owners:</span>
                      <span className="text-muted-foreground">{build.owners.join(", ")}</span>
                    </div>
                  )}
                  {build.featuredWeapons?.length > 0 && (
                    <div className="flex items-start gap-2">
                      <span className="font-semibold min-w-[90px] text-foreground">Weapons:</span>
                      <span className="text-muted-foreground">{build.featuredWeapons.join(", ")}</span>
                    </div>
                  )}
                  {build.modPriorities?.length > 0 && (
                    <div className="flex flex-wrap items-start gap-2">
                      <span className="font-semibold min-w-[90px] text-foreground">Mods:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {build.modPriorities.map((m: string, i: number) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-xs"
                          >
                            <Check className="w-3 h-3" />
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <p className="text-muted-foreground pt-1">
                    <span className="font-semibold text-foreground">Positioning: </span>
                    {build.positioning}
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">Build Plan: </span>
                    {build.buildPlan}
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">Spell Use: </span>
                    {build.spellUsage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 3: Hell Maiden Limbo and Lust Walkthrough */}
      <section id="limbo-lust-walkthrough" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 mb-3 md:mb-4 text-[hsl(var(--nav-theme-light))]">
              <Eye className="w-6 h-6" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Circle Walkthroughs
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              <LinkedTitle
                linkData={moduleLinkMap["hellMaidenWalkthrough"]}
                locale={locale}
              >
                {t.modules.hellMaidenWalkthrough.title}
              </LinkedTitle>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.hellMaidenWalkthrough.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-4 md:space-y-6">
            {t.modules.hellMaidenWalkthrough.stages.map((stage: any, index: number) => (
              <div
                key={index}
                className="p-5 md:p-7 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[hsl(var(--nav-theme)/0.2)] border border-[hsl(var(--nav-theme)/0.5)] text-sm font-bold text-[hsl(var(--nav-theme-light))]">
                    {index + 1}
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold">{stage.title}</h3>
                  {stage.runLength && (
                    <span className="ml-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-xs md:text-sm">
                      <Clock className="w-3.5 h-3.5" />
                      {stage.runLength}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {stage.rescueTargets?.length > 0 && (
                    <div className="text-sm">
                      <span className="font-semibold text-foreground">Rescue Targets: </span>
                      <span className="text-muted-foreground">{stage.rescueTargets.join(", ")}</span>
                    </div>
                  )}
                  {stage.bosses?.length > 0 && (
                    <div className="text-sm">
                      <span className="font-semibold text-foreground">Bosses: </span>
                      <span className="text-muted-foreground">{stage.bosses.join(", ")}</span>
                    </div>
                  )}
                </div>

                {stage.featuredThreats?.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 mb-4">
                    <AlertTriangle className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
                    {stage.featuredThreats.map((threat: string, i: number) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-xs"
                      >
                        {threat}
                      </span>
                    ))}
                  </div>
                )}

                {stage.objectives?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-sm mb-2">Objectives</h4>
                    <ul className="space-y-1.5">
                      {stage.objectives.map((obj: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                          {obj}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {stage.requirements?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-sm mb-2">Requirements</h4>
                    <ul className="space-y-1.5">
                      {stage.requirements.map((req: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-2 text-sm border-t border-border pt-3 mt-2">
                  {stage.preparation && (
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">Preparation: </span>
                      {stage.preparation}
                    </p>
                  )}
                  {stage.recommendedSetup && (
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">Recommended Setup: </span>
                      {stage.recommendedSetup}
                    </p>
                  )}
                  {stage.recommendedGoal && (
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">Recommended Goal: </span>
                      {stage.recommendedGoal}
                    </p>
                  )}
                  {stage.bossTips && (
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">Boss Tips: </span>
                      {stage.bossTips}
                    </p>
                  )}
                  {stage.rewards && (
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-[hsl(var(--nav-theme-light))]">Rewards: </span>
                      {stage.rewards}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 5: 模块间阅读停顿 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 4: Hell Maiden Poets of Limbo and Character Unlocks */}
      <section
        id="poets-character-unlocks"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 mb-3 md:mb-4 text-[hsl(var(--nav-theme-light))]">
              <Users className="w-6 h-6" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Characters and Unlocks
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              <LinkedTitle
                linkData={moduleLinkMap["hellMaidenCharacters"]}
                locale={locale}
              >
                {t.modules.hellMaidenCharacters.title}
              </LinkedTitle>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.hellMaidenCharacters.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {t.modules.hellMaidenCharacters.characters.map((char: any, index: number) => (
              <div
                key={index}
                className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <h3 className="text-lg font-bold mb-1 text-[hsl(var(--nav-theme-light))]">
                  {char.name}
                </h3>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                  {char.role}
                </p>
                <p className="text-sm text-muted-foreground mb-3">{char.story}</p>

                <div className="space-y-1.5 text-sm border-t border-border pt-3">
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">Unlock: </span>
                    {char.unlock}
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">Signature Weapon: </span>
                    {char.signatureWeapon}
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">Spell: </span>
                    {char.spell}
                  </p>
                  {char.rewards?.length > 0 && (
                    <div>
                      <span className="font-semibold text-foreground">Rewards:</span>
                      <ul className="mt-1 space-y-1">
                        {char.rewards.map((r: string, i: number) => (
                          <li key={i} className="flex items-start gap-1.5 text-muted-foreground">
                            <Check className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 5: Hell Maiden Bosses and Elite Enemies */}
      <section
        id="bosses-elite-enemies"
        className="scroll-mt-24 px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 mb-3 md:mb-4 text-[hsl(var(--nav-theme-light))]">
              <AlertTriangle className="w-6 h-6" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Bosses and Enemies
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              <LinkedTitle
                linkData={moduleLinkMap["hellMaidenBosses"]}
                locale={locale}
              >
                {t.modules.hellMaidenBosses.title}
              </LinkedTitle>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.hellMaidenBosses.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-3">
            {t.modules.hellMaidenBosses.encounters.map(
              (encounter: any, index: number) => {
                const isOpen = encountersExpanded === index;
                return (
                  <div
                    key={index}
                    className="bg-white/5 border border-border rounded-xl overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setEncountersExpanded(isOpen ? null : index)}
                      className="w-full flex items-center gap-3 p-4 md:p-5 text-left hover:bg-white/5 transition-colors"
                    >
                      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.15)]">
                        <AlertTriangle className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base md:text-lg font-bold">{encounter.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {encounter.circle} · {encounter.encounterType}
                        </p>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 md:px-5 pb-5 space-y-2.5 text-sm border-t border-border pt-4">
                        <p className="text-muted-foreground">
                          <span className="font-semibold text-foreground">Attack Pattern: </span>
                          {encounter.attackPattern}
                        </p>
                        <p className="text-muted-foreground">
                          <span className="font-semibold text-foreground">Recommended Counter: </span>
                          {encounter.recommendedCounter}
                        </p>
                        <p className="text-muted-foreground">
                          <span className="font-semibold text-foreground">Preparation: </span>
                          {encounter.preparation}
                        </p>
                        <p className="text-muted-foreground">
                          <span className="font-semibold text-[hsl(var(--nav-theme-light))]">Victory Reward: </span>
                          {encounter.victoryReward}
                        </p>
                      </div>
                    )}
                  </div>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* 广告位 6: 模块间阅读停顿 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 6: Hell Maiden Progression and Resources */}
      <section
        id="progression-resources"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 mb-3 md:mb-4 text-[hsl(var(--nav-theme-light))]">
              <TrendingUp className="w-6 h-6" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Progression Systems
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              <LinkedTitle
                linkData={moduleLinkMap["hellMaidenProgression"]}
                locale={locale}
              >
                {t.modules.hellMaidenProgression.title}
              </LinkedTitle>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.hellMaidenProgression.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-3">
            {t.modules.hellMaidenProgression.rows.map((row: any, index: number) => (
              <div
                key={index}
                className="p-4 md:p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="text-base md:text-lg font-bold text-[hsl(var(--nav-theme-light))]">
                    {row.system}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-xs">
                    {row.where}
                  </span>
                  <span className="ml-auto text-xs text-muted-foreground font-medium">
                    {row.priority}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{row.howItWorks}</p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Milestone: </span>
                  {row.milestone}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 7: All 72 Hell Maiden Achievements */}
      <section
        id="achievements-guide"
        className="scroll-mt-24 px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 mb-3 md:mb-4 text-[hsl(var(--nav-theme-light))]">
              <ClipboardCheck className="w-6 h-6" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Achievement Checklist
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              <LinkedTitle
                linkData={moduleLinkMap["hellMaidenAchievements"]}
                locale={locale}
              >
                {t.modules.hellMaidenAchievements.title}
              </LinkedTitle>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.hellMaidenAchievements.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-5">
            {t.modules.hellMaidenAchievements.groups.map((group: any, gIndex: number) => (
              <div
                key={gIndex}
                className="p-4 md:p-6 bg-white/5 border border-border rounded-xl"
              >
                <h3 className="text-base md:text-lg font-bold mb-3 text-[hsl(var(--nav-theme-light))]">
                  {group.name}
                </h3>
                <ul className="space-y-2">
                  {group.achievements.map((ach: any, aIndex: number) => (
                    <li
                      key={aIndex}
                      className={`flex items-start gap-2.5 p-2.5 rounded-lg ${ach.featured ? "bg-[hsl(var(--nav-theme)/0.08)] border border-[hsl(var(--nav-theme)/0.25)]" : ""}`}
                    >
                      <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <span className="font-semibold text-foreground">{ach.name}</span>
                        {ach.featured && (
                          <Star className="inline-block w-3.5 h-3.5 ml-1.5 mb-0.5 text-[hsl(var(--nav-theme-light))]" fill="currentColor" />
                        )}
                        <span className="text-muted-foreground"> — {ach.requirement}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 7: 模块间阅读停顿 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 8: Hell Maiden Early Access Roadmap and Updates */}
      <section
        id="early-access-roadmap"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 mb-3 md:mb-4 text-[hsl(var(--nav-theme-light))]">
              <Clock className="w-6 h-6" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Roadmap and Updates
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              <LinkedTitle
                linkData={moduleLinkMap["hellMaidenRoadmap"]}
                locale={locale}
              >
                {t.modules.hellMaidenRoadmap.title}
              </LinkedTitle>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.hellMaidenRoadmap.intro}
            </p>
          </div>

          <div className="scroll-reveal relative pl-6 md:pl-8 border-l-2 border-[hsl(var(--nav-theme)/0.3)] space-y-5 md:space-y-6">
            {t.modules.hellMaidenRoadmap.entries.map((entry: any, index: number) => (
              <div key={index} className="relative">
                <span className="absolute -left-[31px] md:-left-[41px] top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[hsl(var(--nav-theme))] border-2 border-background">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                </span>
                <div className="p-4 md:p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-sm font-bold text-[hsl(var(--nav-theme-light))]">
                      {entry.date}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-xs font-medium">
                      {entry.status}
                    </span>
                  </div>
                  <h3 className="text-base md:text-lg font-bold mb-1.5">{entry.headline}</h3>
                  <p className="text-sm text-muted-foreground">{entry.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner before Footer */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://discord.gg/Hn5dkbAZR5"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/hellmaidengame"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.twitter}
                  </a>
                </li>
                <li>
                  <a
                    href="https://steamcommunity.com/app/3372060"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamCommunity}
                  </a>
                </li>
                <li>
                  <a
                    href="https://store.steampowered.com/app/3372060/Hell_Maiden/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamStore}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
