import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Post} from "./post.model";
import {map} from "rxjs/operators";
import {Subject} from "rxjs";

@Injectable({providedIn: "root"})

export class PostService {
  error = new Subject<string>();

  constructor(private http: HttpClient) {
  }

  createAndStorePost(title: string, content: string) {
    const postData: Post = {title: title, content: content}
    this.http
      .post<{ name: string }>(
        "https://ng-http-7339f-default-rtdb.firebaseio.com/posts.json",
        postData
      ).subscribe((responseData) => {
      console.log(responseData);
    }, (error)=>{
        this.error.next(error.message); //!! eroor handling with subject
    })
  }

  fetchPosts() {
   return this.http
      .get<{ [key: string]: Post }>("https://ng-http-7339f-default-rtdb.firebaseio.com/posts.json")
      .pipe(map((responseData) => {
        const postArray: Post[] = [];
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            postArray.push({...responseData[key], id: key});
          }
        }
        return postArray
      }))
  }

  deletePosts() {
    return this.http
      .delete("https://ng-http-7339f-default-rtdb.firebaseio.com/posts.json")
  }
}
