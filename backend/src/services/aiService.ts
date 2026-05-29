import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface GenerateWhitePageParams {
  title: string;
  niche: string;
  description?: string;
  templateHtml?: string;
}

export interface GeneratedWhitePage {
  mainHtml: string;
  privacyHtml: string;
  termsHtml: string;
}

const SYSTEM_PROMPT = `You are an expert web developer who creates professional, clean white pages (informational landing pages).
You generate complete, self-contained HTML files with inline CSS.
The pages must look professional, modern, and clean.
Always use semantic HTML5.
Pages must be mobile-responsive.
Include proper meta tags, title, and description.
Output ONLY valid HTML, no markdown, no explanations.`;

export async function generateWhitePage(
  params: GenerateWhitePageParams
): Promise<GeneratedWhitePage> {
  const { title, niche, description, templateHtml } = params;

  const templateContext = templateHtml
    ? `\n\nBase your design on this template structure (but create unique content):\n${templateHtml.substring(0, 3000)}`
    : '';

  // Generate main page
  const mainResponse = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4000,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Create a professional white page for:
Title: ${title}
Niche: ${niche}
Description: ${description || 'A professional informational page'}

Requirements:
- Clean, modern design with good typography
- Hero section with title and subtitle  
- 3-4 content sections with relevant information about the niche
- Links to /privacy.html and /terms.html in the footer
- Professional color scheme fitting the niche
- Mobile responsive
- Copyright footer with current year${templateContext}

Output ONLY the complete HTML file, nothing else.`,
      },
    ],
  });

  const mainHtml = (mainResponse.content[0] as { type: string; text: string }).text;

  // Generate privacy policy
  const privacyResponse = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 3000,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Create a Privacy Policy page for a website in the "${niche}" niche called "${title}".
Requirements:
- Standard privacy policy sections (data collection, cookies, third parties, contact)
- Link back to main page (index.html) in header
- Same visual style: clean, professional
- Include last updated date

Output ONLY the complete HTML file.`,
      },
    ],
  });

  const privacyHtml = (privacyResponse.content[0] as { type: string; text: string }).text;

  // Generate terms page
  const termsResponse = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 3000,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Create a Terms & Conditions page for a website in the "${niche}" niche called "${title}".
Requirements:
- Standard terms sections (usage, liability, intellectual property, governing law)
- Link back to main page (index.html) in header  
- Same visual style: clean, professional
- Include last updated date

Output ONLY the complete HTML file.`,
      },
    ],
  });

  const termsHtml = (termsResponse.content[0] as { type: string; text: string }).text;

  return { mainHtml, privacyHtml, termsHtml };
}