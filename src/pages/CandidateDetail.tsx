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
  FileCheck
} from 'lucide-react';
import InterviewOutlinePanel from '@/components/InterviewOutlinePanel';
import type { InterviewOutline } from '@/types/interview';

// 类型定义
interface Tag {
  label: string;
  type: 'primary' | 'success' | 'warning' | 'info';
}

interface Education {
  school: string;
  degree: string;
  period: string;
  duration: string;
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
  period: string;
}

// 模拟生成面试大纲 - 包含丰富疑点的测试版本
const generateMockOutline = (round: number): InterviewOutline => {
  // 候选人摘要 - 包含更多疑点背景
  const candidateSummary = {
    candidateType: 'social' as const,
    education: '某某理工大学 · 本科 · 2022届',
    workExperience: '3年工作经验（含6个月空窗期）',
    experienceType: 'divergent' as const,
    domains: ['后端开发', '分布式系统', '性能优化', '微服务架构', '云原生'],
    coreSkills: ['Java', 'Spring Boot', 'Redis', 'MySQL', 'Kafka', 'Docker', 'Kubernetes', 'Elasticsearch'],
    overallAssessment: '该候选人工作经验3年但经历较跳跃，有6个月空窗期需关注。技术栈涉及面广但部分描述存在夸大嫌疑（如"精通"多项技术）。简历中数据指标亮眼但缺乏具体支撑，需要在面试中重点核实项目真实性和个人贡献度。'
  };

  // 面试节奏建议 - 针对疑点增加验证环节
  const interviewPacing = {
    totalDuration: 60,
    phases: [
      {
        name: '开场与简历验证',
        duration: 12,
        description: '自我介绍 + 简历关键信息核实（重点验证疑点）',
        keyPoints: ['核实空窗期原因', '确认工作经历时间线', '了解频繁跳槽动机', '建立面试氛围']
      },
      {
        name: '技术基础考察',
        duration: 18,
        description: '计算机基础 + 编程能力（验证"精通"声明）',
        keyPoints: ['数据结构与算法', '核实技术深度（非广度）', '代码实现能力']
      },
      {
        name: '项目深度挖掘',
        duration: 22,
        description: '重点项目深入探讨（核实数据真实性）',
        keyPoints: ['验证QPS/并发数据', '技术选型思路', '个人实际贡献度', '难点解决方案']
      },
      {
        name: '候选人提问',
        duration: 8,
        description: '回答候选人问题',
        keyPoints: ['介绍团队情况', '解答技术/业务疑问']
      }
    ],
    strategy: '建议采用"质疑-验证-深挖"策略，重点关注简历中存在的空窗期、数据夸大、频繁跳槽等风险点。对于声称"精通"的技术必须现场验证，对于亮眼的数据指标要求给出具体场景和验证方式。'
  };

  // 疑点分析 - 包含多种类型疑点
  const suspicions = [
    {
      id: 's1',
      type: 'data_doubt' as const,
      typeLabel: '数据疑点',
      content: '简历声称"将系统 QPS 从 1k 提升到 50k，性能提升 50 倍"',
      description: 'QPS 提升 50 倍的 claim 非常激进，作为普通开发而非架构师，主导如此大规模性能优化的可能性较低。需要核实实际参与程度、优化手段和测量方式。',
      riskLevel: 'high' as const,
      verificationSuggestions: [
        '询问优化前的具体 baseline 数据（P99 latency、错误率、机器配置）',
        '了解优化的具体技术手段（缓存？异步？扩容？）',
        '确认是个人方案设计还是执行团队方案',
        '询问如何验证 50 倍提升（压测工具、测试环境、数据样本）',
        '了解优化过程中遇到的最大技术阻力及解决方案'
      ]
    },
    {
      id: 's2',
      type: 'gap' as const,
      typeLabel: '空窗期疑点',
      content: '2023-06 至 2023-12 存在 6 个月空窗期',
      description: '简历显示 6 个月无工作经历，对于工作仅 3 年的候选人来说占比较高，需要了解空窗期原因及期间的技术成长情况。',
      riskLevel: 'high' as const,
      verificationSuggestions: [
        '直接询问空窗期原因（主动离职/被动裁员/个人原因）',
        '了解空窗期间的技术学习和项目实践情况',
        '询问是否有未写入简历的兼职/外包经历',
        '关注空窗期后的求职过程和选择当前岗位的原因',
        '评估空窗期对技术能力的影响（是否保持技术敏感度）'
      ]
    },
    {
      id: 's3',
      type: 'career_change' as const,
      typeLabel: '职业变动疑点',
      content: '3 年内更换 4 份工作，平均每份工作 9 个月',
      description: '跳槽频率过高，可能存在稳定性问题或能力不被认可的情况。需要了解每次离职的真实原因和职业规划。',
      riskLevel: 'high' as const,
      verificationSuggestions: [
        '请候选人按时间线梳理每份工作的入职和离职原因',
        '关注是否存在被辞退或试用期未通过的情况',
        '了解候选人对职业稳定性的看法',
        '询问对未来 3-5 年的职业规划',
        '评估候选人是否清楚自己想要什么（技术深耕 vs 管理转型）'
      ]
    },
    {
      id: 's4',
      type: 'vague_description' as const,
      typeLabel: '描述模糊',
      content: '多处使用"精通""深入理解"等绝对化词汇',
      description: '简历中 8 处使用"精通"（Java、Redis、MySQL、Kafka、ES、Docker、K8s、微服务），对于 3 年经验的候选人来说，这种描述很可能存在夸大。',
      riskLevel: 'medium' as const,
      verificationSuggestions: [
        '选择 2-3 个声称"精通"的技术进行深度追问',
        '询问"精通"的自我定义标准是什么',
        '了解是否读过核心技术的源码或官方文档',
        '询问是否遇到过该技术在极端场景下的问题',
        '评估技术深度 vs 技术广度的平衡'
      ]
    },
    {
      id: 's5',
      type: 'experience_gap' as const,
      typeLabel: '经历断层',
      content: '简历显示"主导微服务架构升级"但第一份工作为传统单体应用',
      description: '候选人在第一家公司（工作 8 个月）期间声称主导微服务架构升级，但该公司技术栈为传统 Spring MVC 单体应用，存在经历与技术栈不匹配的情况。',
      riskLevel: 'medium' as const,
      verificationSuggestions: [
        '询问微服务架构升级的背景和触发原因',
        '了解升级前的技术架构和团队规模',
        '询问具体负责的服务拆分范围和数量',
        '了解升级过程中遇到的最大技术挑战',
        '核实升级后的运维复杂度如何管理（监控、链路追踪、日志聚合）'
      ]
    },
    {
      id: 's6',
      type: 'data_doubt' as const,
      typeLabel: '数据疑点',
      content: '"管理 10 人团队，负责千万级用户产品后端"',
      description: '工作第 2 年就声称管理 10 人团队，且产品用户量千万级，对于普通互联网公司来说晋升速度异常快，需要核实管理职责的真实性和团队规模。',
      riskLevel: 'medium' as const,
      verificationSuggestions: [
        '询问团队的人员构成（正式员工/实习生/外包）',
        '了解日常管理工作内容（比例分配：coding vs management）',
        '询问是否参与绩效评估、招聘面试等管理职责',
        '了解如何协调 10 人团队的工作分配和进度管理',
        '询问作为管理者遇到的最大挑战和解决方案'
      ]
    },
    {
      id: 's7',
      type: 'vague_description' as const,
      typeLabel: '描述模糊',
      content: '"参与多个核心项目，推动技术演进"表述空泛',
      description: '简历中对项目经历的描述大量使用"参与""协助""推动"等模糊词汇，缺乏具体的技术方案、量化指标和个人贡献说明。',
      riskLevel: 'low' as const,
      verificationSuggestions: [
        '要求候选人挑选一个最熟悉的项目详细描述',
        '询问"参与"的具体含义（方案设计？编码实现？测试部署？）',
        '了解项目的业务背景和技术挑战',
        '询问如果重新做这个项目，会有哪些改进',
        '评估候选人对项目的 ownership 程度'
      ]
    }
  ];

  // 问题库
  const questionBank = [
    {
      id: 'c1',
      dimension: '编码能力',
      required: true,
      priority: 1,
      questions: [
        {
          id: 'q1',
          mainQuestion: '你在简历中提到使用 Redis 实现了缓存优化，请现场写一段代码：实现一个带过期时间的 LRU 缓存，要求支持 O(1) 的读写操作，并处理并发安全问题。',
          examinePurpose: '验证候选人是否真正理解并实践过 Redis 缓存，考察数据结构设计、代码实现和并发处理能力',
          followUpFramework: {
            goodSignals: {
              description: '能正确实现 HashMap + 双向链表结构，主动考虑 ConcurrentHashMap 或读写锁解决并发问题，能说出 Redis 中类似结构的实现原理',
              followUpDirection: '深挖：追问 "你在实际项目中是如何决定缓存过期时间的？有没有遇到过缓存穿透或雪崩问题，怎么解决的？"'
            },
            vagueSignals: {
              description: '只说 "用 Redis 的 LRU 策略" 或代码结构混乱，无法清晰解释实现原理，用"大概用了个 map"等模糊表述',
              followUpDirection: '逼出细节：追问 "你说的 map 是 HashMap 还是 ConcurrentHashMap？具体怎么保证线程安全？" 或 "Redis 的 LRU 和 Java 实现的 LRU 有什么区别？"'
            },
            unableSignals: {
              description: '无法写出基本结构，或写的代码有明显 bug（如死锁、空指针），沉默超过 10 秒',
              followUpDirection: '降级：改为问 "那你说说 Redis 为什么快？" 或 "你知道有哪些缓存淘汰策略？" 转向基础概念考察'
            }
          },
          excellentAnswerReference: '能写出完整的线程安全 LRU 实现，使用 ConcurrentHashMap + 双向链表或 LinkedHashMap，主动提及 Redis 的近似 LRU 实现差异，能分析时间/空间复杂度，并联系实际项目中的缓存设计经验',
          isHighlighted: true,
          order: 1
        },
        {
          id: 'q2',
          mainQuestion: '你简历中列了 "熟悉二叉树算法"，假设你在实习中需要处理一个组织架构树，每个节点有员工绩效分数，请实现：按层遍历这棵树，返回每层绩效的平均值，并找出每层绩效最高的员工。',
          examinePurpose: '考察 BFS 算法实际应用能力、代码工程能力和边界情况处理',
          followUpFramework: {
            goodSignals: {
              description: '能正确使用队列实现 BFS，代码结构清晰，主动处理空树、单节点等边界情况，能给出完整的求平均值和最大值的逻辑',
              followUpDirection: '深挖：追问 "如果这棵树有 10 万层，每层 100 万个节点，你的代码会有什么问题？怎么优化内存使用？"'
            },
            vagueSignals: {
              description: '只说 "用 BFS 遍历一下" 但写不出代码，或代码有大量语法错误，无法说明如何处理平均值计算（整数除法问题）',
              followUpDirection: '逼出细节：追问 "你刚才说用 BFS，具体怎么实现？队列里存什么？" 或 "平均值计算要注意什么数据类型问题？"'
            },
            unableSignals: {
              description: '完全不知道 BFS 是什么，或写的代码逻辑完全错误（如用递归实现 BFS），长时间沉默',
              followUpDirection: '降级：改为问 "那你说说二叉树有哪些遍历方式？" 或 "队列和栈有什么区别？" 转向数据结构基础'
            }
          },
          excellentAnswerReference: '代码简洁优雅，使用 Queue 实现 BFS，正确处理空节点和边界情况，主动考虑大数溢出问题（使用 double 计算平均值），能分析时间复杂度 O(n) 和空间复杂度 O(w)，能给出内存优化方案（如只保留当前层节点）',
          isHighlighted: false,
          order: 2
        }
      ]
    },
    {
      id: 'c2',
      dimension: '系统设计',
      required: true,
      priority: 2,
      questions: [
        {
          id: 'q3',
          mainQuestion: '你简历提到"主导千万级 QPS 优化"，假设这是一个电商系统的商品详情页，请设计一个能支撑千万级 QPS 的缓存架构。请画出架构图并说明各层的作用。',
          examinePurpose: '验证候选人对高并发系统设计的理解，考察架构分层思维和实际优化经验',
          followUpFramework: {
            goodSignals: {
              description: '能清晰画出多级缓存架构（浏览器缓存/CDN/负载均衡/应用缓存/Redis/本地缓存），说明各层作用和一致性策略，主动提及热点数据、缓存穿透等问题的解决方案',
              followUpDirection: '深挖：追问 "如果 Redis 集群挂了，你的系统怎么降级？怎么保证数据一致性？"'
            },
            vagueSignals: {
              description: '只说"加 Redis"或"用缓存"，无法说明具体架构分层，用"大概用了集群"等模糊表述',
              followUpDirection: '逼出细节：追问 "你说的千万级 QPS 是总量还是单接口？Redis 集群是什么架构？怎么分片？"'
            },
            unableSignals: {
              description: '无法画出基本架构，对 QPS 量级没有概念（如说单台 Redis 能抗千万 QPS），长时间沉默',
              followUpDirection: '降级：改为问 "你说说 Redis 集群有哪些方案？" 或 "单机 Redis 大概能抗多少 QPS？"'
            }
          },
          excellentAnswerReference: '能给出完整的多级缓存架构图，说明浏览器缓存、CDN、Nginx 缓存、应用本地缓存、Redis 分布式缓存的层级关系，主动分析缓存一致性方案（Cache-Aside、延迟双删等），能给出具体的 QPS 数据估算（如单机 Redis 约 10w QPS，需要 100+ 节点）',
          isHighlighted: true,
          order: 1
        },
        {
          id: 'q4',
          mainQuestion: '你提到使用 Kafka 做消息队列，假设你在项目中需要实现一个订单状态变更通知系统，订单量每秒 10 万笔，请设计这个系统的消息架构。',
          examinePurpose: '考察消息队列实际应用能力、分区设计能力和消费者组设计',
          followUpFramework: {
            goodSignals: {
              description: '能说明 Topic 分区策略、消费者组设计、消息可靠性保证（ACK 机制），主动考虑消息顺序性和幂等性问题',
              followUpDirection: '深挖：追问 "如果某个分区消费慢了，怎么排查？怎么保证消息不丢失也不重复？"'
            },
            vagueSignals: {
              description: '只说"用 Kafka 发消息"，无法说明分区数怎么定，消费者怎么分配，用"大概配了几个分区"等模糊表述',
              followUpDirection: '逼出细节：追问 "你的 Topic 分了多少个 Partition？怎么决定的？消费者组怎么设计的？"'
            },
            unableSignals: {
              description: '不知道 Kafka 的基本概念（Partition、Consumer Group），或设计的分区数和消费者数明显不匹配',
              followUpDirection: '降级：改为问 "Kafka 和 RabbitMQ 有什么区别？" 或 "消息队列一般用来解决什么问题？"'
            }
          },
          excellentAnswerReference: '能给出合理的分区数计算（如根据消费者并发能力和吞吐量需求），说明 Partition 和消费者的关系，主动提及消息可靠性配置（acks=all、min.insync.replicas 等），能分析消息顺序性保证方案和幂等性实现',
          isHighlighted: false,
          order: 2
        }
      ]
    },
    {
      id: 'c3',
      dimension: '项目深挖',
      required: true,
      priority: 3,
      questions: [
        {
          id: 'q5',
          mainQuestion: '你在 XX 公司实习期间负责的微服务项目，当时你们是怎么做服务拆分的？有没有遇到服务间通信的问题，具体是怎么解决的？',
          examinePurpose: '考察微服务架构设计能力和实际问题解决能力，验证简历中"微服务"描述的真实性',
          followUpFramework: {
            goodSignals: {
              description: '能清晰说明服务拆分原则（DDD/业务边界），具体描述遇到的服务通信问题（如超时、重试、熔断）和解决方案，能说出使用的框架和配置',
              followUpDirection: '深挖：追问 "你们的服务注册中心用的什么？如果注册中心挂了怎么办？"'
            },
            vagueSignals: {
              description: '只说"按业务拆分"或"用 Feign 调用"，无法说明具体拆分逻辑，用"我们团队决定的"等模糊表述回避个人贡献',
              followUpDirection: '逼出细节：追问 "你个人负责哪几个服务？具体怎么拆的？举个例子说明服务间怎么调用？"'
            },
            unableSignals: {
              description: '无法说明基本的服务拆分原则，或把微服务理解成"多部署几个实例"，明显缺乏实际经验',
              followUpDirection: '降级：改为问 "你说说单体应用和微服务各有什么优缺点？" 或 "RESTful 和 RPC 有什么区别？"'
            }
          },
          excellentAnswerReference: '能结合 DDD 领域驱动设计说明服务边界划分，详细描述服务间通信方案（同步/异步）、容错机制（熔断、限流、降级），能说出具体技术选型理由（如为什么用 Feign 而不是 RestTemplate），主动提及监控和链路追踪方案',
          isHighlighted: true,
          order: 1
        },
        {
          id: 'q6',
          mainQuestion: '你简历中提到"参与性能优化"，请举一个具体的例子：优化前是什么指标？优化后是什么指标？你具体做了什么？',
          examinePurpose: '考察数据意识和实际优化能力，验证简历中性能描述的真实性',
          followUpFramework: {
            goodSignals: {
              description: '能给出具体的优化前后数据（如 RT 从 200ms 降到 50ms，QPS 从 1000 提升到 5000），详细描述优化手段和验证过程',
              followUpDirection: '深挖：追问 "你是怎么发现这个瓶颈的？用了什么工具分析？如果流量再涨 10 倍，还能怎么优化？"'
            },
            vagueSignals: {
              description: '只说"优化了性能"但给不出具体数字，或用"提升了很多""大概几十毫秒"等模糊表述',
              followUpDirection: '逼出细节：追问 "能给我一个具体的数字吗？优化前和优化后分别是多少？你用了什么工具测量？"'
            },
            unableSignals: {
              description: '无法给出任何具体数据，或说的优化手段和效果明显不匹配（如说加个索引 QPS 从 100 提升到 10 万）',
              followUpDirection: '降级：改为问 "你说说有哪些常见的性能优化手段？" 或 "怎么排查一个接口慢的问题？"'
            }
          },
          excellentAnswerReference: '能给出清晰的优化前后对比数据（包括平均值、P99 等分位值），详细描述问题发现过程（如通过 SkyWalking 发现热点接口）、根因分析、优化方案选择和验证过程，能说明如果流量继续增长的后续优化思路',
          isHighlighted: false,
          order: 2
        }
      ]
    },
    {
      id: 'c4',
      dimension: '技术基础',
      required: false,
      priority: 4,
      questions: [
        {
          id: 'q7',
          mainQuestion: '你简历写了"熟悉 MySQL"，假设你的系统有一张用户订单表，数据量 5000 万，查询场景是按用户 ID 查最近 3 个月的订单，你会怎么设计索引？',
          examinePurpose: '考察 MySQL 索引设计能力和对大数据量场景的理解',
          followUpFramework: {
            goodSignals: {
              description: '能正确设计联合索引（user_id + created_at），说明最左前缀原则，主动考虑索引覆盖和查询优化',
              followUpDirection: '深挖：追问 "如果还要按订单状态筛选，索引怎么调整？数据量再涨 10 倍怎么办？"'
            },
            vagueSignals: {
              description: '只说"给 user_id 加个索引"，无法说明联合索引设计，不理解最左前缀原则',
              followUpDirection: '逼出细节：追问 "为什么不用单独索引而用联合索引？最左前缀原则是什么？"'
            },
            unableSignals: {
              description: '建议加大量单列索引，或说出"索引越多越好"等错误观点，长时间沉默',
              followUpDirection: '降级：改为问 "B+树索引和 Hash 索引有什么区别？" 或 "什么情况下索引会失效？"'
            }
          },
          excellentAnswerReference: '能设计合理的联合索引 (user_id, created_at) 并说明理由，主动提及索引覆盖、避免回表，能分析查询执行计划（EXPLAIN），考虑分库分表或归档方案应对数据增长',
          isHighlighted: false,
          order: 1
        }
      ]
    },
    {
      id: 'c5',
      dimension: '简历疑点核实',
      required: true,
      priority: 5,
      questions: [
        {
          id: 'q8',
          mainQuestion: '我看到你 2023 年 6 月到 12 月有一段空窗期，能详细说说这段时间你在做什么吗？',
          examinePurpose: '核实空窗期原因，评估候选人的职业规划能力和技术持续学习情况',
          followUpFramework: {
            goodSignals: {
              description: '能坦诚说明原因（主动离职进修/家庭原因/创业尝试），并展示期间的技术学习或项目实践（如开源贡献、技术博客、个人项目）',
              followUpDirection: '深挖：追问 "这段时间的学习/项目给你带来了什么收获？对下一份工作有什么影响？"'
            },
            vagueSignals: {
              description: '只说"在休息"或"在学习"，但给不出具体学习内容或成果，用"随便看了看"等模糊表述',
              followUpDirection: '逼出细节：追问 "具体学了哪些技术？通过什么方式学习（课程/书籍/项目）？有产出吗（笔记/代码）？"'
            },
            unableSignals: {
              description: '回避问题、转移话题，或空窗期原因令人担忧（如"就是不想工作"），长时间沉默',
              followUpDirection: '降级：改为问 "那说说你为什么选择现在这家公司？" 或 "你对未来 3 年的职业规划是什么？"'
            }
          },
          excellentAnswerReference: '坦诚说明空窗期原因（如"离职后想系统学习微服务架构，完成了 3 个练手项目"），能展示具体学习成果（GitHub 提交记录、技术博客文章），并说明这段经历如何帮助其明确了职业方向',
          isHighlighted: true,
          order: 1
        },
        {
          id: 'q9',
          mainQuestion: '你简历显示 3 年换了 4 份工作，能按时间线帮我梳理一下每份工作的入职和离职原因吗？',
          examinePurpose: '评估候选人职业稳定性，识别是否存在被辞退或能力问题，了解职业规划清晰度',
          followUpFramework: {
            goodSignals: {
              description: '能清晰说明每次跳槽的合理原因（如业务调整/技术成长受限/公司倒闭），且原因具有连贯性，体现出职业规划',
              followUpDirection: '深挖：追问 "如果重新选择，哪次跳槽是你最后悔的？为什么？"'
            },
            vagueSignals: {
              description: '只说"想换个环境"或"个人原因"，无法说明具体离职动机，或频繁使用"公司原因"回避个人问题',
              followUpDirection: '逼出细节：追问 "具体是什么让你决定离职的？当时有没有尝试解决？下一份工作是如何选择的？"'
            },
            unableSignals: {
              description: '出现前后矛盾（如先说公司裁员，后说主动离职），或承认被辞退但归咎于外部因素，明显回避问题',
              followUpDirection: '降级：改为问 "你觉得一份理想的工作应该具备哪些要素？" 或 "你期望在我们公司工作多久？"'
            }
          },
          excellentAnswerReference: '能给出每次跳槽的清晰逻辑（如"第一份工作发现技术栈老旧，第二份工作业务方向不符，第三份工作公司资金链断裂"），体现出从经历中学习和成长的能力，对未来有明确规划',
          isHighlighted: true,
          order: 2
        },
        {
          id: 'q10',
          mainQuestion: '你简历多处使用"精通"（Java、Redis、MySQL、Kafka、Docker、K8s），你自己如何定义"精通"一个技术？',
          examinePurpose: '验证候选人对"精通"的自我认知，评估技术深度 vs 广度的平衡',
          followUpFramework: {
            goodSignals: {
              description: '能给出合理的"精通"定义（如"读过核心源码、解决过复杂问题、能指导他人"），并承认某些技术只是"熟悉"而非"精通"',
              followUpDirection: '深挖：追问 "那你选一个你最精通的技术，说说它底层最核心的设计思想是什么？"'
            },
            vagueSignals: {
              description: '将"精通"定义为"用过"或"能写代码"，或坚持所有声称"精通"的技术都达到了精通水平',
              followUpDirection: '逼出细节：追问 "你说你精通 Redis，那你说说 Redis 的持久化机制底层是怎么实现的？"'
            },
            unableSignals: {
              description: '无法给出任何定义，或承认"精通"是"为了简历好看"，明显缺乏技术敬畏心',
              followUpDirection: '降级：改为问 "那你说说技术学习的几个阶段（入门/熟悉/精通）有什么区别？"'
            }
          },
          excellentAnswerReference: '能给出务实的定义（如"精通意味着读过核心源码、在生产环境解决过棘手问题、能向他人清晰讲解原理"），主动承认某些技术只是"熟悉"，并说明正在深入学习的方向',
          isHighlighted: false,
          order: 3
        },
        {
          id: 'q11',
          mainQuestion: '你提到"管理 10 人团队"，作为技术管理者，你的一天是如何分配的？coding 和 management 的比例大概是多少？',
          examinePurpose: '核实管理职责的真实性，区分"技术负责人"和"真正的管理者"',
          followUpFramework: {
            goodSignals: {
              description: '能清晰描述管理工作内容（周会、1on1、需求评审、跨部门协调），并给出合理的时间分配（如 30% coding + 70% management）',
              followUpDirection: '深挖：追问 "管理 10 人遇到的最大挑战是什么？有没有遇到过绩效差的成员，怎么处理？"'
            },
            vagueSignals: {
              description: '只说"带团队"但描述的是技术负责人工作（如代码 review、技术方案设计），没有真正的管理职责',
              followUpDirection: '逼出细节：追问 "你参与招聘面试吗？有绩效评估的权限吗？团队成员的晋升你说了算吗？"'
            },
            unableSignals: {
              description: '描述的管理工作明显与 10 人团队规模不匹配（如"每天写代码，偶尔开个会"），或混淆"管理"和"技术指导"',
              followUpDirection: '降级：改为问 "你觉得技术负责人和项目经理有什么区别？"'
            }
          },
          excellentAnswerReference: '能区分 tech lead 和 engineering manager 的区别，描述具体的管理职责（招聘、绩效、团队建设），并反思管理工作中的挑战和成长，时间分配合理',
          isHighlighted: false,
          order: 4
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

// 模拟数据
const mockCandidate: Candidate = {
  name: '罗维馨',
  avatar: '',
  tags: [
    { label: '内推', type: 'primary' },
    { label: '985', type: 'success' },
    { label: '30天内活跃', type: 'info' },
    { label: '+标签', type: 'info' }
  ],
  phone: '+86 135-8976-8596',
  email: 'jcancew@test.com',
  school: '深圳测试大学',
  degree: '硕士',
  period: '2026-01 ~ 2026-02'
};

const mockEducation: Education = {
  school: '深圳测试大学',
  degree: '硕士',
  period: '2026-01 ~ 2026-02',
  duration: '1个月'
};

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

const InfoItem = ({ label, value, mask = false }: { label: string; value: string; mask?: boolean }) => (
  <div className="flex items-center justify-between py-2">
    <span className="text-gray-500 text-sm">{label}</span>
    <span className="text-gray-900 text-sm font-medium">{mask ? '***' : value}</span>
  </div>
);

const AddButton = ({ icon: Icon, label }: { icon: React.ElementType; label: string }) => (
  <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
    <Plus size={14} />
    <span>{label}</span>
  </button>
);

export default function CandidateDetail() {
  const [activeTab, setActiveTab] = useState('standard');
  const [selectedInterviewId, setSelectedInterviewId] = useState<string | null>(null);
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  const [interviews, setInterviews] = useState<Interview[]>([
    {
      id: '1',
      interviewer: '罗维馨',
      round: 3,
      totalRounds: 3,
      type: '视频面试',
      time: '12:15',
      date: '今天（周五）',
      status: 'pending',
      hasFeedback: false,
      hasOutline: false,
      outline: null
    },
    {
      id: '2',
      interviewer: '罗维馨',
      round: 2,
      totalRounds: 3,
      type: '视频面试',
      time: '12:00',
      date: '今天（周五）',
      status: 'completed',
      hasFeedback: true,
      hasOutline: false,
      outline: null
    },
    {
      id: '3',
      interviewer: '罗维馨',
      round: 1,
      totalRounds: 3,
      type: '视频面试',
      time: '10:15',
      date: '2026-04-16（周四）',
      status: 'completed',
      hasFeedback: true,
      hasOutline: false,
      outline: null
    }
  ]);

  const tabs = [
    { key: 'attachment', label: '附件简历' },
    { key: 'standard', label: '标准简历' },
    { key: 'additional', label: '附加信息' },
    { key: 'records', label: '操作记录' }
  ];

  const selectedInterview = interviews.find(i => i.id === selectedInterviewId);

  const handleGenerateOutline = async (interviewId: string) => {
    setSelectedInterviewId(interviewId);
    setIsGeneratingOutline(true);
    
    // 模拟 API 调用延迟
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
            {/* 生成面试大纲按钮 */}
            {interview.hasOutline ? (
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

      {/* 主内容区 - 三栏布局 */}
      <div className="flex gap-4 p-4">
        {/* 左侧栏 */}
        <div className="w-80 flex-shrink-0 space-y-4">
          {/* 候选人基本信息 */}
          <Card>
            <div className="p-4">
              {/* 头像和名称 */}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-medium">罗</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-semibold text-gray-900">{mockCandidate.name}</h2>
                    <Bookmark size={14} className="text-gray-400" />
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {mockCandidate.tags.map((tag, idx) => (
                      <Tag key={idx} {...tag} />
                    ))}
                  </div>
                </div>
              </div>

              {/* 快捷操作 */}
              <div className="flex items-center gap-2 mb-4 text-gray-400">
                <button className="hover:text-gray-600"><span className="text-xs">备注</span></button>
                <span>·</span>
                <button className="hover:text-gray-600"><span className="text-xs">加入文件夹</span></button>
                <span>·</span>
                <button className="hover:text-gray-600"><span className="text-xs">添加提醒</span></button>
                <span>·</span>
                <MoreHorizontal size={14} className="cursor-pointer hover:text-gray-600" />
              </div>

              {/* 联系方式 */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone size={14} />
                  <span>{mockCandidate.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail size={14} />
                  <span>{mockCandidate.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <GraduationCap size={14} />
                  <span>{mockCandidate.school} · {mockCandidate.degree}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={14} />
                  <span>{mockCandidate.period}</span>
                </div>
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

          {/* 教育经历 */}
          <Card>
            <CardHeader 
              title="教育经历" 
              icon={GraduationCap}
              action={<Edit3 size={14} className="text-gray-400 cursor-pointer" />}
            />
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <GraduationCap size={18} className="text-blue-500" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{mockEducation.school}</div>
                  <div className="text-sm text-gray-600">{mockEducation.degree}</div>
                  <div className="text-sm text-gray-500">{mockEducation.period} · {mockEducation.duration}</div>
                </div>
              </div>
            </div>
          </Card>

          {/* 基本信息 */}
          <Card>
            <CardHeader 
              title="基本信息" 
              icon={UserPlus}
              action={<Edit3 size={14} className="text-gray-400 cursor-pointer" />}
            />
            <div className="p-4">
              <InfoItem label="个人证件" value="*** ***" mask />
              <InfoItem label="年龄" value="*** ***" mask />
              <InfoItem label="性别" value="*** ***" mask />
              <InfoItem label="全部来源" value="人才库、字节跳动内推" />
            </div>
          </Card>

          {/* 添加其他信息 */}
          <Card>
            <div className="p-4">
              <div className="text-sm font-medium text-gray-900 mb-3">添加其他信息</div>
              <div className="flex flex-wrap gap-2">
                <AddButton icon={Briefcase} label="工作经历" />
                <AddButton icon={Building2} label="实习经历" />
                <AddButton icon={FileText} label="项目经历" />
                <AddButton icon={Award} label="获奖" />
                <AddButton icon={Trophy} label="竞赛" />
                <AddButton icon={FileBadge} label="证书" />
                <AddButton icon={Languages} label="语言能力" />
                <AddButton icon={Star} label="自我评价" />
                <AddButton icon={LinkIcon} label="社交账号" />
              </div>
            </div>
          </Card>
        </div>

        {/* 中间栏 */}
        <div className="flex-1 space-y-4 min-w-0">
          {/* 职位信息 */}
          <Card>
            <div className="p-4">
              {/* 职位标题 */}
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-xl font-semibold text-gray-900">IMS测试职位-社招罗测</h1>
                <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-600 rounded">面试中</span>
                <ChevronRight size={16} className="text-gray-400" />
              </div>

              {/* 操作按钮 */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Button type="primary" icon={Calendar}>安排面试</Button>
                <Button type="danger" icon={Clock}>终止流程</Button>
                <Button icon={Share2}>分享候选人</Button>
                <Button icon={ArrowRightLeft}>转移职位</Button>
                <Button icon={CheckIcon}>进入终面通过</Button>
                <Button icon={Users}>加入集中面试</Button>
                <Button icon={ArrowRightLeft}>转移阶段</Button>
                <Button icon={UserPlus}>加入其他职位</Button>
                <Button icon={FileText}>安排笔试</Button>
                <Button icon={Bell}>通知候选人</Button>
                <Button icon={MoreHorizontal}>更多</Button>
              </div>

              {/* 投递信息 */}
              <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <UserPlus size={14} />
                  <span>人才库 · HR 寻访</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>21 天前投递</span>
                </div>
              </div>
              <div className="text-sm text-gray-600 mb-4">
                <span className="text-gray-500">候选人投递所有者：</span>
                <span className="text-blue-600 cursor-pointer">罗维馨</span>
                <Edit3 size={12} className="inline ml-1 text-gray-400 cursor-pointer" />
              </div>

              {/* 订阅进展 */}
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
                <h3 className="text-lg font-semibold text-gray-900">面试</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Globe size={14} />
                  <span>翻译为简体中文</span>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {interviews.map(interview => (
                  <InterviewItem key={interview.id} interview={interview} />
                ))}
              </div>

              {/* 面试速记 */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-blue-600 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <FileText size={16} />
                    <span>面试速记</span>
                  </div>
                  <ChevronRight size={16} />
                </div>
              </div>
            </div>
          </Card>

          {/* 其他投递 */}
          <Card>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">其他投递</h3>
                <span className="text-sm text-gray-500">(5)</span>
              </div>
            </div>
          </Card>
        </div>

        {/* 右侧第三栏 - 面试大纲面板 */}
        <div className="w-96 flex-shrink-0">
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
