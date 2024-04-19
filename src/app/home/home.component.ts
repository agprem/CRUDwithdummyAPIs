import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationsnackbarComponent } from '../confirmationsnackbar/confirmationsnackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../auth.service';
import { User } from '../user';
import { MyserviceService } from '../myservice.service';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  title = 'project';
  list: any = []
  datasource: any;
  displayedColumns = ['firstname', 'lastname', 'address', 'Action']
  isEditMode: boolean = false;
  data: any = "";
  searchInput = new FormControl("");
  searchValue = new Subject<string>();
  constructor(
    private _snackBar: MatSnackBar,
    private route: Router,
    private authservice: AuthService,
    private myservice: MyserviceService) {
    this.searchValue
      .pipe(debounceTime(300))
      .subscribe((searchTerm: string) => {
        // Call  search function here
        this.search(searchTerm);
      });
  }

  ngOnInit() {
    if (localStorage.getItem('data') != null && localStorage.getItem('data') != 'undefined') {
      this.datasource = JSON.parse(localStorage.getItem('data'))
    }
    else {
      this.getall();
    }
  }

  //for Getting data
  getall() {
    this.myservice.getAll().subscribe((res) => {
      this.list = res?.users; this.datasource = new MatTableDataSource<User>(this.list); localStorage.setItem("data", JSON.stringify(this.list));
    })
    localStorage.setItem("data", JSON.stringify(this.datasource));
  }
  //for Deleting Record
  delete(element: any) {
    const snackbarRef = this._snackBar.openFromComponent(
      ConfirmationsnackbarComponent,
      {
        data: {
          message: "Are you sure you want to delete this ",
          positive: "Yes",
          negative: "No",
        },
      }
    );
    snackbarRef.onAction().subscribe(() => {
      this.myservice.deleteRecord(element.id).subscribe((res) => { console.log(res, "After delete API hit") })
      this.list.splice(this.list.findIndex((item: any) => item.id == element.id), 1);
      // this.getall();
      this.list = [...this.list];
      this.datasource = this.list;
    });
  }
  //for Adding Record
  addRecord() {
    this.isEditMode = false;
    this.data = "";
  }
  //for Editing Record
  editRecord(element: any) {
    this.isEditMode = true;
    this.data = element;
  }
  //when typed in searchbox through api
  onSearchInputChange($event: any) {
    this.searchValue.next($event.target.value);
  }

  //searching record
  search(searchterm) {
    if (localStorage.getItem('data') != null || localStorage.getItem('data') != undefined) {
      this.myservice.searchRecord(searchterm).pipe(debounceTime(1000)).subscribe((res) => { this.datasource = res?.users })
    }

  }
  //when search from client side (no API use)
  // onSearchInputChange($event: any) {
  //   if (localStorage.getItem('data') == null || localStorage.getItem('data') == undefined) {
  //     this.myservice.searchRecord($event.target.value).pipe(debounceTime(1000)).subscribe((res) => { this.datasource = res?.users })
  //   }
  //   else {
  //     if($event.target.value!=''){
  //       let searchtxt=$event.target.value.toLowerCase();
  //     this.datasource = this.datasource.filter((i) => i.firstName.toLowerCase().includes(searchtxt));
  //     }
  //     else{
  //       this.datasource=JSON.parse(localStorage.getItem('data'));
  //     }

  // 
  //getting data from addpatient component
  getListdata(event: any) {
    let listdata = event.list;
    let isEdit = event.iseditmode;
    this.datasource = [...listdata];
    this.isEditMode = isEdit;
  }
  logout() {
    localStorage.removeItem('currentUser');
    window.location.reload();
  }
}

