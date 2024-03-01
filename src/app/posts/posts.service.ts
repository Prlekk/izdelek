import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";

import { Post, Ingredients, Process } from "./post.model";
import { User } from "./user.model";

const BACKEND_URL = environment.apiUrl + "/posts/";

@Injectable({ providedIn: "root" })

export class PostsService {
  private posts: Post[] = [];
  private users: User[] = [];
  private postsUpdated = new Subject<{ posts: Post[], postCount: number}>();
  private usersUpdated = new Subject<{ users: User[], userCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any, maxPosts: number }>(BACKEND_URL + queryParams)
      .pipe(
        map(postData => {
          return { posts: postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath,
              creator: post.creator,
              ingredients: post.ingredients,
              process: post.process
            };
          }), maxPosts: postData.maxPosts};
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({ 
          posts: [...this.posts], 
          postCount: transformedPostData.maxPosts
        });
      });
  }

  getUsers() {
    return this.http.get<{ message: string, users: any[], maxUsers: number }>("http://localhost:3000/api/user")
      .pipe(
        map(userData => {
          return userData.users.map(user => {
            return {
              id: user._id,
              username: user.username,
              email: user.email,
              posts: user.posts
            };
          });
        })
      );
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string, creator: string, ingredients: Ingredients, process: Process }>(
      BACKEND_URL + id
    );
  }

  addPost(title: string, content: string, image: File, ingredients: Ingredients, process: Process) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    postData.append("ingredients", JSON.stringify(ingredients));
    postData.append("process", JSON.stringify(process));
    this.http
      .post<{ message: string; post: Post }>(
        BACKEND_URL,
        postData
      )
      .subscribe(responseData => {
        this.router.navigate(["/"]);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string, ingredients: Ingredients, process: Process) {
    let postData: Post | FormData;
    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
      postData.append("ingredients", JSON.stringify(ingredients));
      postData.append("process", JSON.stringify(process));
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null,
        ingredients: ingredients,
        process: process
      };
    }
    this.http
      .put(BACKEND_URL + id, postData)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });
  }

  deletePost(postId: string) {
    return this.http
      .delete(BACKEND_URL + postId)
  }
}
