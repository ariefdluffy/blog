<script>
  import SEO from '$lib/components/SEO.svelte';
  import { Mail, Globe, ExternalLink, MapPin, Code, Cpu, Server, Zap, Briefcase, Heart } from 'lucide-svelte';

  const interests = [
    { icon: '🤖', label: 'Artificial Intelligence', desc: 'Machine Learning, Deep Learning, Large Language Models' },
    { icon: '⚙️', label: 'Otomatisasi', desc: 'Membangun sistem yang berjalan mandiri' },
    { icon: '🌐', label: 'Web Development', desc: 'Aplikasi web modern' },
    { icon: '🖥️', label: 'Server Administration', desc: 'Mengelola server dan infrastruktur' },
    { icon: '🔄', label: 'DevOps', desc: 'CI/CD, backup automation, server management' },
    { icon: '🔗', label: 'Data Integration', desc: 'API integration, webhook systems' },
  ];

  const projects = [
    { name: 'Hermes Agent', desc: 'Sistem AI agent berbasis command-line yang dapat diperluas dengan berbagai skill dan tool.' },
    { name: 'Blog Otomatis', desc: 'Blog ini menggunakan sistem otomatis untuk menghasilkan konten riset harian dan artikel teknologi.' },
  ];

  const techStack = [
    { category: 'AI/ML', items: ['Python', 'PyTorch', 'Transformers'], icon: Cpu },
    { category: 'AI Agents', items: ['Hermes Agent', 'Claude Code'], icon: Zap },
    { category: 'Web', items: ['SvelteKit', 'Tailwind CSS', 'MDSvex'], icon: Globe },
    { category: 'Backend', items: ['Node.js', 'Python'], icon: Server },
    { category: 'Automation', items: ['Cron', 'Webhooks'], icon: Code },
    { category: 'Server', items: ['Ubuntu', 'Proxmox', 'PM2', 'Docker'], icon: Server },
    { category: 'Cloud', items: ['Google Drive', 'rclone'], icon: Globe },
    { category: 'Data', items: ['Google Sheets', 'SQLite', 'REST APIs'], icon: Code },
  ];

  const contacts = [
    { icon: Mail, label: 'Email', value: 'areftheluffy@gmail.com', href: 'mailto:areftheluffy@gmail.com' },
    { icon: Globe, label: 'Website', value: 'lockbit.my.id', href: 'https://lockbit.my.id' },
    { icon: Globe, label: 'Blog', value: 'blog.lockbit.my.id', href: 'https://blog.lockbit.my.id' },
    { icon: ExternalLink, label: 'GitHub', value: '@ariefdluffy', href: 'https://github.com/ariefdluffy' },
    { icon: MapPin, label: 'Lokasi', value: '🇮🇩 Indonesia (WITA — UTC+9)', href: null },
  ];
</script>

<SEO title="Tentang & Kontak" description="Profil dan kontak Miftahul Arif" />

<!-- Hero -->
<section class="mb-10">
  <div class="rounded-xl bg-gradient-to-br from-primary/8 via-transparent to-accent/8 border border-primary/10 dark:border-primary/20 p-6 sm:p-8">
    <div class="flex items-center gap-3 mb-3">
      <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <span class="text-lg">👋</span>
      </div>
      <div>
        <h1 class="text-2xl font-extrabold tracking-tight">Tentang Saya</h1>
        <p class="text-xs text-text-muted dark:text-dark-text-muted">Miftahul Arif</p>
      </div>
    </div>
    <p class="text-sm text-text-muted dark:text-dark-text-muted leading-relaxed max-w-xl">
      Halo! Saya <strong class="text-text dark:text-dark-text">Miftahul Arif</strong> — penggiat teknologi yang tertarik dengan dunia AI, pemrograman, dan otomatisasi. Blog ini tempat berbagi pengetahuan dan mendokumentasikan perjalanan belajar.
    </p>
  </div>
</section>

