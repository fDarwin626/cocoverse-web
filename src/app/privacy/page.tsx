import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, Section } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "CocoVerse UI collects no personal information and uses no cookies. It only counts views, copies and hearts of each effect.",
};

const LINK = "text-gold-text underline underline-offset-4";

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy policy" updated="November 16, 2026">
      <Section title="The short version">
        <p>
          CocoVerse UI does not collect personal information. There are no accounts, no sign-up forms, no cookies, no
          ads and no tracking tools.
        </p>
      </Section>

      <Section title="What we count">
        <p>
          When you open an effect’s page, copy its code or heart it, our database adds one to a running total for that
          effect. Those totals (views, copies and hearts) are the numbers shown on the site. They are not linked to
          you, your device or your IP address, and they cannot be used to identify anyone.
        </p>
      </Section>

      <Section title="What stays on your device">
        <p>
          The site uses your browser’s own storage, not cookies, for small things such as your light or dark choice and
          which effects you have already viewed or hearted. This stops the same visit from being counted twice and
          stops us asking for the same heart again. It stays on your device, and you can clear it at any time in your
          browser settings.
        </p>
      </Section>

      <Section title="Where the numbers live">
        <p>
          The site is hosted on Vercel and the totals are kept in a database. Like any web host, they may keep
          standard technical logs, such as IP address and browser type, to keep the service secure and running. We do
          not use those logs to identify or follow visitors, and we do not add them to our database.
        </p>
      </Section>

      <Section title="Other websites and contacting us">
        <p>
          The Reach out button opens WhatsApp. If you message us there, we receive your number and what you write, and
          we use them only to reply to you. WhatsApp’s own terms and privacy policy apply to that chat. Links to other
          sites, such as the CoCoNuT-sTuDiOs link in the footer, take you away from this site, and those sites’ own
          policies apply.
        </p>
      </Section>

      <Section title="Children">
        <p>We do not collect personal information from anyone, including children.</p>
      </Section>

      <Section title="Changes">
        <p>
          If this policy changes, the new version will be posted on this page with a new date at the top. Our{" "}
          <Link href="/terms" className={LINK}>
            terms of use
          </Link>{" "}
          explain the rules for using the site and the code.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Questions about this policy? Use the Reach out button at the end of the list of effects on the home page, or
          the CoCoNuT-sTuDiOs link in the footer.
        </p>
      </Section>
    </LegalPage>
  );
}