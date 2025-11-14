"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";

type Word = {
  id: number;
  level: string;
  word_ja: string;
  reading: string | null;
  pos: string | null;
  meaning_my: string;
  meaning_ja: string | null;
  example_ja: string | null;
  example_my: string | null;
};

const LEVEL = "N1";

export default function StudyPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredWords, setFilteredWords] = useState<Word[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  // 初期ロード：N1データを取得
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setSearchTerm("");
      const { data, error } = await supabase
        .from("jlpt_words")
        .select("*")
        .eq("level", LEVEL)
        .order("id", { ascending: true });

      if (error) {
        console.error(error);
      } else if (data) {
        setWords(data as Word[]);
        setFilteredWords(data as Word[]);
        if (data.length > 0) {
          setSelectedId(data[0].id);
        }
      }
      setLoading(false);
    };

    load();
  }, []);

  // 検索処理：サーバー側で実行
  const handleSearch = useCallback(
    async (term: string) => {
      setSearchTerm(term);
      
      if (!term.trim()) {
        setFilteredWords(words);
        return;
      }

      setSearching(true);
      const { data, error } = await supabase
        .from("jlpt_words")
        .select("*")
        .eq("level", LEVEL)
        .or(
          `word_ja.ilike.%${term}%,reading.ilike.%${term}%,meaning_my.ilike.%${term}%,meaning_ja.ilike.%${term}%`
        )
        .order("id", { ascending: true });

      if (error) {
        console.error(error);
      } else if (data) {
        setFilteredWords(data as Word[]);
      }
      setSearching(false);
    },
    [words]
  );

  const selectedWord = useMemo(
    () => words.find((w) => w.id === selectedId),
    [words, selectedId]
  );

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500 text-sm">読み込み中...</p>
      </main>
    );
  }

  if (words.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500 text-sm">
          まだ単語が登録されていません。
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <h1 className="text-xl font-semibold text-slate-900">JLPT N1 単語辞書</h1>
        </div>
      </header>

      {/* メインコンテンツ */}
      <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-[calc(100vh-100px)]">
        {/* 左側: リスト */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          {/* 検索バー */}
          <div className="p-3 border-b border-slate-200 flex-shrink-0">
            <div className="relative">
              <input
                type="text"
                placeholder="単語で検索..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searching && (
                <div className="absolute right-3 top-2.5">
                  <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {filteredWords.length} / {words.length} 件
            </p>
          </div>

          {/* 単語リスト - 仮想スクロール対応 */}
          <div
            ref={listRef}
            className="flex-1 overflow-y-auto"
          >
            {filteredWords.length > 0 ? (
              filteredWords.map((word) => (
                <button
                  key={word.id}
                  onClick={() => setSelectedId(word.id)}
                  className={`w-full text-left px-3 py-3 border-b border-slate-100 transition-colors hover:bg-slate-50 ${
                    selectedId === word.id
                      ? "bg-blue-50 border-l-4 border-l-blue-500"
                      : ""
                  }`}
                >
                  <p className="font-semibold text-sm text-slate-900">
                    {word.word_ja}
                  </p>
                  {word.reading && (
                    <p className="text-xs text-slate-500">{word.reading}</p>
                  )}
                  <p className="text-xs text-slate-600 mt-1 line-clamp-1">
                    {word.meaning_my}
                  </p>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-slate-500 text-sm">
                検索結果がありません
              </div>
            )}
          </div>
        </div>

        {/* 右側: 詳細パネル */}
        <div className="lg:col-span-2">
          {selectedWord ? (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 h-full overflow-y-auto">
              {/* 単語情報 */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <h2 className="text-4xl font-bold text-slate-900">
                    {selectedWord.word_ja}
                  </h2>
                  {selectedWord.pos && (
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded whitespace-nowrap">
                      {selectedWord.pos}
                    </span>
                  )}
                </div>
                {selectedWord.reading && (
                  <p className="text-lg text-slate-600 font-medium">
                    {selectedWord.reading}
                  </p>
                )}
              </div>

              {/* ミャンマー語の意味 */}
              <div className="mb-6 pb-6 border-b border-slate-200">
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-2">
                  ミャンマー語の意味
                </h3>
                <p className="text-2xl font-semibold text-slate-900 leading-relaxed">
                  {selectedWord.meaning_my}
                </p>
              </div>

              {/* 日本語の説明 */}
              {selectedWord.meaning_ja && (
                <div className="mb-6 pb-6 border-b border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-2">
                    日本語の説明
                  </h3>
                  <p className="text-slate-700 leading-relaxed">
                    {selectedWord.meaning_ja}
                  </p>
                </div>
              )}

              {/* 例文 */}
              {(selectedWord.example_ja || selectedWord.example_my) && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
                    例文
                  </h3>
                  <div className="space-y-4">
                    {selectedWord.example_ja && (
                      <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
                        <p className="text-xs text-slate-600 font-medium mb-1">
                          日本語
                        </p>
                        <p className="text-slate-800">
                          {selectedWord.example_ja}
                        </p>
                      </div>
                    )}
                    {selectedWord.example_my && (
                      <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
                        <p className="text-xs text-slate-600 font-medium mb-1">
                          ミャンマー語
                        </p>
                        <p className="text-slate-800">
                          {selectedWord.example_my}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 flex items-center justify-center h-full">
              <p className="text-slate-500 text-sm">単語を選択してください</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
