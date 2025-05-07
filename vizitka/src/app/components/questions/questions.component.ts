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
      answer:
        'Мы — Zilant Team, команда IT-специалистов, разрабатывающая проекты на заказ: cайты, CRM-системы, телеграм-боты, мобильные приложения, веб-приложения и др.',
      isExpanded: false,
      isAnimating: false,
    },
    {
      question: 'Какой у нас стэк?',
      answer:
        'Figma, HTML, CSS, JavaScript/TypeScript, Angular, MySQL, PostgreSQL, Flask, Python, Flutter, NumPy, Pandas, FastAPI, Git.',
      isExpanded: false,
      isAnimating: false,
    },
    {
      question: 'Сколько времени уходит на выполнение заказа?',
      answer: 'До 1 месяца в зависимости от сложности заказа.',
      isExpanded: false,
      isAnimating: false,
    },
    {
      question: 'Поддерживается ли проект после разработки?',
      answer: 'Да, но за отдельную плату.',
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
    if (!items.length) return;

    let maxItemHeight = 0;
    let maxAnswerHeight = 0;

    const firstItem = items[0].nativeElement;
    const firstAnswerWrapper = firstItem.querySelector('.answer-wrapper');
    if (firstAnswerWrapper) {
      firstAnswerWrapper.style.maxHeight = 'none';
      firstItem.style.height = 'auto';
      maxAnswerHeight = firstAnswerWrapper.scrollHeight;
      maxItemHeight = firstItem.scrollHeight;
      firstAnswerWrapper.style.maxHeight = '';
      firstItem.style.height = '';
    }

    items.forEach((item, index) => {
      const questionItem = item.nativeElement;
      const answerWrapper = questionItem.querySelector('.answer-wrapper');

      if (answerWrapper) {
        if (this.questions[index].isExpanded) {
          questionItem.style.setProperty(
            '--max-item-height',
            `${maxItemHeight}px`
          );
          answerWrapper.style.setProperty(
            '--max-height',
            `${maxAnswerHeight}px`
          );
          questionItem.classList.add('expanded');
        } else {
          questionItem.style.removeProperty('--max-item-height');
          answerWrapper.style.removeProperty('--max-height');
          questionItem.classList.remove('expanded');
        }
      }
    });
  }
}
