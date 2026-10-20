<script lang="ts">
  import About from '$lib/About.svelte';
  import JsonLd from '$lib/JsonLd.svelte';
</script>
<svelte:head>
  <title>About | Sagar Panda</title>
  <meta name="description" content="About Sagar Panda, a DevOps and Cloud Infrastructure Engineer specializing in AWS, Kubernetes, Terraform, CI/CD, GitOps, observability, and DevSecOps."/>
  <link rel="canonical" href="https://sagarpanda.com/about/"/>
  <meta property="og:title" content="About | Sagar Panda"/><meta property="og:description" content="About Sagar Panda, a DevOps and Cloud Infrastructure Engineer specializing in AWS, Kubernetes, Terraform, CI/CD, GitOps, observability, and DevSecOps."/>
  <meta property="og:type" content="profile"/><meta property="og:image" content="https://sagarpanda.com/images/og-image.png"/><meta name="twitter:card" content="summary_large_image"/>
</svelte:head>
<JsonLd data={{'@context':'https://schema.org','@graph':[{'@type':'ProfilePage','@id':'https://sagarpanda.com/about/#profilepage','url':'https://sagarpanda.com/about/','name':'About | Sagar Panda','mainEntity':{'@id':'https://sagarpanda.com/#person'}},{'@type':'BreadcrumbList','@id':'https://sagarpanda.com/about/#breadcrumb','itemListElement':[{'@type':'ListItem','position':1,'name':'Home','item':'https://sagarpanda.com/'},{'@type':'ListItem','position':2,'name':'About','item':'https://sagarpanda.com/about/'}]}]}}/>
<main id="main-content" class="shell"><About headingLevel="h1"/></main>
