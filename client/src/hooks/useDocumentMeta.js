import { useEffect } from "react";

function setMeta(name, content, attr = "name") {
  if (!content) return;
  let tag = document.querySelector(`meta[${attr}="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function setCanonical(path) {
  if (!path) return;
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", `https://www.lumorabeauty.pk${path}`);
}

// Sets the page <title>, meta description/OG tags, and canonical URL for
// SEO on this client-rendered SPA. Call once per page component.
export default function useDocumentMeta({ title, description, path }) {
  useEffect(() => {
    if (title) document.title = title;
    setMeta("description", description);
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    if (path) {
      setMeta("og:url", `https://www.lumorabeauty.pk${path}`, "property");
      setCanonical(path);
    }
  }, [title, description, path]);
}
