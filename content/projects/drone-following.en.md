## Project context
In my fourth year at university, I worked on simulated autonomous drone formation flight. My work included detecting a leading drone, estimating its position, and developing the following behavior.

## From perception to following
A depth camera and YOLO were used to detect the leading drone. Coordinates from the detected bounding box were used to locate its center.

1. Detect the leading drone using YOLO and depth-camera input.
2. Locate the center using the bounding box.
3. Apply filtering to handle noise in the estimate.
4. Develop the behavior for following the leading drone.

## Handling noise
I used a noise filter in the position-estimation process. The specific filter, its parameters, and comparative results will be documented after reviewing the original materials.

## Evidence and scope
This was a **simulation-based project**. No real-world flight validation is claimed here.

Available video and written records will be used to clarify my implementation, the team's wider work, and the conditions under which following succeeded or failed.
