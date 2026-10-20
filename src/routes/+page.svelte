<script lang="ts">
  import type { PageData } from './$types';
  import { site } from '$lib/site';
  import About from '$lib/About.svelte';
  import Contact from '$lib/Contact.svelte';
  import Section from '$lib/Section.svelte';
  import PostCard from '$lib/PostCard.svelte';
  import ProjectCard from '$lib/ProjectCard.svelte';
  import TechIcon from '$lib/TechIcon.svelte';
  import JsonLd from '$lib/JsonLd.svelte';
  const socialIcons: Record<string, string> = { GitHub: 'GitHub', LinkedIn: 'LinkedIn', Medium: 'Medium' };
  let { data }: { data: PageData } = $props();
</script>
<svelte:head>
  <title>{site.title}</title>
  <meta name="description" content={site.description}/>
  <link rel="canonical" href="https://sagarpanda.com/"/>
  <meta property="og:title" content={site.title}/><meta property="og:description" content={site.description}/>
  <meta property="og:image" content="https://sagarpanda.com/images/og-image.png"/><meta name="twitter:card" content="summary_large_image"/>
</svelte:head>
<JsonLd data={{'@context':'https://schema.org','@graph':[{'@type':'WebSite','@id':'https://sagarpanda.com/#website','name':site.title,'url':'https://sagarpanda.com/','description':site.description,'inLanguage':'en','author':{'@id':'https://sagarpanda.com/#person'}},{'@type':'Person','@id':'https://sagarpanda.com/#person','name':site.name,'url':'https://sagarpanda.com/','image':'https://sagarpanda.com'+site.avatar,'jobTitle':site.role,'description':site.bio,'sameAs':['https://github.com/sagarkpanda','https://www.linkedin.com/in/sagarkpanda/','https://sagarpanda.medium.com/','https://bsky.app/profile/sagarpanda.com'],'knowsAbout':['AWS','Kubernetes','Terraform','GitOps','CI/CD','Observability','DevSecOps','Cloud Infrastructure']}]}}/>
<main id="main-content" class="shell home">
  <section class="hero">
    <div class="terminal-line">$ whoami</div>
    <div class="hero-grid">
      <div><div class="avatar-wrap"><img src={site.avatar} alt={site.name} width="160" height="160" loading="eager" fetchpriority="high"/></div></div>
      <div>
        <h1>{site.name}</h1><p class="hero-role">{site.role}</p>
        <p class="hero-copy">I build and operate cloud infrastructure, Kubernetes platforms, CI/CD systems, and secure delivery pipelines with AWS, Terraform, GitOps, and observability.</p>
        <div class="hero-actions"><a href="/blogs/" class="button primary">read the blogs</a><a href={'mailto:' + site.email} class="button">email</a></div>
        <div class="socials" aria-label="Social links">{#each site.social.filter(([n]) => n !== 'Email') as [name, url]}<a href={url} target={url.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" aria-label={name} title={name}><TechIcon name={socialIcons[name] ?? name} size={18}/></a>{/each}</div>
      </div>
    </div>
  </section>
  <About />
  <Section command="ls ~/projects --sort=impact" title="Projects" id="projects">
    <p class="section-lead">Hands-on infrastructure and platform projects built around Kubernetes, AWS, GitOps, observability, and DevSecOps.</p>
    <div class="project-grid">{#each data.projects as project}<ProjectCard {project}/>{/each}</div>
  </Section>
  <Section command="git log --work" title="Experience" id="experience">
    <div class="timeline">{#each site.experience as item}<div class="timeline-item"><div class="timeline-marker"></div><div><div class="timeline-head"><h3>{item.role} · <a href={item.url} target="_blank" rel="noopener noreferrer">{item.company}</a></h3><span>{item.date}</span></div><ul>{#each item.bullets as bullet}<li>{bullet}</li>{/each}</ul></div></div>{/each}</div>
  </Section>
  <Section command="cat ./education" title="Education" id="education">
    <div class="edu-grid">{#each site.education as item}<div class="terminal-card"><h3>{item.degree}</h3><a href={item.url} target="_blank" rel="noopener noreferrer">{item.school}</a><p>{item.date} · GPA {item.gpa}</p></div>{/each}</div>
  </Section>
  <Section command="tail -n 5 ~/blog" title="Latest Writing" id="blog">
    <p class="section-lead">Practical notes on DevOps, Kubernetes, AWS, CI/CD, observability, and security.</p>
    <div class="post-list">{#each data.latestPosts as post}<PostCard {post}/>{/each}</div>
    <a class="text-link" href="/blogs/">cd /blogs → all posts</a>
  </Section>
  <Contact />
  <footer class="footer"><span>$ echo "built by Sagar Panda"</span><a href="https://status.sagarpanda.com" target="_blank" rel="noopener noreferrer" class="status-link"><span class="status-tick">✓</span><span class="status-text">All Systems Operational</span></a><span>© {new Date().getFullYear()} · Svelte · Tailwind CSS</span></footer>
</main>
