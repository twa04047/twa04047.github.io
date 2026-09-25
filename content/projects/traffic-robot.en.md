## Model Citizen — a mobile traffic-monitoring robot

In 2020, while studying at Kyungpook National University, I worked with Lee Jae-geon as the two-person team **Model Citizen (모범시민)**. We proposed a camera robot that travels along modular rails between roadside structures, extending the area that a fixed camera can observe. The project received an **Excellence Award at the 1st Daegu Metropolitan City Robot Idea Contest**.

The idea addressed illegal parking that obstructs pedestrians’ views and emergency-vehicle access. Our goal was to move cameras where they were needed, interpret the scene and provide warnings. The team developed CAD designs and a physical proof of concept; my contribution was **computer vision development**.

## My contribution — face and vehicle detection

I developed a **Python and OpenCV PoC that detects faces in webcam frames and displays their locations**. The original presentation preserves the running `face.py` script alongside its detection output.

![Original vision PoC: Python and OpenCV code on the left, with a detected face outlined on the right.](../../../media/traffic/vision-demo.png)

| Step | Implementation |
| --- | --- |
| Camera input | Open the webcam with `VideoCapture(0)` and read successive frames |
| Preprocessing | Convert frames to grayscale with `cvtColor` and `COLOR_BGR2GRAY` |
| Face detection | Load OpenCV’s frontal-face Haar Cascade and call `detectMultiScale` |
| Visualization | Draw green rectangles at the detected coordinates on the input frame |

Face detection was a **basic vision PoC using an existing Haar Cascade model** to connect camera input with visible detection results. It located faces without identifying individuals.

The **vehicle-detection recording** shows bounding boxes, `car` labels and confidence scores on nighttime road footage. Detections are visible as multiple vehicles enter the frame and the view moves. The displayed scores are confidence values for individual detections, not accuracy measured on a separate evaluation dataset. The archived material does not establish the vehicle detector’s model or training method, so neither is specified here.

## The team’s design and physical PoC

The team designed a robot suspended beneath a rail, with omni wheels above it to support movement along the rail. The concept used existing roadside structures, such as traffic-light and streetlight poles, and combined a camera with warning lights.

![Team CAD rendering of a roadside support structure and the proposed robot rail.](../../../media/traffic/rail-cad.jpg)
![The team’s physical PoC, showing the assembled body and omni wheels.](../../../media/traffic/prototype.png)

CATIA parts and assemblies for the robot and rail, CAD renderings and a physical prototype photo supported the feasibility proposal. The motor recording also shows the prototype moving along an outdoor rail. **Mechanical design and hardware fabrication were team outcomes**. My individual contribution to this project was vision development.

## Proposed traffic-safety applications

Starting from camera-based observation, the team proposed several applications for a mobile traffic-monitoring system.

![Original concept diagram proposing accident-prevention warnings, messages through an operations center and monitoring of two-wheeled vehicles.](../../../media/traffic/use-scenario.png)

| Proposed capability | Intended application |
| --- | --- |
| Detect pedestrians and vehicles, then warn | Use lights and sound to warn of hazards in blind spots and school zones |
| Observe parked vehicles and connect to an operations center | Move to relevant locations and support warning messages to drivers |
| Adjust coverage by time of day | Assign robots to areas with greater demand, including school zones |
| Collect traffic information | Connect observations across robots and an operations center |

These were **proposed applications**. The material demonstrates face and vehicle detection and rail movement. Integrated traffic control connecting automatic hazard assessment, plate recognition and message delivery remained a future implementation goal.

## Outcome and learning

We connected a traffic-safety problem to a mobile robot concept and used **a physical PoC, a face-detection screenshot, and vehicle-detection and rail-movement recordings to demonstrate initial feasibility**. A proposal, a 16-page presentation and an exhibition poster explained the problem, design and intended uses.

My practical experience was implementing the sequence from camera input through preprocessing, detection and visualization. An operational traffic-monitoring system would require separate evaluation of detection under varying lighting and occlusion, false detections, processing latency, and the integration of robot movement with vision.

## Excellence Award at the Daegu Robot Idea Contest

On **November 25, 2020**, Model Citizen — **Jiho Jang and Lee Jae-geon** — received an Excellence Award at the first Daegu Metropolitan City Robot Idea Contest. The contest was hosted by Daegu Metropolitan City and organized by Daegu Technopark, whose president issued the certificate.

![Excellence Award certificate for Model Citizen at the 1st Daegu Metropolitan City Robot Idea Contest, November 25, 2020.](../../../media/traffic/excellence-award.jpeg)

[View the original certificate photo](../../../media/traffic/excellence-award.jpeg)
