import { EventBus } from './event-bus';
import { v4 as makeUUID } from 'uuid';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pug = require('pug');

export class Block {
  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_CDU: 'flow:component-did-update',
    FLOW_RENDER: 'flow:render'
  };

  _element;
  _meta;
  props: any = {};
  children: { [key: string]: Block };
  eventBus;
  _id = null;

  constructor(tagName = 'div', propsAndChildren = {}) {
    const {props, children} = this._getChildren(propsAndChildren);

    this.props = this._makePropsProxy({...props, __id: this._id});
    this.children = children;

    const eventBus = new EventBus();

    this._meta = {tagName, ...(this.props?.classForRoot ? {class: this.props.classForRoot} : {})};
    this._id = makeUUID();
    this.eventBus = () => eventBus;
    this._registerEvents(eventBus);
    eventBus.emit(Block.EVENTS.INIT);
  }

  _getChildren(propsAndChildren) {
    const children = {};
    const props = {};

    Object.entries(propsAndChildren).forEach(([key, value]) => {
      if (value instanceof Block || Array.isArray(value) && value[0] instanceof Block) {
        children[key] = value;
      } else {
        props[key] = value;
      }
    });

    return {children, props};
  }

  setProps(newProps) {
    if (!newProps) {
      return;
    }

    this._updateProps(newProps);
  }

  _updateProps(propsAndChildren) {
    const {props, children} = this._getChildren(propsAndChildren);

    this.children = children;
    Object.assign(this.props, props);
  }

  _registerEvents(eventBus) {
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  _createResources() {
    const {tagName} = this._meta;

    this._element = this._createDocumentElement(tagName);
  }

  init() {
    this._createResources();
    this.eventBus().emit(Block.EVENTS.FLOW_CDM);
  }

  _componentDidMount() {
    Object.values(this.children).forEach(child => {
      (Array.isArray(child) ? child : [child]).forEach(el => el.dispatchComponentDidMount());
    });

    this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
  }

  dispatchComponentDidMount() {
    this.eventBus().emit(Block.EVENTS.FLOW_CDM);
  }

  _componentDidUpdate(oldProps, newProps) {
    if (!this.componentDidUpdate(oldProps, newProps)) {
      return;
    }

    this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
  }

  componentDidUpdate(oldProps, newProps) {
    // if (oldPoprs.buttonText !== newProps.buttonText) {
    //     this.children.button.setProps({ text: newProps.buttonText });
    // }
    //
    // return true;

    return oldProps !== newProps;
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

  _makePropsProxy(props) {
    return new Proxy(props, {
      set: (target, prop, value) => {
        target[prop] = value;
        this.eventBus().emit(Block.EVENTS.FLOW_RENDER);

        return true;
      },
      deleteProperty() {
        throw new Error('Нет доступа');
      },
    });
  }

  _createDocumentElement(tagName) {
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
    const {events = {}} = this.props;

    Object.keys(events).forEach(eventName => {
      this._element.removeEventListener(eventName, events[eventName]);
    });
  }

  compile(template, props) {
    const propsAndStubs = {...props};

    Object.entries(this.children).forEach(([key, child]) => {
      if (Array.isArray(child)) {
        propsAndStubs[key] = child.map(el => `<div data-id='${el._id}'></div>`);
      } else {
        propsAndStubs[key] = `<div data-id='${child._id}'></div>`;
      }
    });

    const fragment = this._createDocumentElement('template');

    fragment.innerHTML = pug.compile(template)(propsAndStubs);

    Object.values(this.children).forEach(child => {
      (Array.isArray(child) ? child : [child]).forEach(el => {
        const stub = fragment.content.querySelector(`[data-id="${el._id}"]`);

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



