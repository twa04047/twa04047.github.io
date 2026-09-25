## Research context and my contribution

In my fourth year at Kyungpook National University, I worked as an undergraduate researcher in IASL on **vision-based drone formation flight and obstacle avoidance**. The research was motivated by environments where GPS reception or sharing positions between drones can be difficult. Each follower used a camera to observe the leader and calculate its own target position.

My work connected **drone detection to 3D localization and following behavior**. I improved depth selection within detections and used coordinate transformations and filtering to generate follower targets. The system combined visual following with obstacle-aware planning for the leader. I documented the simulation research in a first-author paper and presentation.

The paper was coauthored by Ji-Ho Jang, Seon-il Lee, and Hyeonbeom Lee. The project built on YOLO, darknet_ros, RotorS, OMPL, and FCL. Its contribution was adapting and integrating these tools into a working perception-to-flight pipeline.

## Leader and follower architecture

The leader plans around obstacles, while two followers estimate its relative position from depth images. Images provide the relative-position observations; sensor and control messages inside the simulation are connected through ROS topics.

| Component | Input and processing | Output |
| --- | --- | --- |
| Leader | VLP-16 LiDAR → mapping → OMPL RRT* → FCL collision checks | A path for the formation |
| Follower perception | VI-Sensor RGB image → YOLO / darknet_ros | Leader bounding box |
| Follower localization | Minimum depth inside the box → camera intrinsics → coordinate transformation | Leader position and formation target |
| Follower control input | Target position → low-pass filter (LPF) | Position command for each follower |

The environment used **Ubuntu 18.04, ROS Melodic, the Gazebo-based RotorS Simulator, and the AscTec Firefly model**. Final formation experiments used the simulated VI-Sensor. Earlier seminar materials also document preliminary RealSense D455 integration work.

## Problem 1. A box center may miss the drone surface

The initial approach read depth at the center of the detected bounding box. A drone has a small body and open spaces between its propellers, so that pixel could fall on the background. A correct detection could still produce an unstable distance estimate.

The revised approach **searched the bounding box for the minimum depth and selected the corresponding pixel**. Camera intrinsics and the selected depth then provided 3D camera coordinates.

```text
Xc = Zc × (u − cx) / fx
Yc = Zc × (v − cy) / fy
```

A coordinate transformation and the follower's own position placed the estimate in the world frame. Formation offsets produced the follower target. The archived C++ implementation shows the depth-image search, back-projection with camera matrix `K`, and publication of a `PoseStamped` message.

![Original detection and depth extraction capture. The left view shows the YOLO bounding box; the right shows the selected pixel and depth.](../../../media/drone/depth-detection.png)

## Problem 2. Noisy estimates become noisy targets

Motion of the drone changed the bounding box and selected pixels, introducing noise into the estimated targets. **The paper uses a low-pass filter to smooth the target path** before sending position commands to the followers.

These original plots compare the left and right followers. Blue dotted lines show target paths before filtering; red solid lines show the filtered paths. Filtering reduces rapid fluctuations in the target coordinates.

![Left follower target path before and after low-pass filtering. Original experiment plot.](../../../media/drone/low-pass-left.jpg)
![Right follower target path before and after low-pass filtering. Original experiment plot.](../../../media/drone/low-pass-right.jpg)

The archived `kalman_filter.cpp` contains **both Kalman-filter and LPF implementations**. The LPF branch specifies a 2.8 Hz cutoff and a 500 Hz sampling frequency. These are configuration values, not measured throughput. The paper describes LPF results, but the LPF-selection macro is commented out in the archived source, so the exact executable used for the paper cannot be established from this snapshot alone.

## Planning for the width of the formation

A path that clears obstacles for the leader may still put a follower at risk. The planner therefore used **collision geometry that also accounts for the space occupied by the followers**.

The leader used LiDAR mapping and OMPL's RRT* planner. FCL and OctoMap checked candidate states for collisions. The archived implementation uses a collision box with dimensions `0.5 × 1.5 × 0.1` and a two-second planning limit. These values describe that experiment's configuration.

![Original RViz capture showing the LiDAR point cloud and a planned path between obstacles.](../../../media/drone/lidar-map.png)

## Simulation results

The paper reports **one leader and two followers maintaining a triangular formation, navigating around obstacles, and keeping approximately 1.25 m between the leader and each follower**. The following distance and path plots are the original figures used in the research.

![Leader–follower distance over time. Values fluctuate around approximately 1.25 m; this is neither a constant separation nor a localization-error metric.](../../../media/drone/distance.jpg)

![Paper figure showing paths and the formation. Green represents the leader, red and blue the followers, and black bars the obstacles.](../../../media/drone/formation-path.jpg)

**The 1.25 m figure is the approximate spacing reported in the paper.** It is not an RMSE, detection-accuracy measurement, or repeated-trial success rate. Archived logs and the MATLAB script document target-coordinate and distance plotting, but do not establish hardware flight validation.

## What I learned

The main lesson was how to **turn a detection into a usable control input**. A bounding box can contain the object while its center pixel misses the physical surface. Understanding sensor representations and coordinate frames was essential to reducing the effect of depth-selection errors on target positions.

I also gained experience connecting ROS messages and diagnosing behavior using Gazebo motion, RViz maps, and coordinate plots together. Filtering and planning were evaluated as parts of the formation-flight process.

Segmentation, depth sampling, and Deep SORT appear in the seminar materials as proposed next steps. They are not presented here as completed implementations.

## First-author conference paper

> **First-author paper · 2nd Korea Artificial Intelligence Conference (2021)**
>
> **Ji-Ho Jang · First author** — Proceedings, **pp. 19–20**, **ICT Automotive Convergence session `S-2-3`**.

**“Drone Formation Flight and Obstacle Avoidance Algorithm using on Vision-Based Drone Detection”** (original title)

**Ji-Ho Jang (first author)**, Seon-il Lee, and Hyeonbeom Lee, Kyungpook National University. I developed visual localization and drone-following behavior and documented the methods and simulation results in this first-author conference paper.

[Read the first-author paper · PDF, Korean](../../../media/drone/paper.pdf)

This account draws on the two-page paper, the original PPTX and presentation PDF, seminar materials, simulation recordings, ROS C++ source, the `best2` plots and coordinate logs, and `dronegraph.m`. The paper specifies YOLO v4-trained weights, while some presentation slides say YOLO v3; the project summary therefore uses the general name YOLO. The original documents are linked below.
