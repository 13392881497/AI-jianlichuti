import { useState } from 'react';
import {
  Loader2,
  Sparkles,
  User,
  Target,
  Clock,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Lightbulb,
  ChevronDown,
  ChevronRight,
  FileText,
  HelpCircle,
  MoreHorizontal,
  ArrowRightLeft,
  Plus,
  Trash2,
  Star
} from 'lucide-react';
import type { InterviewOutline, ExaminationPoint } from '@/types/interview';

interface InterviewOutlinePanelProps {
  interviewId: string;
  round: number;
  candidateName: string;
  outline: InterviewOutline | null;
  isGenerating: boolean;
  onGenerate: () => void;
  onUpdateOutline: (outline: InterviewOutline) => void;
}

export default function InterviewOutlinePanel({
  interviewId,
  round,
  candidateName,
  outline,
  isGenerating,
  onGenerate,
  onUpdateOutline
}: InterviewOutlinePanelProps) {
  const [customInput, setCustomInput] = useState('');
  const [activeTab, setActiveTab] = useState<'summary' | 'examination'>('summary');
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  // 按经历分组组织考察点
  const groupExaminationPoints = (points: ExaminationPoint[]) => {
    const groups: { [key: string]: ExaminationPoint[] } = {};
    points.forEach(point => {
      const key = point.relatedExperience || '岗位必考';
      if (!groups[key]) groups[key] = [];
      groups[key].push(point);
    });
    return groups;
  };

  const handleRegenerateQuestion = (pointId: string) => {
    // TODO: 调用API重新生成单个问题
    console.log('重新生成问题:', pointId);
  };

  const handleAdjustDifficulty = (pointId: string, direction: 'harder' | 'easier') => {
    // TODO: 调用API调整难度
    console.log('调整难度:', pointId, direction);
  };

  const handleAddFollowUp = (pointId: string) => {
    // TODO: 添加追问
    console.log('添加追问:', pointId);
  };

  if (isGenerating) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-base font-medium text-gray-900 mb-2">AI 正在生成面试大纲...</p>
        <p className="text-sm text-gray-500 text-center">正在分析简历、识别疑点、生成问题库</p>
      </div>
    );
  }

  if (!outline) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8">
        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">生成面试大纲</h3>
        <p className="text-sm text-gray-500 text-center mb-6">
          AI 将根据候选人简历和岗位要求，<br />为您生成个性化的面试大纲
        </p>
        <div className="w-full mb-4">
          <textarea
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="输入自定义要求（可选）：例如多问系统设计问题、重点考察抗压能力..."
            className="w-full h-20 px-3 py-2 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={onGenerate}
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          生成面试大纲
        </button>
      </div>
    );
  }

  const examinationGroups = groupExaminationPoints(outline.examinationPoints);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">面试大纲</h3>
            <p className="text-xs text-gray-500">第 {round} 轮</p>
          </div>
        </div>
        <button
          onClick={onGenerate}
          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
          title="重新生成"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Global Adjust Input */}
      <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="整体调整：再难一点 / 时长改成45分钟..."
            className="flex-1 h-8 px-2.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white">
        {[
          { key: 'summary', label: '摘要', icon: FileText },
          { key: 'examination', label: `考察点(${outline.examinationPoints.length})`, icon: Target }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`flex-1 py-2.5 text-xs font-medium transition-colors relative flex items-center justify-center gap-1 ${
              activeTab === tab.key
                ? 'text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
            {activeTab === tab.key && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Tab 1: 摘要 */}
        {activeTab === 'summary' && (
          <div className="p-4 space-y-4">
            {/* 候选人定位 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-gray-900">候选人定位</span>
              </div>
              <p className="text-sm text-gray-800 leading-relaxed">
                {outline.summary.candidatePositioning}
              </p>
            </div>

            {/* 简历亮点 */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-semibold text-gray-900">简历亮点</span>
              </div>
              <div className="space-y-2">
                {outline.summary.resumeHighlights.map((highlight, i) => (
                  <div key={highlight.id} className="flex items-start gap-2">
                    <span className="text-xs text-gray-400 mt-0.5">{i + 1}.</span>
                    <div className="flex-1">
                      <span className="text-sm text-gray-800">{highlight.content}</span>
                      {highlight.needsVerification && (
                        <span className="ml-2 text-xs text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
                          待核实
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 本次面试该死磕的点 */}
            <div className="bg-red-50 rounded-lg p-4 border border-red-100">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-red-600" />
                <span className="text-sm font-semibold text-gray-900">本次面试该死磕的点</span>
              </div>
              <div className="space-y-2">
                {outline.summary.keyFocusPoints.map((point, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-red-500 mt-0.5" />
                    <span className="text-sm text-gray-800">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 建议时长分配 */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-green-600" />
                <span className="text-sm font-semibold text-gray-900">建议时长分配</span>
              </div>
              <p className="text-sm text-gray-800">{outline.summary.timeAllocation}</p>
            </div>
          </div>
        )}

        {/* Tab 2: 考察点 */}
        {activeTab === 'examination' && (
          <div className="p-3 space-y-3">
            {Object.entries(examinationGroups).map(([groupName, points]) => (
              <div key={groupName} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {/* 经历/模块标题 */}
                <button
                  onClick={() => toggleGroup(groupName)}
                  className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {expandedGroups.includes(groupName) ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                    <span className="text-sm font-medium text-gray-900">{groupName}</span>
                  </div>
                  <span className="text-xs text-gray-500">{points.length} 题</span>
                </button>

                {/* 问题列表 */}
                {expandedGroups.includes(groupName) && (
                  <div className="divide-y divide-gray-100">
                    {points.map((point) => (
                      <div key={point.id} className="p-3">
                        {/* 问题头部 */}
                        <div className="flex items-start gap-2 mb-2">
                          <span className="text-xs font-medium text-gray-500 mt-0.5">
                            {point.questionNumber}
                          </span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`px-1.5 py-0.5 text-xs rounded ${
                                point.type === 'resume' 
                                  ? 'bg-blue-100 text-blue-600' 
                                  : 'bg-purple-100 text-purple-600'
                              }`}>
                                {point.typeLabel}
                              </span>
                            </div>
                            <p className="text-sm font-medium text-gray-900 leading-relaxed">
                              {point.question}
                            </p>
                          </div>
                          {/* 题级操作按钮 */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleRegenerateQuestion(point.id)}
                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                              title="换一题"
                            >
                              <ArrowRightLeft className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleAdjustDifficulty(point.id, 'harder')}
                              className="p-1 text-gray-400 hover:text-orange-600 transition-colors"
                              title="更难"
                            >
                              <MoreHorizontal className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* 为什么问 */}
                        <div className="ml-6 mb-2 bg-gray-50 rounded p-2">
                          <span className="text-xs font-medium text-gray-600">为什么问：</span>
                          <span className="text-xs text-gray-700 ml-1">{point.whyAsk}</span>
                        </div>

                        {/* 好的回答标准 */}
                        <div className="ml-6 mb-2">
                          <div className="flex items-center gap-1.5 mb-1">
                            <CheckCircle2 className="w-3 h-3 text-green-600" />
                            <span className="text-xs font-medium text-green-700">好的回答</span>
                          </div>
                          <ul className="space-y-1">
                            {point.goodAnswerCriteria.map((criteria, i) => (
                              <li key={i} className="text-xs text-gray-600 flex items-start gap-1">
                                <span className="text-green-500">•</span>
                                {criteria}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* 注水信号 */}
                        <div className="ml-6 mb-2">
                          <div className="flex items-center gap-1.5 mb-1">
                            <AlertCircle className="w-3 h-3 text-red-500" />
                            <span className="text-xs font-medium text-red-600">注水信号</span>
                          </div>
                          <ul className="space-y-1">
                            {point.redFlags.map((flag, i) => (
                              <li key={i} className="text-xs text-gray-600 flex items-start gap-1">
                                <span className="text-red-400">•</span>
                                {flag}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* 追问按钮 */}
                        <div className="ml-6 flex gap-2">
                          <button
                            onClick={() => handleAddFollowUp(point.id)}
                            className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                            追问一层
                          </button>
                          <button
                            onClick={() => handleAdjustDifficulty(point.id, 'harder')}
                            className="flex items-center gap-1 px-2 py-1 text-xs text-orange-600 hover:bg-orange-50 rounded transition-colors"
                          >
                            <HelpCircle className="w-3 h-3" />
                            改成场景题
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            共 {outline.examinationPoints.length} 个考察点
          </span>
          <span className="text-xs text-blue-600">AI 生成</span>
        </div>
      </div>
    </div>
  );
}
