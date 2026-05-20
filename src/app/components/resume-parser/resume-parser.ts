import {Component} from '@angular/core';
import {ResumeParserService} from '../../services/resume-parser.service';
import {FormsModule} from '@angular/forms';
import {MarkdownComponent} from 'ngx-markdown';

@Component({
  selector: 'app-resume-parser',
  imports: [
    FormsModule,
    MarkdownComponent
  ],
  templateUrl: './resume-parser.html',
  styleUrl: './resume-parser.css',
})
export class ResumeParser {
  selectedFile: File | null = null;
  jobDescription: string = '';
  result: string = '';
  loading: boolean = false;

  constructor(
    private _resumeParserService: ResumeParserService,
  ) {
  }

  // File select (PDF only)
  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file && file.type !== 'application/pdf') {
      alert('Only PDF files are allowed');
      return;
    }

    this.selectedFile = file;
  }

  // API call
  analyzeResume() {
    if (!this.selectedFile || !this.jobDescription) return;

    this.loading = true;
    this.result = '';

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('job_description', this.jobDescription);

    this._resumeParserService.post(formData)
      .subscribe({
        next: (res: any) => {
          this.result = res;
          this.loading = false;
        },
        error: () => {
          alert('Error analyzing resume');
          this.loading = false;
          this.result = '';
        }
      });
  }
}
