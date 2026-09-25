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
      image: "https://sagarpanda.com/images/circle_profile.webp",
      jobTitle: "DevOps & Cloud Infrastructure Engineer",
      description:
        "A DevOps engineer focused on cloud infrastructure, automation, and scalable platforms.",
      sameAs: [
        "https://github.com/sagarkpanda",
        "https://www.linkedin.com/in/sagarkpanda/",
        "https://sagarkpanda.medium.com/",
        "https://bsky.app/profile/sagarpanda.com",
      ],
      knowsAbout: [
        "AWS",
        "Kubernetes",
        "Terraform",
        "GitOps",
        "CI/CD",
        "Observability",
        "DevSecOps",
        "Cloud Infrastructure",
      ],
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