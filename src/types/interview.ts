// 面试大纲相关类型定义

export interface InterviewOutline {
  id: string;
  interviewId: string;
  status: 'generating' | 'generated' | 'edited';
  // Tab 1: 摘要
  summary: InterviewSummary;
  // Tab 2: 推荐考察问题
  recommendedQuestions: RecommendedQuestion[];
  createdAt: string;
  updatedAt: string;
}

// Tab 1: 面试摘要
export interface InterviewSummary {
  // 候选人定位：一句话概括
  candidatePositioning: string;
  // 简历亮点：3条最值得肯定的事
  resumeHighlights: ResumeHighlight[];
  // 本次面试该死磕的点：1-2条基于可疑点的追问优先级
  keyFocusPoints: string[];
  // 建议时长分配
  timeAllocation: string;
}

export interface ResumeHighlight {
  id: string;
  content: string;
  // 是否需要核实
  needsVerification: boolean;
  // 核实提示（如果需要）
  verificationNote?: string;
}

// 问题标签
export interface QuestionTag {
  id: string;
  label: string;
  color: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'gray';
}

// Tab 2: 推荐考察问题
export interface RecommendedQuestion {
  id: string;
  // 题目编号：如 Q1.1, Q1.2
  questionNumber: string;
  // 题目类型标签
  type: 'resume' | 'required';
  // 类型标签显示文本
  typeLabel: string;
  // 关联经历（如果是简历追问）
  relatedExperience?: string;
  // 必考模块（如果是岗位必考）
  requiredModule?: string;
  // 题目本身
  question: string;
  // 为什么问
  whyAsk: string;
  // 好的回答标准
  goodAnswerCriteria: string[];
  // 注水信号（答得不好的表现）
  redFlags: string[];
  // 标签列表（如字节范、技术能力等）
  tags: QuestionTag[];
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
