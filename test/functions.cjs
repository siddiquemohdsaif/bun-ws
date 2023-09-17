module.exports = {
  incrementCount: function(context, events, done) {
      context.vars.count = (context.vars.count || 0) + 1;
      return done();
  }
};
