function Closure(body, params, env) {
    if (!Array.isArray(params)) {
        throw new Error('Closure argument must be a list');
    }

    this.body = body;
    this.params = params;
    this.env = env;
}

module.exports = Closure;
