import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Patient } from 'src/app/model/patient';
import { PatientService } from 'src/app/service/patient.service';

@Component({
  selector: 'app-patient-edit',
  templateUrl: './patient-edit.component.html',
  styleUrls: ['./patient-edit.component.css']
})
export class PatientEditComponent implements OnInit{
  
  id: number;
  isEdit: boolean;
  form: FormGroup;

  constructor(
    private patientService: PatientService,
    private route: ActivatedRoute,
    private router: Router
  ){    
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      idPatient: new FormControl(0),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      dni: new FormControl(''),
      address: new FormControl(''),
      phone: new FormControl(''),
      email: new FormControl(''),
    });

    this.route.params.subscribe( data => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    });
  }

  initForm(){
    if(this.isEdit){
      this.patientService.findById(this.id).subscribe(data => {

        this.form = new FormGroup({
          idPatient: new FormControl(data.idPatient),
          firstName: new FormControl(data.firstName),
          lastName: new FormControl(data.lastName),
          dni: new FormControl(data.dni),
          address: new FormControl(data.address),
          phone: new FormControl(data.phone),
          email: new FormControl(data.email),
        });

      });
    }
  }

  operate(){
    const patient = new Patient();
    patient.idPatient = this.form.value['idPatient'];
    patient.firstName = this.form.value['firstName'];
    patient.lastName = this.form.value['lastName'];
    patient.dni = this.form.value['dni'];
    patient.address = this.form.value['address'];
    patient.phone = this.form.value['phone'];
    patient.email = this.form.value['email'];

    //Para Interface
    /*const patient: Patient = {
      idPatient: this.form.value['idPatient'],
      firstName: this.form.value['firstName'],
      lastName: this.form.value['lastName'],
      dni: this.form.value['dni'],
      address: this.form.value['address'],
      phone: this.form.value['phone'],
      email: this.form.value['email'],
    }*/

    if(this.isEdit){
      //UPDATE
      //PRACTICA COMUN, PERO NO RECOMENDADA
      this.patientService.update(patient).subscribe(data => {
        this.patientService.findAll().subscribe(data => {
          //NEXT: ALMACENA LA DATA EN LA VARIABLE
          this.patientService.patientChange.next(data);
        });
      });
    }else{
      //INSERT
      //PRACTICA IDEAL
      this.patientService.save(patient).pipe(switchMap( ()=> {
        return this.patientService.findAll();
      }))
      .subscribe(data => {
        this.patientService.patientChange.next(data);
      });
    }

    this.router.navigate(['/pages/patient']);

  }
  
}
