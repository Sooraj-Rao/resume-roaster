import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import PDFParser from "pdf2json";

type Mode = "roast" | "feedback";
type ResponseLength = "short" | "medium" | "descriptive";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function GET() {
  return NextResponse.json({ message: "GET request successful" });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File | null;
    const mode = (formData.get("mode") as Mode) || "roast";
    const responseLength =
      (formData.get("responseLength") as ResponseLength) || "medium";

    if (!file) {
      return NextResponse.json(
        { error: "No resume file uploaded" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    const resumeText = await parsePdf(buffer);

    if (!resumeText || resumeText.trim().length === 0) {
      return NextResponse.json(
        { error: "Unable to extract readable text from resume" },
        { status: 400 }
      );
    }

    const model: GenerativeModel = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = createPrompt(resumeText, mode, responseLength);
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return NextResponse.json({
      result: response,
      originalFileName: file.name,
      mode: mode,
      responseLength: responseLength,
    });
  } catch (error) {
    console.error("Processing error:", error);
    return NextResponse.json(
      {
        error: "Failed to process resume",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

const createPrompt = (
  resumeText: string,
  mode: Mode,
  responseLength: ResponseLength
): string => {
  const roleDescription =
    mode === "roast"
      ? "savage, no-filter resume roaster"
      : "constructive resume analyzer";

  const jobDescription =
    mode === "roast" ? "tear apart" : "analyze and provide insights on";

  const languageStyle =
    mode === "roast"
      ? "plain, raw, and brutally honest"
      : "constructive and encouraging";

  const additionalInstruction =
    mode === "roast"
      ? "Don't hold back."
      : "Focus on areas of improvement while highlighting strengths.";

  const wordLimit =
    responseLength === "short"
      ? 100
      : responseLength === "medium"
      ? 250
      : mode !== "roast"
      ? 350
      : 400;

  return `
  You are a ${roleDescription}.
  Your job is to ${jobDescription} the following resume in ${languageStyle} language.
  ${additionalInstruction}
  Use simple English.
  Resume Text:
  ${resumeText}

  Guidelines:
  - If it is not a resume, give a ${
    mode === "roast" ? "crazy savage" : "polite but firm"
  } reply in short under 30 words and return, don't go further.
  - ${
    mode === "roast" ? "Rip apart" : "Analyze"
  } every weak point, vague phrase, or generic line.
  - Make it ${
    mode === "roast" ? "darkly funny" : "insightful"
  } but straightforward, using ${
    mode === "roast" ? "basic, raw" : "professional"
  } English.
  - ${
    mode === "roast"
      ? "Avoid sugarcoating anything—be blunt and ruthless."
      : "Provide a balanced analysis, highlighting both strengths and areas for improvement."
  }
  - Keep it under ${wordLimit} words if it is a resume only, else 30 words.
  - ${
    mode === "roast"
      ? "Drop sarcastic career advice that stings but makes sense."
      : ""
  }
  `;
};

const parsePdf = async (buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", () => {
      console.error("Error parsing PDF with pdf2json");
      reject(new Error("Failed to parse PDF with pdf2json"));
    });

    pdfParser.on(
      "pdfParser_dataReady",
      (pdfData: {
        Pages: Array<{ Texts: Array<{ R: Array<{ T: string }> }> }>;
      }) => {
        try {
          const text = pdfData.Pages.map((page) =>
            page.Texts.map((textItem) =>
              decodeURIComponent(textItem.R[0]?.T || "")
            ).join(" ")
          ).join("\n");
          resolve(text);
        } catch (error) {
          console.error("Error extracting text from PDF data", error);
          reject(new Error("Failed to extract text from PDF data"));
        }
      }
    );

    try {
      pdfParser.parseBuffer(buffer);
    } catch (error) {
      console.error("Error parsing buffer", error);
      reject(new Error("Failed to parse PDF buffer"));
    }
  });
};
