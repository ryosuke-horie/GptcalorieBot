import * as line from "@line/bot-sdk";
import { Configuration, OpenAIApi } from "openai";
require('dotenv').config();

const LINE_TOKEN = process.env.LINE_TOKEN;
const GPT_KEY = process.env.GPT_KEY;

export const handler = async(event) => {
    const client = new line.Client({
    channelAccessToken: LINE_TOKEN,
  });

  const reqBody = JSON.parse(event.body);
  console.log(reqBody)

  let message = {};

  if (reqBody.events[0].message.type == "text") {
    const configuration = new Configuration({
      apiKey: GPT_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: reqBody.events[0].message.text,
      max_tokens: 1000,
      temperature: 0,
    });

    message = {
      type: "text",
      text: response.data.choices[0].text.trim()
    };
  } else {
    message = {
      type: "text",
      text: "テキストを入力してください。"
    };
  }

  const toToken = reqBody.events[0].source.userId;

  await client.pushMessage(toToken, message).catch((err) => {
    // error handling
    console.error(err);
  });
    const response = {
        statusCode: 200,
        body: JSON.stringify(message),
    };
    return response;
};
