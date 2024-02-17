import { schemas } from '../../data/tt_db';
import { Document } from 'langchain/document';

interface TableColumn {
  column_name: string;
  data_type: string;
}

function loadDBSchemaRowsIntoLangchainDocs() {
  const tables: { [key: string]: TableColumn[] } = {};
  // NOTE: This 'tablesExtraContext might later be moved to a separate file where we can add more context to each table.
  // Examples of extra context could be db rows as examples, db queries from MB reports, etc.
  const tablesExtraContext: { [key: string]: { columns: { [key: string]: string }; extra?: string } } = {};
  for (const entry of schemas) {
    const { table_name, column_name, data_type } = entry;
    if (!tables[table_name]) {
      tables[table_name] = [];
    }
    tables[table_name].push({ column_name, data_type });
  }

  const documents = [];
  for (const [table_name, columns] of Object.entries(tables)) {
    let description = `This is the ${table_name} table. Here is a list of each column and its data type:\n\n`;
    for (const { column_name, data_type } of columns) {
      description += `${column_name}: ${data_type}\n`;
      // Add extra context if available
      if (tablesExtraContext[table_name]?.columns[column_name]) {
        description += tablesExtraContext[table_name].columns[column_name] + '\n';
      }
    }
    if (tablesExtraContext[table_name]?.extra) {
      description += '\n\n' + tablesExtraContext[table_name].extra;
    }
    documents.push(new Document({ pageContent: description }));
  }

  return documents;
}

export default loadDBSchemaRowsIntoLangchainDocs;
