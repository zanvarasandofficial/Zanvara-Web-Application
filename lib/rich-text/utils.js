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
  "img",
]);

const ALLOWED_STYLE_PROPS = new Set(["color", "text-align", "width", "height"]);
const ALLOWED_ALIGN_VALUES = new Set(["left", "center", "right", "justify"]);

const IMAGE_SIZE_PATTERN = /^(\d+px|\d+%|auto)$/i;

export function normalizeImageDimension(value, fallback = "100%") {
  const trimmed = String(value ?? "").trim().toLowerCase();

  if (!trimmed || trimmed === "auto") {
    return fallback;
  }

  if (/^\d+$/.test(trimmed)) {
    const pixels = Number(trimmed);
    if (pixels >= 40 && pixels <= 1200) {
      return `${pixels}px`;
    }
    return fallback;
  }

  if (/^\d+px$/.test(trimmed)) {
    const pixels = Number(trimmed.replace("px", ""));
    if (pixels >= 40 && pixels <= 1200) {
      return trimmed;
    }
    return fallback;
  }

  if (/^\d+%$/.test(trimmed)) {
    const percent = Number(trimmed.replace("%", ""));
    if (percent >= 10 && percent <= 100) {
      return trimmed;
    }
    return fallback;
  }

  return fallback;
}

export function buildImageSizeStyle(width, height) {
  const rules = [`width: ${normalizeImageDimension(width, "100%")}`];
  const normalizedHeight = normalizeImageDimension(height, "auto");

  if (normalizedHeight !== "auto") {
    rules.push(`height: ${normalizedHeight}`);
  } else {
    rules.push("height: auto");
  }

  return rules.join("; ");
}

function isSafeImageStyleProperty(property, value, tagName) {
  const prop = property?.toLowerCase();

  if (prop === "color") {
    return /^#[0-9a-fA-F]{3,8}$/.test(value);
  }

  if (prop === "text-align") {
    return ALLOWED_ALIGN_VALUES.has(value?.toLowerCase());
  }

  if (tagName === "img" && (prop === "width" || prop === "height")) {
    return IMAGE_SIZE_PATTERN.test(value?.toLowerCase() ?? "");
  }

  return false;
}

export function stripHtmlToText(html) {
  const value = html ?? "";

  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function hasRichTextContent(html) {
  const value = html ?? "";
  if (stripHtmlToText(value).length > 0) {
    return true;
  }

  return /<img\b[^>]*\bsrc=["']https?:\/\//i.test(value);
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
              return isSafeImageStyleProperty(property, value, tagName);
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

        if (tagName === "img") {
          if (attribute.name === "src") {
            const src = attribute.value.trim();
            if (/^https?:\/\//i.test(src)) {
              child.setAttribute("src", src);
            } else {
              child.removeAttribute("src");
            }
            return;
          }

          if (attribute.name === "alt") {
            child.setAttribute("alt", attribute.value.trim().slice(0, 200) || "Product detail image");
            return;
          }

          if (attribute.name === "loading" && attribute.value === "lazy") {
            child.setAttribute("loading", "lazy");
            return;
          }

          if (attribute.name === "class" && attribute.value === "rich-text-image") {
            child.setAttribute("class", "rich-text-image");
            return;
          }

          if (attribute.name === "width" || attribute.name === "height") {
            const pixels = Number.parseInt(attribute.value, 10);
            if (Number.isFinite(pixels) && pixels >= 40 && pixels <= 1200) {
              child.setAttribute(attribute.name, String(pixels));
            }
            return;
          }

          child.removeAttribute(attribute.name);
          return;
        }

        child.removeAttribute(attribute.name);
      });

      if (tagName === "img" && !child.getAttribute("src")) {
        child.remove();
        return;
      }

      if (tagName === "img") {
        if (!child.getAttribute("alt")) {
          child.setAttribute("alt", "Product detail image");
        }
        child.setAttribute("loading", "lazy");
        child.classList.add("rich-text-image");
      }

      cleanNode(child);
    });
  }

  cleanNode(template.content);
  return template.innerHTML.trim();
}
