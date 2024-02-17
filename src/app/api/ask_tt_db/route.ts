import type { NextResponse, NextRequest } from 'next/server';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { RetrievalQAChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import buildMessagesContextString from '../../utils/buildMessagesContextString';
import askTTDb from '../../utils/llm-templates/askTTDb';
import loadDBModelsIntoLangchainDocs from '@/app/utils/loadDBModelsIntoLangchainDocs';

export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method === 'POST') {
    const { messages } = await req.json();

    const docs = loadDBModelsIntoLangchainDocs();
    const embeddings = new OpenAIEmbeddings();
    const vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);

    const model = new ChatOpenAI({
      modelName: 'gpt-4',
      temperature: 0.15,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever(5), {
      prompt: PromptTemplate.fromTemplate(
        askTTDb(buildMessagesContextString(messages)),
      ),
    });

    const query = messages[messages.length - 1].content;
    
    const response = await chain.call({ query });
    const jsonResponse = JSON.parse(response.text);

    return new Response(JSON.stringify(jsonResponse));
  } else {
    return new Response(
      JSON.stringify({ message: 'Method ${req.method} Not Allowed' }),
    );
  }
}
