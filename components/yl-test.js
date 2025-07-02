import ylComponent from './yl-component';

class Test {
  get status() {
    const name = this.names.join(' ');
    if (this.failCount <= 0) {
      return `${name}: PASS`;
    } else {
      return `${name}: FAIL (${this.failCount})\n${this.failLog}`;
    }
  }

  get failMessage() {
    retuirn `  `;
  }

  constructor(names, run) {
    this.names = [...names];
    this.run = run;
    this.failCount = 0;
    this.failLog = "";
  }

  assert(condition, message) {
    if (!condition) {
      this.failCount++;
      throw message;
      this.failLog += " " + message;
    }
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export default class ylTest extends ylComponent {
  static get observedAttributes() {
    return ['name', 'src', 'failcount'];
  }

  get html() {
    return `
      <div>${this.name}</div>
      <slot></slot>
      <div>Failed examples: ${this.failcount || 0}</div>
    `;
  }

  connectedCallback() {
    this.name = "Loading Tests...";
    this.failcount = 0;

    this.tests = [];

    // TODO I'm very concerned about the security of this LOL
    fetch(this.src).then(response => response.text()).then(data => {
      
      this.nameStack = [];
      Function(data).bind(this)();

      shuffle(this.tests);

      // TODO run in parallel
      for (const test of this.tests) {
        this.currentTest = test;
        test.run();
        console.log(test.status);

        if (!test.passed) {
          this.failcount = this.failcount + 1;
        }
      }
    });
  }

  does(event, element) {
    // TODO fire the given event on the element
  }


  describe(name, test) {
    this.nameStack.push(name);
    this.name = this.nameStack[0];
    test();
    this.nameStack.pop();
  }

  it(name, test) {
    this.nameStack.push(name);
    this.tests.push(new Test(this.nameStack, test));
    this.nameStack.pop();
  }

  expect(object, key) {
    let valueName = object?.constructor?.name || "object";

    if (!key) {
      object = [ object ];
      key = 0;
    }

    return {
      to_exist: () => {
          this.currentTest.assert(object[key] != null,
            `Expected ${valueName} to exist`);
      },
      to_be: (value) => {
          this.currentTest.assert(object[key] == value,
            `Expected ${valueName} to be ${value}`);
      },
      to_have: (selector, content) => {
        index = index || 0;

        const children = object.querySelectorAll(selector);

        this.currentTest.assert(children.length > 0,
          `Expected to find ${selector} in ${objectName} but there were no matches`);

        let had_content = false;
        for (const child in this.children) {
          this.currentTest.assert("Had ")
        }
      }
    };
  }
} 

ylTest.defineElement();