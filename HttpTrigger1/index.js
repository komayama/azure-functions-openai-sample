const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");

const endpoint = process.env["ENDPOINT"] || "<endpoint>";
const azureApiKey = process.env["AZURE_API_KEY"] || "<api key>";

const messages = [
    { role: "system", content: "Azure Functionsを使用して開発するメリットを教えてください。" }
];
    
const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
const deploymentId = "komayama-gpt-35-japaneast";


module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const events = await client.listChatCompletions(deploymentId, messages, { maxTokens: 800 });

    let response = "";
    for await (const event of events) {
        for await (const choice of event.choices) {
          const delta = choice.delta?.content;
          if (delta !== undefined) {
            response += delta;
          }
        }
      }

    context.log(response);
    
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: response
    };
}