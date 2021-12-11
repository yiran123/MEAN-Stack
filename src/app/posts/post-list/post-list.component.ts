import { PostsService } from './../posts.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, Input } from '@angular/core';
import { Post } from '../post.interface';

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
  private postsSub: Subscription = new Subscription();

  constructor(private postsService: PostsService) {}

  ngOnInit(): void {
    this.posts = this.postsService.getPosts();
    this.postsSub = this.postsService
      .getPostUpdatedListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
