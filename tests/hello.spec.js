describe('greeter', function () {
    var greet = function(){
        return 'Hello, World!';
    };

    it('should say Hello to the World', function () {
        expect(greet('World')).toEqual('Hello, World!');
    });
});