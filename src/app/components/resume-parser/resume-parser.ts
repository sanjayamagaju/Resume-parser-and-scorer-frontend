import { Component } from '@angular/core';
import { ResumeParserService } from '../../services/resume-parser.service';
import { FormsModule } from '@angular/forms';
import { MarkdownComponent } from 'ngx-markdown';

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
  isDragging: boolean = false;
  matchScore: number | null = null;

  constructor(
    private _resumeParserService: ResumeParserService,
  ) {}

  // File select (PDF only)
  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file && file.type !== 'application/pdf') {
      alert('Only PDF files are allowed');
      return;
    }

    this.selectedFile = file;
  }

  // Drag-and-drop
  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;

    const file = event.dataTransfer?.files?.[0];

    if (!file) return;

    if (file.type !== 'application/pdf') {
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
    this.matchScore = null;

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('job_description', this.jobDescription);

    this._resumeParserService.post(formData)
      .subscribe({
        next: (res: any) => {
          this.result = res;
          this.matchScore = this.parseMatchScore(res);
          this.loading = false;
        },
        error: () => {
          alert('Error analyzing resume');
          this.loading = false;
          this.result = '';
          this.matchScore = null;
        }
      });
  }

  // Parse match score (e.g. "85%", "Match Score: 72", "Score: 91%")
  private parseMatchScore(text: string): number | null {
    const match = text.match(/(?:match\s*score[:\s]*|score[:\s]*)(\d{1,3})\s*%?/i)
      ?? text.match(/(\d{1,3})\s*%/);
    if (!match) return null;
    const score = parseInt(match[1], 10);
    return score >= 0 && score <= 100 ? score : null;
  }

  get scoreLabel(): string {
    if (this.matchScore === null) return '';
    if (this.matchScore >= 80) return 'Strong Match';
    if (this.matchScore >= 60) return 'Moderate Match';
    if (this.matchScore >= 40) return 'Weak Match';
    return 'Poor Match';
  }

  get scoreClass(): string {
    if (this.matchScore === null) return '';
    if (this.matchScore >= 80) return 'rp-score--high';
    if (this.matchScore >= 60) return 'rp-score--mid';
    if (this.matchScore >= 40) return 'rp-score--low';
    return 'rp-score--poor';
  }
}
