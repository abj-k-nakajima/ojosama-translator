const { App } = require("@slack/bolt");
const { Configuration, OpenAIApi } = require("openai");

system_settings = `これから私が入力する文章をお嬢様語に変換するタスクを行います。
お嬢様語は基本的に丁寧語であり、各名詞の前に「お」をつけます。
お嬢様語は基本的に「ですわ」もしくは「わ」を語尾に付けることが多く、少し偉そうな口調です。
日本語の入力に対するお嬢様語の出力サンプルを以下に列挙します。

日本語: こんにちは
お嬢様語: ご機嫌よう

日本語: ごめんなさい
お嬢様語: ごめんあそばせ

日本語: おはようございます
お嬢様語: 本日も太陽が輝いていますわ

日本語: トイレに行きます
お嬢様語: お花を摘んでまいりますわ

日本語: これはテストメッセージです
お嬢様語: テストメッセージですわね

日本語: 明日の天気は晴れです
お嬢様語: 明日も晴れ晴れ輝かしいですわね

日本語: 私は腹がすいている
お嬢様語: 私のお腹がペコでございますわ

日本語: あなたはパンを食べますか？
お嬢様語: 貴方はパンをお召し上がりになるかしら？

日本語: あなたは昨日何をしていましたか？
お嬢様語: 貴方は昨日何をなさっていたのかしら？

日本語: あなたの名前は何ですか？
お嬢様語: 貴方のお名前をいただけるかしら？


上記例を参考に、入力した文章をお嬢様語に翻訳してください。
ではタスクを開始します。`;

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.event("reaction_added", async ({ event, client }) => {
  const { type, reaction, item } = event;

  if (type === "reaction_added") {
    if (item.type !== "message") {
      return;
    }
    if (reaction === "rose") {
      let messages = await getMessage(item.channel, item.ts, client);

      console.log(messages);
      console.log(messages[0].reactions);
      const rose = messages[0].reactions.find((el) => el.name == "rose");
      if (rose.count < 2) {
        const response = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            // gpt-3.5-turbo-0301はsystemよりもuserに注目するようなので、systemではなくuserでシステムメッセージを入力
            // https://platform.openai.com/docs/guides/chat/instructing-chat-models
            { role: "user", content: system_settings },
            {
              role: "user",
              content:
                "次のmarkdownをお嬢様語に翻訳してください。\n" +
                messages[0].text,
            },
          ],
        });
        console.log(response.data.choices[0].message.content);

        const result = await client.chat.postMessage({
          text: response.data.choices[0].message.content,
          channel: item.channel,
          thread_ts: item.ts,
        });
      }
    }
  }
});

const getMessage = async (channel, ts, client) => {
  try {
    const result = await client.conversations.replies({
      channel: channel,
      ts: ts,
      limit: 1,
      inclusive: true,
    });
    return result.messages;
  } catch (e) {
    console.log(e);
  }
};

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log("⚡️ Bolt app is running!");
})();
