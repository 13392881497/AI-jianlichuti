import { useState } from 'react';
import {
  ArrowLeft,
  Phone,
  Mail,
  GraduationCap,
  Building2,
  Calendar,
  Clock,
  MoreHorizontal,
  Share2,
  UserPlus,
  Users,
  ArrowRightLeft,
  FileText,
  Video,
  ChevronRight,
  Plus,
  Edit3,
  Bookmark,
  Bell,
  Globe,
  MapPin,
  Briefcase,
  Award,
  Trophy,
  FileBadge,
  Languages,
  Star,
  Link as LinkIcon,
  Sparkles,
  FileCheck,
  Target,
  TrendingUp,
  Lightbulb,
  MessageSquare,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import InterviewOutlinePanel from '@/components/InterviewOutlinePanel';
import type { InterviewOutline } from '@/types/interview';

// 类型定义
interface Tag {
  label: string;
  type: 'primary' | 'success' | 'warning' | 'info';
}

interface Interview {
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
  outline?: InterviewOutline | null;
}

interface Candidate {
  name: string;
  avatar: string;
  tags: Tag[];
  phone: string;
  email: string;
  school: string;
  degree: string;
  major: string;
  period: string;
}

interface WorkExperience {
  company: string;
  position: string;
  period: string;
  duration: string;
  description: string[];
}

interface Project {
  name: string;
  role: string;
  period: string;
  description: string;
  achievements: string[];
}

// AI产品经理面试大纲生成
const generateMockOutline = (round: number): InterviewOutline => {
  const candidateSummary = {
    candidateType: 'social' as const,
    education: '清华大学 · 硕士 · 2021届',
    workExperience: '3年AI产品经验',
    experienceType: 'vertical' as const,
    domains: ['AI产品', '大模型应用', '搜索推荐', '用户增长'],
    coreSkills: ['产品规划', '数据分析', 'Prompt Engineering', '用户研究', 'AB测试', 'SQL'],
    overallAssessment: '该候选人拥有3年AI产品经验，专注大模型应用方向。技术背景扎实（计算机硕士），产品思维清晰。简历中亮点突出（DAU增长300%），但需要核实数据真实性和个人贡献度。'
  };

  const interviewPacing = {
    totalDuration: 60,
    phases: [
      {
        name: '开场与背景了解',
        duration: 8,
        description: '自我介绍 + 职业经历梳理',
        keyPoints: ['了解候选人职业路径', '确认项目经历真实性', '建立面试氛围']
      },
      {
        name: '产品能力考察',
        duration: 20,
        description: '产品设计 + 数据分析能力',
        keyPoints: ['需求分析方法论', '数据驱动决策', '用户体验设计']
      },
      {
        name: 'AI专业能力深挖',
        duration: 22,
        description: 'AI产品专业度评估',
        keyPoints: ['大模型产品经验', 'Prompt Engineering', 'AI伦理与安全', '技术边界理解']
      },
      {
        name: '候选人提问',
        duration: 10,
        description: '回答候选人问题',
        keyPoints: ['介绍团队AI战略', '解答技术/业务疑问']
      }
    ],
    strategy: '建议重点考察候选人的AI产品落地经验，特别关注大模型应用的实际案例。对于简历中的数据指标（DAU增长300%）需要深入核实，评估候选人对AI技术边界的理解深度。'
  };

  const suspicions = [
    {
      id: 's1',
      type: 'data_doubt' as const,
      typeLabel: '数据疑点',
      content: '简历声称"主导AI助手DAU从100万增长到400万（增长300%）"',
      description: 'DAU增长300%是非常亮眼的成绩，需要核实增长时间周期、具体贡献度以及增长手段是否可持续。',
      riskLevel: 'high' as const,
      verificationSuggestions: [
        '询问增长时间周期（是3个月还是3年？）',
        '了解DAU增长的具体手段（投放？自然增长？功能驱动？）',
        '确认是个人主导还是团队协作，具体负责哪些环节',
        '询问增长后的留存率变化',
        '了解是否考虑过增长的成本和ROI'
      ]
    },
    {
      id: 's2',
      type: 'vague_description' as const,
      typeLabel: '描述模糊',
      content: '"负责大模型产品架构设计"表述不够具体',
      description: '简历中对AI产品技术架构的描述较为笼统，缺乏对模型选型、工程实现等细节的说明。',
      riskLevel: 'medium' as const,
      verificationSuggestions: [
        '询问具体使用的模型（GPT-4/Claude/自研？）',
        '了解模型调优和Prompt设计的具体工作',
        '询问如何处理模型幻觉和安全性问题',
        '了解技术架构中的难点和解决方案'
      ]
    },
    {
      id: 's3',
      type: 'career_change' as const,
      typeLabel: '职业变动疑点',
      content: '2年内从搜索产品转AI产品，声称"主导3个AI项目"',
      description: '转型时间较短但项目经验丰富，需要核实AI产品经验的深度和真实性。',
      riskLevel: 'medium' as const,
      verificationSuggestions: [
        '询问转型AI产品的学习路径和方法',
        '了解3个AI项目的具体类型和复杂度',
        '询问在AI项目中遇到的最大技术挑战',
        '评估对AI技术发展的持续关注度'
      ]
    }
  ];

  const questionBank = [
    {
      id: 'c1',
      dimension: '产品基础能力',
      required: true,
      priority: 1,
      questions: [
        {
          id: 'q1',
          mainQuestion: '你在简历中提到主导AI助手DAU增长300%，请详细拆解一下：这个增长是在多长时间内完成的？你具体做了哪些事情？如何衡量你的贡献？',
          examinePurpose: '验证数据真实性，考察候选人的产品方法论和数据驱动思维',
          followUpFramework: {
            goodSignals: {
              description: '能清晰说明时间周期、增长手段（如功能优化/投放/运营活动），能区分个人贡献和团队成果，提到具体的衡量指标（留存率/使用时长等）',
              followUpDirection: '深挖：追问 "如果让你再做一次，你会在哪些方面做得不同？增长过程中最大的失误是什么？"'
            },
            vagueSignals: {
              description: '只说"做了很多优化"但给不出具体措施，或把团队成果全部归功于自己，用"大概增长了3倍"等模糊表述',
              followUpDirection: '逼出细节：追问 "具体是哪个功能带来了最大增长？增长了多少？花了多长时间？"'
            },
            unableSignals: {
              description: '无法说明基本的时间周期，或增长数据前后矛盾，明显缺乏实际经验',
              followUpDirection: '降级：改为问 "那你介绍一下你最熟悉的一个产品功能，你是怎么设计的？"'
            }
          },
          excellentAnswerReference: '能给出清晰的增长曲线和时间节点，详细说明A/B测试过程和结果，主动提及增长的成本和ROI，能反思哪些增长手段是可持续的，哪些是短期红利',
          isHighlighted: true,
          order: 1
        },
        {
          id: 'q2',
          mainQuestion: '假设我们要为这款面试助手产品增加一个AI模拟面试功能，你会如何设计？请从需求分析、功能设计、效果评估三个维度说明。',
          examinePurpose: '考察产品设计完整性和结构化思维能力',
          followUpFramework: {
            goodSignals: {
              description: '能系统性地从用户需求出发（候选人/面试官/HR不同角色），给出完整的功能架构和评估指标',
              followUpDirection: '深挖：追问 "如果技术资源有限，你会优先做哪个功能？为什么？"'
            },
            vagueSignals: {
              description: '直接进入功能设计，缺乏需求分析，或功能设计零散缺乏逻辑',
              followUpDirection: '逼出细节：追问 "这个功能解决什么用户的什么问题？你调研过吗？"'
            },
            unableSignals: {
              description: '无法给出基本的产品设计框架，或设计与AI能力明显不匹配',
              followUpDirection: '降级：改为问 "你觉得一个好的AI产品应该具备哪些特征？"'
            }
          },
          excellentAnswerReference: '能清晰区分不同用户角色的需求，给出MVP版本和完整版的 roadmap，设计包含Prompt模板、评分维度、反馈机制等细节，评估指标包含准确率、用户满意度、复用率等多维度',
          isHighlighted: false,
          order: 2
        }
      ]
    },
    {
      id: 'c2',
      dimension: 'AI专业能力',
      required: true,
      priority: 2,
      questions: [
        {
          id: 'q3',
          mainQuestion: '你提到负责大模型产品架构设计，请具体说明：你们选择了什么模型？为什么选择这个模型？在Prompt设计上有哪些经验？',
          examinePurpose: '考察候选人对大模型技术的理解深度和实际落地经验',
          followUpFramework: {
            goodSignals: {
              description: '能清晰说明模型选型理由（成本/效果/延迟的权衡），能给出具体的Prompt优化案例和效果对比',
              followUpDirection: '深挖：追问 "模型幻觉问题你们是怎么处理的？有没有遇到过安全合规问题？"'
            },
            vagueSignals: {
              description: '只说"用了GPT"但给不出版本和选型理由，Prompt设计缺乏系统性',
              followUpDirection: '逼出细节：追问 "你们用的是GPT-3.5还是GPT-4？API成本大概多少？怎么优化的？"'
            },
            unableSignals: {
              description: '对模型基本概念不清楚（如分不清GPT和BERT），或Prompt设计明显不合理',
              followUpDirection: '降级：改为问 "你觉得大模型产品和小模型产品有什么区别？"'
            }
          },
          excellentAnswerReference: '能详细对比不同模型的优缺点（GPT-4 vs Claude vs 文心一言），给出Prompt工程的最佳实践（Few-shot/CoT/角色设定），主动提及模型评估体系（人工评估+自动评估）',
          isHighlighted: true,
          order: 1
        },
        {
          id: 'q4',
          mainQuestion: 'AI产品经常面临幻觉（Hallucination）问题，你在之前的项目中是如何处理这个问题的？效果如何？',
          examinePurpose: '考察候选人对AI产品核心挑战的理解和解决方案',
          followUpFramework: {
            goodSignals: {
              description: '能系统性地说明多种应对手段（RAG/事实核查/置信度阈值/人工审核），并能给出具体的效果数据',
              followUpDirection: '深挖：追问 "这些方法各自的优缺点是什么？在什么场景下选择哪种方案？"'
            },
            vagueSignals: {
              description: '只说"加了人工审核"或"优化了Prompt"，缺乏系统性思考',
              followUpDirection: '逼出细节：追问 "具体怎么做的？减少了多少幻觉？对用户体验有什么影响？"'
            },
            unableSignals: {
              description: '不知道什么是幻觉，或认为幻觉无法解决只能接受',
              followUpDirection: '降级：改为问 "你觉得AI产品最大的技术限制是什么？"'
            }
          },
          excellentAnswerReference: '能给出分层的解决方案（技术层：RAG/微调；产品层：置信度提示/人工反馈；运营层：审核机制），能权衡准确率和用户体验，主动提及最新的研究方向（如Self-RAG）',
          isHighlighted: false,
          order: 2
        }
      ]
    },
    {
      id: 'c3',
      dimension: '数据与增长',
      required: true,
      priority: 3,
      questions: [
        {
          id: 'q5',
          mainQuestion: '你简历中提到"通过数据分析优化推荐策略，CTR提升25%"，请详细说明：你用了什么数据？发现了什么问题？怎么优化的？',
          examinePurpose: '考察数据驱动决策能力和分析方法论',
          followUpFramework: {
            goodSignals: {
              description: '能清晰说明数据指标（CTR/曝光/点击）、分析过程（漏斗分析/用户分群）、优化手段（算法调优/UI调整）和验证方式（A/B测试）',
              followUpDirection: '深挖：追问 "这个提升是统计显著的吗？样本量多大？持续了多久？"'
            },
            vagueSignals: {
              description: '只说"分析了数据做了优化"但给不出具体指标和方法，缺乏数据敏感度',
              followUpDirection: '逼出细节：追问 "具体看了哪些指标？用什么工具分析的？优化前后数据对比是多少？"'
            },
            unableSignals: {
              description: '无法说明基本的数据分析方法，或混淆相关性和因果性',
              followUpDirection: '降级：改为问 "你觉得产品数据分析最重要的是什么？"'
            }
          },
          excellentAnswerReference: '能给出完整的分析框架（问题发现→假设提出→实验设计→结果验证），主动提及统计显著性检验，能反思分析中的局限性和改进空间',
          isHighlighted: true,
          order: 1
        }
      ]
    },
    {
      id: 'c4',
      dimension: '简历疑点核实',
      required: true,
      priority: 4,
      questions: [
        {
          id: 'q6',
          mainQuestion: '你从搜索产品转型AI产品只有2年时间，但简历上写了主导3个AI项目。能介绍一下这3个项目分别是什么？你在其中遇到的最大技术挑战是什么？',
          examinePurpose: '核实AI产品经验的真实性和深度',
          followUpFramework: {
            goodSignals: {
              description: '能清晰说明3个项目的类型、复杂度、个人角色，能具体描述技术挑战（如模型选型/效果调优/工程落地）',
              followUpDirection: '深挖：追问 "如果让你重新做这3个项目，你会在哪些方面做得不同？"'
            },
            vagueSignals: {
              description: '3个项目描述雷同，无法区分复杂度，或技术挑战描述空泛',
              followUpDirection: '逼出细节：追问 "这3个项目中哪个技术难度最大？具体难在哪里？你怎么解决的？"'
            },
            unableSignals: {
              description: '无法说清楚3个项目的区别，或明显夸大项目复杂度',
              followUpDirection: '降级：改为问 "你转型AI产品后，最大的学习收获是什么？"'
            }
          },
          excellentAnswerReference: '能给出3个差异化明显的项目（如对话系统/内容生成/推荐优化），详细描述技术挑战和解决方案，能反思转型过程中的认知变化',
          isHighlighted: true,
          order: 1
        }
      ]
    }
  ];

  return {
    id: `outline-${Date.now()}`,
    interviewId: '',
    status: 'generated',
    candidateSummary,
    interviewPacing,
    suspicions,
    questionBank,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

// AI产品经理简历数据
const mockCandidate: Candidate = {
  name: '张明远',
  avatar: '',
  tags: [
    { label: '内推', type: 'primary' },
    { label: '985', type: 'success' },
    { label: 'AI产品', type: 'warning' },
    { label: '3年经验', type: 'info' }
  ],
  phone: '+86 138-1234-5678',
  email: 'zhangmingyuan@email.com',
  school: '清华大学',
  degree: '硕士',
  major: '计算机科学与技术',
  period: '2018-09 ~ 2021-06'
};

const workExperiences: WorkExperience[] = [
  {
    company: '字节跳动',
    position: '高级AI产品经理',
    period: '2022.03 - 至今',
    duration: '2年3个月',
    description: [
      '主导AI智能助手产品从0到1建设，DAU从100万增长至400万（增长300%）',
      '负责大模型产品架构设计，基于GPT-4构建多轮对话系统，用户满意度提升40%',
      '设计Prompt Engineering框架，建立标准化模型调优流程，响应延迟降低50%',
      '搭建AI产品数据指标体系，通过A/B测试优化推荐策略，CTR提升25%'
    ]
  },
  {
    company: '百度',
    position: '产品经理（搜索方向）',
    period: '2021.07 - 2022.02',
    duration: '8个月',
    description: [
      '负责百度搜索结果页体验优化，通过用户研究改进信息展示逻辑',
      '参与搜索推荐算法优化项目，协同算法团队提升结果相关性',
      '设计并落地搜索智能问答功能，覆盖头部Query 30%'
    ]
  }
];

const projects: Project[] = [
  {
    name: 'AI面试助手',
    role: '产品负责人',
    period: '2023.06 - 2023.12',
    description: '基于大模型的智能面试辅导工具，提供模拟面试、简历优化、行业知识问答等功能',
    achievements: [
      '主导产品从0到1，3个月内完成MVP上线',
      '设计多角色Prompt模板库，覆盖技术/产品/运营等10+岗位',
      '建立模型效果评估体系，回答准确率从65%提升至85%',
      '用户NPS评分达到45分，月活跃用户突破50万'
    ]
  },
  {
    name: '智能客服系统',
    role: '核心产品经理',
    period: '2022.09 - 2023.05',
    description: '基于大模型的企业智能客服解决方案，支持多轮对话、知识库问答、工单自动处理',
    achievements: [
      '负责产品规划和需求分析，完成5家标杆客户交付',
      '设计RAG架构解决模型幻觉问题，事实准确率达到92%',
      '搭建意图识别和槽位填充模块，对话完成率提升35%',
      '客户平均人力成本降低60%，问题解决率提升至80%'
    ]
  }
];

const skills = [
  { category: '产品能力', items: ['需求分析', '原型设计', '数据分析', '用户研究', 'AB测试'] },
  { category: 'AI技能', items: ['Prompt Engineering', '大模型应用', 'RAG架构', '模型评估'] },
  { category: '工具', items: ['Figma', 'Axure', 'SQL', 'Python', '神策/GrowingIO'] }
];

// 组件
const Tag = ({ label, type }: Tag) => {
  const typeStyles = {
    primary: 'bg-blue-100 text-blue-600',
    success: 'bg-green-100 text-green-600',
    warning: 'bg-orange-100 text-orange-600',
    info: 'bg-gray-100 text-gray-600'
  };

  return (
    <span className={`px-2 py-0.5 text-xs rounded ${typeStyles[type]}`}>
      {label}
    </span>
  );
};

const Button = ({ 
  children, 
  type = 'default', 
  size = 'md',
  icon: Icon,
  onClick 
}: { 
  children: React.ReactNode; 
  type?: 'primary' | 'default' | 'danger' | 'link';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ElementType;
  onClick?: () => void;
}) => {
  const typeStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    default: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50',
    danger: 'bg-white border border-red-300 text-red-600 hover:bg-red-50',
    link: 'text-blue-600 hover:text-blue-700 bg-transparent'
  };

  const sizeStyles = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-1.5 text-sm',
    lg: 'px-6 py-2 text-base'
  };

  return (
    <button 
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded transition-colors ${typeStyles[type]} ${sizeStyles[size]}`}
    >
      {Icon && <Icon size={size === 'sm' ? 12 : 14} />}
      {children}
    </button>
  );
};

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ 
  title, 
  action,
  icon: Icon 
}: { 
  title: string; 
  action?: React.ReactNode;
  icon?: React.ElementType;
}) => (
  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
    <div className="flex items-center gap-2">
      {Icon && <Icon size={16} className="text-gray-400" />}
      <span className="font-medium text-gray-900">{title}</span>
    </div>
    {action && <div>{action}</div>}
  </div>
);

const SectionTitle = ({ icon: Icon, title }: { icon: React.ElementType; title: string }) => (
  <div className="flex items-center gap-2 mb-3">
    <Icon size={18} className="text-blue-500" />
    <span className="font-semibold text-gray-900">{title}</span>
  </div>
);

export default function CandidateDetail() {
  const [activeTab, setActiveTab] = useState('resume');
  const [selectedInterviewId, setSelectedInterviewId] = useState<string | null>(null);
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  const [interviews, setInterviews] = useState<Interview[]>([
    {
      id: '1',
      interviewer: '我的面试',
      round: 3,
      totalRounds: 3,
      type: '视频面试',
      time: '14:00',
      date: '今天（周五）',
      status: 'pending',
      hasFeedback: false,
      hasOutline: false,
      outline: null
    },
    {
      id: '2',
      interviewer: '王经理',
      round: 2,
      totalRounds: 3,
      type: '视频面试',
      time: '10:00',
      date: '昨天（周四）',
      status: 'completed',
      hasFeedback: true,
      hasOutline: false,
      outline: null
    },
    {
      id: '3',
      interviewer: 'HR',
      round: 1,
      totalRounds: 3,
      type: '电话面试',
      time: '15:30',
      date: '2024-01-15（周一）',
      status: 'completed',
      hasFeedback: true,
      hasOutline: false,
      outline: null
    }
  ]);

  const tabs = [
    { key: 'resume', label: '完整简历' },
    { key: 'evaluation', label: '评价记录' }
  ];

  const selectedInterview = interviews.find(i => i.id === selectedInterviewId);

  const handleGenerateOutline = async (interviewId: string) => {
    setSelectedInterviewId(interviewId);
    setIsGeneratingOutline(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const outline = generateMockOutline(3);
    
    setInterviews(prev => prev.map(i => 
      i.id === interviewId 
        ? { ...i, hasOutline: true, outline }
        : i
    ));
    setIsGeneratingOutline(false);
  };

  const handleUpdateOutline = (interviewId: string, outline: InterviewOutline) => {
    setInterviews(prev => prev.map(i => 
      i.id === interviewId 
        ? { ...i, outline }
        : i
    ));
  };

  const InterviewItem = ({ interview }: { interview: Interview }) => (
    <div className="py-4 border-b border-gray-100 last:border-b-0">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <UserPlus size={14} className="text-gray-500" />
            </div>
            <span className="font-medium text-gray-900">{interview.interviewer}</span>
            <span className="text-gray-400">·</span>
            <span className="text-gray-500 text-sm">{interview.round} 面</span>
            <span className="text-gray-400 text-xs">(用人经理面)</span>
          </div>
          <div className="text-sm text-gray-600 mb-2">
            {interview.type} · {interview.date} {interview.time} <span className="text-blue-600 cursor-pointer">详情</span>
          </div>
          <div className="flex items-center gap-2">
            {interview.status === 'completed' && interview.hasFeedback && (
              <Button type="primary" size="sm">继续评价</Button>
            )}
            {interview.status === 'pending' && (
              <Button type="primary" size="sm">填写评价</Button>
            )}
            {interview.interviewer === '我的面试' && (
              interview.hasOutline ? (
                <button
                  onClick={() => setSelectedInterviewId(interview.id)}
                  className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded transition-colors"
                >
                  <FileCheck size={12} />
                  查看面试大纲
                </button>
              ) : (
                <button
                  onClick={() => handleGenerateOutline(interview.id)}
                  className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors"
                >
                  <Sparkles size={12} />
                  生成面试大纲
                </button>
              )
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Video size={16} className="text-gray-400" />
          <span className="text-sm text-blue-600 cursor-pointer">开始视频</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
              <ArrowLeft size={18} />
              <span>返回</span>
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="搜索应用、员工等内容"
                className="w-64 px-3 py-1.5 pl-9 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span>&lt; 上一个</span>
              <span>下一个 &gt;</span>
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区 - 三栏布局 1:1:1 */}
      <div className="flex gap-4 p-4">
        {/* 左侧栏 - 简历详情 */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* 候选人基本信息 */}
          <Card>
            <div className="p-4">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-xl">张</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-xl font-semibold text-gray-900">{mockCandidate.name}</h2>
                    <Bookmark size={16} className="text-gray-400" />
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {mockCandidate.tags.map((tag, idx) => (
                      <Tag key={idx} {...tag} />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Phone size={14} />
                      <span>{mockCandidate.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mail size={14} />
                      <span>{mockCandidate.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 快捷操作 */}
              <div className="flex items-center gap-3 mb-4 text-sm text-gray-500 border-b border-gray-100 pb-3">
                <button className="hover:text-gray-700">备注</button>
                <span>·</span>
                <button className="hover:text-gray-700">加入文件夹</button>
                <span>·</span>
                <button className="hover:text-gray-700">添加提醒</button>
                <span>·</span>
                <MoreHorizontal size={16} className="cursor-pointer hover:text-gray-700" />
              </div>

              {/* 标签页 */}
              <div className="flex border-b border-gray-200">
                {tabs.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 py-2 text-sm font-medium transition-colors relative ${
                      activeTab === tab.key 
                        ? 'text-blue-600' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.key && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {activeTab === 'resume' && (
            <>
              {/* 求职意向 */}
              <Card>
                <div className="p-4">
                  <SectionTitle icon={Target} title="求职意向" />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">期望岗位：</span>
                      <span className="text-gray-900 font-medium">高级AI产品经理</span>
                    </div>
                    <div>
                      <span className="text-gray-500">期望城市：</span>
                      <span className="text-gray-900">北京、上海</span>
                    </div>
                    <div>
                      <span className="text-gray-500">期望薪资：</span>
                      <span className="text-gray-900">35k-50k · 15薪</span>
                    </div>
                    <div>
                      <span className="text-gray-500">到岗时间：</span>
                      <span className="text-gray-900">1个月内</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* 教育经历 */}
              <Card>
                <div className="p-4">
                  <SectionTitle icon={GraduationCap} title="教育经历" />
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <GraduationCap size={20} className="text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-gray-900">{mockCandidate.school}</div>
                        <span className="text-sm text-gray-500">{mockCandidate.period}</span>
                      </div>
                      <div className="text-sm text-gray-600">{mockCandidate.degree} · {mockCandidate.major}</div>
                      <div className="text-sm text-gray-500 mt-1">GPA: 3.8/4.0 | 专业排名前10%</div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* 工作经历 */}
              <Card>
                <div className="p-4">
                  <SectionTitle icon={Briefcase} title="工作经历" />
                  <div className="space-y-4">
                    {workExperiences.map((work, idx) => (
                      <div key={idx} className={idx !== workExperiences.length - 1 ? 'border-b border-gray-100 pb-4' : ''}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-semibold text-gray-900">{work.company}</div>
                          <span className="text-sm text-gray-500">{work.period}</span>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">{work.position} · {work.duration}</div>
                        <ul className="space-y-1">
                          {work.description.map((desc, i) => (
                            <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                              <span className="text-blue-500 mt-1.5">•</span>
                              <span>{desc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* 项目经历 */}
              <Card>
                <div className="p-4">
                  <SectionTitle icon={TrendingUp} title="项目经历" />
                  <div className="space-y-4">
                    {projects.map((project, idx) => (
                      <div key={idx} className={idx !== projects.length - 1 ? 'border-b border-gray-100 pb-4' : ''}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-semibold text-gray-900">{project.name}</div>
                          <span className="text-sm text-gray-500">{project.period}</span>
                        </div>
                        <div className="text-sm text-blue-600 mb-2">{project.role}</div>
                        <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                        <ul className="space-y-1">
                          {project.achievements.map((achievement, i) => (
                            <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                              <CheckCircle2 size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* 专业技能 */}
              <Card>
                <div className="p-4">
                  <SectionTitle icon={Lightbulb} title="专业技能" />
                  <div className="space-y-3">
                    {skills.map((skill, idx) => (
                      <div key={idx}>
                        <div className="text-sm font-medium text-gray-700 mb-2">{skill.category}</div>
                        <div className="flex flex-wrap gap-2">
                          {skill.items.map((item, i) => (
                            <span key={i} className="px-2.5 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>

        {/* 中间栏 - 职位与面试 */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* 职位信息 */}
          <Card>
            <div className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-xl font-semibold text-gray-900">高级AI产品经理</h1>
                <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-600 rounded">面试中</span>
                <ChevronRight size={16} className="text-gray-400" />
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Button type="primary" icon={Calendar}>安排面试</Button>
                <Button type="danger" icon={Clock}>终止流程</Button>
                <Button icon={Share2}>分享候选人</Button>
                <Button icon={ArrowRightLeft}>转移职位</Button>
                <Button icon={Users}>加入集中面试</Button>
                <Button icon={Bell}>通知候选人</Button>
                <Button icon={MoreHorizontal}>更多</Button>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Building2 size={14} />
                  <span>智能招聘事业部</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  <span>北京 · 海淀区</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>3天前投递</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <div className="w-5 h-5 rounded bg-green-500 flex items-center justify-center">
                  <Bell size={12} className="text-white" />
                </div>
                <span className="text-sm font-medium text-gray-900">订阅候选人进展</span>
                <span className="text-gray-400">(1)</span>
                <div className="flex-1" />
                <span className="text-xs text-gray-500">新增进展前</span>
              </div>
            </div>
          </Card>

          {/* 面试记录 */}
          <Card>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">面试记录</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Globe size={14} />
                  <span>共3轮</span>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {interviews.map(interview => (
                  <InterviewItem key={interview.id} interview={interview} />
                ))}
              </div>
            </div>
          </Card>

          {/* 简历评估 */}
          <Card>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare size={18} className="text-blue-500" />
                <span className="font-semibold text-gray-900">简历亮点与风险</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                  <CheckCircle2 size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-green-800">亮点</div>
                    <div className="text-sm text-green-700">清华计算机硕士，技术背景扎实；DAU增长300%数据亮眼；AI产品经验与岗位高度匹配</div>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 bg-orange-50 rounded-lg">
                  <AlertCircle size={16} className="text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-orange-800">风险点</div>
                    <div className="text-sm text-orange-700">DAU增长数据需核实；转型AI产品仅2年但项目经验丰富；需验证技术理解深度</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* 右侧第三栏 - 面试大纲面板 */}
        <div className="flex-1 min-w-0">
          <Card className="h-[calc(100vh-120px)] sticky top-4">
            {selectedInterview ? (
              <InterviewOutlinePanel
                interviewId={selectedInterview.id}
                round={selectedInterview.round}
                candidateName={mockCandidate.name}
                outline={selectedInterview.outline || null}
                isGenerating={isGeneratingOutline}
                onGenerate={() => handleGenerateOutline(selectedInterview.id)}
                onUpdateOutline={(outline) => handleUpdateOutline(selectedInterview.id, outline)}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-base font-medium text-gray-900 mb-2">面试大纲</h3>
                <p className="text-sm text-gray-500">
                  点击左侧面试卡片中的<br />「生成面试大纲」开始使用
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

// 辅助图标组件
function CheckIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
