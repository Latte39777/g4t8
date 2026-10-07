type TopProps = {
  /** 「シミュレーションを始める」ボタン押下時 */
  onStart: () => void;
};

const FEATURES = [
  {
    step: "①",
    title: "かんたんな3項目入力",
    body: "子供の人数・現在の貯蓄額・目標とする養育資金額を入力するだけ。迷ったらサンプルデータで自動入力もできます。",
  },
  {
    step: "②",
    title: "公的支援を自動で試算",
    body: "児童手当や自治体の子育て応援金など、活用できる支援制度の見込額をまとめて計算します。",
  },
  {
    step: "③",
    title: "グラフでひと目で確認",
    body: "貯蓄と公的支援で、目標額のどこまでをカバーできるか。足りない部分がどれだけ埋まるかを視覚化します。",
  },
];

export default function Top({ onStart }: TopProps) {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-12 sm:py-16">
      {/* ヒーローエリア */}
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
          登録不要・約1分で完了
        </span>
        <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">
          養育費・<span className="text-red-400">公的支援</span>
          <br className="sm:hidden" />
          シミュレーター
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
          子育てにかかる目標資金に対し、現在の貯蓄と「政府・自治体の公的支援」を合わせることで、
          どれくらいカバーできるかを視覚的にシミュレーションできます。
          <span className="font-semibold text-slate-800">
            支援のおかげで足りない部分がどれだけ埋まるか
          </span>
          を、グラフで直感的に確認してみましょう。
        </p>
      </div>

      {/* グラフのプレビュー（イメージ） */}
      <div className="mx-auto mt-10 w-full max-w-xl rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold tracking-widest text-slate-400">RESULT IMAGE</p>
          <p className="text-xs text-slate-400">イメージ</p>
        </div>
        <div className="mt-4 flex h-8 w-full overflow-hidden rounded-full bg-slate-200">
          <div className="h-full bg-blue-500" style={{ width: "25%" }} />
          <div className="h-full bg-red-400" style={{ width: "30%" }} />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-blue-500" />
            現在の貯蓄額
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-400" />
            公的支援額
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-slate-200" />
            足りない金額
          </span>
        </div>
      </div>

      {/* 3ステップの説明 */}
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {FEATURES.map((feature) => (
          <div
            key={feature.step}
            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-lg font-bold text-blue-500">
              {feature.step}
            </span>
            <h2 className="mt-3 text-sm font-bold text-slate-900">{feature.title}</h2>
            <p className="mt-2 text-xs leading-6 text-slate-600">{feature.body}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-10 flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={onStart}
          data-testid="start-button"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-blue-500/30 transition-colors hover:bg-blue-600 sm:w-auto"
        >
          シミュレーションを始める
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
        <p className="text-xs text-slate-400">所要時間は1分ほどです</p>
      </div>
    </div>
  );
}
