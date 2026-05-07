# HelloWorld Power Apps Sample

このサンプルは、外部監査管理アプリのダッシュボードUIとして作り替えた Power Apps Code Apps サンプルです。

## 1. 依存関係をインストール

```bash
cd samples/HelloWorld
npm install
```

## 2. Code Apps の初期化

```bash
pac code init
```

## 3. ローカルプレビュー

```bash
npm run dev
```

補足:
- 画面は「監査案件一覧」「重大指摘」「次アクション」を確認できる外部監査管理ダッシュボードです。
- 今後は Dataverse テーブルや Power Platform コネクタに接続して監査案件を実データ化できます。

## 4. Power Apps へ反映

権限確認後に認証し、push します。

```bash
pac auth create --deviceCode --environment {environment id}
npm run build
pac code push --environment {environment id}
```

## 注意点

- `pac auth create` は環境アクセス権がないと完了しても後続操作が失敗します。
- 典型的には `Environment Maker` または Dataverse の `System Customizer` / `System Administrator` 相当の権限が必要です。
