import { Document } from 'langchain/document';
import { modelsData } from '../../data/tt-models'
 
function loadDBModelsIntoLangchainDocs() {
  const documents = [];
  for (const model of Object.keys(modelsData)) {
    const modelContent = modelsData[model];
    const docContent = `Here is the sequelize model for table ${model} with its corresponding associations in the bottom part:\n\n${modelContent}`
    const document = new Document({
      pageContent: docContent,
      metadata: { modelName: model }
    });
    documents.push(document);
  }
  return documents;
}

export default loadDBModelsIntoLangchainDocs;
