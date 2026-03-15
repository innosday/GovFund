export interface Grant {
  id: string;
  title: string;
  agency: string;
  amount: string;
  dDay: number;
  category: string;
  requirements: {
    minYears?: number;
    maxYears?: number;
    minRevenue?: number;
    industry?: string[];
    needsVenture?: boolean;
  };
}

export const mockGrants: Grant[] = [
  {
    id: '1',
    title: '2024년 창업성장기술개발사업 (디딤돌)',
    agency: '중소벤처기업부',
    amount: '최대 1.2억원',
    dDay: 12,
    category: 'R&D',
    requirements: {
      maxYears: 7,
      needsVenture: true,
      industry: ['Software', 'Bio', 'Energy']
    }
  },
  {
    id: '2',
    title: '초기창업패키지 지원사업',
    agency: '창업진흥원',
    amount: '최대 1억원',
    dDay: 5,
    category: 'Startup',
    requirements: {
      maxYears: 3,
      industry: ['Software', 'Manufacturing', 'Other']
    }
  },
  {
    id: '3',
    title: '글로벌 강소기업 육성 프로젝트',
    agency: '산업통상자원부',
    amount: '최대 5억원',
    dDay: 24,
    category: 'Global',
    requirements: {
      minYears: 3,
      minRevenue: 10,
      industry: ['Manufacturing', 'Software']
    }
  }
];
