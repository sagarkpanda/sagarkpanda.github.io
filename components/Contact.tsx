import { site } from "@/lib/site-data";
import Section from "@/components/Section";

export default function Contact() {
  const linkedin = site.social.find(([name]) => name === "LinkedIn")?.[1];

  return (
    <Section
      command="ping sagar --interactive"
      title="Get In Touch"
      id="contact"
    >
      <div className="contact-card">
        <p>
          My inbox is always open. Whether it is an infrastructure question,
          collaboration, or just a technical discussion, send me a note.
        </p>

        {/* <div className="hero-actions"> */}
        <div className="hero-actions contact-actions">
          <a className="button primary" href={`mailto:${site.email}`}>
            $ email
          </a>

          {linkedin && (
            <a
              className="button primary"
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              $ linkedin
            </a>
          )}
        </div>
      </div>
    </Section>
  );
}