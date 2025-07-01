this.describes('yl-component', () => {
    const component = this.querySelector('yl-component');

    this.has('no observed attributes', () => { 
        this.expects(component.constructor.observedAttributes.length == 0);
    });
})