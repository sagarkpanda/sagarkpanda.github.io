<script lang="ts">
  import PostCard from '$lib/PostCard.svelte';
  import BlogPagination from '$lib/BlogPagination.svelte';

  let { data } = $props();
</script>

<svelte:head>
  <title>Blogs — Page {data.page} | Sagar Panda</title>
  <link rel="canonical" href={'https://sagarpanda.com/blogs/page/' + data.page + '/'} />
</svelte:head>

<main id="main-content" class="shell page-shell">
  <section class="section">
    <div class="command">$ cd /blogs/page/{data.page} && ls -lt</div>

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

    <BlogPagination page={data.page} totalPages={data.totalPages} />

    <a class="text-link" href="/">← home</a>
  </section>
</main>
