import { ASSETS } from "@/lib/assets";
import { type AssetDoc, DOCS, type DocParam, docFor } from "@/lib/docs";
import { SITE_URL } from "@/lib/site";

const TITLE = "CocoVerse UI";
const TAGLINE =
  "Animated 3D and particle effects for Flutter. Every effect has a live preview, its parameters and code to copy.";
const IMPORT_LINE = "import 'package:cocoverse_ui/cocoverse_ui.dart';";

/** The install command, taken from the shared install step in docs.ts so it can never drift. */
function installCommand(): string {
  const first = Object.values(DOCS)[0];
  return first?.install?.command ?? "flutter pub add cocoverse_ui";
}

function sortedAssets() {
  return [...ASSETS].sort((a, b) => a.name.localeCompare(b.name));
}

function pageUrl(slug: string): string {
  return `${SITE_URL}/asset/${slug}`;
}

function firstSentence(text: string): string {
  const i = text.indexOf(". ");
  return i === -1 ? text : text.slice(0, i + 1);
}

function paramLine(p: DocParam): string {
  const bits = [p.type];
  if (p.def !== undefined) bits.push(`default ${p.def}`);
  return `- \`${p.name}\` (${bits.join(", ")}): ${p.desc}`;
}

/** The short index: one line for every effect, with a link to its page. */
export function buildLlmsTxt(): string {
  const lines: string[] = [
    `# ${TITLE}`,
    "",
    `> ${TAGLINE}`,
    "",
    `CocoVerse UI (the Flutter package cocoverse_ui) is free. Install it with \`${installCommand()}\` and import it with \`${IMPORT_LINE}\`.`,
    "",
    "Effects fill the space their parent gives them, so you set an effect's size with a SizedBox and its position with padding or Align. Each effect page lists every parameter with its type, default and meaning, and has a complete example you can copy.",
    "",
    "## Documentation",
    "",
    `- [All documentation in one file](${SITE_URL}/llms-full.txt): every effect's summary, parameters, options, controller, example and notes`,
    `- [Home](${SITE_URL}/): a live preview of every effect`,
    "",
    "## Effects",
    "",
  ];
  for (const asset of sortedAssets()) {
    const doc = docFor(asset.slug);
    const note = doc ? `: ${firstSentence(doc.summary)}` : "";
    lines.push(`- [${asset.name}](${pageUrl(asset.slug)})${note}`);
  }
  lines.push("");
  return lines.join("\n");
}

function section(name: string, slug: string, doc: AssetDoc): string {
  const out: string[] = [];
  out.push(`## ${name}`, "", `Page: ${pageUrl(slug)}`, "", doc.summary, "");

  out.push("Use cases:", "", ...doc.useCases.map((u) => `- ${u}`), "");
  out.push("Quick start:", "", "```dart", doc.getCode, "```", "");
  out.push("Parameters:", "", ...doc.params.map(paramLine), "");

  for (const group of doc.paramGroups ?? []) {
    out.push(`### ${group.name}`, "", group.desc, "", ...group.params.map(paramLine), "");
  }

  if (doc.enums?.length) {
    out.push("Options:", "");
    for (const e of doc.enums) {
      out.push(`### ${e.name}`, "", e.desc, "", ...e.values.map((v) => `- \`${v.name}\`: ${v.desc}`), "");
    }
  }

  if (doc.controller) {
    out.push(
      "Controller:",
      "",
      `### ${doc.controller.name}`,
      "",
      doc.controller.desc,
      "",
      ...doc.controller.methods.map((m) => `- \`${m.name}\`: ${m.desc}`),
      "",
    );
  }

  out.push("Full example:", "", "```dart", doc.example, "```", "");

  if (doc.notes?.length) {
    out.push("Notes:", "", ...doc.notes.map((n) => `- ${n}`), "");
  }
  return out.join("\n");
}

/** Everything in one file: every effect's full documentation. */
export function buildLlmsFullTxt(): string {
  const parts: string[] = [
    `# ${TITLE}: full documentation`,
    "",
    `> ${TAGLINE}`,
    "",
    `Install: \`${installCommand()}\``,
    `Import: \`${IMPORT_LINE}\``,
    "",
    "Effects fill the space their parent gives them, so set an effect's size with a SizedBox and its position with padding or Align. Most effects have no background of their own and are transparent unless you give them one.",
    "",
    `Short index of all effects: ${SITE_URL}/llms.txt`,
    "",
  ];
  for (const asset of sortedAssets()) {
    const doc = docFor(asset.slug);
    if (doc) {
      parts.push(section(asset.name, asset.slug, doc));
    } else {
      parts.push(
        `## ${asset.name}`,
        "",
        `Page: ${pageUrl(asset.slug)}`,
        "",
        "Full documentation for this effect is coming soon.",
        "",
      );
    }
  }
  return parts.join("\n");
}