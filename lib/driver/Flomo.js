const superagent = require("superagent");
const fs = require("hexo-fs");

const fileName = "talk.json";

/**
 *
 * @param {Array} data
 */
function saveData(data) {
    let oldData = {};
    if (fs.existsSync(fileName)) {
        oldData = fs.readFileSync(fileName);
        oldData = JSON.parse(oldData);
    } else {
        fs.writeFileSync(fileName, "{}");
    }
    oldData["flomo"] = oldData["flomo"] ? oldData["flomo"] : [];
    // remove the repeated data
    const newData = data.filter((item) => {
        return !oldData["flomo"].find((oldItem) => {
            return oldItem.updated_at === item.updated_at;
        });
    });
    oldData["flomo"] = oldData["flomo"].concat(newData);
    // 按照修改时间排序，从新到旧
    const res = oldData["flomo"].sort((a, b) => {
        return new Date(b.updated_at) - new Date(a.updated_at);
    });
    fs.writeFileSync(fileName, JSON.stringify(res, null, 4));
    return res;
}

/**
 * `log in url`: https://flomoapp.com/login/
 * @param {string} cookie string
 * @param {string} tag
 * @param {number} limit
 */
async function getFlomo(cookie, tag, limit = 20) {
    const res = await superagent.get("https://flomoapp.com/api/memo").query({ tag, limit }).set("Cookie", cookie).catch(console.error);
    const data = res.body;
    let memos = data?.memos || [];
    memos = memos.map((memo) => {
        const { source, content, tags, created_at, updated_at } = memo;
        let pureContent = content;
        tags.forEach((tag) => {
            pureContent = pureContent.replace(`#${tag}`, "");
        });
        return {
            source,
            content: pureContent,
            tags,
            created_at,
            updated_at,
        };
    });
    if (memos.length > 0) {
        saveData(memos);
    } else {
        console.log("No data");
    }
    return memos;
}

/**
 *
 * @param {*} locals
 * @return {Promise<string>}
 */
module.exports = async function (locals) {
    if (!this.config.talk.flomo) {
        return;
    }

    const { cookie, tag, limit } = this.config.talk.flomo;
    const pageTheme = this.config.talk.theme || "Paper";

    const memos = await getFlomo(cookie, tag, limit);

    const cardTemplate = fs.readFileSync("templates/Card.html");
    const pageHtml = fs.readFileSync(`templates/${pageTheme}.html`);

    const cards = memos.map((memo) => {
        const tags = memo.tags.map((tag) => {
            return `<a href="https://flomoapp.com/mine?tag=${tag}">#${tag}</a>`;
        });
        return cardTemplate
            .replace(/\{\{date\}\}/g, new Date(memo.updated_at).toLocaleString())
            .replace(/\{\{content\}\}/g, memo.content)
            .replace(/\{\{tags\}\}/g, tags.length > 0 ? `<div class="card-footer">${tags.join(" ")}</div>` : "")
            .replace(/\{\{border\}\}/g, Math.floor(Math.random() * 5 + 2));
    });

    const content = pageHtml.replace(/\{\{cards\}\}/g, cards.join(""));

    return content;
};
