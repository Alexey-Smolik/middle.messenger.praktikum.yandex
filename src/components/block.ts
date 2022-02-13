import { EventBus } from './event-bus';
import { v4 as makeUUID } from 'uuid';
import * as pug from 'pug';

// eslint-disable-next-line @typescript-eslint/no-var-requires
// const pug = require('pug');

export interface Event {
  elementId: string,
  eventName: string,
  callBack: () => void
}

export class Block<TProps> {
  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_CDU: 'flow:component-did-update',
    FLOW_RENDER: 'flow:render'
  };

  _element: HTMLElement;
  _meta;
  props: TProps;
  children;
  eventBus = new EventBus();
  _id = '';

  constructor(tagName = 'div', propsAndChildren: TProps) {
    const { props, children } = this._getChildren(propsAndChildren);

    this._id = makeUUID();
    this.props = this._makePropsProxy({...props, __id: this._id});
    this.children = children;
    this._meta = {
      tagName,
      ...(this.props?.classForRoot ? { class: this.props.classForRoot } : { })
    };
    this._registerEvents(this.eventBus);
    this.eventBus.emit(Block.EVENTS.INIT);
  }

  _getChildren(propsAndChildren: TProps) {
    const children = {};
    const props = {};

    Object.entries(propsAndChildren).forEach(([key, value]) => {
      if (Array.isArray(value) && value[0] instanceof Block) {
        children[key] = value;
      } else {
        props[key] = value;
      }
    });

    return { children, props };
  }

  setProps(newProps: TProps) {
    if (!newProps) {
      return;
    }

    Object.assign(this.props, newProps);
  }

  _registerEvents(eventBus: EventBus) {
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  _createResources() {
    this._element = this._createDocumentElement(this._meta.tagName);
  }

  init() {
    this._createResources();
    this.eventBus.emit(Block.EVENTS.FLOW_RENDER);
  }

  _componentDidMount() {
    this.componentDidMount();
    Object.values(this.children).forEach(child => {
      child.forEach(el => el.dispatchComponentDidMount());
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  componentDidMount() { }

  dispatchComponentDidMount() {
    this.eventBus.emit(Block.EVENTS.FLOW_CDM);
  }

  _componentDidUpdate(oldProps: TProps, newProps: TProps) {
    if (!this.componentDidUpdate(oldProps, newProps)) {
      return;
    }

    this.eventBus.emit(Block.EVENTS.FLOW_RENDER);
  }

  componentDidUpdate(oldProps: TProps, newProps: TProps) {
    return true;
  }

  get element() {
    return this._element;
  }

  _render() {
    this._removeEvents();
    this._element.innerHTML = '';
    this._element.appendChild(this.render());
    this._element.removeAttribute('data-id');

    if (this._meta.class) {
      this._element.classList.add(this._meta.class);
    }

    this._addEvents();
  }

  render() {
    return pug.compile(`${this._meta.tagName}`)({});
  }

  getContent() {
    return this.element;
  }

  _makePropsProxy(props: TProps) {
    return new Proxy(props as unknown as object, {
      set: (target, prop, value) => {
        const oldValue = { ...target };

        target[prop] = value;
        this.eventBus.emit(Block.EVENTS.FLOW_CDU, oldValue, target);

        return true;
      },
      deleteProperty() {
        throw new Error('Нет доступа');
      },
    });
  }

  _createDocumentElement(tagName: string) {
    const element = document.createElement(tagName);
    element.setAttribute('data-id', this._id);
    return element;
  }

  _addEvents() {
    const { events = { } } = this.props;

    Object.keys(events).forEach(eventName => {
      this._element.addEventListener(eventName, events[eventName]);
    });
  }


  _removeEvents() {
    const { events = { } } = this.props;

    Object.keys(events).forEach(eventName => {
      this._element.removeEventListener(eventName, events[eventName]);
    });
  }

  compile(template: string, props: TProps) {
    const propsAndStubs = {...props};

    Object.entries(this.children).forEach(([key, child]) => {
      propsAndStubs[key] = child.map(el => `<div data-id='${el._id}'></div>`);
    });

    const fragment = this._createDocumentElement('template');

    fragment.innerHTML = pug.compile(template)(propsAndStubs);

    Object.values(this.children).forEach(child => {
      child.forEach(el => {
        const stub = fragment.content.querySelector(`[data-id='${el._id}']`);

        stub.replaceWith(el.getContent());
      })
    });

    return fragment.content;
  }

  show() {
    this._element.style.display = 'block';
  }

  hide() {
    this._element.style.display = 'none';
  }
}
