// src/app/features/knowledge/knowledge.ts
import {
  Component, ChangeDetectionStrategy, inject,
  signal, computed,
} from '@angular/core';
import { CommonModule }       from '@angular/common';
import { MockDataService, KnowledgeArticle } from '../../core/mock/mock-data.service';
import { ArticleList }        from './components/article-list/article-list';
import { ArticleDetail }      from './components/article-detail/article-detail';
import { Pill,SectionHeader } from '@shared';

@Component({
  selector: 'app-knowledge',
  standalone: true,
  imports: [CommonModule, ArticleList, ArticleDetail, SectionHeader, Pill],
  templateUrl: './knowledge.html',
  styleUrl: './knowledge.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Knowledge {
  private readonly data = inject(MockDataService);

  protected readonly search        = signal('');
  protected readonly activeSubject = signal('all');
  protected readonly openArticleId = signal<string | null>(null);

  private readonly today = new Date();

  // Only show public, non-expired articles
  private readonly visible = computed(() =>
    this.data.knowledgeArticles.filter(
      a => !a.internal &&
           new Date(a.publishOn) <= this.today &&
           new Date(a.expirationDate) >= this.today
    )
  );

  protected readonly filtered = computed(() => {
    const q   = this.search().toLowerCase().trim();
    const sub = this.activeSubject();
    return [...this.visible()]
      .filter(a => sub === 'all' || a.subjectId === sub)
      .filter(a => !q || (a.title + ' ' + a.keywords.join(' ')).toLowerCase().includes(q))
      .sort((a, b) => new Date(b.publishOn).getTime() - new Date(a.publishOn).getTime());
  });

  protected readonly openArticle = computed(() =>
    this.openArticleId()
      ? this.visible().find(a => a.id === this.openArticleId()) ?? null
      : null
  );

  protected readonly subjects       = this.data.subjects;
  protected readonly visibleCount   = computed(() => this.visible().length);

  protected countBySubject(id: string): number {
    return this.visible().filter(a => a.subjectId === id).length;
  }

  protected readonly quickSearches = ['settlement', 'ntp drift', 'sso', 'webhook', 's3 export'];
}