import {Injectable} from "@angular/core";
import {HttpClient, HttpEventType, HttpHeaders, HttpParams} from "@angular/common/http";
import {Post} from "./post.model";
import {map, catchError, tap} from "rxjs/operators";
import {Subject, throwError} from "rxjs";

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
        postData,
        {
          observe: "response"
        }
      ).subscribe((responseData) => {
      console.log(responseData);
    }, (error) => {
      this.error.next(error.message); //!! eroor handling with subject
    })
  }

  fetchPosts() {
    let searchParams = new HttpParams();
    searchParams = searchParams.append("print", "pretty")
    searchParams = searchParams.append("custom", "key")

    return this.http
      .get<{ [key: string]: Post }>("https://ng-http-7339f-default-rtdb.firebaseio.com/posts.json", {
        headers: new HttpHeaders({"my-header": "hello"}),
        //params:new HttpParams().set("print", "pretty")
        params: searchParams,
        responseType:"json"
      })
      .pipe(map((responseData) => {
          const postArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postArray.push({...responseData[key], id: key});
            }
          }
          return postArray
        }),  //!!! catchError --->return throwError(errorRes)
        catchError((errorRes) => {
          return throwError(errorRes) //!!this is Observable
        })
      )
  }

  deletePosts() {
    return this.http
      .delete("https://ng-http-7339f-default-rtdb.firebaseio.com/posts.json",
        {
          observe: 'events',
          responseType:"json"
        })
      .pipe(
        tap((event) => {
          console.log(event)
          if(event.type === HttpEventType.Sent){
            //console.log(event)
          }

          if(event.type === HttpEventType.Response) {
           console.log(event.body);
          }
        }))

  }
}
