# PLATEAU Linked Open Dataを公開するプログラムの利用マニュアル

## Firebaseの準備

[Firebase](https://firebase.google.com/?hl=ja)のプロジェクトをあらかじめセットアップしてください。
Firebaseの利用手順などの情報は[Firebaseのウェブサイト](https://firebase.google.com/?hl=ja)を参照してください。

## PLATEAU Linked Open Dataのアップロード

1. プロジェクトルートからadmin-toolsのディレクトリに移動します。
2. `yarn`を実行して必要なパッケージをインストールします。

admin-toolsを使えるように設定します。

1. FirebaseのコンソールからダウンロードできるJSON形式のサービスアカウントのキーをJSONファイルとしてadmin-tools配下の任意のディレクトリに配置します。
2. .env.sampleを.envに変更し、SERVICE_ACCOUNTに1.で設定したJSONファイルのパスを設定します。
3. 建物データを`input-resources/building/*/*.jsonld`フォルダに、不動産IDデータを`input-resources/realestateid/*/*.jsonld`フォルダに配置します。
4. `node import_data.js`を実行します。

## PLATEAU Linked Open Dataを参照解決する機能の公開準備

Cloud Functions上にLinked Open Dataを参照解決する仕組みを構築します。

1. functionsフォルダに移動します。
2. `yarn`を実行します。

## ポータルウェブサイトの公開準備

プロジェクトルートで以下の操作をします。
.env.sampleを.envに変更し、VITE_PROXYにURLを設定します。

## デプロイ

1. ローカルで動作させるには`yarn dev`を実行します。
2. Firebaseにデプロイするには、`firebase deploy`を実行します。
