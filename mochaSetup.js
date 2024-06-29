import { JSDOM } from 'jsdom';

const jsdom = new JSDOM(`<body></body>`);

global.window = jsdom.window;
global.document = jsdom.window.document;
global.Node = jsdom.window.Node;
global.XMLHttpRequest = jsdom.window.XMLHttpRequest;
global.DOMParser = jsdom.window.DOMParser;

global.MouseEvent = jsdom.window.MouseEvent;
