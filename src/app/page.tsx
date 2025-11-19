"use client";

import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  FileText,
  Sparkles,
  X,
  ArrowDownLeft,
  LoaderCircle,
  Flame,
  MessageCircle,
  Stars,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import CustomHead from "@/components/custom-head";

type T_mode = "roast" | "feedback";

type T_length = "short" | "medium" | "descriptive";

export default function ResumeRoaster() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [mode, setMode] = useState<T_mode>("roast");
  const [responseLength, setResponseLength] = useState<T_length>("descriptive");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError(null);
    } else {
      setError("Whoopsie! PDFs only, buddy! Try again!");
    }
  };

  const processResume = async () => {
    if (!file) return;
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("mode", mode);
      formData.append("responseLength", responseLength);

      const response = await axios.post(`/api/roast`, formData);

      setResult(response.data.result);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError(
        "Uh-oh! Our system hiccuped. Your resume was too spicy to handle!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetProcess = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setMode("roast");
    setResponseLength("medium");
  };

  const Modes: T_mode[] = ["roast", "feedback"];
  const ResponseLengthList: T_length[] = ["short", "medium", "descriptive"];

  return (
    <>
      <>
        <CustomHead
          title="AI Resume Roaster | Get Honest Feedback on Your CV"
          description="Upload your resume and receive brutally honest feedback to improve your chances of landing your dream job. Our AI-powered tool analyzes and roasts your CV to perfection."
          canonicalUrl="https://roast.soorajrao.in/"
        />
      </>
      <div
        className={`flex flex-col min-h-screen bg-gradient-to-br
       items-center   gap-y-5 sm:justify-center
      from-white  via-green-200 to-green-100 
      ${result ? "pt-10" : "pt-24 sm:pt-4"}
    `}
      >
        <div>
          <Card
            className={`bg-white shadow-xl mb-4   sm:max-w-7xl rounded-2xl w-full overflow-hidden
          ${result ? "max-w-xs sm:max-w-7xl" : "w-[300px] sm:w-[400px]"}
          `}
          >
            <CardHeader className="p-6">
              <CardTitle className=" text-xl  sm:text-3xl text-black/80 font-semibold text-center flex items-center justify-center">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-900 to-green-500   px-1">
                  AI
                </span>
                Resume {mode === "roast" ? "Roaster" : "Feedback"}
                {mode === "roast" ? (
                  <Flame className="ml-2 text-red-500" />
                ) : (
                  <MessageCircle className="ml-2 text-red-500" />
                )}
              </CardTitle>
              <CardDescription className="text-center scale-110 mt-2">
                {result
                  ? `Your ${
                      mode === "roast"
                        ? "sizzling roast"
                        : "insightful feedback"
                    } is ready!`
                  : `Prepare for ${
                      mode === "roast"
                        ? "a sizzling reality check"
                        : "constructive insights"
                    }!`}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              {result ? (
                <div className="space-y-6">
                  <div className="bg-green-50 rounded-2xl sm:p-6 p-3 mb-6">
                    <p className="whitespace-pre-wrap text-xs sm:text-base text-gray-800">
                      <HighlightedText text={result} />
                    </p>
                  </div>
                  <p className="text-sm sm:text-base font-semibold text-center mb-6 text-green-800">
                    We just {mode === "roast" ? "roasted" : "analyzed"} - {" "}
                    <br className=" sm:hidden" />
                    {SliceText(file?.name || "")}
                  </p>
                  <div className="flex sm:flex-row flex-col gap-4 border-t pt-3 items-center justify-around">
                    <Button
                      variant="default"
                      size="lg"
                      onClick={resetProcess}
                                        className="  bg-gradient-to-r  text-sm from-green-950  bg-black  font-semibold py-2 px-4 rounded-md "
                    >
                      Process Another Resume <Stars />
                    </Button>
                    <a
                      target="_blank"
                      href="https://soorajrao.in?ref=resume-roaster"
                      className="
                    

                        flex items-center  relative  hover:underline underline-offset-2 group   font-normal  text-sm 
                        "
                    >
                      Developed By
                      <span className="font-semibold   pl-1 flex items-center">
                        Sooraj{" "}
                        <ArrowDownLeft className="rotate-180 pl-1 scale-0 duration-200 group-hover:scale-75 " />
                      </span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {file ? (
                    <div className="flex justify-start items-center">
                      <Button
                        variant="ghost"
                        className="bg-green-100  cursor-default hover:bg-green-100 py-2 px-5 w-fit rounded-full"
                      >
                        {SliceText(file.name)}
                      </Button>
                      <Button
                        disabled={isLoading}
                        className=" rounded-full scale-90"
                        onClick={resetProcess}
                        variant="ghost"
                        size="icon"
                        title="Remove"
                      >
                        <X />
                      </Button>
                    </div>
                  ) : (
                    <div className="relative">
                      <Input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="flex items-center text-sm  justify-center px-4 py-2 border-2  rounded-md cursor-pointer hover:bg-green-50 transition-colors  "
                      >
                        <FileText className="mr-2 w-5 h-5" />
                        Upload your resume (PDF)
                      </label>
                    </div>
                  )}
                  {error && (
                    <p className="text-red-500 text-sm text-center">{error}</p>
                  )}
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-semibold">Mode</Label>
                      <div className=" flex justify-start gap-4 mt-2">
                        {Modes.map((item, i) => {
                          return (
                            <Button
                              size="sm"
                              onClick={() => setMode(item)}
                              variant={item === mode ? "default" : "ghost"}
                              key={i}
                              className={`flex items-center space-x-2 capitalize shadow-md
                                ${
                                  item === mode &&
                                  "bg-gradient-to-tr from-black via-green-950 to-green-950 "
                                }
                                
                                `}
                            >
                              <p>{item}</p>
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <div>
                        <Label className="text-base font-semibold">
                          Response length
                        </Label>
                        <div className=" flex justify-start gap-4 mt-2">
                          {ResponseLengthList.map((item, i) => {
                            return (
                              <Button
                                size="sm"
                                onClick={() => setResponseLength(item)}
                                variant={
                                  item === responseLength ? "default" : "ghost"
                                }
                                key={i}
                                className={`flex items-center space-x-2 capitalize shadow
                                  ${
                                    item === responseLength &&
                                    "bg-gradient-to-tr from-black via-green-950 to-green-950  "
                                  }
                                  `}
                              >
                                <p>{item}</p>
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={processResume}
                    disabled={!file || isLoading}
                    className="w-full  bg-gradient-to-r  text-sm from-green-950  bg-black  font-semibold py-2 px-4 rounded-md "
                  >
                    {isLoading ? (
                      <p className="flex items-center justify-center">
                        <LoaderCircle className="animate-spin mr-2" />
                        Processing...
                      </p>
                    ) : (
                      <span className="flex items-center justify-center">
                        {mode === "roast" ? "Roast" : "Analyze"} my Resume
                        <Sparkles className="ml-2 w-5 h-5" />
                      </span>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        {!result && (
          <a
            target="_blank"
            href="https://soorajrao.in?ref=resume-roaster"
            className="flex items-center  relative group   font-normal  text-sm 
             hover:underline underline-offset-2
            "
          >
            Developed By
            <span className=" font-semibold  pl-1 flex items-center">
              Sooraj{" "}
              <ArrowDownLeft className="rotate-180 pl-1 scale-0 duration-200 group-hover:scale-75 " />
            </span>
          </a>
        )}
      </div>
    </>
  );
}

interface HighlightedTextProps {
  text: string;
}

const HighlightedText: React.FC<HighlightedTextProps> = ({ text }) => {
  const parts = text.split(/(\*.*?\*|".*?")/g);
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("*") && part.endsWith("*")) {
          return (
            <span
              key={index}
              className="font-semibold -ml-[2px]  text-purple-600"
            >
              {part.slice(1, -1)}
            </span>
          );
        } else if (part.startsWith('"') && part.endsWith('"')) {
          return (
            <span key={index} className="font-semibold text-pink-600">
              {part.slice(1, -1)}
            </span>
          );
        } else if (part.startsWith("*") || part.startsWith('"')) {
          return <span key={index}>{part.slice(1, part.length)}</span>;
        } else if (part.endsWith("*") || part.endsWith('"')) {
          return <span key={index}>{part.slice(0, -1)}</span>;
        } else if (part.endsWith(":")) {
          return (
            <span key={index} className=" font-semibold">
              {part}
            </span>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
};

const SliceText = (str: string): string => {
  if (!str) return "";
  return str.length > 20 ? `${str.slice(0, 10)}...${str.slice(-10)}` : str;
};
