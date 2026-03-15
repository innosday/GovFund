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
    requirements: { maxYears: 7, needsVenture: true, industry: ['Software', 'Bio', 'Energy'] }
  },
  {
    id: '2',
    title: '초기창업패키지 지원사업',
    agency: '창업진흥원',
    amount: '최대 1억원',
    dDay: 5,
    category: 'Startup',
    requirements: { maxYears: 3, industry: ['Software', 'Manufacturing', 'Other'] }
  },
  {
    id: '3',
    title: '글로벌 강소기업 육성 프로젝트',
    agency: '산업통상자원부',
    amount: '최대 5억원',
    dDay: 24,
    category: 'Global',
    requirements: { minYears: 3, minRevenue: 10, industry: ['Manufacturing', 'Software'] }
  },
  {
    id: '4',
    title: '데이터 바우처 지원사업',
    agency: '한국지능정보사회진흥원',
    amount: '최대 6,000만원',
    dDay: 8,
    category: 'Voucher',
    requirements: { industry: ['Software', 'Bio', 'Other'] }
  },
  {
    id: '5',
    title: '비대면 서비스 바우처',
    agency: '중소벤처기업부',
    amount: '최대 400만원',
    dDay: 15,
    category: 'Voucher',
    requirements: { industry: ['Software', 'Other'] }
  },
  {
    id: '6',
    title: '팁스(TIPS) 운영지원 사업',
    agency: '중소벤처기업부',
    amount: '최대 10억원',
    dDay: 45,
    category: 'R&D',
    requirements: { maxYears: 7, industry: ['Software', 'Bio', 'Energy', 'Manufacturing'] }
  },
  {
    id: '7',
    title: '해외전시회 개별참가 지원사업',
    agency: 'KOTRA',
    amount: '최대 1,000만원',
    dDay: 3,
    category: 'Global',
    requirements: { industry: ['Manufacturing', 'Software'] }
  },
  {
    id: '8',
    title: '혁신제품 지정 및 구매촉진 사업',
    agency: '조달청',
    amount: '판로 개척 지원',
    dDay: 20,
    category: 'Public',
    requirements: { needsVenture: true, industry: ['Manufacturing', 'Energy'] }
  },
  {
    id: '9',
    title: '청년 일자리 도약 장려금',
    agency: '고용노동부',
    amount: '인당 최대 1,200만원',
    dDay: 60,
    category: 'HR',
    requirements: { minRevenue: 1 }
  },
  {
    id: '10',
    title: 'ICT 혁신기업 기술개발사업',
    agency: '과학기술정보통신부',
    amount: '최대 4.5억원',
    dDay: 18,
    category: 'R&D',
    requirements: { maxYears: 5, industry: ['Software'] }
  },
  {
    id: '11',
    title: '스마트공장 보급 확산 사업',
    agency: '스마트제조혁신추진단',
    amount: '최대 2억원',
    dDay: 30,
    category: 'Manufacturing',
    requirements: { industry: ['Manufacturing'], minRevenue: 5 }
  },
  {
    id: '12',
    title: '소셜벤처 육성 지원사업',
    agency: '기술보증기금',
    amount: '최대 5,000만원',
    dDay: 7,
    category: 'Social',
    requirements: { maxYears: 7, industry: ['Other', 'Software'] }
  },
  {
    id: '13',
    title: '지역특화 프로젝트 레전드 50+',
    agency: '중소벤처기업진흥공단',
    amount: '지역별 상이',
    dDay: 11,
    category: 'Local',
    requirements: { industry: ['Manufacturing'] }
  },
  {
    id: '14',
    title: 'AI 솔루션 실증 지원사업',
    agency: '정보통신산업진흥원',
    amount: '최대 3억원',
    dDay: 14,
    category: 'AI',
    requirements: { industry: ['Software'] }
  },
  {
    id: '15',
    title: '중소기업 수출 바우처 사업',
    agency: '중소벤처기업부',
    amount: '최대 1억원',
    dDay: 22,
    category: 'Global',
    requirements: { minRevenue: 3, industry: ['Manufacturing', 'Software'] }
  }
];
