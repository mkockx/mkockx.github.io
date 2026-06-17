const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, AlignmentType, LevelFormat,
  HeadingLevel, BorderStyle, TabStopType, TabStopPosition, ExternalHyperlink
} = require("docx");

const ACCENT = "0E5C5B";
const INK = "1C1B19";
const SOFT = "46443F";

// ---- helpers ----
const rule = { bottom: { style: BorderStyle.SINGLE, size: 6, color: ACCENT, space: 2 } };

function sectionHeading(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 100 },
    border: rule,
    children: [new TextRun({ text: text.toUpperCase(), bold: true, color: ACCENT, size: 22, font: "Arial", characterSpacing: 20 })],
  });
}

// Experience entry: title + right-aligned dates, then "Company — Location", then bullets
function job(title, dates, companyLine, bullets) {
  const out = [
    new Paragraph({
      spacing: { before: 160, after: 0 },
      tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
      children: [
        new TextRun({ text: title, bold: true, size: 22, color: INK }),
        new TextRun({ text: "\t" + dates, size: 19, color: SOFT }),
      ],
    }),
    new Paragraph({
      spacing: { after: 40 },
      children: [new TextRun({ text: companyLine, italics: true, size: 20, color: SOFT })],
    }),
  ];
  for (const b of bullets) {
    out.push(new Paragraph({
      numbering: { reference: "bullets", level: 0 },
      spacing: { after: 20 },
      children: [new TextRun({ text: b, size: 20, color: INK })],
    }));
  }
  return out;
}

function skill(label, items) {
  return new Paragraph({
    spacing: { after: 40 },
    indent: { left: 0 },
    children: [
      new TextRun({ text: label + ":  ", bold: true, size: 20, color: ACCENT }),
      new TextRun({ text: items, size: 20, color: INK }),
    ],
  });
}

function bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { after: 20 },
    children: [new TextRun({ text, size: 20, color: INK })],
  });
}

