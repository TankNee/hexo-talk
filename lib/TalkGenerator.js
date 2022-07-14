module.exports = async function (locals) {
    const type = this.config.talk.type;
    const title = this.config.talk.title;
    let content;

    switch (type) {
        case "flomo":
            content = await require("./driver/Flomo").call(this, locals);
            break;
        default:
            throw new Error(`Unknown talk type: ${type}`);
    }

    return {
        path: "talk/index.html",
        data: {
            slug: "talk",
            title,
            content,
        },
        layout: ["page", "post"],
    };
};
