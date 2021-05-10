/**
 * Parse a string for the raw tokens.
 *
 * @param  {String} str
 * @return {Array}
 */
declare function parse(str: string): Array<any>;
/**
 * Compile a string to a template function for the path.
 *
 * @param  {String}   str
 * @return {Function}
 */
declare function compile(str: string): Function;
/**
 * Expose a method for transforming tokens into the path function.
 */
declare function tokensToFunction(tokens: any): (obj: any) => string;
/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {Array}  tokens
 * @param  {Array}  keys
 * @param  {Object} options
 * @return {RegExp}
 */
declare function tokensToRegExp(tokens: Array<any>, options: any): RegExp;
/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 */
declare function pathToRegexp(path: string, keys: Array<any>, options?: object): RegExp;
export { pathToRegexp, parse, compile, tokensToFunction, tokensToRegExp };
