// src/app/teacher/record-absences/record-absences.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ClassService } from '../../core/services/class.service';
import { AbsenceService } from '../../core/services/absence.service';
import { Student } from 'src/app/interfaces/student';


@Component({
  selector: 'app-record-absences',
  templateUrl: './record-absences.component.html',
  styleUrls: ['./record-absences.component.css']
})
export class RecordAbsencesComponent implements OnInit {
  classId: number = 0;
  className: string = '';
  absenceForm!: FormGroup;
  students: Student[] = [];
  loading = true;
  submitting = false;
  success = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private classService: ClassService,
    private absenceService: AbsenceService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.classId = id ? +id : 0;
    this.initForm();
    this.loadClassDetails();
  }

  initForm(): void {
    this.absenceForm = this.fb.group({
      date: [new Date().toISOString().substring(0, 10)],
      courseId: ['', Validators.required],
      students: this.fb.array([])
    });
  }

  get studentsArray(): FormArray {
    return this.absenceForm.get('students') as FormArray;
  }

  loadClassDetails(): void {
    this.classService.getClassDetails(this.classId).subscribe(
      (classData: any) => {
        this.className = classData.name;
        
        // Get students in the class
        this.classService.getStudentsInClass(this.classId).subscribe(
          (students: Student[]) => {
            this.students = students;
            
            // Create form controls for each student
            students.forEach((student) => {
              this.studentsArray.push(this.fb.group({
                studentId: [student.id],
                studentName: [student.name],
                isAbsent: [false],
                isJustified: [false],
                reason: ['']
              }));
            });
            
            this.loading = false;
          }
        );
      }
    );
  }

  toggleAbsence(index: number): void {
    const student = this.studentsArray.at(index);
    const isAbsent = student.get('isAbsent')?.value;
    
    // Reset justification and reason when marking as not absent
    if (!isAbsent) {
      student.get('isJustified')?.setValue(false);
      student.get('reason')?.setValue('');
    }
  }

  onSubmit(): void {
    if (this.absenceForm.invalid) {
      return;
    }

    this.submitting = true;
    this.success = false;
    this.error = '';

    // Format the data for submission
    const absentStudents = this.studentsArray.value
      .filter((s: any) => s.isAbsent)
      .map((s: any) => ({
        studentId: s.studentId,
        date: this.absenceForm.get('date')?.value,
        courseId: this.absenceForm.get('courseId')?.value,
        isJustified: s.isJustified,
        reason: s.reason
      }));

    if (absentStudents.length === 0) {
      this.submitting = false;
      this.success = true;
      return;
    }

    this.absenceService.recordAbsences(absentStudents).subscribe({
      next: () => {
        this.submitting = false;
        this.success = true;
        // Reset all students to not absent
        this.studentsArray.controls.forEach(control => {
          control.get('isAbsent')?.setValue(false);
          control.get('isJustified')?.setValue(false);
          control.get('reason')?.setValue('');
        });
      },
      error: error => {
        this.submitting = false;
        this.error = error?.error?.message || 'Une erreur est survenue';
      }
    });
  }
}