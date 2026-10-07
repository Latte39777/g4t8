import type { SimulationInput } from '@/lib/simulation'
import { calculateSimulation, formatYen } from '@/lib/simulation'

type ResultProps = {
  input: SimulationInput
  /** 「入力内容を修正する」ボタン押下時 */
  onEdit: () => void
  /** 「最初からやり直す」ボタン押下時 */
  onReset: () => void
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

export default function Result({ input, onEdit, onReset }: ResultProps) {
  const { supportPrograms, supportTotal, shortfall, coverageRate } =
    calculateSimulation(input)
  const target = input.targetAmount

  // 目標額に対する割合（%）
  const savingsRate = (input.savings / target) * 100
  const supportRate = (supportTotal / target) * 100
  const rawTotal = savingsRate + supportRate
  // 合計が目標額を超える場合はバーがはみ出さないように按分する
  const isOverTarget = rawTotal > 100
  const savingsWidth = isOverTarget ? (savingsRate / rawTotal) * 100 : savingsRate
  const supportWidth = isOverTarget ? (supportRate / rawTotal) * 100 : supportRate

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-10 sm:py-14">
      {/* ヘッダー */}
      <div className="text-center">
        <p className="text-xs font-bold tracking-widest text-blue-500">STEP 2 / 2</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
          シミュレーション結果
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          現在の貯蓄に、公的支援の見込額を加えるとこの結果です。
        </p>
      </div>

      {/* ① 積み上げ式横棒プログレスバー（最重要UI） */}
      <div className="mt-8 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              目標額に対するカバー状況
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              グラフの全体が目標額（{formatYen(target)}）を表します
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">カバーできた合計</p>
            <p className="text-lg font-bold text-slate-900">
              {formatYen(input.savings + supportTotal)}
            </p>
          </div>
        </div>

        {/* 積み上げバー：左から「貯蓄（青）」＋「公的支援（赤）」、余白が「足りない金額」 */}
        <div
          className="mt-5 flex h-12 w-full overflow-hidden rounded-full bg-slate-200 shadow-inner"
          data-testid="progress-bar"
          role="img"
          aria-label={`現在の貯蓄額 ${formatYen(input.savings)}、公的支援額 ${formatYen(supportTotal)}、足りない金額 ${formatYen(shortfall)}`}
        >
          {savingsWidth > 0 && (
            <div
              className="flex h-full items-center justify-center bg-blue-500 transition-all duration-500"
              style={{ width: `${savingsWidth}%` }}
              data-testid="savings-bar"
            >
              {!isOverTarget && savingsWidth >= 12 && (
                <span className="px-2 text-xs font-bold text-white">
                  {savingsRate.toFixed(1)}%
                </span>
              )}
            </div>
          )}
          {supportWidth > 0 && (
            <div
              className="flex h-full items-center justify-center bg-red-400 transition-all duration-500"
              style={{ width: `${supportWidth}%` }}
              data-testid="support-bar"
            >
              {!isOverTarget && supportWidth >= 12 && (
                <span className="px-2 text-xs font-bold text-white">
                  {supportRate.toFixed(1)}%
                </span>
              )}
            </div>
          )}
        </div>

        {/* 凡例 */}
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-blue-500" />
            現在の貯蓄額（{formatYen(input.savings)}）
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-400" />
            公的支援額の合計（{formatYen(supportTotal)}）
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-slate-200" />
            足りない金額（{formatYen(shortfall)}）
          </span>
        </div>

        {/* 支援による上乗せ効果メッセージ */}
        {shortfall > 0 ? (
          <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-4">
            <p className="text-sm font-bold text-blue-900">
              公的支援のおかげで、目標額の {coverageRate.toFixed(1)}% をカバーできています！
            </p>
            <p className="mt-1 text-xs leading-6 text-blue-800">
              貯蓄だけでは目標の {savingsRate.toFixed(1)}% でしたが、
              公的支援（{formatYen(supportTotal)}）で
              あと <span className="font-bold text-red-400">{supportRate.toFixed(1)}% 分</span>
              の足りない部分を埋められました。
            </p>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
            <p className="text-sm font-bold text-emerald-900">
              目標額を達成できました！
            </p>
            <p className="mt-1 text-xs leading-6 text-emerald-800">
              現在の貯蓄と公的支援（{formatYen(supportTotal)}）を合わせると、
              目標とする養育資金額をカバーできています。
            </p>
          </div>
        )}
      </div>

      {/* ② 公的支援リスト（グラフの赤色と視覚的にリンク） */}
      <div className="mt-6 rounded-3xl border border-red-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-2.5">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <h2 className="text-sm font-bold text-slate-900">
            適用された公的支援（モック）
          </h2>
          <span className="ml-auto rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-400">
            合計 {formatYen(supportTotal)}
          </span>
        </div>
        <p className="mt-2 text-xs leading-5 text-slate-500">
          下のリストが、グラフの<span className="font-semibold text-red-400">赤い部分</span>
          に相当します。
        </p>

        <ul className="mt-4 divide-y divide-slate-100">
          {supportPrograms.map((program) => (
            <li key={program.id} className="flex items-start gap-3 py-4">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-400 text-white">
                <CheckIcon />
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800">
                  {program.name}
                </p>
                <p className="mt-0.5 text-xs leading-5 text-slate-500">
                  {program.description}
                </p>
              </div>
              <p
                className="text-base font-bold text-red-400"
                data-testid={`support-amount-${program.id}`}
              >
                {formatYen(program.amount)}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* 入力内容のサマリー */}
      <div className="mt-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-sm font-bold text-slate-900">入力した内容</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-slate-600">子供の人数</dt>
            <dd className="font-semibold text-slate-900">{input.childCount} 人</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-slate-600">現在の貯蓄額</dt>
            <dd className="font-semibold text-slate-900">
              {formatYen(input.savings)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-slate-600">目標とする養育資金額</dt>
            <dd className="font-semibold text-slate-900">{formatYen(target)}</dd>
          </div>
        </dl>
      </div>

      {/* アクション */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onEdit}
          className="flex-1 rounded-full border border-slate-300 px-6 py-4 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
        >
          入力内容を修正する
        </button>
        <button
          type="button"
          onClick={onReset}
          data-testid="reset-button"
          className="flex-1 rounded-full bg-blue-500 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-colors hover:bg-blue-600"
        >
          最初からやり直す
        </button>
      </div>
    </div>
  )
}
