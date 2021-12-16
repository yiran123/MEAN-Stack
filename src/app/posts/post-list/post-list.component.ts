import { PostsService } from './../posts.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, Input } from '@angular/core';
import { Post } from '../post.interface';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit {
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
  private postsSub: Subscription = new Subscription();

  constructor(private postsService: PostsService) {}

  ngOnInit(): void {
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.isLoading = true;
    this.postsSub = this.postsService
      .getPostUpdatedListener()
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.isLoading = false;
        this.posts = postData.posts;
        this.totalPosts = postData.postCount;
      });
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
    //console.log(this.currentPage + ' ' + this.postsCurPage);
    if (this.postsCurPage === 0) {
      this.currentPage -= 1;
    }
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
