import { GoogleGenerativeAI } from "@google/generative-ai";

interface CompanyInfo {
  name: string;
  industry: string;
  revenue: number;
}

export const generateAIDraft = async (sectionTitle: string, companyInfo?: CompanyInfo) => {
  const rawApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const apiKey = rawApiKey?.replace(/["']/g, "").trim();

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return "오류: .env 파일에 실제 API 키를 입력해 주세요.";
  }

  // 기본값 설정 (매개변수가 없을 경우)
  const info = companyInfo || { name: '해당 기업', industry: '소프트웨어/IT', revenue: 10 };

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 현재 환경에서 가장 안정적인 모델명 사용
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash-preview" 
    });

    const prompt = `
      당신은 대한민국 정부 R&D 과제 기획 전문가입니다. 
      아래의 기업 정보를 바탕으로 기술개발 계획서의 [${sectionTitle}] 섹션을 전문적으로 작성해 주세요.
      
      기업명: ${info.name}
      산업분야: ${info.industry}
      연매출: ${info.revenue}억원
      
      작성 가이드라인 (가독성 중점):
      1. 반드시 소제목(예: 1.1 개요)을 사용하여 내용을 분리하십시오.
      2. 문단 사이에 빈 줄을 삽입하여 가독성을 높이십시오.
      3. 핵심 내용은 불렛포인트( - )를 사용하여 요약하십시오.
      4. 전문 용어 뒤에는 쉬운 설명을 괄호안에 덧붙여 주십시오.
      5. 격식 있는 문체(~함, ~임)를 사용하되, 한 문장이 짧고 간결해야 합니다.
      6. 마크다운 형식을 활용하십시오.
      7. 오직 한국어로만 상세히 작성하십시오.
    `;

    console.log(`🚀 [Gemini] AI 생성 요청: ${sectionTitle}`);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (!text) throw new Error("AI가 응답을 생성하지 못했습니다.");
    
    console.log("✅ AI 생성 완료");
    return text;

  } catch (err: unknown) {
    const error = err as Error;
    console.error("❌ Gemini API 에러:", error);
    
    if (error.message.includes("503") || error.message.includes("404")) {
      return "서비스 점검 중이거나 서버 과부하입니다. 잠시 후 다시 시도해 주세요.";
    }
    return `AI 생성 실패: ${error.message}`;
  }
};
