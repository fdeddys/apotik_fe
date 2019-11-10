import { Component, OnDestroy } from '@angular/core';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

@Component({
  selector: 'op-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {

  title = 'secpage';
  private sub: any;

  constructor(private slimLoader: SlimLoadingBarService, private router: Router) {
      // Listen the navigation events to start or complete the slim bar loading
      this.sub = this.router.events.subscribe(event => {
          if (event instanceof NavigationStart) {
              this.slimLoader.start();
          } else if (event instanceof NavigationEnd ||
              event instanceof NavigationCancel ||
              event instanceof NavigationError) {
              this.slimLoader.complete();
          }
      }, (error: any) => {
          this.slimLoader.complete();
      });
  }

  ngOnDestroy(): any {
      this.sub.unsubscribe();
  }

}
