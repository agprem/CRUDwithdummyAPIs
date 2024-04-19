import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpErrorResponse } from '@angular/common/http'
import { BehaviorSubject, catchError, debounceTime, of, switchMap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyserviceService {
  list: any;
private avoidInterceptor:HttpClient;

  constructor(private httpbackend: HttpBackend,private http:HttpClient) { 
    this.avoidInterceptor=new HttpClient(this.httpbackend)
  }
  //Login API
  login(input: any) {
    let payload = input
    return this.http.post('https://dummyjson.com/auth/login', JSON.stringify(payload), {
      observe: "response",
      headers: { 'Content-Type': 'application/json' }
    })
      .pipe(
        switchMap((value: any) => {
          const member: any = value.body;
          return of(member);
        })
      );
  }

  //Add Record API
  addRecord(input) {
    return this.http.post("https://dummyjson.com/users/add", JSON.stringify(input), {
      observe: "response",
      headers: { 'Content-Type': 'application/json' }
    })
      .pipe(
        switchMap((value: any) => {
          const member: any = value.body;
          return of(member);
        })

      )
  }

  //Get All  Record API
  getAll() {
    return this.avoidInterceptor.get("https://dummyjson.com/lll", {
      observe: "response",
      headers: { 'Content-Type': 'application/json' }
    })
      .pipe(
        switchMap((value: any) => {
          const member: any = value.body;
          return of(member);
        })

      )
  }
  //Update Record API
  editRecord(id, input) {
    return this.http.put("https://dummyjson.com/users/" + id, JSON.stringify(input), {
      observe: "response",
      headers: { 'Content-Type': 'application/json' }
    })
      .pipe(
        switchMap((value: any) => {
          const member: any = value.body;
          return of(member);
        })

      )
  }

  //Delete Record API
  deleteRecord(id) {
    return this.http.delete("https://dummyjson.com/users/" + id, {
      observe: "response",
      headers: { 'Content-Type': 'application/json' }
    })
      .pipe(
        switchMap((value: any) => {
          const member: any = value.body;
          return of(member);
        })
      )
  }
  //Searching Record API
  searchRecord(searchText) {
    return this.http.get("https://dummyjson.com/users/search?q=" + searchText, {
      observe: "response",
      headers: { 'Content-Type': 'application/json' }
    })
      .pipe(debounceTime(1000),
        switchMap((value: any) => {
          const member: any = value.body;
          return of(member);
        })
      )
  }
}
