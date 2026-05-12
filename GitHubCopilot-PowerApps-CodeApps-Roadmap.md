# GitHub Copilot + React + Power Apps（CodeApps）ロードマップ

## 1. 目的
本ドキュメントは、GitHub Copilot を活用して React ベースのアプリを開発し、Power Apps（CodeApps）として安全に落とし込むための実行計画です。

---

## 2. 全体像（推奨フロー）

1. 要件整理（業務要件・データ要件・権限制約）
2. 開発土台の準備（CodeApps プロジェクト、環境、認証方式）
3. React 実装（画面・状態管理・エラー処理）
4. CodeApps 組み込み（build/push 導線）
5. 権限・セキュリティ確認（SPN 権限、Dataverse ロール、DLP）
6. 検証（Dev → Test）
7. 本番反映と運用（Prod、監視、ローテーション）

---

## 3. フェーズ別ロードマップ

## フェーズA: 企画・設計

- ユースケースを整理
  - 例: 一覧表示、検索、更新、承認、監査
- Copilot と人の分担を決定
  - Copilot: UI 雛形、API 呼び出し、テスト雛形、リファクタ案
  - 人: 業務仕様確定、権限設計、最終レビュー
- データモデルを確定
  - Dataverse テーブル、主キー、関連、監査列

成果物:
- 画面一覧
- API/データ定義
- 権限マトリクス

## フェーズB: 環境とガバナンス準備

- Power Platform 管理センターで環境を分離
  - Dev / Test / Prod
- DLP ポリシー適用
- 環境変数・接続参照戦略を定義
- 必要に応じて環境をセキュリティグループで制限

成果物:
- 環境構成図
- DLP 定義
- 接続参照・環境変数ルール

## フェーズC: 認証方式の標準化（推奨: サービスプリンシパル）

- Entra ID で App Registration を作成
- Tenant ID / Client ID / Client Secret を発行
- Enterprise Application（サービスプリンシパル）を有効化
- Power Platform 管理スコープのアクセス権を付与
- Dataverse に Application User を作成しロール付与

成果物:
- 認証情報保管ポリシー
- SPN 権限チェックリスト

## フェーズD: React 開発（GitHub Copilot 活用）

- Copilot で初期 UI を作成し、人が業務仕様に合わせて調整
- API 呼び出し層を分離
- エラー時 UI（再試行・通知）を実装
- ログ/監査を意識した設計

推奨実装ルール:
- コンポーネント単位で責務分離
- フォーム入力バリデーション明示
- 権限不足時のハンドリングを必須化

## フェーズE: CodeApps 統合

- `prepare` 実行で依存・初期化確認
- `buildAndPush` で Power Apps に反映
- 環境ID・認証方式・接続参照を明示指定

実行例:

```bash
npm run cli -- prepare
npm run cli -- buildAndPush --authMode servicePrincipal \
  --tenantId <TENANT_ID> \
  --clientId <CLIENT_ID> \
  --clientSecret <CLIENT_SECRET> \
  --environmentId <ENVIRONMENT_ID>
```

## フェーズF: 検証（Dev/Test）

- 機能確認
  - 主要シナリオが成立
- 権限確認
  - 非許可ユーザーは適切に拒否
- 性能確認
  - 一覧表示・検索・更新が許容時間内
- 障害確認
  - API 失敗時にユーザー向けエラー表示が適切

## フェーズG: 本番展開・運用

- Test 承認後に Prod へ反映
- リリースノート管理
- 監視項目を定義
  - 失敗率、応答時間、認証エラー
- Secret ローテーション運用

---

## 4. 必要な設定・権限

| 区分 | 必要項目 | 最低限の考え方 |
|---|---|---|
| Entra | App Registration（SPN） | Tenant/Client/Secret を発行 |
| Power Platform 管理 | 管理スコープ権限 | 環境参照・管理APIに必要 |
| 環境アクセス | セキュリティグループ設定 | 制限環境なら SPN をグループに追加 |
| Dataverse | Application User + セキュリティロール | 初期は広め、安定後に最小権限化 |
| 開発運用 | DLP / 接続参照 / 環境変数 | 環境差分を吸収しやすくする |

---

## 5. 管理者向け設定手順（要点）

1. Entra ID で App Registration を作成
2. Enterprise Application を確認
3. サービスプリンシパルに Power Platform 管理スコープ権限を付与
4. 対象環境の Dataverse で Application User 作成
5. Application User に必要ロール付与（検証時は強め、後で絞る）
6. 環境がセキュリティグループ制限の場合は SPN を追加

---

## 6. よくある失敗と対策

- 失敗: `pac auth create` 後に 403
  - 対策: Dataverse ロールだけでなく、Power Platform 管理スコープ権限も確認
- 失敗: 環境が見えない
  - 対策: 環境ID誤り、セキュリティグループ未参加、テナント不一致を確認
- 失敗: Dev で成功・Test/Prod で失敗
  - 対策: 接続参照、環境変数、ロール差分を点検
- 失敗: シークレット漏えい
  - 対策: CLI ログマスキング、Secrets 管理ストア利用、定期ローテーション

---

## 7. 留意点（実務上重要）

- 認証方式は今後もサービスプリンシパルを標準化
- 個人アカウント（device code）は例外対応のみ
- コードレビュー時は Copilot 生成コードの責務境界を重点確認
- 依存ライブラリ更新時は Power Apps 側の挙動影響を確認
- 本番反映は必ず Test での手順再現後に実施

---

## 8. 推奨チェックリスト（リリース前）

- [ ] SPN で `buildAndPush` が成功する
- [ ] 主要業務シナリオが Test で再現できる
- [ ] 権限不足時の表示/制御が正しい
- [ ] 監査ログ・エラーログが取得できる
- [ ] Secret ローテーション手順が更新されている

---

## 9. Definition of Done

- React アプリ機能が要件を満たす
- CodeApps として Power Apps 環境で実行できる
- 認証・権限・DLP が運用基準を満たす
- リリース手順とロールバック手順が文書化済み
