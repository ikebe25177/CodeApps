# Power Platform CLI 認証・権限確認メモ

## 目的

Power Apps Code Apps のサンプルをコンテナ環境から実行するにあたり、Power Platform CLI (`pac`) の認証と権限で詰まっている点を整理し、上長確認が必要な事項を明確にする。

## 現在の状況

- Node.js LTS と npm は利用可能
- Power Platform CLI (`pac`) はこのコンテナで利用可能
- サンプルの取得、`npm install`、`pac code init` は実行可能
- このコンテナ内には現在、有効な `pac` 認証プロファイルが存在しない
- `pac auth create --deviceCode` 自体は開始可能だが、認証後に対象環境へのアクセス権不足の可能性がある

## 発生した問題

### 1. 通常の `pac auth create` がそのまま使えない

原因:
- この作業環境は Dev Container 内の Linux ターミナル
- `pac auth create` の通常サインインはブラウザ起動前提
- コンテナ内からローカルブラウザを自動で開けず、対話ブラウザ認証が成立しない

影響:
- SSO に近い通常の対話ログインは、このコンテナ内では実質使いにくい

### 2. デバイスコード認証では権限不足の可能性がある

原因候補:
- サインイン自体はできても、対象環境へのアクセス権が不足している
- Power Platform 環境には入れても、Code Apps の作成・更新・push に必要な権限が不足している

影響:
- `pac auth create --deviceCode` 後も、環境参照や push が失敗する可能性がある

### 3. スクリプトが認証を早い段階で要求していた

元のスクリプトの問題:
- Git clone、`npm install`、`pac code init` のようなローカル作業にもかかわらず、途中で `pac auth create` を無条件実行していた

対応済み:
- `pac auth create` は build/push の直前だけ実行するよう変更済み
- 認証方式を `-AuthMode deviceCode|interactive|none` で切り替え可能に変更済み
- コンテナ環境向けに既定値を `deviceCode` に変更済み

## `pac auth create` が必要なタイミング

必須ではない作業:
- Git clone
- `npm install`
- `pac code init`
- ローカル開発の準備

必要になる作業:
- `pac env list` など、Power Platform 環境情報の取得
- 対象環境への接続確認
- `pac code push --environment <EnvironmentId>` の実行
- Dataverse / Power Apps 環境に対する変更反映

## 利用可能な認証方式

### 1. interactive

概要:
- ブラウザを開いてサインインする通常の対話認証

この環境での状況:
- コンテナからブラウザを開けないため不向き

### 2. deviceCode

概要:
- CLI がコードを表示し、別ブラウザで入力して認証する方式

この環境での状況:
- 実行可能
- ただし、対象環境に対する権限がないと、その後の操作は失敗する

### 3. service principal

概要:
- Azure AD アプリ登録を用いた非対話認証

この環境での状況:
- 技術的には可能
- ただし、アプリ登録、クライアント ID、シークレットまたは証明書、テナント情報、Power Platform 側のアプリケーションユーザー設定が必要

## 必要と考えられる権限

最低限確認したい権限:
- 対象 Power Platform 環境へのアクセス権
- 対象環境でのアプリ作成・更新権限

典型的に必要な権限候補:
- Environment Maker
- Dataverse の System Customizer
- Dataverse の System Administrator

補足:
- サービスプリンシパルを使う場合も、Dataverse 側で同等のセキュリティロールが必要
- 権限とは別に、必要なライセンスが不足していると操作できない場合がある

## 上長に確認したい事項

1. 対象環境 `91c808ac-8704-ea1c-bcd8-27eac0cddab8` に対して、自分のアカウントにアクセス権が付与されているか
2. Code Apps の作成・更新・push を行う前提で、`Environment Maker` または同等以上の権限を付与してよいか
3. Dataverse 利用前提の場合、`System Customizer` または `System Administrator` のいずれが適切か
4. ユーザーアカウントで進めるべきか、サービスプリンシパルで進めるべきか
5. 必要な Power Apps / Dataverse ライセンスが割り当て済みか

## 権限確認後にやること

1. `pac auth create --deviceCode --environment 91c808ac-8704-ea1c-bcd8-27eac0cddab8` を実行
2. `pac auth list` で認証プロファイル作成を確認
3. `pac env list` で対象環境が見えるか確認
4. 必要に応じて `pac code push --environment 91c808ac-8704-ea1c-bcd8-27eac0cddab8` を実行

## 判断の要点

- このコンテナに `pac` 認証プロファイルを追加すること自体は可能
- ただし、認証プロファイルを作れることと、対象環境を操作できることは別問題
- 現在の主なボトルネックは、認証方式そのものより、対象環境に対する権限不足の可能性