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
import { OutletListComponent } from './home/outlet-list/outlet-list.component';
import {FormsModule} from "@angular/forms";
import {AppRoutingModule} from "./app-routing.module";
import { DeleteModalComponent } from './shared/delete-modal/delete-modal.component';
import { ErrorModalComponent } from './shared/error-modal/error-modal.component';
import { SetupModalComponent } from './shared/setup-modal/setup-modal.component';
import { CheckModalComponent } from './shared/check-modal/check-modal.component';
import { NoteModalComponent } from './shared/note-modal/note-modal.component';
import { SubtaskSetupComponent } from './home/checklist-list/subtask-setup/subtask-setup.component';
import { ErrorComponent } from './error/error.component';
import {ConfirmLeaveGuard} from "./can-deactivate.guard";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    ChecklistListComponent,
    ChecklistSetupComponent,
    ChecklistItemComponent,
    OutletListComponent,
    DeleteModalComponent,
    ErrorModalComponent,
    SetupModalComponent,
    CheckModalComponent,
    NoteModalComponent,
    SubtaskSetupComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [ConfirmLeaveGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
