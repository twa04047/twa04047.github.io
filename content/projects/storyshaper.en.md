## StoryShaper — a picture book a child can shape

StoryShaper is an **interactive picture book read in a parent’s voice, with dialogue and illustrations that respond to a child’s answers**. A parent who is away can still read at bedtime, while the child chooses, predicts, and explains what happens. The project began with a teammate’s experience as a parent.

Our demo uses *The Three Little Pigs*. When a child says “Thin paper!”, the next illustration shows a paper house. The story shows it fluttering apart and asks why. Editing the existing page preserves the characters and watercolor style. The team’s submission also demonstrates reading a book in another language using the parent’s recorded voice.

[Watch the submission demo · YouTube](https://youtu.be/FXtuQ7iy4z0) · [StoryShaper live app](https://storyshaper.vercel.app) · [Team source code](https://github.com/anmemol-beta/storyshaper)

## The hackathon

The **Meta Global AI Developer Hackathon**, hosted by Meta and Cerebral Valley, was a worldwide online event. Our participation period was **October 26–November 4, 2026 (10 days, US Eastern Time)**. Participants built working projects with Meta models. [Official event page](https://cerebralvalley.ai/e/meta-ai-developer-hackathon)

We developed StoryShaper as a **four-person team**. The team README records our track as **Indie Developer** and our theme as **Build for Your World**, addressing a problem from everyday life. I was responsible for **story-agent development**. [Team project overview](https://github.com/anmemol-beta/storyshaper#readme)

## My contribution — turning an answer into the next story turn

I designed and implemented an agent that interprets open answers while preserving the story’s causal logic and safe ending.

| Responsibility | Implementation |
| --- | --- |
| Interpretation and writing | Used Muse Spark to interpret the child’s intent and material, then draft short dialogue and a question for the current scene |
| Story progression | Created nine participation points: choose a material, predict the outcome, and explain why for each pig’s house in The Three Little Pigs. Check the answer before moving to the next question |
| Unfamiliar materials | Validated the original material name, bilingual labels, and behavior, preserving that identity in later scenes and picture requests |
| Validation and recovery | Combined server rules with independent model review when needed; switched to three touch choices after the first unaccepted answer or speech-recognition failure |
| Reader integration | Connected the child’s choices and approved story to the next illustration and narration |

The team divided responsibilities as follows. Names follow the [team README](https://github.com/anmemol-beta/storyshaper/blob/main/README.md#team-and-acknowledgments).

| Team member | Responsibility |
| --- | --- |
| 현준 | Parent and character voices, narration, and voice infrastructure |
| **지호 (me)** | **Story agent, material reasoning, dialogue/questions, and guardrails** |
| 수찬 | Reader UI/UX, app experience, and image/motion integration |
| 형서 | Demo video and submission storytelling |

## Open answers within authored story boundaries

People define the essential events and ending. The model interprets a child’s choices and writes within those boundaries; the server validates its proposal before committing the next state. A model error or failed review leaves progress unchanged and does not count as a child’s failure.

| Answer or situation | Handling |
| --- | --- |
| “I’ll use paper!” | Preserve the chosen material and connect it to the house blowing apart and a question about why |
| “An ice cream house!” | Describe softening, dripping, and melting; reject wording that attributes melting to the wolf’s breath |
| “It will get bigger!” | Accept a safe prediction even when it differs from the outcome, then explain the observed process and result in the same response |
| “The wolf eats the pigs!” | Gently redirect to the safe story and offer three choices so the child can continue |

New materials are checked against five behaviors: **light and flexible, loose pieces, edible, melting, and rigid**. The server maps these to authored events. A paper cup retains its name instead of being reduced to paper. When a material conflicts with a scene’s required event, the agent acknowledges the idea and guides the child toward another choice.

## Passing approved story data to pictures and narration

The team’s pipeline is **transcription → story agent → picture editing and review → narration and display**. Muse Voice Transcribe hears the child, Muse Spark interprets and writes, and Muse Image edits the current page. Muse Spark independently reviews generated pictures. The submission also uses SAM 3.1 segments to animate elements of the prepared illustrations.

## Guardrails, prompt engineering, and response speed

**Agent guardrails.** I defined rules for essential events and a safe ending, then validated proposed materials, dialogue, and questions before advancing the story. Unfamiliar materials and complex answers receive a separate review. Unsuitable or unclear answers lead to a gentle explanation and three choices the child can tap.

**Prompt engineering.** I structured prompts around the current question’s purpose, the chosen material and its properties, and child-friendly language. I refined the instructions to acknowledge a prediction even when it differs from the outcome, then describe observable changes, explain the result, and ask an easy question. This also addressed problems such as changing the child’s material name or giving the wrong cause for an event.

**Response-speed optimization.** I reduced repeated context so requests carry the information needed for the current scene. I improved the call flow so simple answers can proceed after rule checks, while unfamiliar materials and complex answers retain additional review. Prepared choices reuse authored dialogue to avoid model calls. Mocked tests confirmed reductions in request count and input size.