<!-- Interests -->
<section class="mb-10">
  <div class="flex items-center gap-2 mb-4">
    <Heart size={16} class="text-primary" />
    <h2 class="text-sm font-bold text-primary">Minat</h2>
  </div>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
    {#each interests as interest}
      <div class="rounded-lg border border-border dark:border-dark-border border-l-2 border-l-primary p-4 hover:border-primary/40 hover:bg-bg-alt dark:hover:bg-dark-bg-alt transition-all">
        <div class="flex items-start gap-3">
          <span class="text-2xl flex-shrink-0">{interest.icon}</span>
          <div class="min-w-0 flex-1">
            <h3 class="text-sm font-semibold text-text dark:text-white mb-1">{interest.label}</h3>
            <p class="text-xs text-text-muted dark:text-dark-text-muted leading-relaxed">{interest.desc}</p>
          </div>
        </div>
      </div>
    {/each}
  </div>
</section>

<!-- Projects -->
<section class="mb-10">
  <div class="flex items-center gap-2 mb-4">
    <Briefcase size={16} class="text-accent" />
    <h2 class="text-sm font-bold text-accent">Proyek</h2>
  </div>
  <div class="space-y-3">
    {#each projects as project}
      <div class="rounded-lg border border-border dark:border-dark-border border-l-2 border-l-accent p-4 hover:border-accent/40 hover:bg-bg-alt dark:hover:bg-dark-bg-alt transition-all">
        <h3 class="text-sm font-bold text-text dark:text-white mb-1.5">{project.name}</h3>
        <p class="text-xs text-text-muted dark:text-dark-text-muted leading-relaxed">{project.desc}</p>
      </div>
    {/each}
  </div>
</section>

<!-- Tech Stack -->
<section class="mb-10">
  <div class="flex items-center gap-2 mb-4">
    <Code size={16} class="text-emerald-500" />
    <h2 class="text-sm font-bold text-emerald-500">Teknologi</h2>
  </div>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
    {#each techStack as tech}
      <div class="rounded-lg border border-border dark:border-dark-border p-4 hover:border-emerald-500/40 hover:bg-bg-alt dark:hover:bg-dark-bg-alt transition-all">
        <div class="flex items-center gap-2 mb-2">
          <svelte:component this={tech.icon} size={14} class="text-emerald-500" />
          <h3 class="text-sm font-semibold text-text dark:text-white">{tech.category}</h3>
        </div>
        <div class="flex flex-wrap gap-1.5">
          {#each tech.items as item}
            <span class="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              {item}
            </span>
          {/each}
        </div>
      </div>
    {/each}
  </div>
</section>

<!-- Contact -->
<section class="mb-10">
  <div class="flex items-center gap-2 mb-4">
    <Mail size={16} class="text-primary" />
    <h2 class="text-sm font-bold text-primary">Kontak</h2>
  </div>
  <div class="space-y-2">
    {#each contacts as contact}
      {#if contact.href}
        <a href={contact.href} target="_blank" rel="noopener noreferrer"
           class="group flex items-center gap-3 rounded-lg border border-border dark:border-dark-border p-3 hover:border-primary/40 hover:bg-bg-alt dark:hover:bg-dark-bg-alt transition-all">
          <div class="w-8 h-8 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
            <svelte:component this={contact.icon} size={14} class="text-primary" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-xs text-text-muted dark:text-dark-text-muted">{contact.label}</p>
            <p class="text-sm font-medium text-text dark:text-white group-hover:text-primary transition-colors truncate">
              {contact.value}
            </p>
          </div>
        </a>
      {:else}
        <div class="flex items-center gap-3 rounded-lg border border-border dark:border-dark-border p-3">
          <div class="w-8 h-8 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
            <svelte:component this={contact.icon} size={14} class="text-primary" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-xs text-text-muted dark:text-dark-text-muted">{contact.label}</p>
            <p class="text-sm font-medium text-text dark:text-white truncate">{contact.value}</p>
          </div>
        </div>
      {/if}
    {/each}
  </div>
</section>
