import {
  Component,
  AfterViewChecked,
  ElementRef,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { CommonModule } from '@angular/common';

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
  standalone: true,
  imports: [CommonModule],
})
export class QuestionsComponent implements AfterViewChecked {
  @ViewChildren('questionItem') questionItems!: QueryList<ElementRef>;

  questions: QuestionItem[] = [
    {
      question: 'Кто мы и чем занимаемся?',
      answer:
        'Мы — Zilant Team, команда IT-специалистов, специализирующаяся на разработке на заказ: создании сайтов, мобильных приложений, веб-приложений, CRM-систем и Telegram-ботов различной сложности.',
      isExpanded: false,
      isAnimating: false,
    },
    {
      question: 'Какие технологии вы используете в разработке?',
      answer:
        'Наш стек охватывает все этапы разработки:\n\n' +
        'Дизайн: Figma\n' +
        'Фронтенд: HTML, CSS, JavaScript/TypeScript, Angular\n' +
        'Бэкенд: Python, Flask, FastAPI\n' +
        'Базы данных: MySQL, PostgreSQL\n' +
        'Мобильная разработка: Flutter\n' +
        'Data Science (при необходимости): NumPy, Pandas\n' +
        'Системы контроля версий: Git',
      isExpanded: false,
      isAnimating: false,
    },
    {
      question: 'Сколько времени занимает разработка проекта на заказ?',
      answer:
        'Сроки выполнения заказа на разработку зависят от сложности проекта. Простые решения могут быть готовы за несколько недель, комплексные проекты - за несколько месяцев. В среднем, многие проекты мы реализуем до 1 месяца.',
      isExpanded: false,
      isAnimating: false,
    },
    {
      question: 'Предоставляете ли вы поддержку после запуска проекта?',
      answer:
        'Да, мы предлагаем техническую поддержку и доработку проектов после разработки. Условия и стоимость поддержки обсуждаются индивидуально.',
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
    }, 400);
  }

  ngAfterViewChecked(): void {
    this.updateRowHeights();
  }

  private updateRowHeights(): void {
    const items = this.questionItems.toArray();
    if (!items.length) return;

    const isSingleColumn = window.innerWidth <= 480;

    if (isSingleColumn) {
      items.forEach((item, index) => {
        const questionItem = item.nativeElement;
        const answerWrapper = questionItem.querySelector('.answer-wrapper');

        if (answerWrapper) {
          if (this.questions[index].isExpanded) {
            answerWrapper.style.maxHeight = 'none';
            questionItem.style.height = 'auto';
            const itemHeight = questionItem.scrollHeight;
            const answerHeight = answerWrapper.scrollHeight;

            questionItem.style.setProperty('--item-height', `${itemHeight}px`);
            answerWrapper.style.setProperty(
              '--max-height',
              `${answerHeight}px`
            );
            questionItem.classList.add('expanded');

            answerWrapper.style.maxHeight = '';
            questionItem.style.height = '';
          } else {
            questionItem.style.removeProperty('--item-height');
            answerWrapper.style.removeProperty('--max-height');
            questionItem.classList.remove('expanded');
          }
        }
      });
    } else {
      const itemsPerRow = 2;
      for (let i = 0; i < items.length; i += itemsPerRow) {
        let maxItemHeight = 0;
        let maxAnswerHeight = 0;

        for (let j = i; j < i + itemsPerRow && j < items.length; j++) {
          const questionItem = items[j].nativeElement;
          const answerWrapper = questionItem.querySelector('.answer-wrapper');

          if (answerWrapper && this.questions[j].isExpanded) {
            answerWrapper.style.maxHeight = 'none';
            questionItem.style.height = 'auto';
            const itemHeight = questionItem.scrollHeight;
            const answerHeight = answerWrapper.scrollHeight;

            maxItemHeight = Math.max(maxItemHeight, itemHeight);
            maxAnswerHeight = Math.max(maxAnswerHeight, answerHeight);

            answerWrapper.style.maxHeight = '';
            questionItem.style.height = '';
          }
        }

        for (let j = i; j < i + itemsPerRow && j < items.length; j++) {
          const questionItem = items[j].nativeElement;
          const answerWrapper = questionItem.querySelector('.answer-wrapper');

          if (answerWrapper) {
            if (this.questions[j].isExpanded) {
              questionItem.style.setProperty(
                '--item-height',
                `${maxItemHeight}px`
              );
              answerWrapper.style.setProperty(
                '--max-height',
                `${maxAnswerHeight}px`
              );
              questionItem.classList.add('expanded');
            } else {
              questionItem.style.removeProperty('--item-height');
              answerWrapper.style.removeProperty('--max-height');
              questionItem.classList.remove('expanded');
            }
          }
        }
      }
    }
  }
}
