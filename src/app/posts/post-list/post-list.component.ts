import { AuthService } from './../../auth/auth.service';
import { PostsService } from './../posts.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../post.interface';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   { title: 'First Post', content: "This is the first post's content" },
  // ];
  posts: Post[] = [];
  isLoading: boolean = false;
  totalPosts: number = 0;
  postsPerPage = 2;
  postsCurPage = this.postsPerPage;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated: boolean = false;
  userId: string;
  userRole: string;
  private postsSub: Subscription = new Subscription();
  private authStatusSub: Subscription;

  constructor(
    private postsService: PostsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.userRole = this.authService.getUserRole();
    this.isLoading = true;
    this.postsSub = this.postsService
      .getPostUpdatedListener()
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.isLoading = false;
        this.posts = postData.posts;
        this.totalPosts = postData.postCount;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((userRole) => {
        // this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
        this.userRole = userRole;
      });
    //console.log(this.userIsAuthenticated);
  }

  onChangedPage(pageData: PageEvent) {
    //console.log(pageData);
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;

    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsCurPage =
      this.totalPosts - this.postsPerPage * (this.currentPage - 1) - 1 >
      this.postsCurPage
        ? this.postsPerPage
        : this.totalPosts - this.postsPerPage * (this.currentPage - 1) - 1;
    if (this.postsCurPage === 0) {
      this.currentPage -= 1;
    }
    this.postsService.deletePost(postId).subscribe({
      next: () => {
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
