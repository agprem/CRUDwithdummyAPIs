import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MyserviceService } from 'src/app/myservice.service';

@Component({
  selector: 'app-addpatient',
  templateUrl: './addpatient.component.html',
  styleUrls: ['./addpatient.component.css']
})
export class AddpatientComponent {
  @Input() isEditMode;
  @Input() formdata;
  @Output() listData = new EventEmitter();
  iseditmode: boolean;
  data: any = "";
  edited: any = "any";
  addform: FormGroup
  list: any = [];
  MAILFORMAT = /^\s*([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,8})\s*$/;

  ngOnChanges(changes: SimpleChanges) {
    this.iseditmode = changes['isEditMode']?.currentValue;
    this.data = changes['formdata']?.currentValue;
    // console.log("inside onchange", changes, this.iseditmode, this.data);
    this.addform = this.fb.group({
      firstName: ["", [Validators.minLength(2), Validators.maxLength(20)]],
      lastName: ["", [Validators.minLength(2), Validators.maxLength(20)]],
      email: ["", [Validators.required, Validators.pattern(this.MAILFORMAT)]],
      phone: this.fb.array([this.fb.group({
        phone: ["", [Validators.required]],
      })]),
      address: this.fb.group({
        address: ['', [Validators.required]],
        address2: ['', []],
        city: [''],
        state: ["", [Validators.required]],
        postalCode: ["", [Validators.required]],
      }),
    })
    this.patchForm();
  }

  constructor(private fb: FormBuilder, private myservice: MyserviceService) { }

  ngOnInit(): void {
   // this.getall();
  }
  patchForm() {
    //patching Form in Edit Mode
    if (this.iseditmode == true || this.data != "" || this.data != undefined || this.data != null) {
      this.addform.patchValue({ firstName: this.data?.firstName, lastName: this.data?.lastName, email: this.data?.email })
      this.addform.controls['address'].patchValue({ address: this.data?.address?.address, state: this.data?.address?.state, city: this.data?.address?.city, postalCode: this.data?.address?.postalCode })
      let phonearray = <FormArray>this.addform?.controls['phone'];
      if (Array.isArray(this.data?.phone)) {
        phonearray.controls[0]['controls'].phone.patchValue(this.data?.phone[0]?.phone)
      }
      else {
        phonearray.controls[0]['controls'].phone.patchValue(this.data?.phone)
      }
    }
  }
  //for getting all record
  getall() {
    this.myservice.getAll().subscribe((res) => { this.list = res?.users; });
    //for removing update and add message
   
  }

  //Form Array for Phone
  getPhone() {
    return this.addform.get('phone') as FormArray
  }

  addPhone(event) {
    this.getPhone().push(this.newPhone());
  }
  //when clicked on remove Phone
  removePhone(i: any) {
    this.getPhone().removeAt(i)
  }
  //when clicked on add Phone
  newPhone() {
    return this.fb.group({
      phone: ["", [Validators.required]],
    })
  }
  
  //after clicking on add record
  addRecord() {
    console.log(this.addform)
    this.addform.markAllAsTouched();
    if (this.addform.valid) {
      this.myservice.addRecord(this.addform.value).subscribe((res) => { this.list.unshift(res); this.list = [...this.list]; this.emitList(); })
      //for removing update and add message
      this.edited = false;
      this.resetForm();
    }
  }

  //after clicking on edit record
  updateRecord(updateform: any) {
    this.addform.markAllAsTouched();
    if (updateform.valid) {
      this.myservice.editRecord(this.data.id, updateform.value).subscribe((res) => {
        this.list.splice(this.list.findIndex((item: any) => item.id == this.data.id), 1, res); this.list = [...this.list];
        console.log("After edit", this.list); this.emitList();
      })
        ;
      //for removing update and add message
      this.edited = true;
      this.resetForm();

    }
  }
  //when reset clicked
  resetForm() {
    this.addform.reset();
    this.iseditmode = false;
    //for removing record updated or added message
    this.edited = 'any';
  }
  //when data is emitted to home component
  emitList() {
    this.iseditmode == undefined ? this.iseditmode = false : this.iseditmode;
    this.listData.emit({ list: this.list, iseditmode: this.iseditmode })
  }

}


