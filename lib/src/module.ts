import { Injectable, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { RestangularHandler } from './handler';
import { RestangularInterceptingHandler } from './intercepting-handler';
import { Restangular } from './restangular';
import { DefaultRestangularConfig, RestangularConfig } from './config';
import { RestangularClient } from './client';
import { RestangularBuilder } from './builder';

@Injectable()
export class InitialRestangular {

  constructor(private handler: RestangularHandler) {
  }

  one(routeOrId, id?) {
    let route = routeOrId;
    if (typeof id === 'undefined') {
      id = routeOrId;
      route = undefined;
    }
    const builder = new RestangularBuilder({id, route, isCollection: false});
    return new RestangularClient(builder, this.handler);
  }

  all(route) {
    const builder = new RestangularBuilder({route, isCollection: true});
    return new RestangularClient(builder, this.handler);
  }

  extendConfig(options: any) {
    const handler = this.handler.extendConfig(options);
    return new InitialRestangular(handler);
  }

  withConfig(options: any) {
    const handler = this.handler.withConfig(options);
    return new InitialRestangular(handler);
  }
}

@NgModule({
  imports: [
    HttpClientModule
  ],
  providers: [
    {provide: RestangularConfig, useValue: DefaultRestangularConfig},
    {provide: Restangular, useClass: InitialRestangular},
    {provide: RestangularHandler, useClass: RestangularInterceptingHandler},
  ],
})
export class RestangularModule {

  static config(config: any) {
    let configProvider;
    switch (typeof config) {
      case 'object': {
        configProvider = {provide: RestangularConfig, useValue: config};
        break;
      }
      case 'function': {
        configProvider = {provide: RestangularConfig, useClass: config};
        break;
      }
    }
    return {
      ngModule: RestangularModule,
      providers: [
        configProvider,
      ]
    };
  }
}
