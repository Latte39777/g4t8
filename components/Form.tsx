'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'
import type { SimulationInput } from '@/lib/simulation'
import { SAMPLE_INPUT, formatYen } from '@/lib/simulation'

type FieldName = 'childCount' | 'savings' | 'targetAmount'
type FieldErrors = Partial<Record<FieldName, string>>

type FormProps = {
  /** 「結果を見る」ボタン押下時（バリデーション通過後に呼ばれる） */
  onSubmit: (input: SimulationInput) => void
  /** 「トップへ戻る」ボタン押下時 */
  onBack: () => void
}

const inputClass =
  'w-full rounded-xl border bg-white px-4 py-3 pr-14 text-lg font-semibold text-slate-900 outline-none transition focus:ring-2'

export default function Form({ onSubmit, onBack }: FormProps) {
  const [childCount, setChildCount] = useState('')
  const [savings, setSavings] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})

  /** テスト用：サンプルデータをワンクリックで自動入力 */
  const fillSample = () => {
    setChildCount(String(SAMPLE_INPUT.childCount))
    setSavings(String(SAMPLE_INPUT.savings))
    setTargetAmount(String(SAMPLE_INPUT.targetAmount))
    setErrors({})
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors: FieldErrors = {}

    const parsedChildCount = Number(childCount)
    if (childCount.trim() === '' || Number.isNaN(parsedChildCount)) {
      nextErrors.childCount = '子供の人数を入力してください。'
    } else if (!Number.isInteger(parsedChildCount) || parsedChildCount < 0) {
      nextErrors.childCount = '0以上の整数で入力してください。'
    }

    const parsedSavings = Number(savings)
    if (savings.trim() === '' || Number.isNaN(parsedSavings)) {
      nextErrors.savings = '現在の貯蓄額を入力してください。'
    } else if (parsedSavings < 0) {
      nextErrors.savings = '0以上の金額で入力してください。'
    }

    const parsedTarget = Number(targetAmount)
    if (targetAmount.trim() === '' || Number.isNaN(parsedTarget)) {
      nextErrors.targetAmount = '目標とする養育資金額を入力してください。'
    } else if (parsedTarget <= 0) {
      nextErrors.targetAmount = '1円以上で入力してください。'
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    onSubmit({
      childCount: parsedChildCount,
      savings: parsedSavings,
      targetAmount: parsedTarget,
    })
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-10 sm:py-14">
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-9">
        <p className="text-xs font-bold tracking-widest text-blue-500">STEP 1 / 2</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">
          お子さまと資金の状況を教えてください
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          3つの項目を入力すると、現在の貯蓄と公的支援を合わせた試算結果をグラフで表示します。
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6">
          {/* 子供の人数 */}
          <div>
            <label
              htmlFor="childCount"
              className="text-sm font-semibold text-slate-700"
            >
              子供の人数
            </label>
            <div className="relative mt-1.5">
              <input
                id="childCount"
                type="number"
                inputMode="numeric"
                min={0}
                step={1}
                value={childCount}
                onChange={(e) => setChildCount(e.target.value)}
                placeholder="例: 2"
                aria-invalid={errors.childCount ? true : undefined}
                className={`${inputClass} ${
                  errors.childCount
                    ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                    : 'border-slate-300 focus:border-blue-400 focus:ring-blue-100'
                }`}
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                人
              </span>
            </div>
            {errors.childCount ? (
              <p className="mt-1.5 text-xs font-medium text-red-500">
                {errors.childCount}
              </p>
            ) : (
              <p className="mt-1.5 text-xs text-slate-400">
                何人分の支援を試算するか入力してください
              </p>
            )}
          </div>

          {/* 現在の貯蓄額 */}
          <div>
            <label
              htmlFor="savings"
              className="text-sm font-semibold text-slate-700"
            >
              現在の貯蓄額
            </label>
            <div className="relative mt-1.5">
              <input
                id="savings"
                type="number"
                inputMode="numeric"
                min={0}
                step={1}
                value={savings}
                onChange={(e) => setSavings(e.target.value)}
                placeholder="例: 5000000"
                aria-invalid={errors.savings ? true : undefined}
                className={`${inputClass} ${
                  errors.savings
                    ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                    : 'border-slate-300 focus:border-blue-400 focus:ring-blue-100'
                }`}
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                円
              </span>
            </div>
            {errors.savings ? (
              <p className="mt-1.5 text-xs font-medium text-red-500">
                {errors.savings}
              </p>
            ) : (
              savings.trim() !== '' &&
              !Number.isNaN(Number(savings)) &&
              Number(savings) >= 0 && (
                <p className="mt-1.5 text-xs text-slate-400">
                  {formatYen(Number(savings))}
                </p>
              )
            )}
          </div>

          {/* 目標とする養育資金額 */}
          <div>
            <label
              htmlFor="targetAmount"
              className="text-sm font-semibold text-slate-700"
            >
              目標とする養育資金額
            </label>
            <div className="relative mt-1.5">
              <input
                id="targetAmount"
                type="number"
                inputMode="numeric"
                min={1}
                step={1}
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="例: 20000000"
                aria-invalid={errors.targetAmount ? true : undefined}
                className={`${inputClass} ${
                  errors.targetAmount
                    ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                    : 'border-slate-300 focus:border-blue-400 focus:ring-blue-100'
                }`}
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                円
              </span>
            </div>
            {errors.targetAmount ? (
              <p className="mt-1.5 text-xs font-medium text-red-500">
                {errors.targetAmount}
              </p>
            ) : (
              targetAmount.trim() !== '' &&
              !Number.isNaN(Number(targetAmount)) &&
              Number(targetAmount) > 0 && (
                <p className="mt-1.5 text-xs text-slate-400">
                  {formatYen(Number(targetAmount))}
                </p>
              )
            )}
          </div>

          {/* サンプルデータ自動入力（テスト用） */}
          <div className="rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/60 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  入力に迷ったら、サンプルデータをお試しください
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  テスト用に、入力欄がワンクリックで埋まります。
                </p>
              </div>
              <button
                type="button"
                onClick={fillSample}
                data-testid="sample-fill-button"
                className="flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-blue-300 bg-white px-5 py-2.5 text-sm font-bold text-blue-600 transition-colors hover:bg-blue-50"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 5v14M5 12h14"
                  />
                </svg>
                サンプルデータで自動入力
              </button>
            </div>
          </div>

          {/* 送信ボタン */}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row-reverse">
            <button
              type="submit"
              data-testid="show-result-button"
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-blue-500 px-6 py-4 text-base font-bold text-white shadow-lg shadow-blue-500/25 transition-colors hover:bg-blue-600"
            >
              結果を見る
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5-5 5M6 12h12"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={onBack}
              className="rounded-full border border-slate-300 px-6 py-4 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
            >
              ← トップへ戻る
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
