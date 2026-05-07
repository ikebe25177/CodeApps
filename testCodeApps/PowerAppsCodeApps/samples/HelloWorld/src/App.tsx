import React, { useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  FluentProvider,
  makeStyles,
  shorthands,
  Text,
  tokens,
  webLightTheme,
} from '@fluentui/react-components';

import './App.css';

const audits = [
  {
    id: 'AU-24018',
    company: 'Northwind Logistics',
    category: '財務監査',
    owner: '佐藤 優',
    due: '2026-05-18',
    risk: '高',
    progress: '83%',
  },
  {
    id: 'AU-24022',
    company: 'Contoso Medica',
    category: '個人情報',
    owner: '森本 結衣',
    due: '2026-05-23',
    risk: '中',
    progress: '61%',
  },
  {
    id: 'AU-24031',
    company: 'Fabrikam Energy',
    category: '調達統制',
    owner: '高橋 智也',
    due: '2026-05-29',
    risk: '高',
    progress: '47%',
  },
];

const findings = [
  {
    title: '委託先管理台帳の更新遅延',
    severity: '重大',
    note: '四半期棚卸の証跡が2件未登録。是正期限は5/14。',
  },
  {
    title: '経費承認フローの職務分掌不備',
    severity: '注意',
    note: '承認者と申請者のロール分離確認が未完了。',
  },
  {
    title: '外部SaaS契約の保管先分散',
    severity: '要確認',
    note: '最新契約書の保管先が複数あり、参照統制が弱い。',
  },
];

const actions = [
  '監査対象先へ是正依頼を送付',
  '重大指摘のエビデンス回収状況を更新',
  '月次レビュー会議向けに監査サマリを確定',
];

const useStyles = makeStyles({
  root: {
    height: '100vh',
    width: '100vw',
    background:
      'radial-gradient(circle at 12% 14%, #d8f3e8, transparent 42%), radial-gradient(circle at 88% 12%, #dbe8ff, transparent 34%), radial-gradient(circle at 75% 82%, #fbe6d4, transparent 36%), #f3f6f8',
    ...shorthands.padding('24px'),
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'center',
    overflowY: 'auto',
    overflowX: 'hidden',
    boxSizing: 'border-box',
    position: 'relative',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    maxWidth: '1080px',
    width: '100%',
    minHeight: 'calc(100vh - 48px)',
    ...shorthands.gap('20px'),
    ...shorthands.padding('40px', '0'),
    position: 'relative',
    zIndex: 1,
  },
  heroCard: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.78)',
    backdropFilter: 'blur(6px)',
    border: '1px solid rgba(255,255,255,0.85)',
    boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
    ...shorthands.padding('36px', '28px'),
  },
  eyebrow: {
    color: '#0b4f46',
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightBold,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    marginBottom: '10px',
  },
  heroTitle: {
    fontSize: 'clamp(2rem, 5vw, 3.4rem)',
    lineHeight: 1.08,
    fontWeight: tokens.fontWeightBold,
    color: '#182026',
    marginBottom: '14px',
  },
  lead: {
    maxWidth: '760px',
    fontSize: tokens.fontSizeBase400,
    lineHeight: 1.8,
    color: '#33424d',
    marginBottom: '22px',
  },
  badgeContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    ...shorthands.gap('12px'),
    marginBottom: '22px',
    flexWrap: 'wrap',
  },
  actionRow: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('14px'),
    flexWrap: 'wrap',
  },
  statusText: {
    fontWeight: tokens.fontWeightSemibold,
    color: '#0b5c52',
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '14px',
  },
  kpiCard: {
    backgroundColor: '#16212a',
    color: '#f7fafc',
    ...shorthands.padding('18px'),
    minHeight: '132px',
  },
  kpiLabel: {
    color: '#9fb4c3',
    marginBottom: '8px',
  },
  kpiValue: {
    fontSize: tokens.fontSizeHero700,
    fontWeight: tokens.fontWeightBold,
    lineHeight: 1,
    marginBottom: '8px',
  },
  kpiMeta: {
    color: '#d6e2ea',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1.6fr 1fr',
    gap: '14px',
    '@media (max-width: 900px)': {
      gridTemplateColumns: '1fr',
    },
  },
  infoCard: {
    backgroundColor: 'rgba(255,255,255,0.78)',
    backdropFilter: 'blur(6px)',
    border: '1px solid rgba(255,255,255,0.85)',
    boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
    ...shorthands.padding('18px'),
  },
  sectionTitle: {
    fontWeight: tokens.fontWeightBold,
    color: '#182026',
    marginBottom: '14px',
  },
  auditList: {
    display: 'grid',
    gap: '12px',
  },
  auditButton: {
    border: '1px solid #dde5ea',
    borderRadius: '14px',
    backgroundColor: '#fbfdff',
    textAlign: 'left',
    width: '100%',
    ...shorthands.padding('16px'),
  },
  auditTopRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '8px',
    flexWrap: 'wrap',
  },
  auditName: {
    fontWeight: tokens.fontWeightSemibold,
    color: '#182026',
  },
  auditMeta: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(120px, 1fr))',
    gap: '10px',
    '@media (max-width: 720px)': {
      gridTemplateColumns: '1fr',
    },
  },
  metaLabel: {
    color: '#677580',
    marginBottom: '2px',
  },
  metaValue: {
    color: '#24303a',
    fontWeight: tokens.fontWeightMedium,
  },
  infoTitle: {
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: '10px',
    color: '#182026',
  },
  findingsList: {
    display: 'grid',
    gap: '10px',
    marginBottom: '18px',
  },
  findingItem: {
    borderLeft: '4px solid #d2693c',
    backgroundColor: '#fffaf6',
    borderRadius: '10px',
    ...shorthands.padding('12px', '14px'),
  },
  findingTitle: {
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: '6px',
  },
  findingNote: {
    color: '#5a646d',
  },
  actionList: {
    display: 'grid',
    gap: '8px',
  },
  actionItem: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start',
    color: '#24303a',
  },
  actionDot: {
    width: '10px',
    height: '10px',
    borderRadius: '999px',
    backgroundColor: '#0b5c52',
    marginTop: '6px',
    flexShrink: 0,
  },
  footer: {
    fontSize: tokens.fontSizeBase200,
    color: '#54636e',
  },
  noise: {
    position: 'fixed',
    inset: 0,
    pointerEvents: 'none',
    opacity: 0.08,
    backgroundImage:
      'linear-gradient(0deg, transparent 24%, rgba(0,0,0,0.3) 25%, transparent 26%), linear-gradient(90deg, transparent 24%, rgba(0,0,0,0.3) 25%, transparent 26%)',
    backgroundSize: '3px 3px',
  },
});

