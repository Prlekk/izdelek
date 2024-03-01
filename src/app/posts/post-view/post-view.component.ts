import { Component, OnInit } from "@angular/core";
import { Ingredients, Post, Process } from "../post.model";

import { PostsService } from "../posts.service";
import { ActivatedRoute } from "@angular/router";
import { faSpoon } from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: "app-post-view",
    templateUrl: "./post-view.component.html",
    styleUrls: ["./post-view.component.css"]
})
export class PostViewComponent implements OnInit {
    faSpoon = faSpoon;

    post: Post;
    ingredients: Ingredients;
    process: Process;

    constructor(private postService: PostsService, private route: ActivatedRoute) {}

    ngOnInit() {
        const postId = this.route.snapshot.paramMap.get("postId");
        this.postService.getPost(postId).subscribe(postData => {
            this.post = {
                id: postData._id, 
                title: postData.title, 
                content: postData.content,
                imagePath: postData.imagePath,
                creator: postData.creator,
                ingredients: postData.ingredients,
                process: postData.process
            };
            this.ingredients = JSON.parse(this.post.ingredients);
            this.process = JSON.parse(this.post.process);
            console.log(typeof this.ingredients, this.ingredients);
            console.log(typeof this.process, this.process.steps);
        });
    }
}