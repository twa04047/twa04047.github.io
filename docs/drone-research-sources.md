# 드론 편대비행 포트폴리오의 근거

2026-09-25에 IASL 연구 보관 폴더를 탐색하여 한국어·영어 상세 페이지를 보완했다. 원본 연구 자료는 수정하지 않았다.

## 탐색 범위

- 전체 파일 6,452개를 목록화했다. 이 중 6,315개는 `src.iasl`의 ROS 패키지, 외부 라이브러리, 모델, 빌드 산출물, Git 기록이다.
- `편대비행 논문`의 53개 파일, 루트의 세미나·연구 문서, `picture`, 참고 논문 폴더와 ZIP 목록을 확인했다.
- 논문·발표 PDF와 PPTX의 본문 및 발표자 노트를 읽고, 핵심 그림을 시각적으로 확인했다. 세미나 PPTX와 연구계획 문서도 읽어 완료한 구현과 후속 계획을 구분했다.
- 전체 PDF 37개의 문서 성격을 분류했다. 외부 논문·강의자료는 참고자료이며 개인 연구 성과로 옮기지 않았다. 동적 물체 위치 추정 실험결과서는 다른 연구자의 2022년 실험으로, 그 RMSE·속도는 인용하지 않았다.
- 연구 영상 10개를 조사해 브라우저에서 재생 가능한 기존 4배속 MP4를 선택했다. 파일명의 속도 표기를 유지했다.
- 개인정보 동의서·결제 증빙·행정 양식·설치 파일은 공개 자산에서 제외했다. 전체 목록과 추출 중간물은 Git 제외 경로 `private/drone-research`에 둔다.

## 주장별 근거

| 포트폴리오 내용 | 확인한 자료 | 해석 범위 |
| --- | --- | --- |
| 2021년 학부 연구, 제1저자 | 논문 저자 순서, PPTX 발표자 노트 1, 사용자 설명 | 제1저자와 핵심 인식·추종 개발. 모든 패키지를 독자 개발했다는 주장은 하지 않음 |
| 학술대회 게재 | `koreaai2021-proceeding-final…pdf` 목차 PDF 7쪽, 본문 PDF 44–45쪽 | 제2회 한국 인공지능 학술대회, S-2-3, 인쇄 쪽번호 019–020. 행사 2021-09-29~10-01 |
| 3대 삼각편대, 약 1.25m 간격 | 논문 본론 4와 Fig. 4–5, PPTX 13번 슬라이드 | 논문 보고 시뮬레이션 결과. RMSE나 성공률 아님 |
| 바운딩 박스 내 최소 깊이 | 논문 본론 4, PPTX 8번 슬라이드·노트, `darknet_ros/darknet_ros/src/yolo_object_detector_node.cpp` 및 `_2.cpp` | 최솟값 선택 및 카메라 K 행렬을 이용한 역투영 |
| 목표좌표 필터링 | 논문 본론 5, Fig. 6, PPTX 9번 슬라이드, `kalman_filter/src/kalman_filter.cpp` | 논문 최종 방법은 LPF. 보관 소스에는 칼만 필터도 존재 |
| LPF 2.8 Hz / 500 Hz | 동일 C++ 파일의 `ONLY_LOW` 분기 | 소스 상 설정값. 실제 처리율이나 최종 실험 설정을 입증하지 않음 |
| RRT*와 편대 공간 충돌 검사 | 논문 본론 2, PPTX 10번 슬라이드, `path_planning/src/path_planning.cpp` | 기존 OMPL·FCL 활용. 충돌 박스 0.5×1.5×0.1, solve(2)는 보관 코드 값 |
| Ubuntu 18.04 / ROS Melodic / RotorS / Firefly | 논문 본론 1, PPTX 11번 슬라이드 | 당시 시뮬레이션 환경 |
| 초기 RealSense 검토와 후속 과제 | `seminar_5`, `seminar_7`, `seminar_8`, `seminar_9`, `seminar_10` | 센서 사전 실험과 segmentation·depth sampling·Deep SORT 계획을 최종 편대비행과 구분 |

## 자료 간 차이와 측정 한계

1. 논문은 YOLO v4로 학습한 가중치를 명시한다. 주 발표자료의 7번 슬라이드는 YOLO v3를 표기하고 `seminar_9`는 v4를 표기한다. 요약은 YOLO로 통칭하고 본문에 차이를 설명한다.
2. `kalman_filter.cpp`의 `#define ONLY_LOW`가 주석 처리되어 있어 해당 스냅샷의 기본 분기는 칼만 필터다. 논문·최종 그림은 LPF를 기술하므로 폴더 이름과 로그 파일명만 보고 필터를 단정하지 않는다.
3. `kalman_1.txt`, `kalman_3.txt` 등은 위 노드에서 발행한 목표좌표와 거리 계산을 기록한다. 이를 독립적인 실제 추종 오차나 실기체 odometry 성능으로 재해석하지 않는다.
4. 논문의 무통신 편대비행 목표를 ROS 통신까지 없다는 뜻으로 넓히지 않는다. 팔로워의 상대 위치 입력은 영상이며 내부 시뮬레이션은 ROS 토픽과 자기 위치 정보를 사용한다.
5. 참고 코드 `formation`, `vswarm`, `Fast-Planner`의 존재만으로 개인 구현 성과를 추가하지 않는다. `darknet_ros`와 `path_planning`에는 원저자·라이선스 헤더가 있으므로 기존 도구의 수정·통합으로 설명한다.

## 공개 자산 대응표

아래 경로의 기준은 원본의 `편대비행 논문/`이다. 공개 파일은 원본을 그대로 복사했으며 결과 그래프의 수치나 형태를 바꾸지 않았다.

| `public/media/drone/` 파일 | 원본 |
| --- | --- |
| formation.png | Screenshot from 2021-08-12 22-59-09.png |
| obstacle-course.png | best2/Screenshot from 2021-08-14 02-57-13.png |
| lidar-map.png | best2/Screenshot from 2021-08-14 02-53-35.png |
| depth-detection.png | best2/Screenshot from 2021-08-14 01-21-24.png |
| distance.jpg | best2/distance.jpg |
| formation-path.jpg | best2/total.jpg |
| low-pass-left.jpg | best2/filter left.jpg |
| low-pass-right.jpg | best2/filter right.jpg |
| formation-demo-4x.mp4 | picture/4xKakaoTalk_20210928_022505698.mp4 |
| paper.pdf | 영상기반 드론 인지를 통한 편대비행 및 장애물 회피 알고리즘 개발.pdf |
| presentation.pdf | 영상기반 드론 인지를 통한 편대비행 및 장애물 회피 알고리즘 개발(ppt version).pdf |
