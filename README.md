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
| `content/site.json` | 표시 이름, 소개, GitHub·LinkedIn·이메일, 경력 흐름 |
| `content/projects.json` | 프로젝트 카드 제목·설명·분야·상태·미디어 |
| `content/projects/<slug>.ko.md` | 한국어 프로젝트 설명 |
| `content/projects/<slug>.en.md` | 영어 프로젝트 설명 |
| `public/media/` | 공개할 캡처, 영상, 이미지 |
| `src/style.css` | 색상, 글꼴, 레이아웃 |

프로젝트 목록의 순서가 카드와 다음 프로젝트의 순서를 결정합니다. 새 프로젝트는 목록에 항목을 추가하고 같은 slug의 한·영 Markdown 파일을 만들면 됩니다. 분야는 `data` 또는 `robotics`, 상태는 `experience`, `simulation`, `in-progress`, `archive`를 사용합니다. Markdown의 `##` 제목은 상세 페이지 목차로 연결됩니다.

GitHub 계정명은 현재 연결된 계정에서 확인한 `twa04047`입니다. 실명·LinkedIn·이메일은 제공받기 전까지 추가하지 않았습니다. 기존 GitHub 프로필이나 LinkedIn 계정 자체는 수정하지 않았습니다.

## 실제 이미지와 영상 추가

현재 썸네일은 대화에서 확인된 흐름을 설명하는 **개념도**입니다. 실제 실행 화면이나 성능 측정 결과가 아닙니다.

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

Markdown 본문에서 직접 이미지를 쓰려면 `![설명](../../../media/example.png)` 형식으로 넣습니다. HTML은 지원하지 않으며 Markdown 표·목록·코드 블록·링크는 지원합니다.

## GitHub Pages 배포

이 폴더를 독립 저장소의 최상위로 사용합니다. 상위 `my_test` 폴더 전체를 업로드하지 마세요.

1. 사용자 사이트의 저장소 이름은 `twa04047.github.io`를 사용합니다.
2. 저장소 Settings → Pages → Build and deployment에서 **GitHub Actions**를 선택합니다.
3. 기본 브랜치(`master`, 또는 `main`)에 변경을 반영하면 `.github/workflows/pages.yml`이 빌드·내부 링크 검사 후 `dist`만 배포합니다.
4. 실제 공개 주소는 `https://twa04047.github.io/`입니다. `/ko/`와 `/en/`을 각각 직접 열 수도 있습니다.

URL은 상대 경로로 생성하므로 일반 프로젝트 저장소의 `/repository/` 하위 경로에도 대응합니다. 소스 Markdown은 빌드 때 HTML로 변환됩니다. 서버에서 Node.js를 실행하지 않습니다.

공식 문서: [사이트 생성](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site), [GitHub Actions 배포](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## 현재 내용의 범위

- 대화에서 제공한 경험만 사용했습니다. 날짜는 임의로 정하지 않고 대학·재직 연차로 표시합니다.
- 네트워크 성능 수치, 드론 필터 종류·오차 등 확인되지 않은 사실은 만들지 않았습니다.
- 주문 자동화는 개발 중이며 최적화 모델은 다음 구현 목표입니다.
- 델타로봇은 남아 있는 자료를 확인한 뒤 설명을 확장해야 합니다.
- 상세 페이지는 초안입니다. 프로젝트 원본 코드·영상·논문을 아직 검토하지 않았습니다.

개인 복원 메모는 Git에서 제외되는 `private/`에 보관하고, 공개할 설명만 `content`에 옮기는 방식을 권장합니다. `public/`의 모든 파일은 사이트에 복사되므로 개인 메모를 넣지 마세요.
