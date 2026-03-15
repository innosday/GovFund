# Development Task List: Strategic Command Center

## Phase 1: Re-aligning the Core
- [ ] `useCompanyStore` 고도화: 매출액, 임직원수, 특허보유수 등 세부 필드 추가
- [ ] `MainLayout` 고정 (Sidebar - Main - StatusPanel 3단 구조)
- [ ] 다크모드(`Slate-950`) 및 `font-black` 테마 전역 적용 확인

## Phase 2: Intelligence Layer (The Strategist)
- [ ] `useCompany` 데이터를 활용한 실시간 자격 요건 필터링 로직 구현
- [ ] `Success Score` 알고리즘 설계: 업력, 매출, 기술력 기반 지원사업 합격률 계산 UI
- [ ] `MatchingView` 카드 리자인: 공고 요약과 동시에 '우리 회사의 적합도' 표시

## Phase 3: Execution Engine (The Weapon)
- [ ] `VaultView` 강화: 서류 보관을 넘어, 각 서류의 유효기간 및 필수 여부 트래킹
- [ ] `useEditor` 연동: 금고 내의 기업 정보를 불러와 사업계획서 템플릿에 자동 주입하는 AI 기능
- [ ] `StatusPanel`: 실시간으로 채워지는 서류 체크리스트 및 제출 준비도(%) 구현

## Phase 4: AI Reviewer & Submission
- [ ] `Proposal Editor`: AI가 실시간으로 작성 중인 내용을 검토하고 '보완 필요 사항'을 피드백해주는 패널
- [ ] `Submission Control`: 모든 서류 완비 시에만 활성화되는 '최종 제출(Launch)' 시스템
- [ ] 전문가 연결(Expert Matching) 버튼 및 멤버십 플랜 연동 UI

## Phase 5: Polishing & Launch
- [ ] 고밀도 데이터 시각화(Chart.js 등)를 활용한 기업 성과 대시보드
- [ ] 로딩 및 전환 애니메이션 (Control Tower 느낌의 시각 효과)
- [ ] 최종 배포 및 실제 기업 데이터 매칭 테스트
