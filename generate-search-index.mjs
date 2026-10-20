import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const root = process.cwd();
const contentRoot = path.join(root, 'content');
const outputPath = path.join(root, 'static', 'search-index.json');
function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}
function normalizeSlug(file, section) {
  return path.relative(path.join(contentRoot, section), file).replace(/\\/g, '/').replace(/\.md$/i, '').split('/').filter((part) => part !== '_index').join('/');
}
const index = [];
for (const file of walk(path.join(contentRoot, 'blogs')).filter((file) => /\.md$/i.test(file) && !path.basename(file).startsWith('_'))) {
  const parsed = matter(fs.readFileSync(file, 'utf8'));
  if (parsed.data.draft) continue;
  const slug = normalizeSlug(file, 'blogs');
  const list = (value) => Array.isArray(value) ? value.map(String) : typeof value === 'string' ? [value] : [];
  index.push({
    title: String(parsed.data.title ?? slug),
    description: String(parsed.data.description ?? parsed.data.summary ?? ''),
    content: parsed.content,
    tags: list(parsed.data.tags),
    categories: list(parsed.data.categories),
    route: `/blogs/${slug}/`,
    kind: 'Blog'
  });
}
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(index));
console.log(`Generated ${index.length} blog search entries at ${path.relative(root, outputPath)}`);