const App: React.FC = () => {
  const styles = useStyles();
  const [status, setStatus] = useState('未確認');
  const [selectedAuditId, setSelectedAuditId] = useState(audits[0].id);

  const runtimeLabel = useMemo(() => {
    if (typeof window === 'undefined') {
      return 'Power Apps ランタイム';
    }

    return window.location.hostname.includes('powerapps')
      ? 'Power Apps 上で動作中'
      : 'ローカル Code Apps プレビュー';
  }, []);

  const selectedAudit = useMemo(
    () => audits.find((audit) => audit.id === selectedAuditId) ?? audits[0],
    [selectedAuditId],
  );

  const handleCheck = () => {
    const onlineLabel = navigator.onLine ? 'オンライン' : 'オフライン';
    setStatus(`OK: ${selectedAudit.company} / ${runtimeLabel} / ${onlineLabel}`);
  };

  return (
    <FluentProvider theme={webLightTheme}>
      <div className={styles.root}>
        <div className={styles.noise} />
        <div className={styles.container}>
          <Card className={styles.heroCard}>
            <Text className={styles.eyebrow}>EXTERNAL AUDIT CONTROL</Text>
            <Text className={styles.heroTitle}>外部監査案件を一画面で追える監査管理アプリ</Text>
            <Text className={styles.lead}>
              監査対象会社、進行中案件、重大指摘、是正アクションをまとめて可視化するダッシュボードです。
              Power Apps 上で案件受付、進捗更新、監査メモ入力へ発展させる前提の画面構成にしています。
            </Text>
            <div className={styles.badgeContainer}>
              <Badge appearance="filled" color="brand">
                外部監査
              </Badge>
              <Badge appearance="outline" color="success">
                是正管理
              </Badge>
              <Badge appearance="outline" color="important">
                Power Apps Code Apps
              </Badge>
            </div>

            <div className={styles.actionRow}>
              <Button appearance="primary" onClick={handleCheck}>
                選択案件の状態確認
              </Button>
              <Button appearance="secondary" onClick={() => setSelectedAuditId(audits[1].id)}>
                要注意案件へ切替
              </Button>
              <Text className={styles.statusText}>{status}</Text>
            </div>
          </Card>

          <div className={styles.kpiGrid}>
            <Card className={styles.kpiCard}>
              <Text className={styles.kpiLabel}>進行中の監査</Text>
              <Text className={styles.kpiValue}>12</Text>
              <Text className={styles.kpiMeta}>今週クローズ予定 4件</Text>
            </Card>
            <Card className={styles.kpiCard}>
              <Text className={styles.kpiLabel}>重大指摘</Text>
              <Text className={styles.kpiValue}>3</Text>
              <Text className={styles.kpiMeta}>期限超過リスク 1件</Text>
            </Card>
            <Card className={styles.kpiCard}>
              <Text className={styles.kpiLabel}>未回収エビデンス</Text>
              <Text className={styles.kpiValue}>8</Text>
              <Text className={styles.kpiMeta}>先週比 -2件</Text>
            </Card>
            <Card className={styles.kpiCard}>
              <Text className={styles.kpiLabel}>監査責任者レビュー</Text>
              <Text className={styles.kpiValue}>5/7</Text>
              <Text className={styles.kpiMeta}>本日17:00締切</Text>
            </Card>
          </div>

          <div className={styles.grid}>
            <Card className={styles.infoCard}>
              <Text className={styles.sectionTitle}>監査案件一覧</Text>
              <div className={styles.auditList}>
                {audits.map((audit) => (
                  <button
                    key={audit.id}
                    type="button"
                    className={styles.auditButton}
                    onClick={() => setSelectedAuditId(audit.id)}
                    style={{
                      borderColor: audit.id === selectedAuditId ? '#0b5c52' : '#dde5ea',
                      boxShadow:
                        audit.id === selectedAuditId
                          ? '0 0 0 2px rgba(11,92,82,0.14)'
                          : 'none',
                    }}
                  >
                    <div className={styles.auditTopRow}>
                      <div>
                        <Text className={styles.auditName}>{audit.company}</Text>
                        <Text>{audit.id} / {audit.category}</Text>
                      </div>
                      <Badge appearance="outline" color={audit.risk === '高' ? 'danger' : 'warning'}>
                        リスク {audit.risk}
                      </Badge>
                    </div>
                    <div className={styles.auditMeta}>
                      <div>
                        <Text className={styles.metaLabel}>担当者</Text>
                        <Text className={styles.metaValue}>{audit.owner}</Text>
                      </div>
                      <div>
                        <Text className={styles.metaLabel}>期限</Text>
                        <Text className={styles.metaValue}>{audit.due}</Text>
                      </div>
                      <div>
                        <Text className={styles.metaLabel}>進捗</Text>
                        <Text className={styles.metaValue}>{audit.progress}</Text>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            <Card className={styles.infoCard}>
              <Text className={styles.sectionTitle}>選択中案件の要点</Text>
              <Text className={styles.infoTitle}>{selectedAudit.company}</Text>
              <Text style={{ marginBottom: '12px' }}>
                {selectedAudit.category}監査。期限は {selectedAudit.due}。現在の進捗は {selectedAudit.progress}、主担当は {selectedAudit.owner} です。
              </Text>

              <div className={styles.findingsList}>
                {findings.map((finding) => (
                  <div key={finding.title} className={styles.findingItem}>
                    <Text className={styles.findingTitle}>
                      {finding.title} <Badge appearance="tint">{finding.severity}</Badge>
                    </Text>
                    <Text className={styles.findingNote}>{finding.note}</Text>
                  </div>
                ))}
              </div>

              <Text className={styles.sectionTitle}>次アクション</Text>
              <div className={styles.actionList}>
                {actions.map((action) => (
                  <div key={action} className={styles.actionItem}>
                    <div className={styles.actionDot} />
                    <Text>{action}</Text>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Text className={styles.footer}>
            次のステップは、監査依頼登録、是正期限更新、証跡添付を Dataverse テーブルへ接続することです。
          </Text>
        </div>
      </div>
    </FluentProvider>
  );
};

export default App;
