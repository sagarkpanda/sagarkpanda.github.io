<script lang="ts">
  import Section from '$lib/Section.svelte';
  import TechIcon from '$lib/TechIcon.svelte';
  import { Activity, Boxes, Cloud, GitBranch, Layers3, ShieldCheck } from 'lucide-svelte';
  let { headingLevel = 'h2' }: { headingLevel?: 'h1' | 'h2' } = $props();
  const skillGroups = [
    { name: 'Cloud Platforms', icon: 'cloud', skills: ['AWS', 'Azure'] },
    { name: 'Containers & Orchestration', icon: 'boxes', skills: ['Kubernetes', 'Helm', 'Argo CD', 'Kustomize', 'Docker'] },
    { name: 'Monitoring & Observability', icon: 'activity', skills: ['Prometheus', 'Grafana', 'OpenTelemetry', 'New Relic'] },
    { name: 'CI/CD & Automation', icon: 'git-branch', skills: ['GitHub Actions', 'GitLab CI/CD', 'Jenkins'] },
    { name: 'Infrastructure as Code & Platforms', icon: 'layers', skills: ['Terraform', 'Ansible', 'Linux', 'Apache HTTP Server', 'NGINX'] },
    { name: 'Security & Tooling', icon: 'shield', skills: ['SonarQube', 'Trivy', 'Falco'] }
  ];
</script>
<Section command="cat about.md" title="About Me" id="about" {headingLevel}>
  <div class="about-grid">
    <div>
      <p>Senior DevOps Engineer with 6+ years of experience building cloud-native platforms and automating software delivery.</p>
      <p>My work focuses on AWS, Kubernetes, Terraform, GitOps, CI/CD, observability, and DevSecOps. I document what I build through practical tutorials and projects.</p>
      <p>I prefer infrastructure that is reproducible, deployments that are boring, and systems that are easier to operate than they were yesterday.</p>
    </div>
    <div class="stats">
      <div><strong>6+</strong><span>years experience</span></div>
      <div><strong>AWS</strong><span>cloud platform</span></div>
      <div><strong>K8s</strong><span>platform focus</span></div>
      <div><strong>IaC</strong><span>Terraform driven</span></div>
    </div>
  </div>
  <div class="about-skills">
    <div class="command">$ kubectl get skills</div>
    <h2>Skills &amp; Technologies</h2>
    <p class="section-lead">The stack I use to build, automate, secure, and operate cloud-native systems.</p>
    <div class="skill-categories">
      {#each skillGroups as group}
        <div class="skill-category">
          <div class="skill-category-head"><span class="skill-category-icon" aria-hidden="true">{#if group.icon === 'cloud'}<Cloud size={19}/>{:else if group.icon === 'boxes'}<Boxes size={19}/>{:else if group.icon === 'activity'}<Activity size={19}/>{:else if group.icon === 'git-branch'}<GitBranch size={19}/>{:else if group.icon === 'layers'}<Layers3 size={19}/>{:else}<ShieldCheck size={19}/>{/if}</span><strong>{group.name}</strong></div>
          <div class="skill-items">{#each group.skills as skill}<span class="skill-item"><TechIcon name={skill} size={17}/>{skill}</span>{/each}</div>
        </div>
      {/each}
    </div>
  </div>
</Section>
