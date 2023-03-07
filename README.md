# ojosama-translator

## 概要
`ojosama-translator`は世界が素晴らしく素敵であることを再認識するためのSlackbotです。

実装は下記を参考にしています。
https://github.com/slackapi/reacjilator

## Get started
こちらではローカルで実行する際の手順を紹介します。  
ローカルでSlackAppを動作するためにngrokを使用しています。  
クラウド環境で実行する方は参考としてください。

### OpenAIのAPIキー作成
1. [OpenAIのAPI設定ページ](https://platform.openai.com/account/api-keys) にアクセスします。
1. `Create new secret key`を押下し、OpenAIのAPIキーを作成します。
1. 生成したAPIキーは後ほど使用するのでコピーして保存してください。

### SlackApp作成
1. [SlacakAPI](https://api.slack.com/) にアクセスします。
1. `Create New APP`を押下し、任意の名前でSlackAppを作成します。
1. `Basic Information`画面の`Signing Secret`は後ほど使用するのでコピーして保存してください。
1. `OAuth & Permissions`を押下して画面を遷移します。
1. `OAuth & Permissions`画面下部の`Scopes`で下記のScopeを設定します。
    - channels:history
    - chat:write
    - reactions:read
1. `OAuth & Permissions`画面の`Install App to workspace`を押下します。
1. ワークスペースにアプリのインストールを求める画面が出てくるので、承認します。
1. `OAuth & Permissions`画面上部の`Bot User OAuth Token`は後ほど使用するのでコピーして保存してください。

### ngrokインストール
1. [ngrok](https://dashboard.ngrok.com/get-started/your-authtoken)にアクセスして登録を行います。
1. [ngrokのAuthTokenページ](https://dashboard.ngrok.com/get-started/your-authtoken)にアクセスします。
1. 画面上部の`Authtoken`は後ほど使用するのでコピーして保存してください。
1. ローカルPCで端末を開きます。
1. 下記コマンドでngrokをインストールします。
   ```
   brew install ngrok/ngrok/ngrok
   ```
1. 下記コマンドでngrokの設定をします。
   ```
   ngrok config add-authtoken {ngrokのAuthtoken}
   ```
1. 下記コマンドでngrokを起動します。
   ```
   ngrok http 3000
   ```
1. Fowardingの行に出力したURL`https://XXXXXXXXX.ngrok.io`は後ほど使用するのでコピーして保存してください。

### アプリ起動
1. 下記コマンドで環境変数を登録します。
    ```
    export SLACK_BOT_TOKEN={SlackAPIのBot User OAuth Token}
    export SLACK_SIGNING_SECRET={SlackAPIのSigning Secret}
    export OPENAI_API_KEY={OpenAIのAPIキー}
    ```
1. 下記コマンドでアプリを起動します。
    ```
    node app.js
    ```

### イベントのリクストURL登録
1. [SlacakAPI](https://api.slack.com/) にアクセスします。
1. `Event Subscriptions`を押下して画面を遷移します。
1. `Request URL`に`{ngrokのFowardingURL}/slack/events`を入力します。
1. `Subscribe to bot events`に`reaction_added`を追加します。

### テスト
1. Slackを開きます。
1. テスト用のチャンネルの上部チャンネル名を押下します。
1. `Integrations`を押下し、`Add apps`から作成したSlackAppを追加します。
1. テスト用メッセージを投稿します。
1. 上記メッセージに対して:rose:スタンプを押下します。  
    正常に動作していれば上記メッセージに対して`お嬢様語`へと翻訳した内容を返信します。

