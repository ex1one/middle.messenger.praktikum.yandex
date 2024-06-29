import { expect } from 'chai';
import sinon from 'sinon';

import Block from '../block';

interface Props {
  text?: string;
  events?: Record<string, () => void>;
}

describe('Block', () => {
  let PageClass: typeof Block;

  beforeEach(() => {
    class Page extends Block<Props> {
      constructor(props?: Props) {
        super(props);
      }

      protected render(): string {
        return `<div>
								<span id="test-text">{{text}}</span>
						</div>`;
      }
    }

    PageClass = Page as typeof Block;
  });

  it('Must create a component with a state from the constructor', () => {
    const text = 'Hello';
    const pageComponent = new PageClass({ text });

    const spanText =
      pageComponent.element?.querySelector('#test-text')?.innerHTML;

    expect(spanText).to.be.eq(text);
  });

  it('component should set events on the element', () => {
    const handlerStub = sinon.stub();
    const pageComponent = new PageClass({
      events: {
        click: handlerStub,
      },
    });

    const event = new MouseEvent('click');
    pageComponent.element?.dispatchEvent(event);

    expect(handlerStub.calledOnce).to.be.true;
  });

  it('component should be render because different props', () => {
    const text = 'new value';
    const pageComponent = new PageClass({ text: 'Hello' });

    pageComponent.setProps({ text });
    const spanText =
      pageComponent.element?.querySelector('#test-text')?.innerHTML;

    expect(spanText).to.be.eq(text);
  });

  it('should not render because of the same props', () => {
    const text = 'Hello';
    const pageComponent = new PageClass({ text });

    pageComponent.setProps({ text });
    const spanText =
      pageComponent.element?.querySelector('#test-text')?.innerHTML;

    expect(spanText).to.be.eq(text);
  });

  it('component should be render because different state', () => {
    const text = 'new value';
    const pageComponent = new PageClass({ text: 'Hello' });

    pageComponent.setState({ text });
    const spanText =
      pageComponent.element?.querySelector('#test-text')?.innerHTML;

    expect(spanText).to.be.eq(text);
  });

  it('should not render because of the same state', () => {
    const text = 'Hello';
    const pageComponent = new PageClass({}, { text });

    pageComponent.setState({ text });
    const spanText =
      pageComponent.element?.querySelector('#test-text')?.innerHTML;

    expect(spanText).to.be.eq(text);
  });

  it('should show the element', () => {
    const el = document.createElement('div');
    const pageComponent = new PageClass();
    const getContentStub = sinon.stub(pageComponent, 'getContent').returns(el);
    pageComponent.show();
    expect(el.style.display).to.equal('block');
    getContentStub.restore();
  });

  it('should hide the element', () => {
    const el = document.createElement('div');
    const pageComponent = new PageClass();
    const getContentStub = sinon.stub(pageComponent, 'getContent').returns(el);
    pageComponent.hide();
    expect(el.style.display).to.equal('none');
    getContentStub.restore();
  });
});
