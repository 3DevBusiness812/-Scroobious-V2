import { Prisma } from '@prisma/client';
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import { encode } from "gpt-3-encoder";
import { env } from '~/env.mjs';
import { prisma } from '~/server/prisma';
import { startupSelect } from "./selectionDefs";
import { trackUser } from '~/utils/customerio';
import { debug, error } from '~/utils/logger';

export const cioPipstantDescriptionSaved = async (result: string, userId: string) => {
  debug(`cioPipstantDescriptionSaved`, result);

  try {
    await trackUser(userId, 'pipstant.description_saved', result)
  } catch (err) {
    error("CIO PipstantDescriptionSaved", result);
    error(err);
  }
}

export const cioPipstantDescriptionGenerated = async (result: Partial<Awaited<ReturnType<typeof generateAIShortDescription>>>, userId: string) => {
  debug(`cioPipstantDescriptionGenerated`, result);

  try {
    await trackUser(userId, 'pipstant.description_generated', result)
  } catch (err) {
    error("CIO PipstantDescriptionGenerated", result);
    error(err);
  }
}

export const cioPipstantDescriptionStarted = async (userId: string) => {
  debug(`cioPipstantDescriptionSterted`, userId);

  try {
    await trackUser(userId, 'pipstant.started')
  } catch (err) {
    error("CIO PipstantDescriptionSterted", userId);
    error(err);
  }
}

export const formatStartupForPrompt = (startup: Prisma.StartupGetPayload<{ select: typeof startupSelect }> | null) => {
  if (!startup) return null

  const [pitch] = startup.organization?.pitches ?? [];
  const [latestPitchDeck] = pitch?.pitchDecks ?? []
  const pitchDeckContent = latestPitchDeck?.textContent ?? ""

  const [pitchVideo] = pitch?.pitchVideos ?? [];
  const video = pitchVideo?.video ?? null;
  const videoTranscription = video?.transcription ?? ""

  const {
    shortDescription,
    originStory,
  } = startup

  return {
    originStory,
    shortDescription,
    pitchDeckContent,
    videoTranscription
  };
}

/**
 * Generate AI Short Description for a startup
 * 
 * @param id Startup ID
 * @param userId Founder Id
 * @returns Object { startup, text, formattedPrompt, tokens }
 */
export const generateAIShortDescription = async (id: string, userId: string): Promise<{
  startup: ReturnType<typeof formatStartupForPrompt>;
  text: string;
  formattedPrompt: string;
  tokens: number
}> => {
  const err = new Error("⚠️ Invalid or no startup data!\n\nPlease make sure your startup data is valid.")

  if (!id) throw err

  const template = `Given the startup pitch description below generate a short and concise sentence summarizing what problem this company solves, so that potential investors can understand what problem the company solves. The Don't include the name of the startup in your response.  The sentence should be less than 150 characters.

% DESCRIPTION:

{pitchDeckContent}

{shortDescription}

{originStory}

{videoTranscription}
`

  const prompt = new PromptTemplate({
    template: template,
    inputVariables: ["shortDescription", "originStory", "pitchDeckContent", "videoTranscription"],
  });

  const model = new OpenAI({
    openAIApiKey: env.OPENAI_API_KEY,
    temperature: 1.5,
    modelName: "gpt-3.5-turbo-16k"
  });

  const chain = new LLMChain({ llm: model, prompt: prompt });

  const startup = await prisma.startup.findFirstOrThrow({
    select: startupSelect,
    where: { userId, id }
  }).then(startup => formatStartupForPrompt(startup));

  if (!startup) throw err

  const formattedPrompt = await prompt.format(startup);
  const tokens = encode(formattedPrompt).length
  const { text } = await chain.call(startup);

  const result = { startup, text, formattedPrompt, tokens }

  await cioPipstantDescriptionGenerated({ text, tokens }, userId)

  return result
}
