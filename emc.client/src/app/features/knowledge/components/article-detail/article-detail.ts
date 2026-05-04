// src/app/features/knowledge/components/article-detail/article-detail.ts
import {
  Component, ChangeDetectionStrategy, inject,
  input, output,
} from '@angular/core';
import { CommonModule }       from '@angular/common';
import { MockDataService, KnowledgeArticle } from '../../../../core/mock/mock-data.service';
import { Pill }               from '../../../../shared/ui/pill/pill';
import { Button }             from '../../../../shared/ui/button/button';
import { FormatDatePipe }     from '../../../../shared/pipes/format-date.pipe';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [CommonModule, Pill, Button, FormatDatePipe],
  templateUrl: './article-detail.html',
  styleUrl: './article-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleDetail {
  private readonly data = inject(MockDataService);

  article = input.required<KnowledgeArticle>();
  back    = output<void>();

  protected subjectTitle(id: string): string {
    return this.data.subjects.find(s => s.id === id)?.title ?? '—';
  }
}