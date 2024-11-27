import { AsyncPipe, JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { interval, switchMap } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [JsonPipe, AsyncPipe],
  template: `
    <h1>RxResource (doesn't refresh)</h1>
    <pre>{{ todoR.value() | json }}</pre>
    <h1>Observable with async pipe (refreshes data)</h1>
    <pre>{{ todoObs$ | async | json }}</pre>
  `,
})
export class AppComponent {
  #http = inject(HttpClient);

  todoObs$ = this.fetchTodo$();

  todoR = rxResource({
    loader: () => this.fetchTodo$()
  });

  fetchTodo$() {
    return interval(2000) // 2 sec
      .pipe(
        switchMap(() =>
          this.#http.get(
            'https://jsonplaceholder.typicode.com/todos/' +
              Math.floor(Math.random() * 100)
          )
        )
      );
  }
}
