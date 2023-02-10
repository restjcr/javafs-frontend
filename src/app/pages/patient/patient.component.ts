import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Patient } from 'src/app/model/patient';
import { PatientService } from 'src/app/service/patient.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit{
  
  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'dni', 'actions'];
  dataSource: MatTableDataSource<Patient>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private patientService: PatientService
    ){

  }

  ngOnInit(): void {

    //RECUPERAR LOS DATOS DE LA VARIABLE REACTIVA
    //SE INVOCA SOLO CUANDO SE DETECTA UN NEXT
    this.patientService.patientChange.subscribe(data => {
      this.createTable(data);
    });

    this.patientService.findAll().subscribe(data => {
      this.createTable(data);
    });    
  }

  applyFilter(e: any){
    this.dataSource.filter = e.target.value.trim();    
  }

  createTable(data: Patient[]){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


}
