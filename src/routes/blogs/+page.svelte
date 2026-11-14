<script lang="ts">
  import type { PageData } from './$types';
  import PostCard from '$lib/PostCard.svelte';
  import BlogPagination from '$lib/BlogPagination.svelte';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Blogs | Sagar Panda</title>
  <meta name="description" content="Technical notes and hands-on guides covering DevOps, AWS, Kubernetes, Terraform, CI/CD, observability, and security." />
  <link rel="canonical" href="https://sagarpanda.com/blogs/" />
  <meta property="og:title" content="Blogs | Sagar Panda" />
  <meta property="og:image" content="https://sagarpanda.com/images/og-image.png" />
</svelte:head>

<main id="main-content" class="shell page-shell">
  <section class="section">
    <div class="command">$ cd /blogs && ls -lt</div>

    <h1>Writing</h1>

    <p class="section-lead">
      Technical notes and hands-on guides covering DevOps, AWS, Kubernetes, Terraform, CI/CD,
      observability, and security.
    </p>

    <div class="post-list">
      {#each data.posts as post (post.route)}
        <PostCard {post} />
      {/each}
    </div>

    <BlogPagination page={1} totalPages={data.totalPages} />

    <a class="text-link" href="/">← home</a>
  </section>
</main>
