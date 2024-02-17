import fs from 'fs';
import path from 'path';

// This function is only used once, to build the robust object from our models dir.
function prepareModelContents() {
  const modelsDir = '/Users/juanchaher/dev/tt-ai-chats/src/data/tt_models'
  const modelContents:any = {};

  const modelFiles = fs.readdirSync(modelsDir);

  for (const fileName of modelFiles) {
    if (path.extname(fileName) === '.js') {
      const filePath = path.join(modelsDir, fileName);
      const content = fs.readFileSync(filePath, 'utf8');
      const tableName = path.basename(fileName, '.js');
      modelContents[tableName] = content;
    }
  }

    const jsonModelContents = JSON.stringify(modelContents, null, 2);
    const jsonModelContentsPath = '/Users/juanchaher/dev/tt-models.json';
    fs.writeFileSync(jsonModelContentsPath, jsonModelContents);

  return modelContents;
}

export default prepareModelContents;