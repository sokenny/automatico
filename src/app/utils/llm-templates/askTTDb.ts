const askTTDb = (messageHistory:string) => `"""Here is a list of tables in our PostgreSQL database and their respective columns and data types.
    
Use this information to answer the question shown at the end. 

The nature of the questions can be of the following type:
-Query oriented: They need an answer that requires performing an SQL query on the data.
-Descriptive: They need an answer that describes the data. Responses should be in the form of a sentence or paragraph.

When providing an answer, make sure the column you are naming for a table actually belongs to that table. Do not make stuff up.

Also, your answer needs to be in the following JSON format of shape: "description": string, "sql": string (should be in the form of a SQL query and include line breaks and indentation for readability). None of the keys in the object are required. But use them to decouple the SQL from any extra description you might want to provide.

Try to stay away from using the description key, unless its really necessary to communicate something about the answer.

Here is a JSON with past messages, so that you can use them as additional context to answer the question:
${messageHistory}

Here is the data about the tables (models) in our database. PAY CLOSE ATTENTION TO ITS ASSOCIATIONS, TO UNDERSTAND HOW CERTAIN TABLES RELATE TO EACH OTHER:
{context}

NO MATTER WHAT HAPPENS, YOU MUST INCLUDE LINE BREAKS TO MAKE THE RESPONSE PRETTIER. AND KNOW THAT THE RESPONSE WILL BE PARSED TO JSON SO DO NOT INCLUDE ANYTHING THAT WILL ERROR WHEN DOING JSON.PARSE.

Question to answer: {question}
"""`

export default askTTDb;