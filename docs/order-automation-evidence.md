# 주문·재고 자동화 포트폴리오 근거 기록

확인일: 2026-09-25. 원본 프로젝트: 같은 Projects 폴더의 `koreafire_order`.

## 공개 내용과 근거

| 내용 | 확인한 원본 |
| --- | --- |
| 대시보드와 날짜 조건 | `spec/01_dashboard_navigation.md`, `spec/02_query_conditions.md`, `src/application/site_builder.py` |
| 주문 조회·상세·주별 집계·표 검색·다운로드 | `spec/03`~`08`, 대응 `src/specs/` 모듈 |
| 일별 CSV 동기화·변경 주문·최신성·잠금·해시 | `src/application/order_cache_service.py`, `tests/test_pending_order_cache.py` |
| 작업 상태·진행률·취소 | `src/application/order_query_jobs.py`, `spec/04_1_detail_api_concurrency.md` |
| 기본 동시 호출 16개 | `src/shared/detail_concurrency.py` (속도 향상 수치 아님) |
| XLS 입력·재고·최소재고 스냅샷 | `spec/09_production_plan_ui.md`, `src/specs/spec09_production_plan_ui.py` |
| ERP API·인증 | `fire_api_test/README.md`, `fire_api_test/AGENTS.md`, 공통 API 모듈 |
| Windows 배포 코드 | `deploy/targets/windows/README.md`, 런처·XLSX 어댑터·패키징·설치 정의 |
| 생산 최적화는 미구현 | spec 09 범위, `docs/최적화함수.md`, `docs/17주_생산계획_알고리즘_제안.md`, 2026-09-03 회의록 |

원본 저장소는 수정하지 않았다. 기존 포트폴리오의 개인 프로젝트·개발자 역할 맥락을 유지했다. 업무시간 개선은 아래 사용자 제공 내용을 근거로 표시하며, 고객 PC 설치 완료를 추정하지 않았다. 17주/18주 및 생산능력 해석의 차이는 최종 명세에서 확정할 사안으로 표시했다.

## 캡처 방식

- `qa/koreafire_demo.py`(Git 제외)가 원본 `build_site`, `create_handler`, 작업 관리자, 캐시 동기화·필터·집계 로직을 사용했다.
- ERP 헤더·상세 조회 의존성만 합성 데이터로 대체했다. 실제 설정 파일·고객 데이터·원본 주문 캐시는 읽지 않았다. 이전 직접 ERP 조회 경로는 데모 서버에서 차단했다.
- 주문 12건, 품목 6개, 이름 `DEMO-*`/`자소 예시 A~F`, 모든 수량은 공개용 예시다.
- XLS 입력은 기존 테스트의 BIFF/CFB 작성 보조 함수로 생성한 합성 출고장이다. 로컬 데모에만 추가한 '포트폴리오 예시 엑셀 불러오기' 버튼으로 파일 입력에 넣은 뒤, 원본의 확인 버튼과 실제 업로드 파서를 실행했다.
- UI 구조를 재작성하거나 결과 표를 이미지로 합성하지 않았다. 데모 표기 배너를 추가하고 Chrome 브라우저에서 직접 화면을 촬영했다.
- `public/media/orders/`의 `dashboard.jpg`, `query.jpg`, `order-details.jpg`, `weekly-summary.jpg`, `inventory-input.jpg`를 한·영 페이지에서 사용한다.
- 생성 버튼을 눌러 '생산계획표 계산 기능은 다음 단계에서 제공됩니다.' 문구를 확인했다.

## 검증 기록

