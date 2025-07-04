import ylComponent from './yl-component';

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
}

class SourceMap {
  constructor() {
    this.children = [];
    this.lines = [];
    this.lets = [];
  }

  getNode(names) {
    let map = this;
    for (const i in names) {
      map = map.children[names[i]];
      if (!map) {
        break;
      }
    }
    return map;
  }
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
      <div class="frame">
        <slot></slot>
      </div>
      <div>Failed examples: ${this.failcount || 0}</div>
    `;
  }

  get css() {
    return `
      .frame {
        border: 1px dashed black;
      }
    `;
  }

  connectedCallback() {
    this.name = "Loading Tests...";
    this.failcount = 0;

    this.tests = [];

    // TODO sanitize URL and/or JS before executing
    fetch(this.src).then(response => response.text()).then(data => {
      
      this.sourceMap = new SourceMap(data);

      Function(data).bind(this)();

      shuffle(this.tests);

      for (const test of this.tests) {
        this.test = test;
        this.setup();
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

  describe(name, setup) {
    this.nameStack.push(name);
    this.name = this.nameStack[0];
    setup();
    this.nameStack.pop();
  }

  let(run) {
    this.letStack.push(run);
  }

  it(name, run) {
    this.nameStack.push(name);
    this.tests.push(new Test(this.nameStack, this.sourceMap, run));
    this.nameStack.pop();
  }

  expect(object) {
    let name = object?.constructor?.name || "object";

    const to_exist = (t) => {
      this.test.assert((object != null) == t,
        `Expected ${name} to ${t ? '' : 'not '}exist but got ${o}`);
    };

    const to_be = (value, t) => {
      this.test.assert((object == value) == t,
        `Expected ${name} to ${t ? '' : 'not '}be ${value} but got ${object}`);
    };

    const to_have = (selector, t) => {
      const msg = 
        `Expected to find '${selector}' with content '` + 
        `${content}' in ${name}, but `;

      const children = object.querySelectorAll(selector);
      this.test.assert((children.length ? true : false) == t,
        msg + `there were no matches.`);

      return {
        with: (content) => {
          let match = false;
          for (const child of children) {
            match = match || child.innerHTML.contains(content);
            if (match) {
              break;
            }
          }
          this.test.assert(match == t,
            msg + `no matching selector had content.`);
        }
      };
    }

    return {
      to_exist:     ()         => { to_exist(true); },
      to_not_exist: ()         => { to_exist(false); },
      to_be:        (value)    => { to_be(value, true); },
      to_not_be:    (value)    => { to_be(value, false); },
      to_have:      (selector) => { return to_have(selector, true); },
      to_not_have:  (selector) => { return to_have(selector, false); },
    };
  }
} 

ylTestGroup.defineElement();