import { PostsService } from './../posts.service';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Post } from '../post.interface';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss'],
})
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';

  newPost = 'No content';
  constructor(private postsService: PostsService) {}

  ngOnInit(): void {}

  onAddPost(postForm: NgForm) {
    if (postForm.invalid) {
      return;
    }
    this.postsService.addPost(postForm.value.title, postForm.value.content);
    postForm.resetForm();
  }
}
