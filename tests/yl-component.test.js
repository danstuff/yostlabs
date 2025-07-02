this.describe('yl-component', () => {
    const component = this.querySelector('yl-component');
    const observedAttributes = component.constructor.observedAttributes;

    this.it('has no observed attributes', () => { 
        this.expect(observedAttributes.length).to_be(1);
        this.expect(false);
        this.expect(false);
    });

    this.it('has something else', () => {
        this.expect(true);
    })
})