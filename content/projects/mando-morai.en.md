## Project overview

I participated in the **Autonomous Driving Simulation Challenge** at the 2021 Mando autonomous-mobility competition. Using a virtual road in MORAI, our team connected camera, LiDAR and GPS/IMU data through ROS 1 nodes to turn sensor input into information for driving decisions.

I worked on **camera color and region-of-interest (ROI) processing and forward-obstacle distance from LiDAR**. Rather than passing raw sensor data directly to control, I separated the pipeline into a camera-based region signal and a LiDAR-based distance output.

## Camera: turning images into a driving signal

I decoded MORAI's compressed camera stream into OpenCV images, selected pixels with BGR color thresholds and applied a **trapezoidal ROI** over the lower road area.

In `lane_roi.py`, I calculated the share of selected pixels inside the ROI and published a Boolean `school_zone` topic against a configured threshold. The processing path was **color selection → ROI mask → pixel ratio → ROS topic**, giving other nodes a compact signal derived from the camera frame.

## LiDAR: returning distance to a forward obstacle

In `velodyne_parser.py`, I read 3D points from `/velodyne_points` and selected **forward obstacle candidates** using position, height and distance conditions. The parser calculated point distances and published the nearest value as `dist_forward`. This turned LiDAR observations into an obstacle-distance value that other ROS nodes could consume.

![Original photograph of a LiDAR distance-parser test in MORAI.](../../../media/mando/lidar-test-photo.jpg)

## ROS driving pipeline

The team developed lane perception, GPS/IMU path following and control nodes to connect sensor processing with driving decisions. My camera and LiDAR work provided perception inputs to this broader pipeline.

| Input | Processing and output |
| --- | --- |
| Camera frames | Color filtering and ROI processing, then a `school_zone` signal |
| LiDAR point cloud | Forward-obstacle candidates and nearest distance on `dist_forward` |
| GPS/IMU and lane information | Steering and speed commands from the team's path-following and lane-processing nodes |

## Engineering perspective

The meaning of a sensor reading changes with **the region and coordinate conditions used to select it**. I made those choices explicit through camera color ranges and ROI geometry, and through the LiDAR parser's forward-position, height and distance filters. Publishing the results as separate ROS topics also taught me how to define a usable interface between perception and driving control.
