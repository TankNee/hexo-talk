/* global hexo */

hexo.extend.generator.register("flomo-talk", function (locals) {
    if (!this.config.talk.enable) {
        return;
    }
    return require("./lib/TalkGenerator").call(this, locals);
});
