import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {ChecklistSetupComponent} from "./home/checklist-setup/checklist-setup.component";
import {ChecklistItemComponent} from "./home/checklist-list/checklist-item/checklist-item.component";
import {SubtaskSetupComponent} from "./home/checklist-list/subtask-setup/subtask-setup.component";
import {ErrorComponent} from "./error/error.component";
import {ConfirmLeaveGuard} from "./can-deactivate.guard";

const routes: Routes = [
  {path: '', component: HomeComponent, pathMatch: 'full', canDeactivate: [ConfirmLeaveGuard]},
  {path: 'setup-checklist/:id', component: ChecklistSetupComponent, canDeactivate: [ConfirmLeaveGuard]},
  {path: 'open-checklist/:id', component: ChecklistItemComponent, canDeactivate: [ConfirmLeaveGuard]},
  {path: 'setup-subtask/:id', component: SubtaskSetupComponent, canDeactivate: [ConfirmLeaveGuard]},
  {path: 'error', component: ErrorComponent, canDeactivate: [ConfirmLeaveGuard]},
  {path: '**', redirectTo: ''}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule{

}
