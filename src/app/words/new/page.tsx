"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function NewWordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [form, setForm] = useState({
    word_ja: "",
    reading: "",
    pos: "",
    meaning_my: "",
    meaning_ja: "",
    example_ja: "",
    example_my: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.word_ja || !form.meaning_my) {
      alert("日本語単語 と ミャンマー語意味 は必須です。");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from("jlpt_words").insert({
        level: "N1",
        ...form,
      });

      if (error) {
        alert("登録エラー: " + error.message);
      } else {
        setSuccessMessage("登録しました！");
        setForm({
          word_ja: "",
          reading: "",
          pos: "",
          meaning_my: "",
          meaning_ja: "",
          example_ja: "",
          example_my: "",
        });
        // 2秒後に /study にリダイレクト
        setTimeout(() => {
          router.push("/study");
        }, 2000);
      }
    } catch (e: any) {
      console.error(e);
      alert("エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="max-w-2xl mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">新しい単語を追加</h1>
            <p className="text-sm text-slate-500 mt-1">学習者が作成した単語を辞書に追加します</p>
          </div>
        </div>

        {/* 成功メッセージ */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">✓ {successMessage}</p>
            <p className="text-sm text-green-700 mt-1">学習ページに戻ります...</p>
          </div>
        )}

        {/* フォーム */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          {/* 必須情報セクション */}
          <div className="p-4 sm:p-6 border-b border-slate-200 bg-linear-to-r from-blue-50 to-transparent">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span className="text-blue-600 text-xl">1</span>
              必須情報
            </h2>
            <div className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  日本語単語 <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  name="word_ja"
                  value={form.word_ja}
                  onChange={handleChange}
                  placeholder="例：勉強"
                  className="w-full px-3 sm:px-4 py-2 text-base border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                />
                <p className="text-xs text-slate-500 mt-1">学習対象の日本語の単語を入力してください</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  ミャンマー語の意味 <span className="text-red-500 font-bold">*</span>
                </label>
                <textarea
                  name="meaning_my"
                  value={form.meaning_my}
                  onChange={handleChange}
                  rows={3}
                  placeholder="例：ပညာ"
                  className="w-full px-3 sm:px-4 py-2 text-base border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                />
                <p className="text-xs text-slate-500 mt-1">ミャンマー語での意味を記入してください</p>
              </div>
            </div>
          </div>

          {/* 追加情報セクション */}
          <div className="p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span className="text-slate-400 text-xl">2</span>
              追加情報（オプション）
            </h2>
            <div className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  よみ（ひらがな）
                </label>
                <input
                  type="text"
                  name="reading"
                  value={form.reading}
                  onChange={handleChange}
                  placeholder="例：べんきょう"
                  className="w-full px-3 sm:px-4 py-2 text-base border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  品詞
                </label>
                <input
                  type="text"
                  name="pos"
                  value={form.pos}
                  onChange={handleChange}
                  placeholder="例：名詞、動詞"
                  className="w-full px-3 sm:px-4 py-2 text-base border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  日本語の簡単な説明
                </label>
                <textarea
                  name="meaning_ja"
                  value={form.meaning_ja}
                  onChange={handleChange}
                  rows={3}
                  placeholder="例：学習。知識を身につけるための活動。"
                  className="w-full px-3 sm:px-4 py-2 text-base border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  例文（日本語）
                </label>
                <textarea
                  name="example_ja"
                  value={form.example_ja}
                  onChange={handleChange}
                  rows={3}
                  placeholder="例：毎日、学校で勉強します。"
                  className="w-full px-3 sm:px-4 py-2 text-base border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  例文（ミャンマー語）
                </label>
                <textarea
                  name="example_my"
                  value={form.example_my}
                  onChange={handleChange}
                  rows={3}
                  placeholder="例：သူသည်နေ့စဉ်ကျောင်းတွင်ပညာသင်ယူသည်။"
                  className="w-full px-3 sm:px-4 py-2 text-base border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                />
              </div>
            </div>
          </div>

          {/* アクションボタン */}
          <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={loading || !form.word_ja || !form.meaning_my}
              className="flex-1 py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "登録中..." : "単語を登録"}
            </button>
            <Link
              href="/study"
              className="px-4 py-3 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium transition-colors"
            >
              キャンセル
            </Link>
          </div>
        </div>

        {/* ヒント */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-900">
            <span className="font-semibold">💡 ヒント:</span> 日本語単語とミャンマー語意味は必須です。その他の情報は後で追加・編集できます。
          </p>
        </div>
      </div>
    </main>
  );
}
