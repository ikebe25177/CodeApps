# Copilot Studio + React + Power Apps ロードマップ

## 1. 目的
このドキュメントは、Copilot Studio を活用しながら React ベースでアプリを開発し、最終的に Power Apps 環境へ安全に展開するための実行ロードマップです。

---

## 2. 全体フロー（推奨順）

1. 要件定義とアーキテクチャ決定
2. テナント/環境の前提設定（セキュリティ・DLP・環境戦略）
3. 認証方式の決定（推奨: サービスプリンシパル）
4. React アプリ開発（ローカル）
5. Copilot Studio 側のエージェント/トピック/アクション整備
6. Power Apps への統合（Code Apps / Canvas 連携 / Dataverse 連携）
7. ALM（Dev → Test → Prod）と運用監視

---

## 3. フェーズ別ロードマップ

## フェーズA: 要件定義（Day 0）

- 対象業務のユースケースを定義（閲覧/入力/承認/通知）
- Copilot Studio に任せる範囲を決定（会話導線、FAQ、操作案内、アクション呼び出し）
- React で実装する範囲を決定（業務UI、ダッシュボード、複雑フォーム）
- Power Apps への落とし込み方式を決定

成果物:
- 画面一覧
- データモデル
- 認可モデル
- 展開戦略（環境分離方針）

## フェーズB: 環境・ガバナンス設定（Day 0-1）

- Power Platform 管理センターで Dev/Test/Prod 環境を準備
- 必要に応じて環境をセキュリティグループで制限
- DLP ポリシーでコネクタ利用制御
- Dataverse のテーブル/権限モデルを作成

成果物:
- 環境一覧（用途・管理者・接続制限）
- DLP ポリシー定義
- セキュリティロール一覧

## フェーズC: 認証/権限（Day 1）

推奨: サービスプリンシパル認証を標準化

- Entra ID で App Registration を作成
- Client ID / Tenant ID / Client Secret を発行
- Enterprise Application（サービスプリンシパル）を有効化
- Power Platform 管理スコープに必要なアクセスを付与
- 対象環境の Dataverse に Application User を作成
- Application User に必要ロールを付与

成果物:
- 認証情報の安全な保管先
- サービスプリンシパルの権限表

## フェーズD: React アプリ実装（Day 1-3）

- React UI を実装（一覧、検索、詳細、更新）
- Dataverse/API の接続実装
- 監査ログ、エラーハンドリング、再試行制御を実装
- Power Apps 埋め込み時の UI 制約（サイズ、レスポンシブ）を考慮

品質ゲート:
- 主要ユースケースの E2E 成功
- 主要操作の権限制御確認
- 例外時メッセージ確認

## フェーズE: Copilot Studio 実装（Day 2-4）

- トピック設計（問い合わせ分類、業務操作導線）
- ナレッジ接続（SharePoint、Web、Dataverse など）
- アクション連携（Power Automate / API 呼び出し）
- React 側の業務画面導線に接続

品質ゲート:
- 誤回答率の確認
- ハンドオフ導線（人手対応）確認
- 機密情報の出力抑止確認

## フェーズF: Power Apps への落とし込み（Day 4-5）

- build 実行
- Power Apps へ push/deploy
- 環境設定（接続参照、環境変数、ロール）を反映
- 動作確認（Dev → Test）

CLI 実行例:

```bash
npm run cli -- buildAndPush --authMode servicePrincipal \
  --tenantId <TENANT_ID> \
  --clientId <CLIENT_ID> \
  --clientSecret <CLIENT_SECRET> \
  --environmentId <ENVIRONMENT_ID>
```

## フェーズG: ALM・運用（継続）

- ソリューション化してバージョン管理
- Dev/Test/Prod で段階リリース
- 監視（エラー率、応答時間、失敗フロー）
- 定期レビュー（DLP、権限棚卸し、Secret ローテーション）

---

## 4. 必要な設定・権限（最小セット）

| 項目 | 必要ロール/設定 | 補足 |
|---|---|---|
| テナント管理 | Power Platform Administrator（推奨） | 環境参照・管理操作に必要 |
| 環境アクセス | セキュリティグループ割当（必要時） | 環境をグループ制限している場合は必須 |
| Dataverse 実行権限 | Application User + セキュリティロール | 最初は広め、安定後に最小権限へ絞る |
| デプロイ認証 | Entra App Registration（SPN） | Tenant/Client/Secret を安全保管 |
| データ保護 | DLP ポリシー | 業務外コネクタの混在を防止 |

---

## 5. 管理者向け設定チェックリスト

- App Registration が対象テナントに存在する
- Enterprise Application が有効
- サービスプリンシパルに Power Platform 管理スコープ権限が付与済み
- 対象環境で Application User が作成済み
- Application User に必要ロールが付与済み
- 環境のセキュリティグループ制限に SPN が含まれる
- DLP ポリシーが要件に一致
- Secret の有効期限とローテーション手順が定義済み

---

## 6. 典型的な詰まりポイント

- `pac auth create` は成功するが環境参照/管理APIで 403
- Dataverse ロールは付与済みだが、Power Platform 管理スコープ権限が不足
- 環境がセキュリティグループ制限されており SPN が未追加
- Dev では動くが Test/Prod の接続参照や環境変数が未設定
- CLI 実行ログに Secret が露出してしまう

---

## 7. セキュリティ留意点

- Client Secret はリポジトリ保存禁止
- 実行ログの Secret マスキングを必須化
- 最小権限原則でロール設計
- 監査ログ（誰がいつ何をデプロイしたか）を保存
- 本番は承認フロー付きデプロイを推奨

---

## 8. 推奨運用ルール

- 認証方式はサービスプリンシパルを標準に固定
- 個人アカウント（device code）は例外時のみ
- 変更は必ず Pull Request ベース
- 重要変更は Test 環境で検証後に Prod 反映
- Secret は 90 日周期などで定期ローテーション

---

## 9. 完了判定（Definition of Done）

- React アプリの主要業務シナリオが通る
- Copilot Studio の会話導線が業務要件を満たす
- Power Apps 環境で deploy 後の操作が再現できる
- 権限不足/403 が解消されている
- 運用手順（ローテーション、障害時対応、ロールバック）が文書化済み
