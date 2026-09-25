# 데이터 & 자율 시스템 포트폴리오

GitHub Pages용 정적 웹 포트폴리오입니다. 한국어와 영어, 분야별 프로젝트 갤러리, 경력 타임라인, Markdown 상세 페이지를 제공합니다. 별도 서버나 유료 서비스가 필요하지 않습니다.

## 로컬 실행

Node.js 22 이상에서 다음 명령을 실행합니다.

```sh
npm ci --ignore-scripts
npm run dev
```

미리보기: http://127.0.0.1:4173/ko/

`content`, `src`, `public` 파일을 수정하면 자동으로 다시 생성합니다. 브라우저는 새로고침하세요. 배포 파일만 생성하려면 `npm run build`, 내부 링크를 확인하려면 `npm run check`를 사용합니다.

## 내용 수정

| 파일 | 수정할 내용 |
| --- | --- |
| `content/site.json` | 한·영 이름, 소개, 프로필 사진, 학력·경력, 기술 스택, GitHub·LinkedIn·이메일 |
| `content/projects.json` | 프로젝트 카드 제목·설명·분야·상태·미디어 |
| `content/projects/<slug>.ko.md` | 한국어 프로젝트 설명 |
| `content/projects/<slug>.en.md` | 영어 프로젝트 설명 |
| `public/media/` | 공개할 캡처, 영상, 이미지 |
| `src/style.css` | 색상, 글꼴, 레이아웃 |

프로젝트 목록의 순서가 카드와 다음 프로젝트의 순서를 결정합니다. 새 프로젝트는 목록에 항목을 추가하고 같은 slug의 한·영 Markdown 파일을 만들면 됩니다. 분야는 `data` 또는 `robotics`, 상태는 `experience`, `poc`, `idea-poc`, `simulation`, `in-progress`, `archive`를 사용합니다. `idea-poc`는 아이디어·PoC 제작 프로젝트에 사용합니다. `origin`은 `school`(학교), `personal`(개인), `company`(회사)로 카드의 프로젝트 구분을 지정하며, `collaboration`에는 한·영 협력과제 문구를 넣습니다. Markdown의 `##` 제목은 상세 페이지 목차로 연결됩니다.

`published: false`인 프로젝트는 목록·필터 개수·다음 프로젝트 링크·한영 상세 페이지 생성에서 제외됩니다. 네트워크 전처리 프로젝트는 자료 보충을 위해 이 상태로 보관 중이며, 내용을 보완한 후 `published: true`로 바꾸면 복원됩니다. Markdown 원본은 그대로 남아 있습니다.

`recognition`의 한·영 문구는 프로젝트 카드와 상세 페이지에 수상·선정 라벨로 표시됩니다. 기술 스택의 `skills[].items`는 `name`과 로컬 SVG 경로인 `icon`으로 구성하며, 로고 출처는 [기술 로고 기록](docs/technology-icons.md)에 정리했습니다.

프로필 이름은 장지호(JIHO JANG)이며, 사용자가 제공한 학력·경력·기술 스택·이메일·LinkedIn 주소를 표시합니다. 프로필 사진은 `public/media/profile/portrait.jpg`에 보관합니다. GitHub 계정은 `twa04047`이며, 드론 연구의 저자 표기는 원본 논문을 따릅니다.

## 실제 이미지와 영상 추가

드론 프로젝트는 당시 연구의 **Gazebo 캡처, 시뮬레이션 영상, 원본 실험 그래프**를 사용합니다. 델타로봇 프로젝트는 **실물 제작 사진, CATIA 모델, 설계 도면과 원본 최종영상**을 사용합니다. Foundry 프로젝트는 **더미데이터 기반 PoC의 Workshop 화면·시연영상·전처리 및 Data Lineage 캡처**를 사용합니다. 나머지 프로젝트의 썸네일은 대화에서 확인된 흐름을 설명하는 개념도입니다.

예를 들어 `public/media/drone-cover.jpg`와 `public/media/drone-demo.mp4`를 넣고, `content/projects.json`에서 해당 프로젝트의 속성을 다음과 같이 수정합니다.

```json
{
  "cover": "media/drone-cover.jpg",
  "media": [
    {
      "type": "video",
      "src": "media/drone-demo.mp4",
      "alt": {
        "ko": "시뮬레이션에서 앞선 드론을 따라가는 모습",
        "en": "Following a leading drone in simulation"
      }
    }
  ],
  "links": [
    {
      "url": "https://github.com/ACCOUNT/REPOSITORY",
      "label": { "ko": "프로젝트 코드", "en": "Source code" }
    }
  ]
}
```

위 코드는 변경할 속성의 예시입니다. 기존 프로젝트의 나머지 속성은 유지하세요. 이미지의 `type`은 `image`를 사용합니다. 파일명은 영문·숫자·하이픈을 권장합니다. 공개 가능한 자료만 `public`에 넣으세요. 실제 파일이 없으면 빌드가 실패하므로 경로만 먼저 추가하지 마세요. 원본 대용량 영상은 압축하거나 외부 영상 페이지를 `links`에 연결할 수 있습니다.

