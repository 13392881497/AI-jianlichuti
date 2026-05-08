import { useState, useEffect } from 'react';
import {
  Loader2,
  Sparkles,
  Clock,
  GripVertical,
  Plus,
  Trash2,
  Star,
  AlertCircle,
  Award,
  CheckCircle2,
  RefreshCw,
  Lightbulb,
  ChevronDown,
  ChevronRight,
  User,
  Timer,
  HelpCircle,
  Target,
  FileText,
  TrendingUp,
  AlertTriangle,
  CheckSquare,
  MessageSquare,
  ChevronUp,
  X
} from 'lucide-react';
import type { InterviewOutline, QuestionCategory, InterviewQuestion, SuspicionAnalysis } from '@/types/interview';

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
  const [activeTab, setActiveTab] = useState<'summary' | 'pacing' | 'suspicions' | 'questions'>('summary');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [expandedSuspicions, setExpandedSuspicions] = useState<string[]>([]);
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>([]);

  // 当 outline 加载时，默认展开所有问题详情
  useEffect(() => {
    if (outline) {
      const allQuestionIds = outline.questionBank.flatMap(c => c.questions.map(q => q.id));
      setExpandedQuestions(allQuestionIds);
    }
  }, [outline]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleSuspicion = (suspicionId: string) => {
    setExpandedSuspicions(prev =>
      prev.includes(suspicionId)
        ? prev.filter(id => id !== suspicionId)
        : [...prev, suspicionId]
    );
  };

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestions(prev =>
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleAddQuestion = (categoryId: string) => {
    if (!outline) return;
    const newQuestion: InterviewQuestion = {
      id: `q-${Date.now()}`,
      mainQuestion: '',
      examinePurpose: '',
      followUpFramework: {
        goodSignals: { description: '', followUpDirection: '' },
        vagueSignals: { description: '', followUpDirection: '' },
        unableSignals: { description: '', followUpDirection: '' }
      },
      excellentAnswerReference: '',
      isHighlighted: false,
      order: outline.questionBank.find(c => c.id === categoryId)?.questions.length || 0
    };
    onUpdateOutline({
      ...outline,
      questionBank: outline.questionBank.map(c =>
        c.id === categoryId ? { ...c, questions: [...c.questions, newQuestion] } : c
      )
    });
  };

  const handleDeleteQuestion = (categoryId: string, questionId: string) => {
    if (!outline) return;
    onUpdateOutline({
      ...outline,
      questionBank: outline.questionBank.map(c =>
        c.id === categoryId
          ? { ...c, questions: c.questions.filter(q => q.id !== questionId) }
          : c
      )
    });
  };

  const handleUpdateQuestion = (categoryId: string, questionId: string, mainQuestion: string) => {
    if (!outline) return;
    onUpdateOutline({
      ...outline,
      questionBank: outline.questionBank.map(c =>
        c.id === categoryId
          ? {
              ...c,
              questions: c.questions.map(q =>
                q.id === questionId ? { ...q, mainQuestion } : q
              )
            }
          : c
      )
    });
  };

  const handleToggleHighlight = (categoryId: string, questionId: string) => {
    if (!outline) return;
    onUpdateOutline({
      ...outline,
      questionBank: outline.questionBank.map(c =>
        c.id === categoryId
          ? {
              ...c,
              questions: c.questions.map(q =>
                q.id === questionId ? { ...q, isHighlighted: !q.isHighlighted } : q
              )
            }
          : c
      )
    });
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-600';
      case 'medium': return 'bg-orange-100 text-orange-600';
      case 'low': return 'bg-yellow-100 text-yellow-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getRiskLevelLabel = (level: string) => {
    switch (level) {
      case 'high': return '高风险';
      case 'medium': return '中风险';
      case 'low': return '低风险';
      default: return '未知';
    }
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

      {/* Custom Input */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs text-gray-600">智能调整</span>
        </div>
        <textarea
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          placeholder="例如：多问系统设计问题..."
          className="w-full h-14 px-2.5 py-1.5 text-xs border border-gray-300 rounded resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white">
        {[
          { key: 'summary', label: '摘要', icon: User },
          { key: 'pacing', label: '节奏', icon: Timer },
          { key: 'suspicions', label: `疑点(${outline.suspicions.length})`, icon: AlertTriangle },
          { key: 'questions', label: '问题库', icon: HelpCircle }
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
      <div className="flex-1 overflow-y-auto p-3">
        {/* 候选人摘要 */}
        {activeTab === 'summary' && (
          <div className="space-y-3">
            {/* 基本信息卡片 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-gray-900">候选人画像</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">类型：</span>
                  <span className="font-medium text-gray-900">
                    {outline.candidateSummary.candidateType === 'campus' ? '应届生' : '社招'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">教育：</span>
                  <span className="font-medium text-gray-900">{outline.candidateSummary.education}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">经验：</span>
                  <span className="font-medium text-gray-900">{outline.candidateSummary.workExperience}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">类型：</span>
                  <span className={`px-2 py-0.5 text-xs rounded ${
                    outline.candidateSummary.experienceType === 'vertical' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-orange-100 text-orange-600'
                  }`}>
                    {outline.candidateSummary.experienceType === 'vertical' ? '垂直深耕' : '多领域发散'}
                  </span>
                </div>
              </div>
            </div>

            {/* 涉及领域 */}
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">涉及领域</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {outline.candidateSummary.domains.map((domain, i) => (
                  <span key={i} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                    {domain}
                  </span>
                ))}
              </div>
            </div>

            {/* 核心技能栈 */}
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">核心技能栈</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {outline.candidateSummary.coreSkills.map((skill, i) => (
                  <span key={i} className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* 综合评价 */}
            <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
              <div className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-yellow-600 mt-0.5" />
                <div>
                  <span className="text-sm font-medium text-gray-900">综合评价</span>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    {outline.candidateSummary.overallAssessment}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 面试节奏 */}
        {activeTab === 'pacing' && (
          <div className="space-y-3">
            {/* 总时长 */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">建议总时长</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">{outline.interviewPacing.totalDuration}</span>
                <span className="text-sm text-gray-500">分钟</span>
              </div>
            </div>

            {/* 策略建议 */}
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex items-start gap-2">
                <TrendingUp className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <span className="text-sm font-medium text-gray-900">整体策略</span>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    {outline.interviewPacing.strategy}
                  </p>
                </div>
              </div>
            </div>

            {/* 各阶段时间分配 */}
            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-900">阶段分配</span>
              {outline.interviewPacing.phases.map((phase, index) => (
                <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{phase.name}</span>
                    <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                      {phase.duration} 分钟
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{phase.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {phase.keyPoints.map((point, i) => (
                      <span key={i} className="text-xs text-gray-500">
                        • {point}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 疑点分析 */}
        {activeTab === 'suspicions' && (
          <div className="space-y-2">
            {outline.suspicions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-green-500" />
                <p className="text-sm">暂未发现明显疑点</p>
              </div>
            ) : (
              outline.suspicions.map((suspicion) => (
                <div key={suspicion.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => toggleSuspicion(suspicion.id)}
                    className="w-full flex items-start gap-2 p-3 hover:bg-gray-50 transition-colors"
                  >
                    {expandedSuspicions.includes(suspicion.id) ? (
                      <ChevronDown className="w-4 h-4 text-gray-400 mt-0.5" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400 mt-0.5" />
                    )}
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-1.5 py-0.5 text-xs rounded ${getRiskLevelColor(suspicion.riskLevel)}`}>
                          {getRiskLevelLabel(suspicion.riskLevel)}
                        </span>
                        <span className="text-xs text-gray-500">{suspicion.typeLabel}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">{suspicion.content}</p>
                    </div>
                  </button>
                  {expandedSuspicions.includes(suspicion.id) && (
                    <div className="px-3 pb-3 pl-9">
                      <p className="text-xs text-gray-600 mb-2">{suspicion.description}</p>
                      <div className="bg-gray-50 rounded p-2">
                        <span className="text-xs font-medium text-gray-700">核实建议：</span>
                        <ul className="mt-1 space-y-1">
                          {suspicion.verificationSuggestions.map((suggestion, i) => (
                            <li key={i} className="text-xs text-gray-600 flex items-start gap-1">
                              <span className="text-blue-500">•</span>
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* 问题库 */}
        {activeTab === 'questions' && (
          <div className="space-y-2">
            {outline.questionBank.map((category) => (
              <div key={category.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {expandedCategories.includes(category.id) ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                    <span className="text-sm font-medium text-gray-900">{category.dimension}</span>
                    {category.required && (
                      <span className="px-1 py-0.5 text-xs bg-red-100 text-red-600 rounded">必问</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">{category.questions.length} 题</span>
                </button>
                {expandedCategories.includes(category.id) && (
                  <div className="divide-y divide-gray-100">
                    {category.questions.map((question, index) => (
                      <div key={question.id} className="p-3 hover:bg-gray-50 transition-colors">
                        {/* 问题标题栏 */}
                        <div className="flex items-start gap-2">
                          <span className="text-xs text-gray-400 mt-1">{index + 1}.</span>
                          <div className="flex-1 min-w-0">
                            <div className="w-full text-sm text-gray-900 whitespace-pre-wrap break-words leading-relaxed">
                              {question.mainQuestion}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
                            <button
                              onClick={() => handleToggleHighlight(category.id, question.id)}
                              className={`p-1 rounded transition-colors ${
                                question.isHighlighted ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-500'
                              }`}
                            >
                              <Star className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => toggleQuestion(question.id)}
                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            >
                              {expandedQuestions.includes(question.id) ? (
                                <ChevronUp className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDeleteQuestion(category.id, question.id)}
                              className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* 展开详情 */}
                        {expandedQuestions.includes(question.id) && (
                          <div className="ml-4 space-y-3">
                            {/* 考察目的 */}
                            <div className="bg-blue-50 rounded p-2">
                              <div className="flex items-center gap-1.5 mb-1">
                                <Target className="w-3 h-3 text-blue-600" />
                                <span className="text-xs font-medium text-blue-700">考察目的</span>
                              </div>
                              <p className="text-xs text-gray-700">{question.examinePurpose}</p>
                            </div>

                            {/* 追问决策框架 */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-1.5">
                                <MessageSquare className="w-3 h-3 text-gray-500" />
                                <span className="text-xs font-medium text-gray-700">追问决策框架</span>
                              </div>
                              
                              {/* 答得好 */}
                              <div className="bg-green-50 rounded p-2 border-l-2 border-green-400">
                                <div className="flex items-center gap-1.5 mb-1">
                                  <CheckSquare className="w-3 h-3 text-green-600" />
                                  <span className="text-xs font-medium text-green-700">答得好 → 深挖</span>
                                </div>
                                <p className="text-xs text-gray-600 mb-1">
                                  <span className="text-green-600">信号：</span>
                                  {question.followUpFramework.goodSignals.description}
                                </p>
                                <p className="text-xs text-gray-600">
                                  <span className="text-green-600">追问：</span>
                                  {question.followUpFramework.goodSignals.followUpDirection}
                                </p>
                              </div>

                              {/* 答得泛 */}
                              <div className="bg-orange-50 rounded p-2 border-l-2 border-orange-400">
                                <div className="flex items-center gap-1.5 mb-1">
                                  <AlertCircle className="w-3 h-3 text-orange-600" />
                                  <span className="text-xs font-medium text-orange-700">答得泛 → 逼出细节</span>
                                </div>
                                <p className="text-xs text-gray-600 mb-1">
                                  <span className="text-orange-600">信号：</span>
                                  {question.followUpFramework.vagueSignals.description}
                                </p>
                                <p className="text-xs text-gray-600">
                                  <span className="text-orange-600">追问：</span>
                                  {question.followUpFramework.vagueSignals.followUpDirection}
                                </p>
                              </div>

                              {/* 答不上来 */}
                              <div className="bg-red-50 rounded p-2 border-l-2 border-red-400">
                                <div className="flex items-center gap-1.5 mb-1">
                                  <X className="w-3 h-3 text-red-600" />
                                  <span className="text-xs font-medium text-red-700">答不上来 → 降级/转向</span>
                                </div>
                                <p className="text-xs text-gray-600 mb-1">
                                  <span className="text-red-600">信号：</span>
                                  {question.followUpFramework.unableSignals.description}
                                </p>
                                <p className="text-xs text-gray-600">
                                  <span className="text-red-600">转向：</span>
                                  {question.followUpFramework.unableSignals.followUpDirection}
                                </p>
                              </div>
                            </div>

                            {/* 优秀回答参考 */}
                            <div className="bg-purple-50 rounded p-2">
                              <div className="flex items-center gap-1.5 mb-1">
                                <Award className="w-3 h-3 text-purple-600" />
                                <span className="text-xs font-medium text-purple-700">优秀回答参考</span>
                              </div>
                              <p className="text-xs text-gray-700">{question.excellentAnswerReference}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => handleAddQuestion(category.id)}
                      className="w-full flex items-center justify-center gap-1 py-2 text-xs text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      添加问题
                    </button>
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
            共 {outline.questionBank.reduce((acc, c) => acc + c.questions.length, 0)} 个问题
          </span>
          <span className="text-xs text-blue-600">AI 生成</span>
        </div>
      </div>
    </div>
  );
}
