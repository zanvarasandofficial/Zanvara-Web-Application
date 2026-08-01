export default function JsonLd({ data }) {
  if (!data) {
    return null;
  }

  const payload = Array.isArray(data) ? data : [data];
  const graphs = payload.filter(Boolean);

  if (!graphs.length) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graphs.length === 1 ? graphs[0] : graphs) }}
    />
  );
}
