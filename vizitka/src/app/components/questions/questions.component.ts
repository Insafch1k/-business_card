import {
  Component,
  AfterViewChecked,
  ElementRef,
  ViewChildren,
  QueryList,
} from '@angular/core';

interface QuestionItem {
  question: string;
  answer: string;
  isExpanded: boolean;
  isAnimating: boolean;
}

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss'],
})
export class QuestionsComponent implements AfterViewChecked {
  @ViewChildren('questionItem') questionItems!: QueryList<ElementRef>;

  questions: QuestionItem[] = [
    {
      question: 'Кто мы и чем занимаемся?',
      answer: 'C++, Pascal, Кумир',
      isExpanded: false,
      isAnimating: false,
    },
    {
      question: 'Какой у нас стэк?',
      answer:
        'Figma, HTML, CSS, JavaScript/TypeScript, Angular, MySQL, PostgresSQL, Flask, Python, Flutter, NumPy, Pandas, FastApi, Git',
      isExpanded: false,
      isAnimating: false,
    },
    {
      question: 'Сколько времени уходит на выполнение заказа?',
      answer: 'Зависит от сложности',
      isExpanded: false,
      isAnimating: false,
    },
    {
      question: 'Поддерживается ли проект после его старта?',
      answer: 'Да.',
      isExpanded: false,
      isAnimating: false,
    },
  ];

  toggleQuestion(index: number): void {
    if (this.questions[index].isAnimating) {
      return;
    }

    this.questions[index].isAnimating = true;
    this.questions[index].isExpanded = !this.questions[index].isExpanded;

    setTimeout(() => {
      this.questions[index].isAnimating = false;
      this.updateRowHeights();
    }, 700);
  }

  ngAfterViewChecked(): void {
    this.updateRowHeights();
  }

  private updateRowHeights(): void {
    const items = this.questionItems.toArray();

    const isSingleColumn = window.innerWidth <= 480;

    if (isSingleColumn) {
      items.forEach((item, index) => {
        const questionItem = item.nativeElement;
        const answerWrapper = questionItem.querySelector('.answer-wrapper');
        if (answerWrapper && this.questions[index].isExpanded) {
          answerWrapper.style.maxHeight = 'none';
          questionItem.style.height = 'auto';
          const answerHeight = answerWrapper.scrollHeight;
          const itemHeight = questionItem.scrollHeight;
          answerWrapper.style.maxHeight = '';
          questionItem.style.height = '';
          answerWrapper.style.setProperty('--max-height', `${answerHeight}px`);
          questionItem.style.setProperty('--item-height', `${itemHeight}px`);
        } else if (answerWrapper) {
          answerWrapper.style.removeProperty('--max-height');
          questionItem.style.removeProperty('--item-height');
        }
      });
    } else {
      const rows: ElementRef[][] = [
        [items[0], items[1]],
        [items[2], items[3]],
      ];

      rows.forEach((row) => {
        const expandedItems = row.filter(
          (_, i) => this.questions[row.indexOf(row[i])].isExpanded
        );

        if (expandedItems.length > 0) {
          let maxHeight = 0;
          let maxItemHeight = 0;

          expandedItems.forEach((item) => {
            const questionItem = item.nativeElement;
            const answerWrapper = questionItem.querySelector('.answer-wrapper');
            if (answerWrapper) {
              answerWrapper.style.maxHeight = 'none';
              questionItem.style.height = 'auto';
              const answerHeight = answerWrapper.scrollHeight;
              const itemHeight = questionItem.scrollHeight;
              maxHeight = Math.max(maxHeight, answerHeight);
              maxItemHeight = Math.max(maxItemHeight, itemHeight);
              answerWrapper.style.maxHeight = '';
              questionItem.style.height = '';
            }
          });

          expandedItems.forEach((item) => {
            const questionItem = item.nativeElement;
            const answerWrapper = questionItem.querySelector('.answer-wrapper');
            if (answerWrapper && answerWrapper.classList.contains('visible')) {
              answerWrapper.style.setProperty('--max-height', `${maxHeight}px`);
              questionItem.style.setProperty(
                '--item-height',
                `${maxItemHeight}px`
              );
            }
          });
        } else {
          row.forEach((item) => {
            const questionItem = item.nativeElement;
            const answerWrapper = questionItem.querySelector('.answer-wrapper');
            if (answerWrapper) {
              answerWrapper.style.removeProperty('--max-height');
              questionItem.style.removeProperty('--item-height');
            }
          });
        }
      });
    }
  }
}
