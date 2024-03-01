import { NgModule } from "@angular/core";

import { PostCreateComponent } from './post-create/post-create.component';
import { PostListComponent } from './post-list/post-list.component';
import { ReactiveFormsModule } from "@angular/forms";
import { AngularMaterialModule } from "../angular-material.module";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { PostViewComponent } from "./post-view/post-view.component";

@NgModule({
    declarations: [
        PostCreateComponent,
        PostListComponent,
        PostViewComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AngularMaterialModule,
        RouterModule,
        FontAwesomeModule
    ],
    exports: [
        PostCreateComponent,
        PostListComponent,
        ReactiveFormsModule,
    ]
})
export class PostsModule {}