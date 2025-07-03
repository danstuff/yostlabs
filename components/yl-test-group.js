import ylComponent from './yl-component';

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function mapSource(code, startIndex) {
  // TODO
  return {};
}

class Test {
  get status() {
    const name = this.names.join(' ');
    if (this.failCount <= 0) {
      return `${name}: PASS`;
    } else {
      return `${name}: FAIL (${this.failCount})\n${this.failLog}`;
    }
  }

  get failLine() {
    let map = this.sourceMap;
    for (const i in this.names) {
      map = map[this.names[i]];
      if (!map) {
        break;
      }
    }

    return map ? map[this.assertCount] : '00';
  }

  constructor(names, sourceMap, run) {
    this.names = [...names];
    this.sourceMap = sourceMap;
    this.run = run;
    this.assertCount = 0;
    this.failCount = 0;
    this.failLog = "";
  }

  assert(condition, message) {
    this.assertCount++;

    if (!condition) {
      this.failCount++;
      this.failLog += ` ${message}\n  >> ${this.failLine}\n`;
    }
  }
}

export default class ylTestGroup extends ylComponent {
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

    // TODO sanitize URL and/or JS before executing
    fetch(this.src).then(response => response.text()).then(data => {
      
      this.sourceMap = mapSource(data);

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

  click(target) {
    target.click();
  }

  type(string) {
    return {
      in : (target) => {
        for (const key of string) {
          target.dispatchEvent(
            new KeyboardEvent('keypress', { key: key }));
        }
      }      
    }
  }

  describe(name, test) {
    this.nameStack.push(name);
    this.name = this.nameStack[0];
    test();
    this.nameStack.pop();
  }

  it(name, test) {
    this.nameStack.push(name);
    this.tests.push(new Test(this.nameStack, this.sourceMap, test));
    this.nameStack.pop();
  }

  expect(object, key) {
    let name = object?.constructor?.name || "object";

    if (key) {
      name += `.${key}`;
    } else {
      object = [ object ];
      key = 0;
    }

    const exist = (o, k, t) => {
      this.currentTest.assert((o[k] != null) == t,
        `Expected ${name} to ${t ? '' : 'not '}exist but got ${o[k]}`);
    };

    const be = (o, k, v, t) => {
      this.currentTest.assert((o[k] == v) == t,
        `Expected ${name} to ${t ? '' : 'not '}be ${value} but got ${o[k]}`);
    };

    // TODO negation
    return {
      to_exist: () => {
          this.currentTest.assert(object[key] != null,
            `Expected ${name} to exist`);
      },
      to_be: (value) => {
          this.currentTest.assert(object[key] == value,
            `Expected ${name} to be ${value}`);
      },
      to_have: (selector, content) => {
        index = index || 0;

        const children = object.querySelectorAll(selector);

        const msg = 
          `Expected to find '${selector}' with content '` + 
          `${content}' in instance of ${name}, but `;

        this.currentTest.assert(children.length > 0,
          msg + `there were no matches.`);

        let had_content = false;
        for (const child in this.children) {
          if (child.innerHTML.includes(content)) {
            had_content = true;
            break;
          }
        }
        this.currentTest.assert(had_content,
          msg + `no matching selector had content.`);
      }
    };
  }
} 

ylTestGroup.defineElement();