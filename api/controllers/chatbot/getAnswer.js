const { PineconeClient } = require("@pinecone-database/pinecone");
const { DirectoryLoader } = require("langchain/document_loaders/fs/directory");
const { TextLoader } = require("langchain/document_loaders/fs/text");
const { PDFLoader } = require("langchain/document_loaders/fs/pdf");
const { createPineconeIndex } = require("../../../utils/database/pinecone");
const { updatePinecone } = require("../../../utils/database/updateDocument.js");
const { queryPineconeVectorStoreAndQueryLLM } = require("../../../utils/database/queryPinecone.js");

require("dotenv").config();

module.exports = getAnswer = async (req, res) => {
    try {
        const question = "Who is mr Gatsby?";
        const indexName = "test-index";
        const vectorDimension = 1536;

        const client = new PineconeClient();
        await client.init({
            apiKey: process.env.PINECONE_API_KEY,
            environment: process.env.PINECONE_ENVIRONMENT,
        });

        // 7. Set up DirectoryLoader to load documents from the ./documents directory
        const loader = new DirectoryLoader("./documents", {
            ".txt": (path) => new TextLoader(path),
            ".pdf": (path) => new PDFLoader(path),
        });

        const docs = await loader.load();

        (async () => {
            // 11. Check if Pinecone index exists and create if necessary
            await createPineconeIndex(client, indexName, vectorDimension);
            // 12. Update Pinecone vector store with document embeddings
            await updatePinecone(client, indexName, docs);
            // 13. Query Pinecone vector store and GPT model for an answer
            await queryPineconeVectorStoreAndQueryLLM(client, indexName, question);
        })();



        return res.status(200).send({ message: 'The API is working fine' });
    } catch (error) {
        console.log(error);
        return res.status(400).send(error);
    }
};
