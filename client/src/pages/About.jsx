import useDocumentMeta from "../hooks/useDocumentMeta";

export default function About() {
  useDocumentMeta({
    title: "About Lumora Beauty",
    description: "Learn about Lumora Beauty — our mission, authenticity and customer commitment.",
    path: "/about"
  });

  return (
    <section className="section-tight">
      <div className="container">
        <h1>About Lumora Beauty</h1>
        <p>We curate high-quality beauty products and ensure authenticity with every order.</p>
      </div>
    </section>
  );
}
