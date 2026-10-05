## The challenge and my contribution

In 2021, our team prepared for the **Autonomous Driving Simulation Challenge** in the Mando autonomous-mobility competition. We used the MORAI simulator and ROS 1 to explore the path from sensor input to driving commands. The competition plan describes this category as autonomous driving on a virtual map with a simulated vehicle.

The archived team code covers camera-based lane perception, LiDAR distance and clustering, GPS/IMU path following, and steering and speed commands. **My identifiable changes** were to the camera color threshold and region of interest (ROI), an experimental `school_zone` topic, and point-selection conditions in a LiDAR forward-distance parser. I distinguish these changes from team control code and the examples supplied for the course.

## Finding lane and school-zone regions in camera frames

The camera exercises decode MORAI's compressed image stream into OpenCV frames and select lane candidates by color. I changed a supplied example from HSV conversion to thresholds on the BGR image and adjusted a trapezoidal ROI for 640×480 frames.

In `lane_roi.py`, I extended the example to calculate the fraction of selected pixels inside the ROI and publish a Boolean `school_zone` topic. **This is a color-region experiment**, not a trained sign or traffic-light detector. The thresholds and fixed image size were tuned for the archived setup and would need recalibration for another camera.

![Original photograph of the MORAI simulator alongside the image-filter output.](../../../media/mando/rgb-filter-photo.jpg)

## Experimenting with LiDAR forward-distance filtering

The supplied `velodyne_parser.py` example reads 3D points from `/velodyne_points`, selects forward candidates and publishes their minimum distance to `dist_forward`. I changed the point-selection conditions and kept a separate experiment named `velodyne_parser_yolo.py`. Despite its filename, that file **only parses LiDAR distances**; it does not run YOLO inference.

The archived angle code concatenates the results of two filters rather than taking the intersection for a ±30° sector. It also lacks robust handling for frames with no selected points. I therefore treat it as an experiment, not a validated obstacle-avoidance or distance-measurement result.

## The team's ROS driving pipeline

| Stage | Archived work |
| --- | --- |
| Lane perception | Camera color filtering, ROI, Bird's Eye View, lane fitting and curvature estimation |
| Path following | GPS position and IMU heading compared with route points to produce steering and speed commands |
| Obstacle processing | LiDAR forward distance and DBSCAN clustering, plus a pedestrian-detection exercise |
| Command selection | A controller draft combining lane and GPS commands with obstacle states into `CtrlCmd` |

Curvature estimation, path following and integrated control are **team work** preserved in the `EH` and `hyunho` folders. Some LiDAR-to-camera projection, HOG pedestrian-detection and DBSCAN files match the supplied training skeleton. Their presence in the archive is not evidence that I developed them independently.

## Archived simulation records

An original photograph shows the MORAI vehicle on a curved road beside lane-processing output and steering logs. The archive also contains a lane-tracing test recording and a longer driving-test recording. These are **records of simulation experiments**, not measured completion or success rates.

![Original photograph of the MORAI vehicle on a curved road alongside lane-processing output and steering logs.](../../../media/mando/lane-photo.jpg)

## What I learned and what remains unverified

Using sensor results for control requires consistent data formats and reference frames. Camera ROI and thresholds depend on resolution and color space; LiDAR obstacle candidates depend on height, direction and range filters. Connecting the stages with ROS topics helped me understand how perception values feed steering and speed commands.

The archived code still contains experimental constants, missing empty-input handling, and package-name and path inconsistencies. The material does not establish competition **completion, ranking or awards**, a working traffic-light detector, obstacle-avoidance success rates, or quantified driving performance. This case study records the scope of the 2021 implementation and experiments.
