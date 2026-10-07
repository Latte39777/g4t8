'use client'

import { useState } from 'react'
import Top from '@/components/Top'
import Form from '@/components/Form'
import Result from '@/components/Result'
import type { SimulationInput } from '@/lib/simulation'

/** 画面の切り替え状態（SPAライクな遷移） */
type Step = 'top' | 'form' | 'result'

export default function Home() {
  const [step, setStep] = useState<Step>('top')
  const [input, setInput] = useState<SimulationInput | null>(null)

  /** アンケート送信時：入力値を保存して結果画面へ */
  const handleSubmit = (values: SimulationInput) => {
    setInput(values)
    setStep('result')
  }

  /** 「最初からやり直す」：すべてリセットしてトップへ */
  const handleReset = () => {
    setInput(null)
    setStep('top')
  }

  return (
    <div className="flex min-h-dvh flex-col bg-gradient-to-b from-slate-50 via-white to-blue-50">
      {/* ヘッダー */}
      <header className="sticky top-0 z-10 border-b border-slate-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500 text-sm font-black text-white shadow-sm">
              ¥
            </span>
            <span className="text-sm font-bold text-slate-800">
              養育費・公的支援シミュレーター
            </span>
          </div>
          {step !== 'top' && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
              {step === 'form' ? 'STEP 1 / 2' : 'STEP 2 / 2'}
            </span>
          )}
        </div>
      </header>

      {/* 画面本体（状態に応じてコンポーネントを切り替え） */}
      <main className="flex flex-1 flex-col">
        {step === 'top' && <Top onStart={() => setStep('form')} />}
        {step === 'form' && (
          <Form onSubmit={handleSubmit} onBack={() => setStep('top')} />
        )}
        {step === 'result' && input && (
          <Result input={input} onEdit={() => setStep('form')} onReset={handleReset} />
        )}
      </main>

      {/* フッター */}
      <footer className="border-t border-slate-100 bg-white/70">
        <p className="mx-auto w-full max-w-3xl px-5 py-4 text-center text-xs leading-5 text-slate-400">
          ※ 本アプリはプロトタイプです。表示される支援額はモックデータに基づく試算であり、
          実際の支給額・制度とは異なります。
        </p>
      </footer>
    </div>
  )
}
