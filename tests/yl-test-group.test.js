this.describe('yl-test-group', () => {
  this.let(() => {
    this.data.foo = "bar";
  });

  this.it('has functional to_have expectations', () => {
    this.expect(this).to_have('div.foo').with("Test the test!");
    this.expect(this).to_have('div.foo').without("Don't test the test!");

    this.expect(this).to_not_have('div.bar');
    this.expect(this).to_not_have('div.bar').without("Test the test!");
  });

  this.it('has functional to_exist expectations', () => {
    this.expect({}).to_exist();
    this.expect(true).to_exist();
    this.expect(false).to_exist();

    this.expect(null).to_not_exist();
    this.expect(undefined).to_not_exist();
  });

  this.it('has functional to_be expectations', () => {
    this.expect(1).to_be(1);
    this.expect(1.5).to_be(1.5);
    this.expect("foo").to_be("foo");
    
    this.expect(1).to_not_be(2);
    this.expect("foo").to_not_be("bar");
    this.expect(1.5).to_not_be(2.5);
    this.expect({foo: "bar"}).to_not_be({foo: "bar"});
  });
})