import { Component, OnInit, OnDestroy } from "@angular/core";
import { Observable, Subscription } from 'rxjs';

import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { PageEvent } from "@angular/material/paginator";
import { AuthService } from "src/app/auth/auth.service";

import { faHeart, faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { animate, state, style, transition, trigger } from "@angular/animations";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"],
  animations: [
    trigger('popOverState', [
      state('show', style({
        opacity: 1,
      })),
      state('hide', style({
        opacity: 0,
      })),
      transition('show => hide', animate('500ms ease-out')),
      transition('hide => show', animate('500ms ease-in'))
    ])
  ]
})
export class PostListComponent implements OnInit, OnDestroy {
  faPen = faPen;
  faTrash = faTrash;
  faHeart = faHeart;
  faSave = faPlus;
  posts: Post[] = [];
  creator: string;
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userLikedPost = false;
  userId: string;
  show = false;
  private postsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(public postsService: PostsService, private authService: AuthService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postsService.getUsers();
    this.userId = this.authService.getUserId();
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((postData: { posts: Post[], postCount: number}) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      });
      this.userIsAuthenticated = this.authService.getIsAuth();
      this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  checkLike(post: Post) {
    return post.usersLiked.includes(this.userId);
  }

  onToggleLike(post: Post, isLike: boolean) {
    if (!this.userIsAuthenticated) {
      return;
    }

    this.isLoading = true;
    this.userLikedPost = isLike;

    if (isLike) {
      this.toggleShow();
    }

    this.postsService.updateLikes(post.id, this.userId, isLike).subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
      }
    });
  }

  getStateName() {
    return this.show ? 'show' : 'hide';
  }

  toggleShow() {
    this.show = !this.show;
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage)
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
  
}
