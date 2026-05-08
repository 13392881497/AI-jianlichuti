// 面试大纲相关类型定义

export interface InterviewOutline {
  id: string;
  interviewId: string;
  status: 'generating' | 'generated' | 'edited';
  // 候选人摘要
  candidateSummary: CandidateSummary;
  // 面试节奏建议
  interviewPacing: InterviewPacing;
  // 疑点分析
  suspicions: SuspicionAnalysis[];
  // 问题库
  questionBank: QuestionCategory[];
  createdAt: string;
  updatedAt: string;
}

// 候选人摘要
export interface CandidateSummary {
  // 候选人类型：应届生/社招
  candidateType: 'campus' | 'social';
  // 教育背景
  education: string;
  // 工作年限
  workExperience: string;
  // 经验类型：垂直/发散
  experienceType: 'vertical' | 'divergent';
  // 涉及领域
  domains: string[];
  // 核心技能栈
  coreSkills: string[];
  // 综合评价
  overallAssessment: string;
}

// 面试节奏建议
export interface InterviewPacing {
  // 总时长
  totalDuration: number;
  // 各阶段时间分配
  phases: InterviewPhase[];
  // 整体策略建议
  strategy: string;
}

export interface InterviewPhase {
  name: string;
  duration: number;
  description: string;
  keyPoints: string[];
}

// 疑点分析
export interface SuspicionAnalysis {
  id: string;
  // 疑点类型：空窗期/数据疑点/职业变换/经历断层/描述模糊
  type: 'gap' | 'data_doubt' | 'career_change' | 'experience_gap' | 'vague_description';
  typeLabel: string;
  // 疑点内容
  content: string;
  // 详细描述
  description: string;
  // 风险等级
  riskLevel: 'high' | 'medium' | 'low';
  // 核实建议
  verificationSuggestions: string[];
}

// 问题库分类
export interface QuestionCategory {
  id: string;
  // 考察维度名称
  dimension: string;
  // 是否必问
  required: boolean;
  // 优先级
  priority: number;
  // 问题列表
  questions: InterviewQuestion[];
}

export interface InterviewQuestion {
  id: string;
  // 主问题（基于简历定制）
  mainQuestion: string;
  // 考察目的
  examinePurpose: string;
  // 追问决策框架
  followUpFramework: FollowUpFramework;
  // 优秀回答参考
  excellentAnswerReference: string;
  // 是否标记为重点
  isHighlighted: boolean;
  order: number;
}

// 追问决策框架
export interface FollowUpFramework {
  // 答得好的信号
  goodSignals: {
    description: string;
    followUpDirection: string;
  };
  // 答得泛的信号
  vagueSignals: {
    description: string;
    followUpDirection: string;
  };
  // 答不上来的信号
  unableSignals: {
    description: string;
    followUpDirection: string;
  };
}

export interface Interview {
  id: string;
  interviewer: string;
  round: number;
  totalRounds: number;
  type: string;
  time: string;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
  hasFeedback: boolean;
  hasOutline?: boolean;
  outline?: InterviewOutline;
}

export type InterviewRound = 'first' | 'second' | 'third' | 'cross';

export interface GenerateOutlineParams {
  interviewId: string;
  round: InterviewRound;
  customInput?: string;
  jobRequirements: string[];
  resumeData: ResumeData;
}

export interface ResumeData {
  projects: Project[];
  skills: string[];
  awards: string[];
  suspicions: Suspicion[];
  highlights: Highlight[];
}

export interface Project {
  name: string;
  role: string;
  description: string;
  challenges: string[];
}

export interface Suspicion {
  content: string;
  type: 'vague' | 'gap' | 'frequent_jump';
}

export interface Highlight {
  content: string;
  type: 'award' | 'project' | 'skill';
}
