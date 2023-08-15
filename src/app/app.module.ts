import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ChecklistListComponent } from './home/checklist-list/checklist-list.component';
import { ChecklistSetupComponent } from './home/checklist-setup/checklist-setup.component';
import { ChecklistItemComponent } from './home/checklist-list/checklist-item/checklist-item.component';
import { SubtaskListComponent } from './home/checklist-list/checklist-item/subtask-list/subtask-list.component';
import { SubtaskComponent } from './home/checklist-list/checklist-item/subtask-list/subtask/subtask.component';
import { OutletListComponent } from './home/outlet-list/outlet-list.component';
import {FormsModule} from "@angular/forms";
import {AppRoutingModule} from "./app-routing.module";
import { DeleteModalComponent } from './shared/delete-modal/delete-modal.component';
import { ErrorModalComponent } from './shared/error-modal/error-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    ChecklistListComponent,
    ChecklistSetupComponent,
    ChecklistItemComponent,
    SubtaskListComponent,
    SubtaskComponent,
    OutletListComponent,
    DeleteModalComponent,
    ErrorModalComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
