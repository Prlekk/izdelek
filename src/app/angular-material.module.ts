import { NgModule } from "@angular/core";

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatStepperModule } from '@angular/material/stepper';
import { MatGridListModule } from '@angular/material/grid-list';  
import { MatDividerModule } from '@angular/material/divider'; 
import { MatTooltipModule } from '@angular/material/tooltip'; 
import { MatListModule } from '@angular/material/list'; 
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';

@NgModule({
    exports: [
        MatFormFieldModule,
        MatInputModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatToolbarModule,
        MatExpansionModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatStepperModule,
        MatGridListModule,
        MatDividerModule,
        MatTooltipModule,
        MatListModule,
        MatTableModule,
        MatMenuModule,
        MatBadgeModule
    ]
})
export class AngularMaterialModule {

}