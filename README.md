# lab-sandbox-25177

お試し用repository（池部さん）

## 今回追加または変更した機能

- `sample-app` を新規追加
- Node.js + Express でローカルWebアプリを実装
- `/` でサンプル画面を表示
- `/api/status` で動作確認用JSONを返却

## アーキテクチャ

- 単一プロセス・単一ポート構成
- `server.js` が静的ファイル配信とAPI提供を同時に担当
- フロントエンドは `sample-app/public` のHTML/CSS/JSをそのまま配信

## 使用技術

- Node.js
- Express
- HTML / CSS / JavaScript

## セットアップまたは起動方法

1. 依存関係をインストール

	```bash
	cd sample-app
	npm install
	```

2. アプリを起動

	```bash
	npm start
	```

## 画面確認方法

- `sample-app` を起動した状態で、VS Codeのポートタブから `8006` を開いて確認
- 画面の「APIステータスを確認」ボタンで `/api/status` の疎通を確認

## 使用ポート

- `8006`（`0.0.0.0:8006` で待ち受け）

## Power Apps への落とし込み

- `testCodeApps/PowerAppsCodeApps/samples/HelloWorld` を、外部監査管理アプリ向けのダッシュボードUIに更新
- 監査案件一覧、重大指摘、次アクション、進行状況KPIを表示する構成へ変更
- Power Apps への反映は `pac auth create --deviceCode` と `pac code push` を利用

## testCodeApps

testCodeApps/codeApps.ps1 は Power Apps Code Apps のサンプル取得、依存関係のインストール、ローカル開発、ビルドと push を補助するスクリプトです。

主な挙動:
- Git clone と npm install は認証なしで実行します。
- pac auth create は build/push の直前にだけ実行します。
- コンテナ環境では既定で device code 認証を使います。

主な引数:
- -Workspace: 作業ディレクトリ
- -StartDev: npm run dev を実行
- -BuildAndPush: build 後に pac code push を実行
- -AuthMode deviceCode|interactive|none: 認証方式を選択

権限メモ:
- 対象環境への接続と push には Power Platform 環境へのアクセス権が必要です。
- 典型的には Environment Maker、または Dataverse の System Customizer / System Administrator 相当の権限が必要です。
