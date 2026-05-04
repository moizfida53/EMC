// src/app/features/knowledge/components/article-list/article-list.ts
import {
  Component, ChangeDetectionStrategy, inject,
  input, output,
} from '@angular/core';
import { CommonModule }      from '@angular/common';
import { MockDataService, KnowledgeArticle } from '../../../../core/mock/mock-data.service';
import { Pill }              from '../../../../shared/ui/pill/pill';
import { FormatDatePipe }    from '../../../../shared/pipes/format-date.pipe';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [CommonModule, Pill, FormatDatePipe],
  templateUrl: './article-list.html',
  styleUrl: './article-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleList {
  private readonly data = inject(MockDataService);

  articles    = input.required<KnowledgeArticle[]>();
  articleOpen = output<string>(); // emits article id

  protected subjectTitle(id: string): string {
    return this.data.subjects.find(s => s.id === id)?.title ?? '—';
  }

  protected snippet(html: string): string {
    return html.replace(/<[^>]+>/g, ' ').slice(0, 200).trim();
  }
}