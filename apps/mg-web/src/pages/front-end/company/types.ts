export enum CompanyStatus {
  ToApply = '待投递',
  Applied = '已投递',
  Interview1 = '一面',
  Interview2 = '二面',
  Interview3 = '三面',
  Offer = 'Offer',
  Rejected = '已拒绝/挂',
  Archive = '归档',
}

export interface InterviewRecord {
  id: string;
  companyId: string;
  round: string; // e.g., "一面", "HR面"
  date: string; // ISO date string
  format: '现场' | '电话' | '视频' | '笔试';
  interviewer?: string;
  questions?: string; // Markdown supported
  answers?: string; // Markdown supported
  result: '通过' | '未通过' | '等待中';
  feedback?: string;
  attachments?: string[]; // URLs
}

export interface Company {
  id: string;
  name: string; // Mapped from 'title' if needed, or keeping name
  title?: string; // Adding title as per new API
  logo?: string;
  website?: string;
  recruitmentUrl?: string; // Adding recruitmentUrl
  description?: string;
  status: CompanyStatus;
  viewCount: number;
  lastUpdated: string;
  location?: string;
  salaryRange?: string; // e.g., "20k-30k"
  tags?: string[];
  recordCount?: number;
  scale?: string; // Adding scale
  level?: string; // Adding level
  createTime?: string; // Adding createTime
  updateTime?: string; // Adding updateTime
}
