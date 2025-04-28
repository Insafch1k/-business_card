import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

interface QuestionItem {
  question: string;
  answer: string;
  isExpanded: boolean;
}

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss'],
})
export class QuestionsComponent {
  questions: QuestionItem[] = [
    {
      question: 'Какой у нас стек?',
      answer: 'C++, Pascal, Кумир',
      isExpanded: false,
    },
    {
      question: 'Сколько стоит наш час?',
      answer: '1500 час, продлить 1000',
      isExpanded: false,
    },
    {
      question: 'Сколько человек в нашей команде?',
      answer: '3',
      isExpanded: false,
    },
    {
      question: 'Где мы находимся?',
      answer:
        'там где ну примерно плюс минус ну типо около это ну той которая вот ну ты понял кароче там где ещё этот был ну как его забыл кроче там где обычно вот это вот всё это самое ну в общем ты понял',
      isExpanded: false,
    },
  ];

  toggleQuestion(index: number): void {
    this.questions[index].isExpanded = !this.questions[index].isExpanded;
  }
}
