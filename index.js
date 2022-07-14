/* global hexo */

hexo.extend.generator.register("talk", function (locals) {
    if (!this.config.talk.enable) {
        return;
    }
    return require("./lib/TalkGenerator").call(this, locals);
});
