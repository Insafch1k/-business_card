import { Component } from '@angular/core';

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
export class QuestionsComponent {
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
        'Figma, HTML, CSS, JavaScript/TypeScript, Angular, MySQL, PostgresSQL, Flask, Python, Flutter, NumPy,  Pandas, FastApi,Git',
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
    }, 600);
  }
}
