import ylComponent from './yl-component';

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
}

class SourceNode {
  constructor(name, parent, source) {
    this.name = name;
    this.path = parent?.path ? parent.path.append(' ' + name) : '';

    // TODO guard against multiple matches
    this.sourceIndex = source.indexOf(name, parent?.sourceIndex || 0);
    
    this.parent = parent;
    this.children = {};
    this.setups = [];
  }

  walk(names, callback) {
    if (callback) {
      callback(this);
    }

    let map = this;
    for (const i in names) {
      map = map.children[names[i]];
      if (!map) {
        break;
      }
      if (callback) {
        callback(map);
      }
    }
  }

  push(name, source) {
    console.log(`push ${name}`);
    const child = new SourceNode(name, this, source);
    this.children[name] = child;
    return child;
  }

  pop() {
    console.log(`pop ${this.name}`);
    return this.parent;
  }

  getLine(source, sourceIndex) {
    sourceIndex = sourceIndex || this.sourceIndex;
    return source.substr(
      sourceIndex,
      source.indexOf('\n', sourceIndex));
  }

  getLength(source) {
    const nextIndex = this.parent.children.indexOf(this)+1;
    if (nextIndex >= this.parent.children.length) {
      return source.length - this.sourceIndex;
    }
    
    const nextChild = this.parent.children[nextIndex];
    return nextChild.sourceIndex - this.sourceIndex;
  }

  getExpectLine(source, count) {
    let sourceIndex = this.sourceIndex;
    while (count > 0) {
      sourceIndex = source.indexOf('expect');
      count--;
    }
    return this.getLine(source, sourceIndex);
  }
}

class Test {
  get status() {
    if (this.failCount <= 0) {
      return `${this.path}: PASS`;
    } else {
      return `${this.path}: FAIL (${this.failCount})\n${this.failLog}`;
    }
  }

  constructor(path, run) {
    this.path = path;
    this.run = run;
    this.assertCount = 0;
    this.failCount = 0;
    this.failLog = "";
  }

  assert(condition, message, source) {
    this.assertCount++;

    // TODO
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
      div {
        margin: 5px;
      }
      
      .frame {
        border: 1px dashed black;
        width: max-content;
      }
    `;
  }

  connectedCallback() {
    this.name = "Downloading...";
    this.failcount = 0;

    this.tests = [];

    // TODO sanitize URL and/or JS before executing
    fetch(this.src).then(response => response.text()).then(source => { 
      this.name = "Loading Tests...";

      this.source = source;
      this.rootSourceNode = new SourceNode('', null, source);
      this.sourceNode = this.rootSourceNode;

      Function(source).bind(this)();

      shuffle(this.tests);

      for (const test of this.tests) {
        this.test = test;

        this.runSetups();
        test.run();

        console.log(test.status);

        if (!test.passed) {
          this.failcount = this.failcount + 1;
        }
      }
    });
  }

  runSetups() {
    // TODO names is not defined here...
    this.rootSourceNode.walk(this.names, (m) => {
      for(const setup in m.setups) {
        setup();
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

  describe(name, call) {
    this.sourceNode = this.sourceNode.push(name, this.source)
    call();
    this.sourceNode = this.sourceNode.pop();
  }

  let(run) {
    this.sourceNode.setups.push(run);
  }

  it(name, run) {
    this.sourceNode = this.sourceNode.push(name, this.source);
    this.tests.push(new Test(this.sourceNode.path, run));
    this.sourceNode = this.sourceNode.pop();
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