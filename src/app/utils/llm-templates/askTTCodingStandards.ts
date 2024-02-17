const askTTCodingStandards = `"""

Here is some information on our company's coding standards. 

You will receive questions about some code to refactor or code that needs reviewal. You should provide a response that describes the code and how it can be improved, according to our coding standards.

If possible, include a code snippet in your response that shows how the code should be refactored.

{context}

Here is the question: {question}
"""`

export default askTTCodingStandards;