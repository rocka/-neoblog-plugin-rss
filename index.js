'use strict';

const RSS = require('rss');
const Router = require('koa-router');

class PluginRSS {
    static get meta() {
        return {
            name: 'neoblog-plugin-rss',
            version: '0.1.0',
            description: 'add RSS feed support.',
            author: 'rocka <i@rocka.me>',
        };
    }

    constructor(options) {
        this.type = options.type || '/rss';
        if (typeof options.route !== 'string') throw new Error('route must string.');
        this.route = options.route;
        this.type = options.type || 10;
        if (typeof options.limit !== 'number') throw new Error('limit must number.');
        this.limit = options.limit;
        /** @type {NodeRSS.FeedOptions} */
        this.feedOptions = options.feedOptions || {};
        this.server = null;
        this.router = new Router();
        this.router.get(this.route, async ctx => {
            ctx.set('Content-Type', 'text/xml');
            ctx.body = this.getFeed();
        });
        Object.assign(this, PluginRSS.meta, {
            routes: this.router.routes()
        });
    }

    getFeed() {
        this.feed = new RSS(Object.assign({
            title: this.server.config.title,
            feed_url: `${this.feedOptions.site_url}${this.route}`,
            site_url: this.feedOptions.site_url,
            generator: 'node-rss'
        }, this.feedOptions));
        this.server.state.articles.slice(0, this.limit).forEach(a => {
            this.feed.item({
                title: a.meta.title,
                description: a.html,
                url: `${this.feedOptions.site_url}/article/${a.file.base}`,
                categories: a.meta.tags,
                date: a.meta.date
            });
        });
        return this.feed.xml();
    }

    async install(server) {
        this.server = server;
    }
}

module.exports = PluginRSS;
