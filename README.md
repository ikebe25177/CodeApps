# lab-sandbox-25177

お試し用repository（池部さん）

## 今回追加または変更した機能

- PowerShell エントリを廃止し、実行導線を Node.js CLI に統一
- `sample-app/codeapps-cli.js` を追加し、`prepare` / `startDev` / `buildAndPush` を実行可能化
- `sample-app` の画面を React UI 化し、ブラウザからジョブ実行とログ確認を可能化
- `sample-app/server.js` にタスクAPIを追加（`/api/tasks`, `/api/dev/start`, `/api/dev/stop`）

## アーキテクチャ

- 単一プロセス・単一ポート構成
- `sample-app/server.js` が静的配信・React UI・実行APIを同時に提供
- Node.js 実行ロジックは `sample-app/src/codeAppsRunner.js` に集約
- 実行エントリは `sample-app/codeapps-cli.js` に統一

## 使用技術

- Node.js
- Express
- React 18 (CDN)
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

3. CLI を直接使う場合

	```bash
	npm run cli -- prepare
	npm run cli -- startDev
	npm run cli -- buildAndPush --authMode servicePrincipal --tenantId <TENANT_ID> --clientId <CLIENT_ID> --clientSecret <CLIENT_SECRET>
	```

## 画面確認方法

- `sample-app` を起動した状態で、VS Code のポートタブから `8006` を開いて確認
- React UI のフォームで環境値を設定し、`Prepare` / `Build & Push` / `Start Dev` を実行
- 画面下部のログ欄で処理ログを確認

## 使用ポート

- `8006`（`0.0.0.0:8006` で待ち受け）

## Power Apps への落とし込み

- `testCodeApps/PowerAppsCodeApps/samples/HelloWorld` を、外部監査管理アプリ向けのダッシュボードUIに更新
- 監査案件一覧、重大指摘、次アクション、進行状況KPIを表示する構成へ変更
- Power Apps への反映は `pac auth create` のサービスプリンシパル認証と `pac code push` を利用

## Node CLI

`sample-app/codeapps-cli.js` が CodeApps 操作の唯一のエントリです。

主な挙動:
- Git clone と npm install は認証なしで実行します。
- pac auth create は build/push の直前にだけ実行します。
- 既定ではサービスプリンシパル認証を使います。

主なコマンド:
- `npm run cli -- prepare`
- `npm run cli -- startDev`
- `npm run cli -- buildAndPush --authMode servicePrincipal --tenantId <TENANT_ID> --clientId <CLIENT_ID> --clientSecret <CLIENT_SECRET>`

権限メモ:
- 対象環境への接続と push には Power Platform 環境へのアクセス権が必要です。
- 典型的には Environment Maker、または Dataverse の System Customizer / System Administrator 相当の権限が必要です。
- サービスプリンシパル認証では、アプリ登録自体に Power Platform 管理スコープのアクセス許可（環境参照権限）が必要です。
