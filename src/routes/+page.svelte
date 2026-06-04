<script>
    import {
        ChevronRight,
        ArrowRight,
        Rss,
        BookOpen,
        Code,
        FlaskConical,
        BookText,
        Database,
        Sparkles,
        FileText,
        Calendar,
    } from "lucide-svelte";
    import SEO from "$lib/components/SEO.svelte";

    let { data } = $props();

    const latestDigests = data.latestDigests;

    const latestTutorials = data.latestTutorials;

    const sections = [
        {
            label: "Research Digests",
            desc: "Ringkasan paper arXiv & Semantic Scholar setiap hari",
            href: "/research",
            count: "45 digest",
            icon: FlaskConical,
            borderL: "border-l-primary",
            iconBg: "bg-primary/10",
            iconText: "text-primary",
            hoverBorder: "hover:border-primary/40",
            hoverText: "group-hover:text-primary",
        },
        {
            label: "Teknologi & AI",
            desc: "Berita AI terkini dan artikel teknologi mendalam",
            href: "/tech",
            count: "100+ artikel",
            icon: Sparkles,
            borderL: "border-l-accent",
            iconBg: "bg-accent/10",
            iconText: "text-accent",
            hoverBorder: "hover:border-accent/40",
            hoverText: "group-hover:text-accent",
        },
        {
            label: "Tutorial",
            desc: "Panduan teknis step-by-step berdasarkan pengalaman nyata",
            href: "/tutorial",
            count: "12 tutorial",
            icon: Code,
            borderL: "border-l-emerald-500",
            iconBg: "bg-emerald-500/10",
            iconText: "text-emerald-500",
            hoverBorder: "hover:border-emerald-500/40",
            hoverText: "group-hover:text-emerald-500",
        },
        {
            label: "Jurnal",
            desc: "Catatan harian, refleksi, dan log aktivitas",
            href: "/journal",
            count: "Harian",
            icon: Calendar,
            borderL: "border-l-orange-500",
            iconBg: "bg-orange-500/10",
            iconText: "text-orange-500",
            hoverBorder: "hover:border-orange-500/40",
            hoverText: "group-hover:text-orange-500",
        },
        {
            label: "Knowledge Base",
            desc: "Tips, referensi, dan kumpulan pengetahuan",
            href: "/knowledge-base",
            count: "",
            icon: Database,
            borderL: "border-l-rose-500",
            iconBg: "bg-rose-500/10",
            iconText: "text-rose-500",
            hoverBorder: "hover:border-rose-500/40",
            hoverText: "group-hover:text-rose-500",
        },
    ];

    const stats = data.stats;

    const iconMap = {
        FlaskConical,
        FileText,
        BookOpen,
    };
</script>

<SEO
    title="Hermes Blog"
    description="Blog pribadi Miftahul Arif — AI research digests, tech tutorials, dan jurnal harian. Seluruh konten di-generate oleh AI Assistant Hermes Agent."
/>

<!-- Tailwind scanner anchors for dynamic color classes -->
<div
    class="hidden bg-orange-500/10 bg-rose-500/10 hover:border-orange-500/40 hover:border-rose-500/40 group-hover:text-orange-500 group-hover:text-rose-500"
></div>

