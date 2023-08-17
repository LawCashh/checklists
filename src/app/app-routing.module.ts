import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {ChecklistSetupComponent} from "./home/checklist-setup/checklist-setup.component";
import {ChecklistItemComponent} from "./home/checklist-list/checklist-item/checklist-item.component";

const routes: Routes = [
  {path: '', component: HomeComponent, pathMatch: 'full'},
  {path: 'setup-checklist/:id', component: ChecklistSetupComponent},
  {path: 'open-checklist/:id', component: ChecklistItemComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule{

}