- 포트폴리오: 빌드 통과, 15개 HTML·424개 내부 링크/이미지/앵커 검증 통과.
- 원본 애플리케이션: 130개 중 129개 통과, 1개 실행 오류. 엑셀 작성 테스트의 Node 패키지 심볼릭 링크 생성이 Windows 권한 오류 `WinError 1314`로 실패했다. 번들 Python의 시간대 데이터와 명시적인 Node 경로를 설정한 상태에서 확인했다.
- Windows 배포 테스트: 15개 중 14개 통과, 1개 실패. 기존 테스트는 `월별집계` 시트명을 기대하지만 현재 어댑터는 최신 계약의 `주별집계`를 생성한다. 설치기 빌드나 고객 PC 설치 검증은 수행하지 않았다.
- API 테스트: UTF-8 환경에서 51개 중 50개 통과, 1개 실패. POSIX 절대 경로 `/tmp/...`를 그대로 보존한다는 기존 테스트의 기대값과 Windows 드라이브가 붙는 실제 경로가 다르다.
- 브라우저: 데스크톱과 390px 모바일 너비에서 확인. 가로 넘침 없음, 캡처 5개 로딩 확인. 실제 조회, XLS 파싱, 최소재고 입력, 미구현 계산 안내를 직접 확인했다.
- 최종 빌드에서는 사용 중인 기존 MP4의 Windows 파일 잠금 때문에 `qa/orders-dist`에서 같은 빌더로 생성한 뒤, 동일 영상 파일을 유지하며 `dist`에 반영했다. 공용 빌드 스크립트는 변경하지 않았다.
- 상세 출력: Git 제외 경로 `qa/koreafire-tests.log`, `qa/koreafire-windows-tests.log`, `qa/koreafire-api-tests.log`.
- 전체 테스트 통과 또는 실서비스 성능 검증으로 표현하지 않았다. 원본 앱의 별도 수정은 이 포트폴리오 작업에 포함하지 않았다.

## 멀티스레드·시간 단축 설명 보강

- 사용자 요청에 따라 `ThreadPoolExecutor` 기반 최대 16개 동시 상세 요청을 카드 소개, 상단 강조문, 핵심 지표와 별도 본문 절에 추가했다.
- 근거: `src/specs/spec04_1_detail_api_concurrency.py`의 `lookup_order_details`, `worker_count = min(total, max_concurrency)`, `ThreadPoolExecutor`, `as_completed`, 입력 위치별 결과 조립. 기본값은 `src/shared/detail_concurrency.py`의 16이다.
- 기능 명세, 구현, 테스트, 성능 관련 문서와 보관 JSON 로그 14개를 확인했으나 동일 조건의 순차/병렬 전후 소요시간은 발견하지 못했다. 로그는 수치형 시간 필드만 추출해 확인했고 인증·주문 원문을 출력하지 않았다.
- 사용자는 명세에 별도 기록이 없다면 '대강 하루 걸리던 작업을 3분 내로 해결'로 표현해 달라고 명시했다. 최종 페이지에는 **사용자 경험 기준 약 하루 → 3분 이내**의 전체 업무 전후 비교로 반영했다.
- 성과는 병렬 요청, CSV 캐시 재사용, 집계 자동화를 함께 적용한 업무 개선이다. 이를 멀티스레드만의 순수 속도 향상으로 귀속하거나 하루를 임의로 8/24시간으로 변환해 백분율·배수를 만들지 않았다. 가정 기반 시간 비교 표는 최종 페이지에서 제거했다.
- 캐시는 `pending_order_details.csv`와 `sync_state.csv`를 사용하는 조회용 테이블이다. 데이터마트와 유사한 활용 역할을 설명하되 별도 DB 테이블 또는 데이터웨어하우스를 구축했다고 주장하지 않는다. 변경 주문만 갱신하며, 9,000건 중 변경 대상 3건의 예시는 spec 04-1에 명시된 동작 예시다.
- 같은 날짜 유효 캐시의 API 0회는 명세·캐시 구현에 따른 조건부 동작이다. 순차/병렬 비교에 캐시 재사용 효과를 혼합하지 않는다.

## End-to-End 1인 개발과 진행 상태

- 사용자가 고객 요청부터 프론트엔드·백엔드·API 연동·데이터 처리까지 전 과정을 혼자 개발 중이라고 명시했다. 이 설명을 근거로 한·영 카드 소개, 상단 강조문, 역할과 본문 첫 절에 1인 End-to-End 개발 책임을 반영했다.
- 전체 프로젝트는 `in-progress`를 유지하며, 구현된 주문·집계·엑셀·재고 입력과 후속 생산계획 최적화 범위를 구분했다. 기존 Codex 활용 표기도 유지했다.
- 사용자가 선택한 상단 자료 버튼을 제거했다. 해당 프로젝트에만 `showHeaderActions: false`를 적용하며, 실제 화면 이미지와 하단 원본 이미지 링크는 유지한다.
- 반영 후 빌드 및 15개 HTML·428개 내부 링크/이미지/앵커 검증을 통과했다. 실제 브라우저에서 한·영 상단 버튼이 0개이고, 새 역할·진행 상태·본문 첫 절이 표시되며 가로 넘침이 없음을 확인했다.
