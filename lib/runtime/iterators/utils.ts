export function generator<TYields>(
    impl: (yield: (val: TYields) => Thenable<void>
    ) => Promise<void>) {

    var started = false,
        yielded: TYields,
        continuation: () => void;

    function start() {
        impl(val => {
            yielded = val;
            return {
                then(onFulfilled?: () => void) {
                    continuation = onFulfilled;
                    return this;
                }
            };
        });
    }

    return {
        next(): { value?: TYields; done: boolean } {
            if (!started) {
                started = true;
                start();
            } else if (continuation) {
                var c = continuation;
                continuation = null;
                c();
            }
            return !continuation ? { done: true }
                : { value: yielded, done: false };
        }
    };
}