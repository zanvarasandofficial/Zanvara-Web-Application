const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "strike",
  "span",
  "ul",
  "ol",
  "li",
  "h3",
  "h4",
  "div",
  "blockquote",
  "a",
]);

const ALLOWED_STYLE_PROPS = new Set(["color", "text-align"]);
const ALLOWED_ALIGN_VALUES = new Set(["left", "center", "right", "justify"]);

export function stripHtmlToText(html) {
  const value = html ?? "";

  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function hasRichTextContent(html) {
  return stripHtmlToText(html).length > 0;
}

export function sanitizeRichTextHtml(html) {
  const value = html ?? "";

  if (typeof window === "undefined") {
    return value;
  }

  const template = document.createElement("template");
  template.innerHTML = value;

  function cleanNode(node) {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        return;
      }

      if (child.nodeType !== Node.ELEMENT_NODE) {
        child.remove();
        return;
      }

      const tagName = child.tagName.toLowerCase();

      if (!ALLOWED_TAGS.has(tagName)) {
        const fragment = document.createDocumentFragment();
        while (child.firstChild) {
          fragment.appendChild(child.firstChild);
        }
        child.replaceWith(fragment);
        return;
      }

      [...child.attributes].forEach((attribute) => {
        if (attribute.name === "style") {
          const safeStyles = attribute.value
            .split(";")
            .map((rule) => rule.trim())
            .filter(Boolean)
            .filter((rule) => {
              const [property, value] = rule.split(":").map((part) => part.trim());
              const prop = property?.toLowerCase();

              if (prop === "color") {
                return /^#[0-9a-fA-F]{3,8}$/.test(value);
              }

              if (prop === "text-align") {
                return ALLOWED_ALIGN_VALUES.has(value?.toLowerCase());
              }

              return false;
            })
            .join("; ");

          if (safeStyles) {
            child.setAttribute("style", safeStyles);
          } else {
            child.removeAttribute("style");
          }
          return;
        }

        if (tagName === "a" && attribute.name === "href") {
          const href = attribute.value.trim();
          if (/^https?:\/\//i.test(href)) {
            child.setAttribute("href", href);
            child.setAttribute("target", "_blank");
            child.setAttribute("rel", "noopener noreferrer");
          } else {
            child.removeAttribute("href");
          }
          return;
        }

        if (tagName === "a" && (attribute.name === "target" || attribute.name === "rel")) {
          return;
        }

        child.removeAttribute(attribute.name);
      });

      cleanNode(child);
    });
  }

  cleanNode(template.content);
  return template.innerHTML.trim();
}
