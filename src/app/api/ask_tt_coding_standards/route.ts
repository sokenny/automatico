import type { NextResponse, NextRequest } from 'next/server';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { RetrievalQAChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import askTTCodingStandards from '../../utils/llm-templates/askTTCodingStandards';

export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method === 'POST') {
    // const { searchParams } = new URL(req.url);
    // const question = searchParams.get('question');
    // if (!question) {
    //   return new Response(JSON.stringify({ message: 'No question provided' }));
    // }

    const { messages } = await req.json();
    console.log('messages_ ', messages);

    const question = messages[messages.length - 1].content;

    const loader = new TextLoader('src/app/data/tt_coding_standards.txt');
    const docs = await loader.load();

    console.log('docs length: ', docs.length);
    console.log('docs: ', docs[0]);

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 0,
    });

    const splitDocs = await textSplitter.splitDocuments(docs);

    const embeddings = new OpenAIEmbeddings();
    const vectorStore = await MemoryVectorStore.fromDocuments(
      splitDocs,
      embeddings,
    );

    const model = new ChatOpenAI({
      modelName: 'gpt-4',
      temperature: 0.35,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever(15), {
      prompt: PromptTemplate.fromTemplate(askTTCodingStandards),
    });

    const response = await chain.call({ query: question });

    return new Response(JSON.stringify(response));
  } else {
    return new Response(
      JSON.stringify({ message: 'Method ${req.method} Not Allowed' }),
    );
  }
}
