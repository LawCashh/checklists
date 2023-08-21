# Checklists projekat

## Features
- Home page lets you pick an outlet
(which gets saved in localstorage and you will be in this outlet
until you change it or empty the localstorage).
- Picking an outlet gives you the list of its checklists
- The circle on the left shows the number of subtasks of individual checklists and their progress in advance
(completing the tasks inside fills the circle with orange color percentage wise)
- Pulling the checklist to the left reveals options for deleting it or setting it up(editing it)
- You can add a new task by pressing the blue + button at the bottom right corner.
This brings up a form, invalid only if the title is empty.
- Deciding to setup the checklist brings you to its edit page
- (from the header you can go back at which point you are asked for confirmation, and you can press the bucket
icon as well if you want to delete the checklist from there, which brings up the confirmation too)
- The checklist name is required, and the description can't be longer than 250 characters
- Deciding to save or cancel the edit brings up confirmation modals as well
- Now from the home page, clicking on the checklist name opens the checklist
showing its subtasks
- You can add a new subtask by pressing the bottom right + button like on the home page
- The header arrow is for going back (no confirmation needed), and the gear button at the top right
location is for accessing the edit checklist page in this way too
- Each subtask can be marked as complete by clicking on the circle to the left
- Pulling the individual subtask to the left reveals 3 options:
  1. Note: brings up a popup for adding a note if there is none, or editing an existing note
     (you can only delete the note by saving an empty string).
  2. Mark as N/A: marks the note as not applicable(this is disabled if it already is)
  3. Setup: opens the subtask's edit page
- Each subtask can have a star, exclamation mark or a time badge on the right.
Star means the task is important, exclamation means that the task is urgent,
and the time badge shows until when the task has to be completed.
- On the subtask setup page, the header contains the arrow button for going back(asks for confirmation)
and the bucket for deleting the task(asks for confirmation).
- You can edit the subtask's name and description here too, but in this case
You have an option for defining the deadline(the time badge from before) which brings up
the hour and minute selection, after adding/changing the deadline you can delete it by pressing the x button on the right
- You can mark the task to be completed at the last day of the month(like the checklist),
And you can mark it as important and/or urgent too.
- Pressing Save or cancel brings up appropriate confirmation modals for each.

### Finished/fixed features/requirements/bugs (with // prefix)

//Setup button goes to a new route for setting up(editing) the checklist but saves the outlet in localstorage for later (na setup stranicu uzmi desc checkliste dodaj loader za ovo ofc)<br/>
//On setup save show loader in a modal over the background with some opacity, then go back and refresh the data<br/>
//Also on setup if the user presses top left ask him if he really wants to go back<br/>
//Also on bucket in header, show him the modal on the space below and if it’s successful go back and refresh<br/>
//Add the local storage and keep the selected outlet in it<br/>
//Also ask the user upon cancelling if he is sure he wants to cancel<br/>
//work on header setup bin<br/>
//Checklist open opens checklist details: top right setup, top left just go back without asking (on this page I’ll use getlistofsubtasks)<br/>
//Modals for deleting tasks and checklists are reusable components<br/>
//While adding a checklist or a subtask you can also save upon entering.<br/>
//Pressing the subtask shows the subtask details, if completed or na show full data with who did it and when<br/>
//When we slide the task we can mark it as n/a<br/>
//Clicking the circle marks the task as completed(checkmark)<br/>
//Ask what the date is for in getsubtasklist, cause my tasks are reset on today’s date, but on 17th of august they are all completed or n/a’d as they should be - SOLVED: checklists are daily<br/>
//You can click add note either if a task has the note already or not (but if it already has a note you can also click on the icon note to edit it), all of this opens up a dialog with input)<br/>
//Ask if I can mark a completed task n/a, and n/a task as completed (switch it) and other variants - SOLVED: he said yes you can switch them<br/>
//Upon saving show loader until the save is completed and until the subtasks are loaded again. Also you can only delete the note through saving empty note.<br/>
//Last subtask on example has a star(if a subtask is marked as important), exclamation if it’s urgent, also if the subtask has a defined time info, show it(shows how long the subtask has time left to complete)<br/>
//Fix sliding anywhere<br/>
//Maybe if you go to open checklist, then setup checklist top right, going back should then bring you to open checklist and not setup checklist<br/>
//Vidi za manuelno pomjeranje naprijed nazad

### Non priorities (small questions/possible edits)

-When he said “Clicking the circle marks the task as completed(checkmark)” did he mean clicking again would revert that (I don’t think so cause it wouldn’t make sense but still)<br/>
-Ask for last day check ( why didn’t it go away)<br/>
-Multiline for note<br/>
-Maybe mention that getbusinessdate gets outlet’s location business date but I complete a task on my date, so if I complete it late at night I complete it on a date before, even though the business outlet date is tomorrow in outlet location(maybe this is intended)

### NEXT TODO

-Pitaj za vrijeme(ono 15:00) da li je to due time absolute ili relative and does it mean there’s 15 hours left to finish it or it should be finished by 15 o’clock. Then make the pin next to other icons and changing it in setup.<br/>
-Maybe on setup routes going back instead of asking are you sure you want to cancel checks for changes and if there are none just goes back but if there are changes Says “Unsaved changes” Are you sure you want to cancel, and then either you have just
a yes next to no which goes back, or no, yes, and yes(save changes). 
