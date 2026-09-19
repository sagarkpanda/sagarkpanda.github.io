import Home from "@/components/Home";
import JsonLd from "@/components/JsonLd";

const websiteSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://sagarpanda.com/#website",
      name: "Sagar Panda | DevOps & Cloud Engineer",
      url: "https://sagarpanda.com/",
      description:
        "Senior DevOps Engineer specializing in AWS, Kubernetes, and Terraform. Sharing practical tutorials on cloud infrastructure, CI/CD, observability, and DevSecOps.",
      inLanguage: "en",
      author: {
        "@id": "https://sagarpanda.com/#person",
      },
    },
    {
      "@type": "Person",
      "@id": "https://sagarpanda.com/#person",
      name: "Sagar Panda",
      url: "https://sagarpanda.com/",
      jobTitle: "DevOps & Cloud Engineer",
    },
  ],
};

export default function Page() {
  return (
    <>
      <JsonLd data={websiteSchema} />
      <Home />
    </>
  );
}