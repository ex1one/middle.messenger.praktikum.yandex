import { expect } from 'chai';
import sinon from 'sinon';
import { Block } from '../../core';

import { Route, Router } from '..';

describe('Route', () => {
  let route: Route;

  beforeEach(() => {
    route = new Route('/test', Block, {
      rootQuery: '#root',
    });
  });

  it('should match pathname correctly', () => {
    expect(route.match('/test')).to.be.true;
    expect(route.match('/other')).to.be.false;
  });

  it('should navigate to a new pathname and render', () => {
    route.navigate('/test');
    expect(route.match('/test')).to.be.true;
  });

  it('should leave and remove the block', () => {
    route.leave();
    expect(route.getBlock()).to.be.null;
  });
});

describe('Router', () => {
  let router: Router | null;

  beforeEach(() => {
    router = new Router('#app');
  });

  afterEach(() => {
    router = null;
  });

  it('should add a route correctly', () => {
    if (router) {
      router.use('/test', Block).use('/second-test', Block);
      expect(router.routes.length).to.equal(2);
    }
  });

  it('should get correct route for a given pathname', () => {
    if (router) {
      router.use('/test', Block);
      const route = router.getRoute('/test');
      expect(route).to.not.be.undefined;
    }
  });

  it('should navigate back in history', () => {
    if (router) {
      const historyBackStub = sinon.stub(router.history, 'back');
      router.back();
      expect(historyBackStub.called).to.be.true;
      historyBackStub.restore();
    }
  });

  it('should navigate forward in history', () => {
    if (router) {
      const historyForwardStub = sinon.stub(router.history, 'forward');
      router.forward();
      expect(historyForwardStub.called).to.be.true;
      historyForwardStub.restore();
    }
  });

  it('should navigate to a new route', () => {
    if (router) {
      const historyPushStateStub = sinon.stub(router.history, 'pushState');
      router.go('/new-route');
      expect(historyPushStateStub.called).to.be.true;
      expect(historyPushStateStub.args[0][2]).to.equal('/new-route');
      historyPushStateStub.restore();
    }
  });
});
