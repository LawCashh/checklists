import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {ChecklistSetupComponent} from "./home/checklist-setup/checklist-setup.component";
import {ChecklistItemComponent} from "./home/checklist-list/checklist-item/checklist-item.component";
import {SubtaskSetupComponent} from "./home/checklist-list/subtask-setup/subtask-setup.component";
import {ErrorComponent} from "./error/error.component";

const routes: Routes = [
  {path: '', component: HomeComponent, pathMatch: 'full'},
  {path: 'setup-checklist/:id', component: ChecklistSetupComponent},
  {path: 'open-checklist/:id', component: ChecklistItemComponent},
  {path: 'setup-subtask/:id', component: SubtaskSetupComponent},
  {path: 'error', component: ErrorComponent},
  {path: '**', redirectTo: ''}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule{

}