<!-- Hero -->
<section class="mb-10">
    <div
        class="rounded-xl bg-gradient-to-br from-primary/8 via-transparent to-accent/8 border border-primary/10 dark:border-primary/20 p-6 sm:p-8"
    >
        <div class="flex items-start justify-between gap-4 mb-4">
            <div>
                <h1
                    class="text-3xl font-extrabold tracking-tight text-text dark:text-white mb-2"
                >
                    Miftahul Arif
                </h1>
                <p class="text-sm text-text-muted dark:text-dark-text-muted">
                    AI Researcher &middot; Developer &middot; Writer
                </p>
            </div>
            <a
                href="/research"
                class="flex-shrink-0 mt-1 text-xs px-3 py-1.5 rounded-full border border-border dark:border-dark-border text-text-muted dark:text-dark-text-muted hover:border-primary hover:text-primary transition-colors flex items-center gap-1.5"
            >
                <Rss size={12} />
                RSS
            </a>
        </div>
        <p
            class="text-sm text-text-muted dark:text-dark-text-muted leading-relaxed max-w-xl mb-6"
        >
            Blog pribadi berisi daily AI research digests, tech tutorials, dan
            jurnal harian. Konten di-generate otomatis setiap hari pukul 08:00
            WIB oleh Hermes Agent.
        </p>

        <!-- Stats -->
        <div class="flex flex-wrap gap-3">
            {#each stats as stat}
                <div
                    class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg/80 dark:bg-dark-bg/80 border border-border dark:border-dark-border"
                >
                    <svelte:component
                        this={iconMap[stat.icon]}
                        size={14}
                        class="text-primary"
                    />
                    <span
                        class="text-xs font-semibold text-text dark:text-white"
                        >{stat.value}</span
                    >
                    <span
                        class="text-xs text-text-muted dark:text-dark-text-muted"
                        >{stat.label}</span
                    >
                </div>
            {/each}
        </div>
    </div>
</section>

<!-- Sections Grid -->
<section class="mb-10">
    <div class="flex items-center gap-2 mb-4">
        <BookText size={16} class="text-primary" />
        <h2 class="text-sm font-bold text-primary">Navigasi</h2>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {#each sections as s}
            <a
                href={s.href}
                class="group block rounded-lg border border-border dark:border-dark-border border-l-2 {s.borderL} p-4 {s.hoverBorder} hover:bg-bg-alt dark:hover:bg-dark-bg-alt transition-all"
            >
                <div class="flex items-start gap-3 mb-2">
                    <div
                        class="w-8 h-8 rounded {s.iconBg} flex items-center justify-center flex-shrink-0"
                    >
                        <svelte:component
                            this={s.icon}
                            size={14}
                            class={s.iconText}
                        />
                    </div>
                    <div class="min-w-0 flex-1">
                        <div class="flex items-center justify-between mb-1">
                            <h3
                                class="text-sm font-bold text-text dark:text-white {s.hoverText} transition-colors"
                            >
                                {s.label}
                            </h3>
                            {#if s.count}
                                <span
                                    class="text-xs text-text-muted dark:text-dark-text-muted bg-bg-alt dark:bg-dark-bg-alt px-2 py-0.5 rounded flex-shrink-0"
                                    >{s.count}</span
                                >
                            {/if}
                        </div>
                        <p
                            class="text-xs text-text-muted dark:text-dark-text-muted leading-relaxed"
                        >
                            {s.desc}
                        </p>
                    </div>
                </div>
            </a>
        {/each}
    </div>
</section>

<!-- Latest Research -->
<section class="mb-10">
    <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
            <FlaskConical size={16} class="text-primary" />
            <h2 class="text-sm font-bold text-primary">Research Terbaru</h2>
        </div>
        <a
            href="/research"
            class="text-xs text-primary hover:underline flex items-center gap-1"
        >
            Lihat semua <ArrowRight size={12} />
        </a>
    </div>
    <div class="space-y-2">
        {#each latestDigests as d}
            <a
                href="/research/daily-digest/{d.date}"
                class="group flex items-center justify-between rounded-lg border border-border dark:border-dark-border border-l-2 border-l-accent p-3 hover:border-accent/40 hover:bg-bg-alt dark:hover:bg-dark-bg-alt transition-all"
            >
                <div class="flex items-center gap-3 min-w-0 flex-1">
                    <div
                        class="w-2 h-2 rounded-full {d.count > 0
                            ? 'bg-green-500'
                            : 'bg-text-muted dark:bg-dark-text-muted'} flex-shrink-0"
                    ></div>
                    <span
                        class="text-sm font-medium text-text dark:text-white group-hover:text-primary transition-colors"
                        >{d.label}</span
                    >
                </div>
                <div class="flex items-center gap-2 flex-shrink-0">
                    {#if d.count > 0}
                        <span
                            class="text-xs text-text-muted dark:text-dark-text-muted"
                            >{d.count} papers</span
                        >
                    {:else}
                        <span
                            class="text-xs text-text-muted dark:text-dark-text-muted italic"
                            >kosong</span
                        >
                    {/if}
                    <ChevronRight
                        size={14}
                        class="text-text-muted dark:text-dark-text-muted group-hover:text-primary transition-colors"
                    />
                </div>
            </a>
        {/each}
    </div>
</section>

<!-- Latest Tutorials -->
<section class="mb-10">
    <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
            <Code size={16} class="text-emerald-500" />
            <h2 class="text-sm font-bold text-emerald-500">Tutorial Populer</h2>
        </div>
        <a
            href="/tutorial"
            class="text-xs text-emerald-500 hover:underline flex items-center gap-1"
        >
            Lihat semua <ArrowRight size={12} />
        </a>
    </div>
    <div class="space-y-2">
        {#each latestTutorials as t, i}
            <a
                href="/tutorial/{t.slug}"
                class="group flex items-center gap-3 rounded-lg border border-border dark:border-dark-border border-l-2 border-l-emerald-500 p-3 hover:border-emerald-500/40 hover:bg-bg-alt dark:hover:bg-dark-bg-alt transition-all"
            >
                <span
                    class="text-xs text-text-muted dark:text-dark-text-muted font-mono w-6 flex-shrink-0 text-center"
                    >{String(i + 1).padStart(2, "0")}</span
                >
                <span
                    class="text-sm font-medium text-text dark:text-white group-hover:text-emerald-500 transition-colors min-w-0 flex-1"
                    >{t.label}</span
                >
                <ChevronRight
                    size={14}
                    class="text-text-muted dark:text-dark-text-muted group-hover:text-emerald-500 transition-colors flex-shrink-0"
                />
            </a>
        {/each}
    </div>
</section>
