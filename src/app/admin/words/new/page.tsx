"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function NewWordPage() {
  const [loading, setLoading] = useState(false);
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
    const { error } = await supabase.from("jlpt_words").insert({
      level: "N1",
      ...form,
    });
    setLoading(false);

    if (error) {
      alert("登録エラー: " + error.message);
    } else {
      alert("登録しました！");
      setForm({
        word_ja: "",
        reading: "",
        pos: "",
        meaning_my: "",
        meaning_ja: "",
        example_ja: "",
        example_my: "",
      });
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="max-w-xl mx-auto bg-white rounded-xl p-4 shadow">
        <h1 className="text-lg font-semibold mb-4">N1 単語登録（管理者用）</h1>

        <div className="space-y-3 text-sm">
          <div>
            <label className="block mb-1">日本語単語 *</label>
            <input
              name="word_ja"
              value={form.word_ja}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>

          <div>
            <label className="block mb-1">よみ</label>
            <input
              name="reading"
              value={form.reading}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>

          <div>
            <label className="block mb-1">品詞（例：名詞・動詞）</label>
            <input
              name="pos"
              value={form.pos}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>

          <div>
            <label className="block mb-1">ミャンマー語意味 *</label>
            <textarea
              name="meaning_my"
              value={form.meaning_my}
              onChange={handleChange}
              rows={2}
              className="w-full border rounded px-2 py-1"
            />
          </div>

          <div>
            <label className="block mb-1">日本語の簡単な説明</label>
            <textarea
              name="meaning_ja"
              value={form.meaning_ja}
              onChange={handleChange}
              rows={2}
              className="w-full border rounded px-2 py-1"
            />
          </div>

          <div>
            <label className="block mb-1">例文（日）</label>
            <textarea
              name="example_ja"
              value={form.example_ja}
              onChange={handleChange}
              rows={2}
              className="w-full border rounded px-2 py-1"
            />
          </div>

          <div>
            <label className="block mb-1">例文（ミャンマー語）</label>
            <textarea
              name="example_my"
              value={form.example_my}
              onChange={handleChange}
              rows={2}
              className="w-full border rounded px-2 py-1"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-2 w-full py-2 rounded-md bg-blue-600 text-white disabled:opacity-60"
          >
            {loading ? "登録中..." : "登録"}
          </button>
        </div>
      </div>
    </main>
  );
}
