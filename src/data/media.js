const files = import.meta.glob("../media/*/*/*.{png,jpg,jpeg,webp,gif,mp4,webm,PNG,JPG,JPEG,MP4}", {
  eager: true,
  query: "?url",
  import: "default",
});

const label = (name) =>
  name
    .replace(/\.[^.]+$/, "")
    .replace(/^\d+[-_ ]*/, "")
    .replace(/[-_]+/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase());

const all = Object.entries(files)
  .map(([path, url]) => {
    const [, , project, kind, file] = path.split("/");
    return {
      project,
      kind,
      file,
      url,
      caption: label(file),
      video: /\.(mp4|webm)$/i.test(file),
    };
  })
  .sort((a, b) => a.file.localeCompare(b.file, undefined, { numeric: true }));

export function mediaFor(project) {
  const items = all.filter((m) => m.project === project);
  return {
    screens: items.filter((m) => m.kind === "screens"),
    videos: items.filter((m) => m.kind === "videos"),
    sculpts: items.filter((m) => m.kind === "sculpts"),
  };
}

const byPath = Object.fromEntries(all.map((m) => [`${m.project}/${m.kind}/${m.file}`, m.url]));

export function mediaUrl(path) {
  const key = path.replace(/^\/?(src\/)?media\//, "");
  return byPath[key] || null;
}
