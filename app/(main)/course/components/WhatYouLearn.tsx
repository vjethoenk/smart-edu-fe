import {
  Target,
  BookOpen,
  Sparkles,
  CheckCircle2,
  GraduationCap,
  Zap,
  Award,
  Star,
} from "lucide-react";

export default function WhatYouLearn({ description }: { description: string }) {
  const skills = description?.split("\n").filter((line) => line.trim()) || [];

  const icons = [Sparkles, Zap, Award, Star, Target, CheckCircle2];

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-2xl p-6 shadow-sm border border-indigo-100">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl shadow-md">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
            Bạn sẽ học được gì
          </h3>
          <p className="text-xs text-gray-500">
            Những kỹ năng & kiến thức quan trọng
          </p>
        </div>
      </div>

      {description ? (
        <div className="space-y-3">
          {skills.map((skill, idx) => {
            const IconComponent = icons[idx % icons.length];
            return (
              <div
                key={idx}
                className="group flex items-start gap-3 p-3 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className="p-1.5 rounded-lg bg-indigo-50 group-hover:bg-indigo-100 transition">
                  <IconComponent className="w-4 h-4 text-indigo-500" />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-900">
                  {skill.replace(/[•\-*]/g, "").trim()}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10 bg-white/50 rounded-xl">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">Chưa có mô tả chi tiết</p>
        </div>
      )}
    </div>
  );
}
