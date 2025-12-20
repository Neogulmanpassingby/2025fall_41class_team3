"use client";

import { useEffect, useState } from "react";
import SideNav from "@/components/home/SideNav";
import TopNotice from "@/components/home/TopNotice";
import FooterSection from "@/components/home/FooterSection";
import PromptInput from "@/components/home/PromptInput";
import CheckboxPills from "@/components/common/CheckboxPills";
import RecommendationCard from "@/components/home/RecommendationCard";
import PolicyDetailModal from "@/components/home/PolicyDetailModal";
import { fetchWithAuth } from "@/lib/auth/apiClient";
import type { PolicyCardData, PolicyDetail } from "@/components/home/types";

export default function DiscoverPage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<PolicyCardData[]>([]);
  const [popular, setPopular] = useState<PolicyCardData[]>([]);
  const [recent, setRecent] = useState<PolicyCardData[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyDetail | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const categoryOptions = [
    { label: "주거", value: "주거" },
    { label: "교육", value: "교육" },
    { label: "창업", value: "창업" },
    { label: "취업", value: "취업" },
    { label: "보건", value: "보건" },
    { label: "육아", value: "육아" },
    { label: "교통", value: "교통" },
  ];

  useEffect(() => {
    // Fetch popular and recent on mount
    const fetchLists = async () => {
      try {
        const [pRes, rRes] = await Promise.all([
          fetchWithAuth("/api/policies/popular"),
          fetchWithAuth("/api/policies/recent"),
        ]);

        if (pRes.ok) {
          const pData = (await pRes.json()) as { id: number; plcyNm: string }[];
          setPopular(
            pData.map((p) => ({ id: p.id, title: p.plcyNm, summary: "", tags: [] }))
          );
        }

        if (rRes.ok) {
          const rData = (await rRes.json()) as { id: number; plcyNm: string }[];
          setRecent(
            rData.map((p) => ({ id: p.id, title: p.plcyNm, summary: "", tags: [] }))
          );
        }
      } catch (err) {
        console.error("[discover] failed to load lists", err);
      }
    };

    fetchLists();
  }, []);

  const handleRecommend = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setStatusMessage(null);

    try {
      // If categories are selected, prepend them to the prompt to bias recommendations
      const combinedPrompt = selectedCategories.length
        ? `${selectedCategories.join(", ")} 카테고리에 해당하는 정책. ${prompt.trim()}`
        : prompt.trim();

      const res = await fetchWithAuth(
        `/api/policies/recommend?prompt=${encodeURIComponent(combinedPrompt)}`
      );

      if (res.ok) {
        const data = (await res.json()) as { recommendations?: any[] };
        const recs: PolicyCardData[] = (data.recommendations || []).map((r) => ({
          id: r.id,
          title: r.plcyNm || r.title || "정책 제목",
          summary: r.reason || r.summary || "",
          tags: r.badges || r.tags,
        }));
        setRecommendations(recs);
      } else {
        const text = await res.text();
        setStatusMessage(text || "추천 요청에 실패했습니다.");
        setRecommendations([]);
      }
    } catch (err) {
      console.error(err);
      setStatusMessage("추천 요청에 실패했습니다.");
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (policy: PolicyCardData) => {
    try {
      const res = await fetchWithAuth(`/api/policies/${policy.id}`);
      if (!res.ok) throw new Error("detail fetch failed");
      const data = (await res.json()) as Partial<PolicyDetail>;
      const detail: PolicyDetail = { ...policy, ...data, id: policy.id } as PolicyDetail;
      setSelectedPolicy(detail);
    } catch (err) {
      console.error(err);
      setStatusMessage("정책 상세 조회에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-[#4d5564]">
      <div className="flex min-h-screen">
        <SideNav active="discover" />
        <div className="flex flex-1 flex-col">
          <TopNotice />

          <main className="px-8 py-10">
            <h2 className="text-2xl font-bold text-[#1f2b3a] mb-6">Discover</h2>

            <section className="mb-8">
              <h3 className="mb-4 text-lg font-semibold">맞춤 추천</h3>

              {/* 카테고리 필터 */}
              <div className="mb-4">
                <p className="mb-2 text-sm text-[#6f7784]">카테고리로 추천 결과를 좁힐 수 있어요</p>
                <CheckboxPills
                  options={categoryOptions}
                  values={selectedCategories}
                  onChange={setSelectedCategories}
                />
              </div>

              <PromptInput
                value={prompt}
                onChange={setPrompt}
                onSubmit={handleRecommend}
                loading={loading}
                helperText={statusMessage || undefined}
              />

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {recommendations.map((r) => (
                  <RecommendationCard key={r.id} policy={r} onSelect={handleSelect} />
                ))}
              </div>
            </section>

            <section className="mb-8">
              <h3 className="mb-4 text-lg font-semibold">인기 정책</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {popular.map((p) => (
                  <RecommendationCard key={p.id} policy={p} onSelect={handleSelect} />
                ))}
              </div>
            </section>

            <section>
              <h3 className="mb-4 text-lg font-semibold">최근 등록</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {recent.map((p) => (
                  <RecommendationCard key={p.id} policy={p} onSelect={handleSelect} />
                ))}
              </div>
            </section>
          </main>

          <FooterSection />
        </div>
      </div>

      <PolicyDetailModal policy={selectedPolicy} onClose={() => setSelectedPolicy(null)} />
    </div>
  );
}
