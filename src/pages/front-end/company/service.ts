import { Company, CompanyStatus, InterviewRecord } from './types';

const STORAGE_KEY_COMPANIES = 'mg_companies';
const STORAGE_KEY_RECORDS = 'mg_interview_records';

// Initial Mock Data
const INITIAL_COMPANIES: Company[] = [
  {
    id: '1',
    name: '字节跳动',
    logo: 'https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/10/1702e5c832267f8f~tplv-t2oaga2asx-image.image',
    website: 'https://jobs.bytedance.com/',
    status: CompanyStatus.Interview2,
    viewCount: 128,
    lastUpdated: '2023-10-25T10:00:00Z',
    location: '北京',
    salaryRange: '30k-50k',
    tags: ['大厂', '高薪', '视频'],
  },
  {
    id: '2',
    name: '阿里巴巴',
    logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
    website: 'https://job.alibaba.com/',
    status: CompanyStatus.Offer,
    viewCount: 256,
    lastUpdated: '2023-10-20T14:30:00Z',
    location: '杭州',
    salaryRange: '25k-45k',
    tags: ['电商', 'Java', '福报'],
  },
  {
    id: '3',
    name: '腾讯',
    logo: 'https://mat1.gtimg.com/www/icon/favicon.ico',
    website: 'https://join.qq.com/',
    status: CompanyStatus.Rejected,
    viewCount: 64,
    lastUpdated: '2023-09-15T09:00:00Z',
    location: '深圳',
    salaryRange: '28k-48k',
    tags: ['社交', '游戏'],
  },
];

const INITIAL_RECORDS: InterviewRecord[] = [
  {
    id: '101',
    companyId: '1',
    round: '一面',
    date: '2023-10-15',
    format: '视频',
    interviewer: '张三',
    questions: '1. React Fiber 原理\n2. HTTP 2.0 特性\n3. 手写 Promise.all',
    result: '通过',
    feedback: '基础扎实，算法不错',
  },
  {
    id: '102',
    companyId: '1',
    round: '二面',
    date: '2023-10-22',
    format: '视频',
    interviewer: '李四',
    questions: '1. 项目难点\n2. 性能优化实践\n3. 系统设计：秒杀系统',
    result: '等待中',
  },
];

// Helper to get data
const getCompanies = (): Company[] => {
  const data = localStorage.getItem(STORAGE_KEY_COMPANIES);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_COMPANIES, JSON.stringify(INITIAL_COMPANIES));
    return INITIAL_COMPANIES;
  }
  return JSON.parse(data);
};

const getRecords = (): InterviewRecord[] => {
  const data = localStorage.getItem(STORAGE_KEY_RECORDS);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(INITIAL_RECORDS));
    return INITIAL_RECORDS;
  }
  return JSON.parse(data);
};

// Service API
export const CompanyService = {
  getAllCompanies: async (): Promise<Company[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const companies = getCompanies();
        const records = getRecords();
        // Ensure recordCount is accurate
        const companiesWithCount = companies.map(c => {
            const count = records.filter(r => r.companyId === c.id).length;
            if (c.recordCount !== count) {
                // Return updated object, but ideally we should persist this eventually
                // For now, just returning correct data is enough for display
                return { ...c, recordCount: count };
            }
            return c;
        });
        resolve(companiesWithCount);
      }, 300);
    });
  },

  getCompanyById: async (id: string): Promise<Company | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const companies = getCompanies();
        resolve(companies.find((c) => c.id === id));
      }, 200);
    });
  },

  addCompany: async (company: Omit<Company, 'id' | 'viewCount' | 'lastUpdated'>): Promise<Company> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const companies = getCompanies();
        const newCompany: Company = {
          ...company,
          id: Date.now().toString(),
          viewCount: 0,
          lastUpdated: new Date().toISOString(),
        };
        companies.unshift(newCompany);
        localStorage.setItem(STORAGE_KEY_COMPANIES, JSON.stringify(companies));
        resolve(newCompany);
      }, 300);
    });
  },

  updateCompany: async (id: string, updates: Partial<Company>): Promise<Company> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const companies = getCompanies();
        const index = companies.findIndex((c) => c.id === id);
        if (index === -1) {
          reject('Company not found');
          return;
        }
        companies[index] = { ...companies[index], ...updates, lastUpdated: new Date().toISOString() };
        localStorage.setItem(STORAGE_KEY_COMPANIES, JSON.stringify(companies));
        resolve(companies[index]);
      }, 300);
    });
  },

  incrementViewCount: async (id: string): Promise<void> => {
    const companies = getCompanies();
    const index = companies.findIndex((c) => c.id === id);
    if (index !== -1) {
      companies[index].viewCount += 1;
      localStorage.setItem(STORAGE_KEY_COMPANIES, JSON.stringify(companies));
    }
  },

  // Records
  getRecordsByCompanyId: async (companyId: string): Promise<InterviewRecord[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const records = getRecords();
        resolve(records.filter((r) => r.companyId === companyId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      }, 300);
    });
  },

  addRecord: async (record: Omit<InterviewRecord, 'id'>): Promise<InterviewRecord> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const records = getRecords();
        const newRecord: InterviewRecord = {
          ...record,
          id: Date.now().toString(),
        };
        records.push(newRecord);
        localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(records));
        
        // Also update company lastUpdated
        CompanyService.updateCompany(record.companyId, {});
        
        resolve(newRecord);
      }, 300);
    });
  },

  updateRecord: async (id: string, updates: Partial<InterviewRecord>): Promise<InterviewRecord> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const records = getRecords();
        const index = records.findIndex((r) => r.id === id);
        if (index === -1) {
          reject('Record not found');
          return;
        }
        records[index] = { ...records[index], ...updates };
        localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(records));
        
        // Also update company lastUpdated
        CompanyService.updateCompany(records[index].companyId, {});

        resolve(records[index]);
      }, 300);
    });
  },
  
  deleteRecord: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const records = getRecords();
            const record = records.find(r => r.id === id);
            if (!record) {
                resolve();
                return;
            }
            const companyId = record.companyId;
            const newRecords = records.filter(r => r.id !== id);
            localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(newRecords));
            
            // Update company record count
            const companyRecords = newRecords.filter(r => r.companyId === companyId);
            CompanyService.updateCompany(companyId, { 
                recordCount: companyRecords.length 
            });
            
            resolve();
        }, 300);
    });
  }
};
