# Story audit follow-through: transfer practice

Design · 28 September 2026 · family 1 in progress, not learner-tested.

The existing story teaches a useful sequence of workplace tasks, but its simulated apps do not yet establish that someone can find a downloaded file, recover from a closed window, or reply in a different communication channel.

**Owner decision (28 Sep 2026):** each family is built as **required steps inside an existing level**, not as optional practice rounds. Depth over breadth: use the story that is already there, add a task to a level only where no current task fits, and ship one PR per family. The pilot still decides whether any of it should get shorter or move.

## Shared design

Keep the Job Card as the only instruction surface. Screens contain source material, ordinary controls, and factual status. Begin with a workplace request; offer Show me and Help on request. A wrong attempt explains the consequence and preserves the draft. Completion describes the observed action, never general computer mastery. Every new task must have English and Spanish source material, corrections, Help, and completion copy.

Use fictional files and contacts. A simulated permission or upload task must never request real browser permissions or personal files. Mark the app as practice. Story drafts belong to the learner and survive reload. Standalone lessons are outside this audit. Store submitted evidence separately from drafts. Add all route, level, location, icon and language wiring through the registry and existing integrity tests.

## 1. File confidence

Status: in progress on `feat/wave-4-file-confidence`.

Placement: Day 10, Shared Files (`level5`, Act II, manager Renata). It gets a new first task, `upload-schedule`, before `files` (rename and share) and `mail-send-link`. The level now has three tasks. The `files` task already teaches rename, so this task does not repeat it.

Scenario: Renata's Monday email has **next week's** crew schedule attached. She asks you to put it in the Schedules folder in Drive so the crew can see it. Next week's file is used on purpose. In the following `files` task, the learner has to pick *this* week's schedule, and the file they just uploaded is one of the look-alikes. Reading the week at the top of the page is how they tell them apart.

Sequence:
1. In Mail, open Renata's message.
2. Download the attachment. It then appears in Downloads, both in the PDF app's list and in the upload picker.
3. Open Drive and go to the Schedules folder.
4. New → File upload opens a picker on Downloads.
5. Choose next week's schedule, not this week's copy (the distractor), and upload it.

Print / Save as PDF is a later follow-up on the résumé day, not part of this task.

Job Card (Act II states the goal, not the clicks): “Download next week's schedule from Renata's email. Upload it to the Schedules folder in Drive.” / “Descarga el horario de la próxima semana del correo de Renata. Súbelo a la carpeta Schedules en Drive.”

Evidence: the uploaded file's identity plus the folder it went to. Neither a typed name nor a click counts. Each of these gets one factual correction and resets no step: opening Upload before downloading, uploading outside Schedules, or picking this week's schedule. Completion: “You downloaded next week's schedule and uploaded it to the Schedules folder.” It makes no claim about files on the learner's own device.

Pilot transfer: with permission, supply a harmless PDF outside the simulator. Observe whether the learner finds it in the device's Downloads folder and uploads it to a shared folder. Record independent success, requested support, and recovery after a wrong file.

## 2. Everyday recovery

Status: in progress on `feat/wave-4-everyday-recovery`. Owner choices (28 Sep): the three incidents are spread across Act II, one per existing task, with no new days. For the closed window, the Job Card asks the learner to close it; nothing fakes a crash.

| Incident | Host | What happens | Evidence |
|---|---|---|---|
| Page won't load | Day 7, `handbook` (the first Docs visit) | The practice Wi-Fi is off, so every browser page except Forms (whose done screen is up) shows Chrome's “No internet” page, and the shelf shows Wi-Fi off. The learner opens Quick Settings, turns on Wi-Fi, then clicks Reload, from the page or the toolbar. | The handbook loads only after Wi-Fi is on *and* Reload is pressed. Reload first gets a correction and resets nothing. One story flag holds the stage; it survives a reload, and replaying Day 7 clears it. Lessons skip it. |
| Undo | Day 12, `status-report` (Sheets) | A paste lands in the wrong cells. The learner uses Undo (the toolbar button or Ctrl+Z) and the numbers come back. | The original values are restored; typing them back by hand is not Undo. |
| Closed window | Day 13, `triage` (already saves drafts) | Mid-draft, the Job Card says the learner has to step away and asks them to close the browser. Then it asks them to reopen it and finish. | The draft is unchanged after reopening, and the task finishes from it. |

Job Card (Day 7): “The page did not load. Check the Wi-Fi, then reload the page.” / “La página no cargó. Revisa el Wi-Fi y después vuelve a cargar la página.” The page itself says “Practice Wi-Fi. Your real computer is still connected.”

Never disconnect the learner's real computer or interrupt a real save to manufacture an exercise. Help stays reachable while the simulated page is unavailable. Permission pop-ups are out of scope until a task has a real reason to ask.

Pilot transfer: observe a harmless closed-tab recovery and Undo in a real editor. Distinguish knowing the control from recovering without losing content.

## 3. Communication beyond email

Placement: choose one round suited to the learner's route, after email basics.

- Manager text: a changed shift request with the day and time in the source. Learner replies with acknowledgement and the relevant detail.
- Voicemail: short audio plus an equivalent transcript. Learner records caller, reason and callback information in a message form. Never require audio-only recall.
- Calendar reply: compare the invitation with a visible schedule, then accept or propose a free alternative.
- Document comment: select the relevant passage and leave a specific question. Do not edit the source when only a comment is requested.
- Team chat: reply in the correct thread and keep private information out of a public channel.

Initial Job Card example: “Renata sent a schedule question. Reply in her text thread.” / “Renata te envió una pregunta sobre el horario. Respóndele en su conversación de mensajes.”

Evidence: grade destination, essential facts and disclosure boundaries separately. Accept short, comprehensible beginner language. An incomplete response gets one actionable correction. Save draft and selected thread on reload. Completion names the channel and action actually practiced.

## Release gates

1. Build one family at a time; test pure grading functions with valid beginner English and Spanish, wrong recipients/files, missing facts, and retry cases.
2. Verify keyboard-only, Chromebook 100% and 150%, screen-reader names, Job Card overlap, language switching, Help, reload, and replay.
3. Run the original audit segment method again before changing its historical tallies.
4. Conduct the real-learner pilot described in `launch-pilot.md`. Staff observations must distinguish independent work, hints, direct coaching, and accidental success.

Open decisions for pilot: useful round length, whether these belong in the required core, which file actions transfer on actual learner devices, and which communication channels their workplaces use. These are teaching and rollout decisions, not facts established by automated tests.
