// 1. Import necessary modules and libraries
const { OpenAI } = require('langchain/llms');
const { RetrievalQAChain } = require('langchain/chains');
const { HNSWLib } = require('langchain/vectorstores');
const { OpenAIEmbeddings } = require('langchain/embeddings');
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const fs = require("fs");


module.exports = getAnswer = async (req, res) => {
    try {
        // 2. Load environment variables
        require("dotenv").config();

        // 3. Set up input data and paths
        const txtFilename = "The_Great_Gatsby";
        const question = "Tell me about “The Experimenter and the Finisher";
        const txtPath = `./${txtFilename}.txt`;
        const VECTOR_STORE_PATH = `${txtFilename}.index`;


        // 4. Define the main function runWithEmbeddings
        const runWithEmbeddings = async () => {
            // 5. Initialize the OpenAI model with an empty configuration object
            const model = new OpenAI({});

            // 6. Check if the vector store file exists
            let vectorStore;
            if (fs.existsSync(VECTOR_STORE_PATH)) {
                // 6.1. If the vector store file exists, load it into memory
                console.log('Vector Exists..');
                vectorStore = await HNSWLib.load(VECTOR_STORE_PATH, new OpenAIEmbeddings());
            } else {
                // 6.2. If the vector store file doesn't exist, create it
                // 6.2.1. Read the input text file
                const text = fs.readFileSync(txtPath, 'utf8');
                // 6.2.2. Create a RecursiveCharacterTextSplitter with a specified chunk size
                const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
                // 6.2.3. Split the input text into documents
                const docs = await textSplitter.createDocuments([text]);
                // 6.2.4. Create a new vector store from the documents using OpenAIEmbeddings
                console.log('Creating documents...');
                vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());
                // 6.2.5. Save the vector store to a file
                await vectorStore.save(VECTOR_STORE_PATH);
            }

            // 7. Create a RetrievalQAChain by passing the initialized OpenAI model and the vector store retriever
            const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());

            // 8. Call the RetrievalQAChain with the input question, and store the result in the 'res' variable
            const res = await chain.call({
                query: question,
            });

            // 9. Log the result to the console
            console.log({ res });
        };

        // 10. Execute the main function runWithEmbeddings
        await runWithEmbeddings();

        return res.status(200).send({ message: 'The API is working fine' });
    } catch (error) {
        console.log(error);
        return res.status(400).send(error);
    }
};
