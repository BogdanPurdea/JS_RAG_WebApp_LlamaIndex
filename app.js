import * as mod from "https://deno.land/std@0.213.0/dotenv/mod.ts";
import { 
    Document, 
    VectorStoreIndex, 
    SimpleDirectoryReader, 
    RouterQueryEngine,
    OpenAIAgent,
    QueryEngineTool,
    FunctionTool} from "npm:llamaindex";

const keys = await mod.load({export: true}); //read API key from .env

const documents1 = await new SimpleDirectoryReader().loadData({directoryPath: "./data"});
const index1 = await VectorStoreIndex.fromDocuments(documents1);
// const llm = HuggingFaceLLM(
//     context_window=4096,
//     max_new_tokens=256,
//     generate_kwargs={"temperature": 0.7, "do_sample": False},
//     system_prompt=system_prompt,
//     query_wrapper_prompt=query_wrapper_prompt,
//     tokenizer_name="StabilityAI/stablelm-tuned-alpha-3b",
//     model_name="StabilityAI/stablelm-tuned-alpha-3b",
//     device_map="auto",
//     stopping_ids=[50278, 50279, 50277, 1, 0],
//     tokenizer_kwargs={"max_length": 4096},
// );
// Settings.llm = llm;
// Settings.chunk_size = 1024;

const queryEngine1 = index1.asQueryEngine();

// const handler = (req) => {
//     //Create a new response object
//     const body = new TextEncoder().encode("Hello world!");
//     return new Response(body, { status: 200 });
// }
// let server = Deno.serve({ port: 8001 }, handler);
// const response = await fetch("http://localhost:8001");
// await response.text();

const documents2 = await new SimpleDirectoryReader().loadData({directoryPath: "./data2"});
const index2 = await VectorStoreIndex.fromDocuments(documents2);
const queryEngine2 = index2.asQueryEngine();

const queryEngine = await RouterQueryEngine.fromDefaults({
    queryEngineTools: [
        {
            queryEngine: queryEngine1,
            description: "Useful for questions about Dan Abramov"
        },
        {
            queryEngine: queryEngine2,
            description: "Useful for questions about the React library"
        }
    ]
});

function sumNumbers({a, b}) {
    return a + b;
}

const sumJSON = {
    type: "object",
    properties: {
        a: {
            type: "number",
            description: "The first number"
        },
        b: {
            type: "number",
            description: "The second number"
        }
    },
    required: ["a", "b"]  
};

const sumFunctionTool = new FunctionTool(sumNumbers, {
    name: "sumNumbers",
    description: "Use this function to sum two numbers",
    parameters: sumJSON
});

const queryEngineTool = new QueryEngineTool({
    queryEngine: queryEngine,
    metadata: {
        name: "react_and_dan_abramov_engine",
        description: "A tool that can answer questions about Dan Abramov and the React library"
    }
});

const agent = new OpenAIAgent({
    tools: [queryEngineTool, sumFunctionTool],
    verbose: true
});

const handler = async (req) => {
    if(req.method == "POST") {
        //expecting the incoming query to be a JSON object of the form {query: ...}
        let data = await req.json();
        let answer = await queryEngine.query({query: data.query});
        //and out response will be a JSON object of the form {response: ...}
        let responseObj = {
            response: answer.toString()
        }
        return new Response(JSON.stringify(responseObj), {
            status: 200
        });
    } else {
        return new Response("Not found", { status: 404 });
    }
}

let server = Deno.serve({ port: 8002 }, handler);
let data = {query: "How does Dan Abramov feel about college?"};
let data2 = {query: "What is React?"};
let response = await fetch("http://localhost:8002", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(data) //Convert the JavaScript object to a JSON string
});


let responseObj = await response.json();
console.log(responseObj.response);

let response1 = await agent.chat({message: "What is React? Use a tool."});
console.log(response1.response.message.content);

await server.shutdown();
