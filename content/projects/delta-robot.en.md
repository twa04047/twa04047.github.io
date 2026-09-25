## A robot for weed removal

**Advanced Weed Removal System** was a 2020 SE-KNU team project at Kyungpook National University. The goal was to detect a target with a camera and move a delta robot's end effector to its location. The team mounted the robot in a mobile frame and built a conveyor test setup for indoor demonstrations.

My contribution was **designing the delta robot in CATIA and designing and fabricating its mechanical components**. I built the physical structure that would carry the team's vision and motor-control system.

## My design and fabrication work

I worked from individual CAD parts through assemblies, fabrication data and physical construction. The design had to accommodate motor mounts, joint connections and the space needed for the end effector to move.

| Responsibility | Work completed |
| --- | --- |
| Delta robot CAD | Modeled the upper base, links, end effector and connecting components in CATIA and assembled them digitally |
| Component design and fabrication | Designed and fabricated the mechanical parts around purchased motors and joints |
| Supporting structures and test equipment | Designed and built components for the profile frame and conveyor setup |
| Fabrication data | Prepared CATPart and CATProduct models, drawings and STL files for 3D printing |

The vision processing, inverse kinematics and motor control described below belong to the **team's integrated system**. My individual contribution was the mechanical design and fabrication.

## The CATIA design

Three motors on the upper base drive the links connected to a common end effector. I modeled the base and links as individual parts, then incorporated the motors and joints into the full assembly.

![Original CAD rendering of my delta robot design, showing the upper base, links and lower end effector.](../../../media/delta/delta-cad.jpg)
![Original CATIA assembly view of the robot and its component parts.](../../../media/delta/cad-assembly.jpg)

The October 6, 2020 meeting record documents **changes to the upper arms and end-effector dimensions after the RBLD8 joints arrived**. The design evolved around the actual components available for assembly.

The geometry also fed into the team's inverse-kinematics model. The final presentation and control code use the following dimensions.

| Model parameter | Length |
| --- | ---: |
| Upper link L | 109.5 mm |
| Lower parallelogram link l | 246 mm |
| Base reference triangle side | 123.94 mm |
| End-effector reference triangle side | 57.87 mm |

These are design and control-model dimensions, rather than measurements of manufacturing tolerance or positioning accuracy.

## A frame with room to move

The frame had to leave enough space below the robot for both the end effector and the moving test targets. Its dimensions and mounting height took account of the workspace that the team studied in MATLAB.

![Workspace calculation from the original presentation, used to guide the surrounding structure.](../../../media/delta/workspace.jpg)

![Original frame-design notes, relating vertical travel, mounting height and clearance below the robot.](../../../media/delta/gantry-sketch.jpg)

The design notes combine the vertical workspace and motor-mount height while reserving clearance between the end effector and the ground. This required designing **the space occupied by a moving mechanism**, as well as its individual parts.

## Fabricating and assembling the parts

We fabricated 3D-printed components from the CAD models and assembled them with the motors, joints and profile frame. The archive includes STL files for the upper base, Link1, Link2 and end effector, along with print-job files for some components.

![The physical upper base and motor-mount assembly.](../../../media/delta/motor-mount.jpg)
![Assembling the fabricated links and end effector.](../../../media/delta/assembly-in-progress.jpg)

![The completed linkage, joints and end effector mounted inside the frame.](../../../media/delta/robot-detail.jpg)

This work connected part-level models to an operating mechanism. Checking interfaces and assembly space in CAD was an essential part of making the design buildable.

## Building the conveyor test setup

The conveyor provided an indoor approximation of targets moving beneath the robot. Its design files include a belt bed, supports, rings, a motor connection and a fabrication drawing. The team's Arduino, L298N driver and DC motor powered the conveyor.

![Conveyor CAD model showing the bed and roller mounting arrangement.](../../../media/delta/conveyor-cad.jpg)
![The fabricated conveyor with leaf-shaped test targets.](../../../media/delta/conveyor-prototype.jpg)

The October 8 meeting covered the conveyor design and frame assembly. By October 27, the team was modifying and running the conveyor and comparing the robot's motion range with the simulation. Building the test equipment made it possible to examine the mechanism and controls together.

## Integration with the team's control system

The mechanism carried a Raspberry Pi camera and three Dynamixel MX-106 motors. The team's control process connected perception to motion:

1. **Detect the target.** Threshold the camera image, find contours and calculate the target center using image moments.
2. **Calculate a target position.** Relate the detected image center to coordinates used by the robot.
3. **Solve inverse kinematics.** Use the target coordinates and link dimensions to calculate the motor angles, with limits for each axis.
4. **Drive the motors.** Send position and speed commands, packaged with a checksum, over RS-485.

![An image-processing demonstration on the robot's display, showing a detected contour and target center.](../../../media/delta/vision-screen.jpg)

Link lengths and coordinate references connect the mechanical design to the control model. The hardware and software needed to use consistent geometry and motion limits.

## Outcome and further validation

**I designed and fabricated the delta robot and its mechanical components, contributing to a physical prototype with a frame and conveyor setup.** The original presentation and demonstration video documents the CAD design, fabricated hardware, image processing and end-effector motion.

The central experience was turning **CAD models into parts that could be made and assembled**, while allowing the complete mechanism to move within its frame. It became a foundation for my later work with robot perception and control.

The demonstrated scope is an indoor prototype. The archive does not establish field weed-removal rates, repeat positioning accuracy or long-duration durability. Those measurements would be useful acceptance criteria for a subsequent design iteration.

## SE-KNU Festival Innovation Award

Our team received the **Innovation Award at the SE-KNU Festival project showcase on November 13, 2020**. The certificate recognizes the project “Development of a mobile agricultural robot with a weed-removal function,” awarded by Kyungpook National University's Engineering Education Innovation Center.

![SE-KNU Festival Innovation Award certificate · November 13, 2020](../../../media/delta/innovation-award.png)

[View the certificate at full resolution](../../../media/delta/innovation-award.png)
