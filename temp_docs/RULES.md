# Coding Rules & Guidelines - Project GovFund

## 1. General Principles
* **Data-First Matching:** 모든 UI는 `useCompanyStore`의 기업 데이터를 기반으로 동적으로 반응해야 한다.
* **Control Tower UI:** 3-Column 레이아웃(Sidebar-Main-Status)을 절대적으로 준수한다.
* **Surgical Updates:** 코드 변경 시 기존의 'Control Tower' 무드와 'font-black' 스타일을 엄격히 계승한다.

## 2. UI & Design Rules
* **Typography:** 중요 텍스트와 제목은 무조건 `font-black`을 사용하여 권위와 가독성을 동시에 확보한다.
* **Rounded Corners:** 모든 주요 컨테이너와 카드는 `rounded-[48px]`를 적용하여 현대적인 B2B SaaS 느낌을 유지한다.
* **Visibility:** 햄버거 메뉴나 깊은 드롭다운을 금지한다. 모든 주요 액션 버튼은 밖으로 노출한다.
* **Dark Mode:** `Slate-950` 배경을 기본으로 하여 텍스트 대비를 극대화한다.

## 3. Logic & State Management
* **State of Truth:** 기업 정보는 `useCompanyStore`, 서류 현황은 `useDocumentsStore`, 에디터 작업은 `useEditorStore`로 분리하여 관리한다.
* **Hook-Centric:** 비즈니스 로직(예: 자격 요건 필터링, 성공 확률 계산)은 반드시 독립적인 Hook으로 분리한다.
* **Validation First:** 서류가 완벽하지 않은 상태에서의 '제출' 버튼은 반드시 비활성화(Disabled) 상태여야 한다.

## 4. File Structure & Conventions
* `/src/hooks`: 로직 분리의 핵심. 컴포넌트에는 UI 코드만 남긴다.
* `/src/lib`: 외부 라이브러리(Firebase, Grants API) 및 순수 함수 정의.
* **Naming:** 컴포넌트 파일명은 `StatusPanel.tsx`와 같이 PascalCase를 사용한다.