`links[].url`에는 HTTPS 주소 또는 `media/drone/paper.pdf`처럼 로컬 자료 경로를 사용할 수 있습니다. 영상은 `poster`로 미리보기 이미지를 지정할 수 있고, 사용자가 재생하기 전까지 영상을 미리 내려받지 않습니다. `coverAlt`·`coverCaption`은 한·영 이미지 설명, `highlights`는 핵심 결과, `evidenceNote`는 프로젝트별 검증 범위를 표시합니다. `highlights`가 있는 상세 페이지는 영상도 본문 위에 배치합니다.

`mediaTitle`, `mediaLabel`, `resourcesLabel`로 영상 제목과 바로가기 문구를 프로젝트에 맞게 설정할 수 있습니다. `media[].chapters`에는 초 단위의 `time`과 한·영 `label`을 넣으면 영상 구간 링크가 표시됩니다. JavaScript가 활성화되면 같은 플레이어에서 해당 구간을 재생하고, 비활성화되면 원본 영상의 시간 링크를 엽니다.

`stage: "poc"`는 더미데이터 PoC 상태를 표시합니다. `disclosure.title`과 `disclosure.body`에 한·영 문구를 넣으면 상세 페이지 상단에 공개 범위를 표시합니다. Foundry 페이지는 실제 사내 데이터로 제작한 내용이 기밀로 공개 불가함을 명시하고, 원시 데이터·내부 분석 파일을 게시하지 않습니다.

Markdown 본문에서 직접 이미지를 쓰려면 `![설명](../../../media/example.png)` 형식으로 넣습니다. 이미지 설명은 캡션으로도 표시됩니다. 이미지 두 개를 빈 줄 없이 연이어 쓰면 나란히 배치합니다. HTML은 지원하지 않으며 Markdown 표·목록·코드 블록·링크는 지원합니다.

## GitHub Pages 배포

이 폴더를 독립 저장소의 최상위로 사용합니다. 상위 `my_test` 폴더 전체를 업로드하지 마세요.

1. 사용자 사이트의 저장소 이름은 `twa04047.github.io`를 사용합니다.
2. 저장소 Settings → Pages → Build and deployment에서 **GitHub Actions**를 선택합니다.
3. 기본 브랜치(`master`, 또는 `main`)에 변경을 반영하면 `.github/workflows/pages.yml`이 빌드·내부 링크 검사 후 `dist`만 배포합니다.
4. 실제 공개 주소는 `https://twa04047.github.io/`입니다. `/ko/`와 `/en/`을 각각 직접 열 수도 있습니다.

URL은 상대 경로로 생성하므로 일반 프로젝트 저장소의 `/repository/` 하위 경로에도 대응합니다. 소스 Markdown은 빌드 때 HTML로 변환됩니다. 서버에서 Node.js를 실행하지 않습니다.

공식 문서: [사이트 생성](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site), [GitHub Actions 배포](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## 현재 내용의 범위

- 드론은 원본 연구 자료와 학술대회 논문집을 확인해 2021년, 제1저자, 3대 삼각편대, 약 1.25m 간격, LPF와 RRT* 기반 방법을 반영했습니다. 근거와 자료 간 차이는 [드론 연구 자료 기록](docs/drone-research-sources.md)에 정리했습니다.
- Foundry는 보관 자료 67개를 탐색해 전처리, Ontology 연결, 이상 플래그 검토와 경로 탐색을 정리했습니다. 공개 PoC 자료와 기밀인 사내 데이터 기반 결과를 구분했습니다. [Foundry 자료 검토 기록](docs/foundry-research-sources.md)에 근거와 제외 범위를 기록했습니다.
- 그 외 프로젝트는 대화에서 제공한 경험을 사용하며, 확인되지 않은 날짜·성능 수치는 추가하지 않았습니다.
- 주문 자동화는 개발 중이며 최적화 모델은 다음 구현 목표입니다.
- 델타로봇은 2020년 자료와 사용자의 기여 확인을 바탕으로 CATIA 설계·부속품 제작을 중심으로 정리했습니다. [자료 검토 기록](docs/delta-research-sources.md)에 근거와 검토 범위를 기록했습니다. 원본 최종영상은 5분 17초, 약 29.8 MB이며 직접 재생할 수 있습니다.
- 드론의 검증 범위는 당시 시뮬레이션입니다. 보관 소스를 현재 환경에서 다시 실행하거나 실기체 비행을 검증한 것은 아닙니다.
- 모범시민 교통관제 로봇은 2020년 교내 아이디어·PoC 프로젝트로, 개인 역할은 비전 개발입니다. 얼굴 검출 화면, 차량 검출·레일 이동 시연영상, 팀의 CAD·실물 사진, 발표자료·배너와 대구광역시 공모전 우수상 상장을 반영했습니다. 비전 영상은 H.264 재생본과 원본, 모터 영상은 원본으로 제공합니다. [자료 검토 기록](docs/traffic-robot-sources.md)에 검증 범위와 확장 아이디어를 구분했습니다.

개인 복원 메모는 Git에서 제외되는 `private/`에 보관하고, 공개할 설명만 `content`에 옮기는 방식을 권장합니다. `public/`의 모든 파일은 사이트에 복사되므로 개인 메모를 넣지 마세요.
