# StoryShaper 포트폴리오 자료 근거

확인일: 2026-11-07 KST. 사용자 제공 제출 글·데모 링크, 로컬 StoryShaper 저장소, 공식 대회 페이지를 대조했다. StoryShaper 원본 저장소는 수정하지 않았다.

2026-11-08 날짜 표기 갱신: 공식 행사 페이지의 10/26 개막~11/4 21:00 미국 동부시간 제출 마감을 재확인했다. 사용자 요청에 따라 한국어 페이지는 **2026.10.27–11.05 (10일, 한국시간)**, 영문 페이지는 **Oct 26–Nov 4, 2026 (10 days, US Eastern Time)**으로 표기한다. 각 언어의 상단 참여 기간과 본문 날짜는 같은 시간대를 사용한다. 기간의 10일은 시작·종료일을 포함한 행사 날짜 수다.

## 사용자 피드백 반영과 원격 main 재확인

- 2026-11-07 GitHub 연결 도구로 원격 `main`의 [README.md](https://github.com/anmemol-beta/storyshaper/blob/main/README.md)를 직접 읽었다. 반환된 파일 blob SHA는 `1a4a745c877a99ae0f0262232ef27776bb4b3bf5`다. 아래의 로컬 `origin/main` 이력과 별개의 최신 조회다.
- `Team and acknowledgments`의 역할을 본문 한영 표로 요약했다: 현준은 부모·등장인물 음성/낭독/음성 인프라, 지호는 스토리 에이전트/재료 판단/대사·질문/가드레일, 수찬은 독서 UI/UX/앱/이미지·모션 통합, 형서는 데모 영상/제출 스토리텔링이다.
- 공개 페이지에서는 브랜치 작업 문구와 브랜치 바로가기를 삭제했다. 커밋 근거는 이 문서에 보존한다.
- '세 집'은 아기돼지 삼형제의 집 3채를 뜻한다. 본문에는 각 집에서 재료 선택·결과 예상·이유 설명에 참여하는 총 9번의 흐름으로 풀어 썼다.
- 미디어 전달 규격, 이전 질문 재답변, 배역 데이터·장면 음성 준비의 상세 문단을 한영 본문에서 삭제했다. 역할표의 미디어 연결 설명도 쉬운 말로 줄였다.
- 수치·검증 표 중심의 마지막 절을 개인의 가드레일 적용, 프롬프트 엔지니어링, 응답 속도 최적화 설명으로 교체했다. 모형 테스트에서 확인한 요청 수·입력량 감소를 실제 응답 속도 개선율로 표현하지 않았다.
- 상단 3개 요약은 스토리 에이전트 개발·프롬프트 엔지니어링·응답 속도 최적화로 교체했다. 키워드 길이에 맞는 글자 크기만 별도 적용한다.

## 검토한 저장소와 이력

- 원격: [anmemol-beta/storyshaper](https://github.com/anmemol-beta/storyshaper).
- `jiho` 및 `origin/jiho`: `5963e72f3aaa75c2e0d9d7cb3f2f1951bb24e5f6`.
- 로컬 `main`: `17e39dc217bf82d86fe8427edadc36ecbddfd420`.
- 로컬에 보관된 `origin/main`: `fe13e83d72c0d30bf5cbbb4258cd0e32be81902b`. 이번 작업에서 fetch하지 않았으므로 현재 원격 최신 여부는 단정하지 않는다.
- 작성자 `twa04047`의 일반 이메일·GitHub noreply 기록을 함께 확인했다. 사용자 설명대로 `jiho`와 `main` 이력을 모두 검토했으며, `main`의 first-parent 이력에도 개인 구현 커밋이 있다.
- 역할 근거: `docs/meetings/2026-10-28-2049-roles-and-integration.md:16`, `docs/meetings/README.md:20`, `docs/internal/plan.md`의 10/28 역할 확인. 지호는 동화 에이전트, 현준은 음성, 수찬은 image-to-video·UI/UX·앱 담당이다. 회의록은 개발 담당 3명의 기록이며 전체 참가 인원 변경을 의미하지 않는다. 팀 구성 4명은 대회 안내의 사용자 확인 기록이다.

## 개인 기여를 뒷받침하는 커밋

| 날짜 | 커밋 | 반영한 내용 |
| --- | --- | --- |
| 2026-10-29 | [0c8da4d](https://github.com/anmemol-beta/storyshaper/commit/0c8da4d9a326f427f7599e0a2d9d33e9c04a5127) | 한영 이야기 엔진, Meta Responses 어댑터, 세션 API, 시험 화면과 회귀 테스트 |
| 2026-10-30 | [c9405a8](https://github.com/anmemol-beta/storyshaper/commit/c9405a8c012b48149e43a0cd2571a7747efb7115) | 낯선 재료의 이름·물성 보존, 인과 설명, 단계별 지연 계측 |
| 2026-10-30 | [667d6b3](https://github.com/anmemol-beta/storyshaper/commit/667d6b3a7ba8db254f2dfe7b1573c531ed175529) | 첫 실패 터치 복구, 승인한 미디어 전달, 이미지 편집·독립 검수 연동 |
| 2026-10-31 | [cf7dce3](https://github.com/anmemol-beta/storyshaper/commit/cf7dce3075504d31331d0f8ddeac5a9113a93b87) | main 작업 보존 스냅샷에 포함된 adaptive 검토·JSON Schema·문맥 축소. 스냅샷 커밋이므로 원격 PR 하나의 독립 작업량으로 해석하지 않음 |
| 2026-10-31 | [15d8da4](https://github.com/anmemol-beta/storyshaper/commit/15d8da45cc897832b6b9149f17c8f9fe3cff3382) | main 직접 반영: 배역 성격·말투·감정을 대본·그림·음성에 연결, 독서 탐색 |
| 2026-10-31 | [552a6a8](https://github.com/anmemol-beta/storyshaper/commit/552a6a83ca4b6339081475f78cde3d84874c00f5) | main 직접 반영: 본문·질문의 전체 장면 음성을 준비한 뒤 전환 |
| 2026-11-03 | [3098fd5](https://github.com/anmemol-beta/storyshaper/commit/3098fd5a0d492b450a237b9fd8ac5065aad66d40) | 이전 질문 재답변과 분기 생성, 중복·폐기한 요청과 그림 결과 격리 |

현재 코드 근거는 `story_agent/engine.py`의 `_review_reason`, `_validate_interpretation`, `_validate_candidate`, `_transition`, `_media_plan`, `story_agent/materials.py`, `story_agent/server.py`와 `tests/test_navigation.py`다. 대본·배역 데이터는 `story_agent/README.md`, `story*.json`, `performance.py`에, 그림 연동은 `media/image_provider.py`와 `prototype/story-media.js`에 있다.

현재 독서 흐름은 오래된 검증 문구보다 최신 코드를 우선했다. `prototype/live-book.js:529`의 `readBeforePicture()`는 낭독 준비 후 본문·질문을 먼저 열고 그림 표시 전 답 입력을 잠근다. `media/jobs.py:232` 및 `prototype/live-book.js:817`은 생성 실패 시 한 번 자동 재시도한 뒤 검수된 준비 백업으로 진행한다. 과거 문서의 '그림 표시 전 본문 전체 잠금'과 '자동 재시도 없음'을 현재 동작으로 옮기지 않았다.

## 대회 정보와 제품 설명

- [공식 행사 안내](https://cerebralvalley.ai/e/meta-ai-developer-hackathon): Meta Global AI Developer Hackathon, Meta & Cerebral Valley 주최, 전 세계 온라인 10일 행사, 2026-10-26~11-04 미국 동부 날짜 기준. 2026-11-07 공개 페이지에서 확인했다.
- Indie Developer / Build for Your World 참가 정보는 최신 팀 `README.md:8–9`의 자체 기록이다. 공식 개별 접수 내역을 확인한 것은 아니다. 초기 대회 정리의 '트랙 미정'보다 최신 README를 따랐다.
- 공식 페이지는 11/4~8 심사·11/9 결과 발표를 안내한다. 수상·결선 진출을 주장하지 않았다. 개막 EST/EDT 혼용을 피하기 위해 시각 대신 미국 동부 날짜를 사용했다.
- 사용자 제공 제출 글을 제품 설명의 최신 기준으로 사용했다. 부모 목소리·다국어 낭독, Muse Voice Transcribe, Muse Spark 1.3, Muse Image 1.0, SAM 3.1 기반 그림 요소 애니메이션은 팀 제품 기능으로 설명했다. README의 SAM '계획' 문구보다 최신 제출문의 범위를 따르되 개인 단독 성과로 귀속하지 않았다.
- 제출 글은 3~6세, 일부 내부 개발 문서는 4~7세를 사용한다. 본문은 연령 숫자를 고정하지 않았다.
- [YouTube 데모](https://youtu.be/FXtuQ7iy4z0)와 [배포 서비스](https://storyshaper.vercel.app)는 사용자가 제공한 링크다. 이번 웹 조회에서 두 페이지의 본문을 가져오지 못했으므로 영상 시청·길이·서비스 동작을 검증했다고 주장하지 않는다.

## 수치의 성격과 제외한 주장

| 항목 | 근거와 반영 범위 |
| --- | --- |
| 집 3개 × 선택·예상·이유 설명 = 9턴 | `story_agent/README.md:46` 및 이야기 데이터·엔진 |
| 다섯 가지 물성 | `story_agent/materials.py`: `light_flexible`, `loose_pieces`, `edible`, `melts`, `rigid`. 서버가 기존 다섯 사건에 매핑 |
| 한영 각각 9턴에서 18→12 모델 요청 | `docs/internal/story-agent.md:113`, `benchmarks/2026-10-30-adaptive/`의 모형 응답 비교. 실제 API 지연 개선율이 아님 |
| 한국어 아이스크림 첫 입력 문맥 5,558→2,937자 | 같은 모형 벤치마크의 직렬화 길이, 약 47% 감소. 토큰 수·실제 응답 속도와 다름 |
| 실제 Muse Spark 한국어 9턴 완주 | `docs/internal/story-agent.md:270` 이후의 과거 3호출 검증 기록. 현재 adaptive 전체 분기의 실제 품질·안전 보장이 아님 |
| 상태·안전·실패 복구 자동 테스트 | `tests/`와 당시 검증 기록을 확인. 이번에는 포트폴리오만 수정했으며 StoryShaper 전체 테스트나 유료 모델을 새로 실행하지 않음 |

검토 추론 강도를 low로 바꾼 [83502df](https://github.com/anmemol-beta/storyshaper/commit/83502df86cd3a38bbdf06c0980520d65a5f39478)는 다른 팀원의 커밋이다. 14~19초→9~11초를 개인 단독 성과로 쓰지 않았다. 부모 음성 장면의 Mac 67–106초→Modal L4 23–27초 역시 팀 제출 글의 수치이며 개인 에이전트 성능 수치로 사용하지 않았다.

Mol et al. (2008)의 교육 효과 인용과 미국 이민 가정 비율은 이번에 원문 연구를 별도로 검증하지 않아 옮기지 않았다. 실제 아동 대상 교육 효과·이해도·안전성 평가를 완료했다고 서술하지 않았다. 음성 가중치를 직접 학습했다고 주장하지 않았다.

## 공개 미디어와 포트폴리오 검증

- `prototype/img/paper_house.jpg`를 `public/media/storyshaper/paper-house.jpg`로 원본 복사했다. 1024×683, SHA-256 `749bd24ba5d108534ee8008a2fa23fa07fbd48566fab586f68083e819ea27f23`.
- 팀 README에 실린 실제 준비 삽화다. AI로 새로 만든 포트폴리오 그림이나 실행 화면 캡처로 표시하지 않고, Muse Image로 제작한 동화 삽화라고 캡션에 명시했다.
- YouTube 링크는 기존 사이트의 HTTPS 자료 링크 기능으로 제공한다. 영상 파일을 다운로드하거나 외부 임베드 기능을 추가하지 않았다.
- `content/projects.json`, 한영 상세 Markdown, 개념도 설정을 추가했다. 기존 사용자 변경은 보존했다.
- `npm run build`와 `npm run check` 통과: 한영 7개 프로젝트, HTML 17개 및 내부 링크·자산·앵커 568개 확인. `git diff --check`도 통과했다.
- 실제 브라우저에서 한영 상세 페이지·언어 전환·갤러리 첫 카드·표지 로드와 데모 링크 노출을 확인했다. 기본 1280px 뷰포트에서 페이지 가로 넘침이 없었다. 외부 링크의 서비스 가용성은 내부 링크 검사 대상이 아니다.
