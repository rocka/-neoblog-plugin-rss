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
        this.route = options.route || '/rss';
        if (typeof options.route !== 'string') throw new Error('route must string.');
        if (!this.route.startsWith('/')) this.route = '/' + this.route;
        this.limit = options.limit || 10;
        if (typeof options.limit !== 'number') throw new Error('limit must number.');
        /** @type {NodeRSS.FeedOptions} */
        this.feedOptions = Object.assign({
            title: null, // this would be set in install()
            feed_url: `${options.feedOptions.site_url}${this.route}`,
            generator: 'node-rss'
        }, options.feedOptions)
        this.itemOptions = options.itemOptions || {};
    }

    /**
     * @see https://tools.ietf.org/html/rfc5005#appendix-B
     * @param {string} type
     * @param {number} page
     */
    makePaginationLink(type, page) {
        return {
            'atom:link': {
                _attr: {
                    rel: type,
                    href: `${this.feedOptions.feed_url}?page=${page}`
                }
            }
        };
    }

    /**
     * get feed XML
     * @param {any[]} articles
     * @param {number} limit
     * @param {number} page
     */
    getFeed(articles, limit, page) {
        const offset = (page - 1) * limit;
        const custom_elements = [];
        if (articles.length > offset + limit) {
            custom_elements.push(this.makePaginationLink('next', page + 1));
        }
        if (page > 1) {
            custom_elements.push(this.makePaginationLink('previous', page - 1));
        }
        const feed = new RSS({ ...this.feedOptions, custom_elements });
        articles.slice(offset, offset + limit).forEach(a => {
            feed.item({
                ...this.itemOptions,
                title: a.meta.title,
                description: a.html,
                url: `${this.feedOptions.site_url}/article/${a.file.base}`,
                categories: a.meta.tags,
                date: a.meta.date
            });
        });
        return feed.xml();
    }

    install(server) {
        this.feedOptions.title = server.config.title;
        const router = new Router();
        router.get(this.route, ctx => {
            const page = Number(ctx.query.page || 1)
            ctx.set('Content-Type', 'application/rss+xml; charset=utf-8');
            ctx.body = this.getFeed(server.state.articles, this.limit, page);
        });
        server.app.use(router.routes());
    }
}

module.exports = PluginRSS;
