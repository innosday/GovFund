# Design Guidelines - Project GovFund

## 1. Core Philosophy
* **Visibility First:** 모든 핵심 액션(제출, 업로드, 수정)은 1-Click 거리에 둔다. 기능을 드롭다운이나 햄버거 메뉴 뒤로 숨기는 것을 엄격히 금지한다.
* **Control Tower UI:** 사용자가 현재 어떤 단계에 있고 무엇이 부족한지 접속 즉시 인지할 수 있도록 실시간 상태(진행률, 체크리스트)를 상시 노출한다.
* **Fintech Mood:** 딱딱한 정부 양식의 느낌을 배제하고, 토스나 뱅크샐러드와 같은 깔끔하고 신뢰감 있는 B2B SaaS 무드를 유지한다.

## 2. Layout Structure
* **3-Column Architecture:** 화면 이동 없이 모든 정보를 통제할 수 있도록 3단 고정 레이아웃을 사용한다.
    * **Left (Sidebar):** 고정 내비게이션. 메뉴는 텍스트와 아이콘을 병기하며 항상 펼쳐진 상태를 유지한다.
    * **Center (Main Feed):** 가변 작업 영역. 공고 검색, AI 추천 카드, 현재 작성 중인 과제 카드가 흐르는 영역이다.
    * **Right (Status Panel):** 고정 현황판. 필수 서류 20종의 체크리스트와 최종 제출 버튼을 배치한다.
* **Independent Scrolling:** 중앙 메인 영역만 개별 스크롤되며, 사이드바와 우측 현황판은 항상 화면에 고정(Sticky)되어야 한다.



## 3. Visual Tokens (Colors & Typography)
* **Primary Color (#1A73E8):** 브랜드 메인 컬러. 내비게이션 active 상태, 확인 버튼, 진행 상태바에 사용한다.
* **Accent Color (#FF6D00):** 액션 권장 컬러. 마감 임박(D-Day), 필수 서류 업로드 필요, 최종 제출 버튼 등 '사용자의 즉각적인 행동'이 필요한 곳에 사용한다.
* **Neutral Colors:**
    * Light Mode: Background(`Slate-50`), Card(`White`), Border(`Slate-200`)
    * Dark Mode: Background(`Slate-900`), Card(`Slate-800`), Border(`Slate-800`)
* **Typography:** `Public Sans`를 기본 폰트로 사용하며, 숫자는 고정 폭(Tabular Figures)을 사용하여 정렬 시 시각적 어긋남을 방지한다.

## 4. Component Rules
* **Action Buttons:**
    * 모든 버튼은 `Material Symbols` 아이콘을 포함하여 시인성을 높인다.
    * 최종 제출 버튼은 모든 체크리스트가 완료되기 전까지 비활성화(Disabled) 상태로 노출하여 목표 지점을 명시한다.
* **Grant Cards:**
    * AI 추천 공고는 가로 스크롤(Snap Scroll)을 적용하여 좁은 공간에서도 많은 정보를 탐색 가능하게 한다.
    * 지원 금액과 D-Day는 카드 내에서 가장 강조된 타이포그래피를 적용한다.
* **Progress Indicators:**
    * 과제 진행률은 단순 수치(`%`)뿐만 아니라 시각적인 프로그레스 바를 통해 성취감을 제공한다.

## 5. Theming (Dark Mode)
* **System First:** 사용자의 OS 설정(`prefers-color-scheme`)을 우선 감지하여 적용한다.
* **Elevation:** 다크모드에서는 배경색보다 카드 색상을 더 밝게(`Slate-900` -> `Slate-800`) 설정하여 레이어의 높낮이를 구분한다.
* **Contrast:** 다크모드 시 가독성을 위해 텍스트 대비를 최소 4.5:1 이상으로 유지하며, 순수한 검정(#000) 대신 깊은 네이비 톤(`Slate-950`)을 베이스로 사용한다.