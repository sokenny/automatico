This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## About tt-ai-chats

This project is a web app that leverages vercel's `ai` and langchain's sdk to create ai chatbots.

Right now its only chatbot to interact with lives at `/chat`.

It interacts with the backend route `/api/ask_tt_db` which is a gpt powered llm that leverages RAG (Retrieval-Augmented Generation) method for handling the vast additional context of our +120 DB tables.

The more relevant logic lives in file `src/app/api/ask_tt_db/route.ts`.

This is merely a first step into exploring the potential of the modules used in this project. It has huge room for improvement.

Hopefully it powers a more robust chatbot in the future and can be a playground for TT devs as we grow our set of AI tools in the platform.

## Contributing

Please feel free to open issues and pull requests!

To get your feet wet you can create a new bot by creating a new folder in the `src/app/api` directory and following the same structure as the `ask_tt_db` bot.

You can see `ask_tt_coding_standards` as an in progress example where we get the context from a .txt rather than a .js file.

Read more about langchain's nodejs sdk here:
[https://js.langchain.com/docs/get_started/introduction/](https://js.langchain.com/docs/get_started/introduction/)

And feel free to explore other ai frameworks that are not langchain and add them to the project.
