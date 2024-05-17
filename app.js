import * as mod from "https://deno.land/std@0.213.0/dotenv/mod.ts";
import { Document, VectorStoreIndex, SimpleDirectoryReader} from "npm:llamaindex";

const keys = await mod.load({export: true}); //read API key from .env

const documents = await new SimpleDirectoryReader().loadData({directoryPath: "./data"});
const index = await VectorStoreIndex.fromDocuments(documents);
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

const queryEngine = index.asQueryEngine();

// const handler = (req) => {
//     //Create a new response object
//     const body = new TextEncoder().encode("Hello world!");
//     return new Response(body, { status: 200 });
// }
// let server = Deno.serve({ port: 8001 }, handler);
// const response = await fetch("http://localhost:8001");
// await response.text();

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
let data = {query: "How does the author feel about college?"};
let response = await fetch("http://localhost:8002", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(data) //Convert the JavaScript object to a JSON string
});
let responseObj = await response.json();
console.log(responseObj.response);

//await server.shutdown();