const doc = new Document({
  creator: "Martin Kockx",
  title: "Martin Kockx — Resume",
  description: "Resume — Martin Kockx",
  styles: {
    default: { document: { run: { font: "Arial", size: 20, color: INK } } },
    paragraphStyles: [
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 22, bold: true, font: "Arial", color: ACCENT },
        paragraph: { spacing: { before: 240, after: 100 }, outlineLevel: 1 } },
    ],
  },
  numbering: {
    config: [
      { reference: "bullets",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 360, hanging: 200 } } } }] },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 },
      },
    },
    children: [
      // ---- HEADER ----
      new Paragraph({
        spacing: { after: 0 },
        children: [new TextRun({ text: "MARTIN KOCKX, PE", bold: true, size: 40, color: INK, font: "Arial", characterSpacing: 10 })],
      }),
      new Paragraph({
        spacing: { after: 60 },
        children: [new TextRun({ text: "Smart Manufacturing  ·  AI Enablement  ·  Industrial Data Strategy", size: 22, color: ACCENT, bold: true })],
      }),
      new Paragraph({
        border: rule,
        spacing: { after: 40 },
        children: [
          new TextRun({ text: "Belmont, MA", size: 19, color: SOFT }),
          new TextRun({ text: "  |  (857) 303-5412  |  ", size: 19, color: SOFT }),
          new ExternalHyperlink({ link: "mailto:kockx.martin.pub@pm.me", children: [new TextRun({ text: "kockx.martin.pub@pm.me", size: 19, color: ACCENT })] }),
          new TextRun({ text: "  |  ", size: 19, color: SOFT }),
          new ExternalHyperlink({ link: "https://www.linkedin.com/in/martinkockx/", children: [new TextRun({ text: "linkedin.com/in/martinkockx", size: 19, color: ACCENT })] }),
          new TextRun({ text: "  |  ", size: 19, color: SOFT }),
          new ExternalHyperlink({ link: "https://mkockx.github.io", children: [new TextRun({ text: "mkockx.github.io", size: 19, color: ACCENT })] }),
        ],
      }),

      // ---- SUMMARY ----
      sectionHeading("Professional Summary"),
      new Paragraph({
        spacing: { after: 60 },
        children: [new TextRun({ size: 20, color: INK, text:
          "Manufacturing systems engineer and digital strategy leader with 13+ years in GMP life sciences, now focused on AI enablement, industrial DataOps, and smart manufacturing. I turn fragmented manufacturing systems and data into trustworthy, AI-ready foundations—defining the data architecture, governance, and roadmaps that connect the plant floor to advanced analytics and AI. Licensed Professional Engineer with deep grounding in MES, SCADA, historians, and process automation across biologics and cell & gene therapy operations." })],
      }),

      // ---- CORE SKILLS ----
      sectionHeading("Areas of Expertise"),
      skill("AI & Analytics", "AI enablement, AI use-case readiness & governance, generative AI, machine learning, advanced & predictive analytics, AI accountability"),
      skill("Industrial DataOps & Data", "AI-ready data, data architecture, data governance, semantic models, manufacturing intent & context, data integrity (ALCOA+)"),
      skill("Smart Manufacturing & Digital", "Smart manufacturing / Industry 4.0, digital transformation, target architecture, strategy & roadmap, MES, electronic batch records (eBR), process historians (OSIsoft / AVEVA PI), review & release by exception, ISA-88 / ISA-95"),
      skill("Data & Cloud Platforms", "AWS, Snowflake, Databricks; SCADA / HMI (Ignition, Rockwell, GE Proficy, DeltaV); PLC / DCS; LIMS; ERP"),
      skill("Quality & Compliance (GxP)", "21 CFR Part 11, EU GMP Annex 11, GAMP 5, computer system validation (CSV), IQ / OQ / PQ, CAPA, deviation, change control"),
      skill("Leadership", "Program & portfolio management, global multi-site delivery, vendor management, stakeholder alignment, team mentoring"),

      // ---- EXPERIENCE ----
      sectionHeading("Professional Experience"),
      ...job("Principal Manufacturing Systems Engineer", "Sep 2024 – Present", "Vertex Pharmaceuticals — Boston, MA", [
        "Partner with manufacturing and technology leadership to set smart-manufacturing strategy and roadmap across the manufacturing systems portfolio.",
        "Define the data architecture and governance that make manufacturing data AI-ready; prioritize and shepherd AI use cases from concept to governed deployment.",
        "Lead evaluation, selection, implementation, and lifecycle management of manufacturing systems, and manage strategic vendor relationships.",
        "Ensure solutions meet GxP, data-integrity, and computer-system-lifecycle requirements (21 CFR Part 11, EU Annex 11, GAMP 5).",
      ]),
      ...job("Digital Plant Program Manager", "2023 – 2024", "MilliporeSigma — Burlington, MA", [
        "Built and led a new global Digital Plant Program spanning 62 manufacturing facilities.",
        "Defined sector target architecture and digital strategy across MES, historian, batch, and analytics.",
        "Drove solution decisions across the program portfolio with accountability for budget, quality, and schedule.",
        "Established the digital roadmap connecting plant-floor systems to enterprise data and analytics.",
      ]),
      ...job("Staff Automation Engineer", "2021 – 2023", "Thermo Fisher Scientific — Cambridge, MA", [
        "Served as department SME and technical strategist across a portfolio of capital engineering projects.",
        "Defined automation strategy from pipeline needs and industry direction, increasingly oriented to data capture, integration, and analytics readiness.",
        "Led project delivery and mentored the automation team, bridging plant-floor controls with the enterprise data layer.",
      ]),
      ...job("Senior Project Engineer", "2020 – 2021", "Constellation Brands — Napa, CA", [
        "Process and automation engineering for large-scale production operations.",
      ]),
      ...job("Senior Controls Engineer", "2019 – 2020", "BW Design Group — Vacaville, CA", [
        "Lead controls engineer for life-science clients; project manager on large single-use-equipment CAPEX programs across the US.",
      ]),
      ...job("Senior / Principal Automation Engineer", "2015 – 2019", "NNE (NNE Pharmaplan) — San Francisco Bay Area, CA", [
        "West-coast Engineer of Record on greenfield biologics, single-use, and continuous-manufacturing programs.",
        "Designed and implemented PI Historian from lab to production at a commercial biotech facility.",
      ]),
      ...job("Field / Project Engineer", "2011 – 2015", "Panduit — Folsom, CA (Singapore & Hong Kong)", [
        "Delivered data-center monitoring and control solutions, with global assignments across Asia.",
      ]),

      // ---- SELECTED PROJECTS ----
      sectionHeading("Selected Projects"),
      bullet("Smart manufacturing roadmap & AI/data enablement (Vertex) — strategy and architecture to make manufacturing data AI-ready, with a prioritized portfolio of AI use cases across the manufacturing systems estate."),
      bullet("Global Digital Plant Program, 62 sites (MilliporeSigma) — sector target architecture, digital strategy, and portfolio governance connecting plant systems to enterprise data and analytics."),
      bullet("Enterprise automation & digital strategy (Thermo Fisher) — department-wide automation and data-capture strategy across a multi-project pipeline."),
      bullet("Greenfield biologics PCS/BMS — full SCADA suite, process formulation and clean-utility systems, GMP HVAC, and equipment integration; SDS/HDS, PLC programming, FAT/SAT."),
      bullet("GMP OSIsoft PI design & implementation — historian solution and network architecture across manufacturing lab → pilot plant → production at a major biotech facility."),

      // ---- EDUCATION ----
      sectionHeading("Education & Certifications"),
      bullet("B.S., Mechanical Engineering — California State University, Sacramento"),
      bullet("Artificial Intelligence: Implications for Business Strategy — MIT Sloan Executive Education (Apr 2026); Credential ID 180521792"),
      bullet("Licensed Professional Engineer (PE) — California (CS7550)"),

      // ---- AFFILIATIONS ----
      sectionHeading("Affiliations"),
      new Paragraph({
        spacing: { after: 40 },
        children: [new TextRun({ size: 20, color: INK, text: "BioPhorum  ·  ISPE  ·  IAAE  ·  Pistoia Alliance  ·  ISA  ·  NSPE  ·  Tau Beta Pi" })],
      }),
    ],
  }],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("/tmp/resume-build/Martin-Kockx-Resume.docx", buffer);
  console.log("wrote Martin-Kockx-Resume.docx", buffer.length, "bytes");
});
