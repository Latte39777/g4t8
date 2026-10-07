/**
 * 養育費・公的支援シミュレーター 用の型定義・モックデータ・計算ロジック
 * ※ 公的支援額はプロトタイプ用のモックであり、実際の制度・支給額とは異なります。
 */

export type SimulationInput = {
  /** 子供の人数（0以上の整数） */
  childCount: number;
  /** 現在の貯蓄額（円） */
  savings: number;
  /** 目標とする養育資金額（円） */
  targetAmount: number;
};

export type SupportProgram = {
  id: string;
  /** 支援制度名 */
  name: string;
  /** 制度の説明（モック） */
  description: string;
  /** 見込額（円） */
  amount: number;
};

/** テスト用のサンプルデータ（ワンクリック自動入力に使用） */
export const SAMPLE_INPUT: SimulationInput = {
  childCount: 2,
  savings: 5_000_000,
  targetAmount: 20_000_000,
};

/**
 * 子供の人数に応じた公的支援額（モック）を返す
 */
export function calculateSupport(childCount: number): SupportProgram[] {
  return [
    {
      id: "jidoteate",
      name: "児童手当",
      description: "0歳〜中学生修了まで（月10,000円 × 12ヶ月 × 15年）",
      amount: 10_000 * 12 * 15 * childCount,
    },
    {
      id: "kosodate-ouenkin",
      name: "自治体の子育て応援金",
      description: "出生・進学時などに支給される一時金（見込）",
      amount: 500_000 * childCount,
    },
    {
      id: "shogaku-kyufukin",
      name: "高校生等奨学給付金",
      description: "高校在学中の学費支援（3年間の見込）",
      amount: 300_000 * childCount,
    },
    {
      id: "iryouhi-jojo",
      name: "乳幼児医療費助成",
      description: "医療費の自己負担分に対する助成（見込）",
      amount: 250_000 * childCount,
    },
  ];
}

/**
 * 入力値とモックの公的支援額からシミュレーション結果を計算する
 */
export function calculateSimulation(input: SimulationInput) {
  const supportPrograms = calculateSupport(input.childCount);
  const supportTotal = supportPrograms.reduce((sum, program) => sum + program.amount, 0);
  const covered = input.savings + supportTotal;
  const shortfall = Math.max(input.targetAmount - covered, 0);
  const coverageRate =
    input.targetAmount > 0 ? (covered / input.targetAmount) * 100 : 0;

  return { supportPrograms, supportTotal, covered, shortfall, coverageRate };
}

/** 金額を「1,234,567円」の形式に整形する */
export function formatYen(amount: number): string {
  return `${Math.round(amount).toLocaleString("ja-JP")}円`;
}
