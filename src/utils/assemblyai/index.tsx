import axios from "axios";
import { env } from "~/env.mjs";
import type { TTranscriptResponse } from "./types";

const assembly = axios.create({
  baseURL: "https://api.assemblyai.com/v2",
  headers: {
    Authorization: env.ASSEMBLY_AI_API_KEY,
    "Content-Type": "application/json",
  },
});

export const getTranscript = async (url: string) => {
  const response = await assembly.post<TTranscriptResponse>("/transcript", {
    audio_url: url,
    // punctuate: false,
    format_text: true,
    disfluencies: false,
    sentiment_analysis: true,
  });

  return response.data;
};

export const getTranscriptById = async (id: string) => {
  const response = await assembly.get<TTranscriptResponse>(`/transcript/${id}`);

  return response.data;
};
