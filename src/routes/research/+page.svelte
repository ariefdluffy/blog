<script>
    import SEO from "$lib/components/SEO.svelte";
    import {
        ArrowRight,
        FileText,
        Calendar,
        Layers,
        BookOpen,
    } from "lucide-svelte";

    let { data } = $props();

    const months = data.months;
    const digests = data.digests;
    const totalDigests = data.totalDigests;
    const totalPapers = data.totalPapers;
    const activeDays = data.activeDays;
    const latestDigests = data.latestDigests;

    function formatDate(dateStr) {
        if (!dateStr) return "";
        try {
            const d = new Date(dateStr + "T00:00:00");
            return d.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
            });
        } catch {
            return dateStr;
        }
    }

    function getStatusColor(status) {
        if (status === "full")
            return "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
        if (status === "ok")
            return "bg-primary/20 text-primary border-primary/30";
        return "bg-bg-alt dark:bg-dark-bg-alt text-text-muted dark:text-dark-text-muted border-border dark:border-dark-border";
    }

    function getStatusBadge(status, papers) {
        if (status === "full") return `${papers} papers`;
        if (status === "ok") return "Kosong";
        return "Kosong";
    }
</script>

<SEO
    title="Research Digests"
    description="Daily AI Research Digests dari arXiv & Semantic Scholar"
/>

<!-- Hero -->
<section class="mb-10">
    <div
        class="rounded-xl bg-gradient-to-br from-primary/8 via-transparent to-accent/8 border border-primary/10 dark:border-primary/20 p-6 sm:p-8"
    >
        <div class="flex items-center gap-3 mb-3">
            <div
                class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"
            >
                <span class="text-lg">🔬</span>
            </div>
            <div>
                <h1 class="text-2xl font-extrabold tracking-tight">
                    Research Digests
                </h1>
                <p class="text-xs text-text-muted dark:text-dark-text-muted">
                    Daily AI Papers
                </p>
            </div>
        </div>
        <p
            class="text-sm text-text-muted dark:text-dark-text-muted leading-relaxed max-w-xl"
        >
            Ringkasan harian paper dari arXiv, Semantic Scholar, dan Papers With
            Code.
        </p>

        <!-- Stats -->
        <div class="flex gap-2 mt-4 flex-wrap">
            <div
                class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-xs font-medium"
            >
                <FileText size={14} class="text-primary" />
                <span class="text-primary font-bold">{totalDigests}</span>
                <span class="text-text-muted dark:text-dark-text-muted"
                    >digest</span
                >
            </div>
            <div
                class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/10 text-xs font-medium"
            >
                <BookOpen size={14} class="text-accent" />
                <span class="text-accent font-bold">{totalPapers}+</span>
                <span class="text-text-muted dark:text-dark-text-muted"
                    >papers</span
                >
            </div>
            <div
                class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-xs font-medium"
            >
                <Calendar size={14} class="text-emerald-500" />
                <span class="text-emerald-500 font-bold">{activeDays}</span>
                <span class="text-text-muted dark:text-dark-text-muted"
                    >hari aktif</span
                >
            </div>
        </div>
    </div>
</section>

<!-- Latest Digests -->
<section class="mb-10">
    <div class="flex items-center justify-between mb-4">
        <h2 class="flex items-center gap-2 text-sm font-bold text-primary">
            <Layers size={16} />
            Digest Terbaru
        </h2>
        <a
            href="/research/latest-digest"
            class="text-xs text-primary hover:underline flex items-center gap-1"
        >
            Lihat semua <ArrowRight size={12} />
        </a>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {#each latestDigests as digest}
            <a
                href="/research/daily-digest/{digest.date}"
                class="group block rounded-lg border border-border dark:border-dark-border border-l-2 {digest.status ===
                'full'
                    ? 'border-l-emerald-500'
                    : 'border-l-primary'} hover:border-primary/40 hover:bg-bg-alt dark:hover:bg-dark-bg-alt transition-all overflow-hidden"
            >
                <div class="p-4">
                    <div class="flex items-start justify-between gap-3">
                        <div class="min-w-0 flex-1">
                            <h3
                                class="text-sm font-semibold group-hover:text-primary transition-colors mb-1"
                            >
                                {formatDate(digest.date)}
                            </h3>
                            <div class="flex items-center gap-2">
                                <span
                                    class="text-xs px-2 py-0.5 rounded-full {getStatusColor(
                                        digest.status,
                                    )}"
                                >
                                    {getStatusBadge(
                                        digest.status,
                                        digest.papers,
                                    )}
                                </span>
                                <span
                                    class="text-[10px] text-text-muted dark:text-dark-text-muted"
                                    >{digest.date}</span
                                >
                            </div>
                        </div>
                        <ArrowRight
                            size={14}
                            class="flex-shrink-0 text-text-muted dark:text-dark-text-muted opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all"
                        />
                    </div>
                </div>
            </a>
        {/each}
    </div>
</section>

<!-- Calendar Grid by Month -->
{#each months as month}
    <section class="mb-8">
        <div class="flex items-center justify-between mb-4">
            <h2 class="flex items-center gap-2 text-sm font-bold text-accent">
                <Calendar size={16} />
                {month.name}
            </h2>
            <span
                class="text-xs px-2.5 py-0.5 rounded-full bg-accent/10 text-accent font-medium"
            >
                {digests[month.key].length} hari
            </span>
        </div>

        <div class="grid grid-cols-7 gap-1.5">
            {#each digests[month.key] as digest}
                <a
                    href="/research/daily-digest/{digest.date}"
                    class="group flex flex-col items-center justify-center p-2 rounded-lg border text-xs transition-all duration-150 hover:scale-105 min-h-[52px] {getStatusColor(
                        digest.status,
                    )}"
                >
                    <span class="font-bold text-sm">{digest.label}</span>
                    {#if digest.status === "full"}
                        <span class="text-[10px] opacity-60"
                            >{digest.papers}p</span
                        >
                    {:else if digest.status === "ok"}
                        <span class="text-[10px] opacity-40">—</span>
                    {:else}
                        <span class="text-[10px] opacity-40">—</span>
                    {/if}
                </a>
            {/each}
        </div>
    </section>
{/each}

<!-- Footer -->
<section
    class="flex flex-wrap items-center justify-center gap-6 py-6 border-t border-border dark:border-dark-border text-xs text-text-muted dark:text-dark-text-muted"
>
    <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-primary"></span>
        <span>Sumber: arXiv, Semantic Scholar, Papers With Code</span>
    </div>
    <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-accent"></span>
        <span>Jadwal: Setiap hari 08:00 WIB</span>
    </div>
</section>
