import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from "rxjs/operators";
import {Post} from "./post.model";
import {PostService} from "./post.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: Post[] = [];
  isFetching = false;
  error = null;
  private subscription: Subscription;

  constructor(private http: HttpClient, private postService: PostService) {
  }

  ngOnInit() {
    this.isFetching = true;
    this.subscription = this.postService.error.subscribe((errorMessage) => {
      this.error = errorMessage
    })
    this.postService.fetchPosts().subscribe(posts => {
      this.isFetching = false;
      this.loadedPosts = posts //!!!show posts, that we get back
    }, (error) => {
      this.isFetching = false;
      this.error = error.message;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onCreatePost(postData: Post) {
    // Send Http request //console.log(postData);
    this.postService.createAndStorePost(postData.title, postData.content)
  }

  onFetchPosts() {
    this.isFetching = true;

    this.postService.fetchPosts().subscribe((posts) => {
      this.isFetching = false;
      this.loadedPosts = posts //!!!show posts, that we get back
    }, (error) => {
      this.isFetching = false;
      this.error = error.message;
      console.log(error)
    });
  }

  onClearPosts() {
    this.postService.deletePosts().subscribe(() => {
      this.loadedPosts = [];
    })
  }

  onHandleError() {
    this.error = null;
  }

}
