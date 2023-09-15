import { getDocument } from "pdfjs-dist";
import axios from "axios";
import { OpenAI } from "langchain/llms/openai";
import { loadSummarizationChain } from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { env } from "~/env.mjs";

export const getPitchDeckContent = async (fileName: string) => {
  const pdfDocument = await getDocument(fileName).promise
  let content = ""

  for (let i = 0; i < pdfDocument.numPages; i++) {
    const pdfPage = await pdfDocument.getPage(i + 1);
    const { items } = await pdfPage.getTextContent();
    content += items.map(i => (i as { str: string }).str).join(" ")
  }

  return content
}

export const summarizePitchDeck = async (fileName: string) => {
  const pdfData = await axios.get(fileName, { responseType: "arraybuffer" }).then(r => r.data)
  const textContent = await getPitchDeckContent(pdfData)
  const model = new OpenAI({
    openAIApiKey: env.OPENAI_API_KEY,
    temperature: 0,
    modelName: "gpt-3.5-turbo-16k"
  });

  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
  const docs = await textSplitter.createDocuments([textContent]);

  const chain = loadSummarizationChain(model, { type: "map_reduce" });
  const { text: textSummary } = await chain.call({
    input_documents: docs,
  }) as { text: string };

  return {
    textSummary, textContent
  }
}
