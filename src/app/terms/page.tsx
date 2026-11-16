import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, Section } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms of use",
  description:
    "The rules for using CocoVerse UI. The effects and their code are free and open source under the MIT licence.",
};

const LINK = "text-gold-text underline underline-offset-4";

export default function TermsPage() {
  return (
    <LegalPage title="Terms of use" updated="November 16, 2026">
      <Section title="Using CocoVerse UI">
        <p>
          CocoVerse UI is made and maintained by CoconutStudios. By using this website you agree to these terms. If you
          do not agree, please do not use it.
        </p>
      </Section>

      <Section title="The effects and their code">
        <p>
          The effects and the cocoverse_ui Flutter package are free and open source under the MIT licence. You may
          copy, clone, fork, modify and use them in personal and commercial projects. The only condition is that you
          keep the copyright and licence notice with the code. The full licence text is in the LICENSE file of the
          package.
        </p>
      </Section>

      <Section title="No warranty">
        <p>
          The website and the effects are provided “as is” and “as available”, without warranty of any kind. Effects
          are visual and can behave differently on different devices, so test them in your own app before you release
          it.
        </p>
      </Section>

      <Section title="Limit of liability">
        <p>
          To the fullest extent the law allows, CoconutStudios is not liable for any loss or damage that comes from
          using the website or the code, including lost data, lost profit, or problems in an app that uses them.
        </p>
      </Section>

      <Section title="Fair use of the site">
        <p>
          Please do not attack or overload the site, try to break into it, or use bots to inflate the view, copy or
          heart counts.
        </p>
      </Section>

      <Section title="Our name and logo">
        <p>
          The MIT licence covers the code only. The CocoVerse name and logo belong to CoconutStudios, so please do not
          use them in a way that suggests we endorse you or your product.
        </p>
      </Section>

      <Section title="Other websites">
        <p>
          The site links to other websites, such as WhatsApp and our portfolio. We are not responsible for their
          content or how they handle your information.
        </p>
      </Section>

      <Section title="Changes">
        <p>
          We may change, pause or remove the website or any effect at any time, and we may update these terms. Copies
          you have already made stay yours under the MIT licence. The date at the top shows the latest version, and if
          you keep using the site after a change you accept it. How we handle information is explained in our{" "}
          <Link href="/privacy" className={LINK}>
            privacy policy
          </Link>
          .
        </p>
      </Section>

      <Section title="Governing law">
        <p>These terms are governed by the laws of Nigeria.</p>
      </Section>

      <Section title="Contact">
        <p>
          Use the Reach out button at the end of the list of effects on the home page, or the CoCoNuT-sTuDiOs link in
          the footer.
        </p>
      </Section>
    </LegalPage>
  );
}